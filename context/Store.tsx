
import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { User, Problem, UserRole, Solution, Review, SiteConfig, Payment, Badge, SkillLevel } from '../types.ts';
import { auth, db } from '../services/firebase.ts';
import { supabase } from '../services/supabase.ts';
import { evaluateSolutionWithAI } from '../services/geminiService.ts';

interface AppContextType {
  user: User | null;
  loading: boolean;
  allUsers: User[];
  problems: Problem[];
  payments: Payment[];
  siteConfig: SiteConfig;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, name: string, extraInfo: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  addProblem: (data: Partial<Problem>) => Promise<void>;
  bulkAddProblems: (problemsData: Partial<Problem>[]) => Promise<void>;
  editProblem: (problemId: string, data: Partial<Problem>) => Promise<void>;
  manualCloseProblem: (problemId: string) => Promise<void>;
  addSolution: (problemId: string, content: string, file?: File, details?: { githubLink?: string, techStack?: string, limitations?: string }) => Promise<void>;
  acceptSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, paymentMethod: string) => Promise<void>;
  verifySimulationSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, status: 'VERIFIED' | 'REJECTED') => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  adminBanUser: (userId: string, currentStatus: boolean) => Promise<void>;
  adminVerifyUser: (userId: string) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminDeleteProblem: (problemId: string) => Promise<void>;
  bulkDeleteProblems: (problemIds: string[]) => Promise<void>;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  fetchSingleUser: (userId: string) => Promise<User | null>;
  fetchUserByUsername: (username: string) => Promise<User | null>;
  clearAuditNotification: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const calculateSkillLevel = (avg: number): SkillLevel => {
  if (avg >= 90) return 'Advanced';
  if (avg >= 75) return 'Intermediate';
  if (avg >= 60) return 'Junior';
  return 'Beginner';
};

