
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

  useEffect(() => {
    const unsub = db.collection("settings").doc("global").onSnapshot((doc) => {
        if (doc.exists) setSiteConfig(doc.data() as SiteConfig);
    }, (error) => console.warn("Global settings restricted:", error.message));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        const unsub = db.collection("users").doc(firebaseUser.uid).onSnapshot((snap) => {
          if (snap.exists) {
            const userData = { id: firebaseUser.uid, ...snap.data() } as User;
            if (!userData.isBanned) setUser(userData);
            else auth.signOut();
          }
        }, (error) => console.error("Profile sync error:", error.message));
        return () => unsub();
      } else { 
        setUser(null); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsub = db.collection("users").onSnapshot((snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
        setAllUsers(usersList);
    }, (error) => setAllUsers(user ? [user] : []));
    return () => unsub();
  }, [user?.id]);

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
      }, (error) => setProblems([]));

    return () => {
      unsub();
      Object.values(solutionUnsubscribes.current).forEach((un: any) => un());
      solutionUnsubscribes.current = {};
    };
  }, [user?.id]);

  const login = useCallback(async (email: string, password: string) => {
    await auth.signInWithEmailAndPassword(email, password);
  }, []);

  const register = useCallback(async (email: string, password: string, role: UserRole, name: string, extraInfo: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user!.uid;
    const username = name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);
    const isVerifiedInitially = role !== UserRole.COMPANY;

    const newUser: any = { 
      id: uid, username, email, name, role, 
      rating: 0, leaderboardScore: 0, penaltyPoints: 0, solvedCount: 0, 
      simSolvedCount: 0, skillLevel: 'Beginner', badges: [], reviews: [], 
      joinedAt: new Date().toISOString(), bio: '', skills: [],
      isVerified: isVerifiedInitially
    };

    if (role === UserRole.STUDENT) newUser.university = extraInfo || "";
    else if (role === UserRole.COMPANY) newUser.companyName = extraInfo || "";

    await db.collection("users").doc(uid).set(newUser);
    await userCredential.user!.sendEmailVerification();
    await auth.signOut();
  }, []);

  const logout = useCallback(async () => {
    Object.values(solutionUnsubscribes.current).forEach((un: any) => un());
    solutionUnsubscribes.current = {};
    setUser(null);
    await auth.signOut();
  }, []);

  const resetPassword = useCallback((email: string) => auth.sendPasswordResetEmail(email), []);

  const addProblem = useCallback(async (data: Partial<Problem>) => {
    if (!user || !user.isVerified) return;
    await db.collection("problems").add({ 
        ...data, companyId: user.id, companyName: user.companyName || user.name, 
        status: 'OPEN', createdAt: new Date().toISOString() 
    });
  }, [user]);

  const bulkAddProblems = useCallback(async (problemsData: Partial<Problem>[]) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    const batch = db.batch();
    problemsData.forEach((data) => {
        const newDocRef = db.collection("problems").doc();
        batch.set(newDocRef, {
            ...data, companyId: user.id, companyName: data.companyName || 'Simulation Hub',
            status: 'OPEN', createdAt: new Date().toISOString(),
            isSimulation: data.isSimulation ?? true
        });
    });
    await batch.commit();
  }, [user]);

  const bulkDeleteProblems = useCallback(async (ids: string[]) => {
    if (!user || user.role !== UserRole.ADMIN || ids.length === 0) return;
    
    // Chunking logic to stay within Firestore limits
    const CHUNK_SIZE = 450; 
    const chunks = [];
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
        chunks.push(ids.slice(i, i + CHUNK_SIZE));
    }

    // Phase 1: Atomic wipe of all problem nodes across parallel batches
    await Promise.all(chunks.map(async (chunk) => {
        const batch = db.batch();
        chunk.forEach(id => batch.delete(db.collection("problems").doc(id)));
        return batch.commit();
    }));

    // Phase 2: Background cleanup of sub-collections (solutions)
    // We do this individually to avoid overwhelming the connection and handle potential fetch errors gracefully
    for (const id of ids) {
        try {
            const solSnap = await db.collection("problems").doc(id).collection("solutions").get();
            if (!solSnap.empty) {
                const subBatch = db.batch();
                solSnap.docs.forEach(doc => subBatch.delete(doc.ref));
                await subBatch.commit();
            }
        } catch (err) {
            console.warn(`Background cleanup skipped for node ${id}:`, err);
        }
    }
  }, [user]);

  const verifySimulationSolution = useCallback(async (pId: string, sId: string, stId: string, rating: number, feedback: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!user || (user.role !== UserRole.MENTOR && user.role !== UserRole.ADMIN)) return;
    await db.runTransaction(async (transaction) => {
      const studentRef = db.collection("users").doc(stId);
      const solRef = db.collection("problems").doc(pId).collection("solutions").doc(sId);
      const studentSnap = await transaction.get(studentRef);
      if (!studentSnap.exists) throw new Error("Student node detached.");
      
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

  const value = useMemo(() => ({
    user, loading, allUsers, problems, payments, siteConfig,
    login, register, logout, resetPassword, addProblem, bulkAddProblems,
    addSolution: async (pId: string, content: string, file?: File, details?: any) => {
        if (!user) return;
        let attachmentUrl = null;
        if (file) {
            const path = `solutions/${pId}/${user.id}/${Date.now()}_${file.name}`;
            await supabase.storage.from('solutions').upload(path, file);
            attachmentUrl = supabase.storage.from('solutions').getPublicUrl(path).data.publicUrl;
        }
        await db.collection("problems").doc(pId).collection("solutions").add({ 
            problemId: pId, studentId: user.id, studentName: user.name, 
            content, submittedAt: new Date().toISOString(), reviewStatus: 'PENDING', attachmentUrl, ...details 
        });
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
  }), [user, loading, allUsers, problems, payments, siteConfig, login, register, logout, resetPassword, addProblem, bulkAddProblems, bulkDeleteProblems, verifySimulationSolution]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};