const BADGE_RULES: Badge[] = [
    { id: 'first_fix', name: 'First Fix', threshold: 1, icon: '🎯', description: 'Solved your first practice simulation.', bonusPoints: 10, awardedAt: '' } as any,
    { id: 'debugger', name: 'Debugger', threshold: 5, icon: '🐛', description: 'Crushed 5 technical simulations.', bonusPoints: 50, awardedAt: '' } as any,
    { id: 'pro_solver', name: 'Pro Solver', threshold: 20, icon: '🔥', description: '20 simulations verified.', bonusPoints: 200, awardedAt: '' } as any
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ baseFontSize: 16, enableDarkMode: true });
  
  const solutionUnsubscribes = useRef<Record<string, () => void>>({});
  const profileUnsubscribe = useRef<(() => void) | null>(null);

  // Global Site Settings Sync
  useEffect(() => {
    const unsub = db.collection("settings").doc("global").onSnapshot((doc) => {
        if (doc.exists) setSiteConfig(doc.data() as SiteConfig);
    }, (error) => console.warn("Settings restricted:", error.message));
    return () => unsub();
  }, []);

  // Auth State Listener - Resolves loading immediately
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        if (profileUnsubscribe.current) {
          profileUnsubscribe.current();
          profileUnsubscribe.current = null;
        }
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // User Profile Sync - Dedicated effect for performance and stability
  useEffect(() => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser && firebaseUser.emailVerified) {
      profileUnsubscribe.current = db.collection("users").doc(firebaseUser.uid).onSnapshot((snap) => {
        if (snap.exists) {
          const userData = { id: firebaseUser.uid, ...snap.data() } as User;
          if (!userData.isBanned) setUser(userData);
          else auth.signOut();
        }
      }, (error) => console.error("Profile sync error:", error.message));
    }
    return () => {
      if (profileUnsubscribe.current) profileUnsubscribe.current();
    };
  }, [auth.currentUser?.uid, auth.currentUser?.emailVerified]);

  // Users List Sync
  useEffect(() => {
    const unsub = db.collection("users").onSnapshot((snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
        setAllUsers(usersList);
    }, (error) => setAllUsers(user ? [user] : []));
    return () => unsub();
  }, [user?.id]);

  // Problems Feed & Solutions Sub-collections Sync
  useEffect(() => {
    const unsub = db.collection("problems").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
        const problemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), solutions: [] })) as Problem[];
        setProblems(problemsData);
        
        if (auth.currentUser) {
          problemsData.forEach(p => {
            if (!solutionUnsubscribes.current[p.id]) {
              solutionUnsubscribes.current[p.id] = db.collection("problems").doc(p.id).collection("solutions").onSnapshot((s) => {
                  setProblems(current => current.map(cp => cp.id === p.id ? { ...cp, solutions: s.docs.map(sd => ({ id: sd.id, ...sd.data() } as Solution)) } : cp));
              });
            }
          });
        }
      }, (error) => {
          console.warn("Problems restricted:", error.message);
          setProblems([]);
      });

    return () => {
      unsub();
      Object.values(solutionUnsubscribes.current).forEach((un: any) => un());
      solutionUnsubscribes.current = {};
    };
  }, [user?.id]);

  const login = useCallback(async (email: string, password: string) => {
    await auth.signInWithEmailAndPassword(email, password);
  }, []);

  const logout = useCallback(async () => {
    Object.values(solutionUnsubscribes.current).forEach((un: any) => un());
    solutionUnsubscribes.current = {};
    if (profileUnsubscribe.current) profileUnsubscribe.current();
    setUser(null);
    await auth.signOut();
  }, []);

  const bulkDeleteProblems = useCallback(async (ids: string[]) => {
    if (!user || user.role !== UserRole.ADMIN || ids.length === 0) return;
    
    // Batch deletion for parent nodes (Atomic & Fast)
    const mainBatch = db.batch();
    ids.forEach(id => mainBatch.delete(db.collection("problems").doc(id)));
    await mainBatch.commit();

    // Background Cleanup: Solution Sub-collections
    // This is run in parallel-sequence to avoid blocking the main UI thread
    for (const id of ids) {
      try {
        const solSnap = await db.collection("problems").doc(id).collection("solutions").get();
        if (!solSnap.empty) {
          const subBatch = db.batch();
          solSnap.docs.forEach(doc => subBatch.delete(doc.ref));
          await subBatch.commit();
        }
      } catch (err) {
        console.warn(`Node ${id} sub-collections skipped during wipe:`, err);
      }
    }
  }, [user]);

  const verifySimulationSolution = useCallback(async (pId: string, sId: string, stId: string, rating: number, feedback: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!user || (user.role !== UserRole.MENTOR && user.role !== UserRole.ADMIN)) return;
    await db.runTransaction(async (transaction) => {
      const studentRef = db.collection("users").doc(stId);
      const solRef = db.collection("problems").doc(pId).collection("solutions").doc(sId);
      const studentSnap = await transaction.get(studentRef);
      if (!studentSnap.exists) throw new Error("Target identity detached.");
      
      const studentData = studentSnap.data() as User;
      const isVerified = status === 'VERIFIED';
      
      transaction.update(solRef, { isVerified, isRejected: !isVerified, reviewStatus: status, rating, feedback, mentorId: user.id, mentorName: user.name });

      if (isVerified) {
        const verifiedSims = (studentData.simSolvedCount || 0) + 1;
        const pastScores = (studentData.reviews || []).map(r => r.rating).slice(-4);
        const rollingAvg = Math.round(([...pastScores, rating].reduce((a,b) => a+b, 0)) / (pastScores.length + 1));
        const finalScore = (verifiedSims * 10) + (rollingAvg * 2) - (studentData.penaltyPoints || 0);

        transaction.update(studentRef, {
            simSolvedCount: verifiedSims, rollingAverage: rollingAvg,
            skillLevel: calculateSkillLevel(rollingAvg), leaderboardScore: finalScore,
            reviews: [...(studentData.reviews || []), { id: sId, problemTitle: 'Simulation Exercise', rating, feedback, createdAt: new Date().toISOString(), companyName: `Mentor: ${user.name}` }],
            auditNotification: { problemId: pId, problemTitle: 'Simulation Verified', status: 'VERIFIED', feedback, read: false }
        });
      } else {
        transaction.update(studentRef, { auditNotification: { problemId: pId, problemTitle: 'Simulation Review', status: 'REJECTED', feedback, read: false } });
      }
    });
  }, [user]);

  const contextValue = useMemo(() => ({
    user, loading, allUsers, problems, payments, siteConfig,
    login, register: async (email: string, password: string, role: UserRole, name: string, extraInfo: string) => {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user!.uid;
      const username = name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);
      const isVerifiedInitially = role !== UserRole.COMPANY;

      const newUser: any = { 
        id: uid, username, email, name, role, isVerified: isVerifiedInitially,
        rating: 0, leaderboardScore: 0, penaltyPoints: 0, solvedCount: 0, 
        simSolvedCount: 0, skillLevel: 'Beginner', badges: [], reviews: [], 
        joinedAt: new Date().toISOString(), bio: '', skills: []
      };

      if (role === UserRole.STUDENT) newUser.university = extraInfo || "";
      else if (role === UserRole.COMPANY) newUser.companyName = extraInfo || "";

      await db.collection("users").doc(uid).set(newUser);
      await userCredential.user!.sendEmailVerification();
      await auth.signOut();
    },
    logout, resetPassword: (email: string) => auth.sendPasswordResetEmail(email),
    addProblem: async (data: Partial<Problem>) => {
      if (!user || !user.isVerified) return;
      await db.collection("problems").add({ ...data, companyId: user.id, companyName: user.companyName || user.name, status: 'OPEN', createdAt: new Date().toISOString() });
    },
    bulkAddProblems: async (problemsData: Partial<Problem>[]) => {
      if (!user || user.role !== UserRole.ADMIN) return;
      const batch = db.batch();
      problemsData.forEach((data) => {
          const newDocRef = db.collection("problems").doc();
          batch.set(newDocRef, { ...data, companyId: user.id, companyName: data.companyName || 'Simulation Hub', status: 'OPEN', createdAt: new Date().toISOString(), isSimulation: data.isSimulation ?? true });
      });
      await batch.commit();
    },
    addSolution: async (pId: string, content: string, file?: File, details?: any) => {
      if (!user) return;
      let attachmentUrl = null;
      if (file) {
          const path = `solutions/${pId}/${user.id}/${Date.now()}_${file.name}`;
          await supabase.storage.from('solutions').upload(path, file);
          attachmentUrl = supabase.storage.from('solutions').getPublicUrl(path).data.publicUrl;
      }
      await db.collection("problems").doc(pId).collection("solutions").add({ problemId: pId, studentId: user.id, studentName: user.name, content, submittedAt: new Date().toISOString(), reviewStatus: 'PENDING', attachmentUrl, ...details });
    },
    acceptSolution: async (pId: string, sId: string, stId: string, r: number, f: string) => {
      await db.runTransaction(async (transaction) => {
          transaction.update(db.collection("problems").doc(pId).collection("solutions").doc(sId), { isAccepted: true, rating: r, feedback: f });
          transaction.update(db.collection("problems").doc(pId), { status: 'CLOSED' });
      });
    },
    verifySimulationSolution,
    editProblem: async (id: string, d: any) => { await db.collection("problems").doc(id).update(d); },
    manualCloseProblem: async (id: string) => { await db.collection("problems").doc(id).update({ status: 'CLOSED' }); },
    updateUserProfile: async (d: any) => { if(user) await db.collection("users").doc(user.id).update(d); },
    adminBanUser: async (id: string, s: boolean) => { await db.collection("users").doc(id).update({ isBanned: !s }); },
    adminVerifyUser: async (id: string) => { await db.collection("users").doc(id).update({ isVerified: true }); },
    adminDeleteUser: async (id: string) => { await db.collection("users").doc(id).delete(); },
    adminDeleteProblem: async (id: string) => { await db.collection("problems").doc(id).delete(); },
    bulkDeleteProblems,
    updateSiteConfig: async (c: any) => { await db.collection("settings").doc("global").set(c, { merge: true }); },
    fetchSingleUser: async (id: string) => { const doc = await db.collection("users").doc(id).get(); return doc.exists ? { id: doc.id, ...doc.data() } as User : null; },
    fetchUserByUsername: async (u: string) => { const snap = await db.collection("users").where("username", "==", u).limit(1).get(); return !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } as User : null; },
    clearAuditNotification: async () => { if(user) await db.collection("users").doc(user.id).update({ auditNotification: null }); }
  }), [user, loading, allUsers, problems, payments, siteConfig, login, logout, bulkDeleteProblems, verifySimulationSolution]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};
