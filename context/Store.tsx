
import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { User, Problem, UserRole, Solution, Review, SiteConfig, Payment, Badge, SkillLevel, PlagiarismMetadata, VerificationStatus } from '../types.ts';
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
  lockProblem: (problemId: string) => Promise<void>;
  unlockProblem: (problemId: string) => Promise<void>;
  addSolution: (problemId: string, content: string, file?: File, details?: { githubLink?: string, techStack?: string, limitations?: string }) => Promise<void>;
  acceptSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, paymentMethod: string) => Promise<void>;
  verifySimulationSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, status: 'VERIFIED' | 'REJECTED') => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  adminBanUser: (userId: string, currentStatus: boolean) => Promise<void>;
  adminVerifyUser: (userId: string) => Promise<void>;
  adminUpdateCompanyStatus: (userId: string, status: VerificationStatus) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminDeleteProblem: (problemId: string) => Promise<void>;
  bulkDeleteProblems: (problemIds: string[]) => Promise<void>;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  fetchSingleUser: (userId: string) => Promise<User | null>;
  fetchUserByUsername: (username: string) => Promise<User | null>;
  clearAuditNotification: () => Promise<void>;
  overridePlagiarismStatus: (problemId: string, solutionId: string, newStatus: 'CLEAN' | 'FLAGGED' | 'PENALIZED') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to calculate similarity between solution contents
function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [internalAuthUser, setInternalAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ baseFontSize: 16, enableDarkMode: true });
  
  const solutionUnsubscribes = useRef<Record<string, () => void>>({});
  const profileUnsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsub = db.collection("settings").doc("global").onSnapshot(doc => {
      if (doc.exists) setSiteConfig(doc.data() as SiteConfig);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(firebaseUser => {
      setInternalAuthUser(firebaseUser);
      if (!firebaseUser) { setUser(null); setLoading(false); }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (profileUnsubscribe.current) profileUnsubscribe.current();
    if (internalAuthUser?.emailVerified) {
      profileUnsubscribe.current = db.collection("users").doc(internalAuthUser.uid).onSnapshot(snap => {
        if (snap.exists) {
          const userData = { id: internalAuthUser.uid, ...snap.data() } as User;
          if (!userData.isBanned) setUser(userData);
          else auth.signOut();
        }
        setLoading(false);
      }, () => setLoading(false));
    } else if (internalAuthUser) { setLoading(false); }
    return () => profileUnsubscribe.current?.();
  }, [internalAuthUser]);

  useEffect(() => {
    const unsub = db.collection("users").onSnapshot(snapshot => {
        setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = db.collection("problems").orderBy("createdAt", "desc").onSnapshot(snapshot => {
        const problemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), solutions: [] })) as Problem[];
        setProblems(problemsData);
        if (internalAuthUser) {
          problemsData.forEach(p => {
            if (!solutionUnsubscribes.current[p.id]) {
              solutionUnsubscribes.current[p.id] = db.collection("problems").doc(p.id).collection("solutions").onSnapshot(s => {
                  setProblems(current => current.map(cp => cp.id === p.id ? { ...cp, solutions: s.docs.map(sd => ({ id: sd.id, ...sd.data() } as Solution)) } : cp));
              });
            }
          });
        }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
      Object.values(solutionUnsubscribes.current).forEach((un: any) => {
        if (typeof un === 'function') un();
      });
      solutionUnsubscribes.current = {};
    };
  }, [internalAuthUser]);

  const lockProblem = useCallback(async (pId: string) => {
    if (!user) return;
    const expires = new Date();
    expires.setDate(expires.getDate() + 15);
    await db.collection("problems").doc(pId).update({
      lockedByStudentId: user.id,
      lockedByStudentName: user.name,
      lockExpiresAt: expires.toISOString()
    });
  }, [user]);

  const unlockProblem = useCallback(async (pId: string) => {
    await db.collection("problems").doc(pId).update({
      lockedByStudentId: null,
      lockedByStudentName: null,
      lockExpiresAt: null
    });
  }, []);

  const addSolution = useCallback(async (pId: string, content: string, file?: File, details?: any) => {
    if (!user) return;
    let attachmentUrl = null;
    if (file) {
        const path = `solutions/${pId}/${user.id}/${Date.now()}_${file.name}`;
        await supabase.storage.from('solutions').upload(path, file);
        attachmentUrl = supabase.storage.from('solutions').getPublicUrl(path).data.publicUrl;
    }
    
    const targetProblem = problems.find(p => p.id === pId);
    const existingSols: Solution[] = targetProblem?.solutions || [];
    let maxSimilarity = 0; 
    let targetId = '';
    
    for (const sol of existingSols) {
      const sim = calculateSimilarity(content, sol.content);
      if (sim > maxSimilarity) { 
        maxSimilarity = sim; 
        targetId = sol.id; 
      }
    }
    
    let plagStatus: 'CLEAN' | 'FLAGGED' | 'PENALIZED' = 'CLEAN';
    if (maxSimilarity > 90) plagStatus = 'PENALIZED';
    else if (maxSimilarity > 80) plagStatus = 'FLAGGED';

    const aiResult = await evaluateSolutionWithAI(targetProblem?.description || '', content);
    await db.collection("problems").doc(pId).collection("solutions").add({ 
      problemId: pId, studentId: user.id, studentName: user.name, content, submittedAt: new Date().toISOString(), reviewStatus: 'PENDING', attachmentUrl, 
      plagiarismMetadata: { similarityPercentage: maxSimilarity, targetSolutionId: targetId, status: plagStatus },
      aiEvaluation: aiResult, ...details 
    });
  }, [user, problems]);

  const verifySimulationSolution = useCallback(async (pId: string, sId: string, stId: string, rating: number, feedback: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!user || (user.role !== UserRole.MENTOR && user.role !== UserRole.ADMIN)) return;
    await db.runTransaction(async (transaction) => {
      const studentRef = db.collection("users").doc(stId);
      const solRef = db.collection("problems").doc(pId).collection("solutions").doc(sId);
      const probRef = db.collection("problems").doc(pId);
      
      const studentSnap = await transaction.get(studentRef);
      const studentData = studentSnap.data() as User;
      const solSnap = await transaction.get(solRef);
      const solData = solSnap.data() as Solution;
      
      const isVerified = status === 'VERIFIED';
      transaction.update(solRef, { isVerified, isRejected: !isVerified, reviewStatus: status, rating, feedback, mentorId: user.id, mentorName: user.name });
      
      if (isVerified) {
        transaction.update(probRef, { lockedByStudentId: null, lockedByStudentName: null, lockExpiresAt: null });

        const verifiedSims = (studentData.simSolvedCount || 0) + 1;
        const pastScores = (studentData.reviews || []).map(r => r.rating).slice(-4);
        const rollingAvg = Math.round(([...pastScores, rating].reduce((a,b) => a+b, 0)) / (pastScores.length + 1));
        const penalty = (solData.plagiarismMetadata?.status === 'PENALIZED' ? 50 : 0) + (studentData.penaltyPoints || 0);
        transaction.update(studentRef, {
            simSolvedCount: verifiedSims, rollingAverage: rollingAvg, penaltyPoints: penalty,
            leaderboardScore: (verifiedSims * 10) + (rollingAvg * 2) - penalty,
            reviews: [...(studentData.reviews || []), { id: sId, problemTitle: 'Simulation Exercise', rating, feedback, createdAt: new Date().toISOString(), companyName: `Mentor: ${user.name}` }],
            auditNotification: { problemId: pId, problemTitle: 'Simulation Verified', status: 'VERIFIED', feedback, read: false }
        });
      } else { transaction.update(studentRef, { auditNotification: { problemId: pId, problemTitle: 'Simulation Review', status: 'REJECTED', feedback, read: false } }); }
    });
  }, [user]);

  const stableActions = useMemo(() => ({
    login: async (e: string, p: string) => await auth.signInWithEmailAndPassword(e, p),
    register: async (email: string, password: string, role: UserRole, name: string, extraInfo: string) => {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user!.uid;
      const newUser: any = { 
        id: uid, username: name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000), email, name, role, 
        isVerified: role !== UserRole.COMPANY,
        verificationStatus: role === UserRole.COMPANY ? 'PENDING_VERIFICATION' : 'VERIFIED',
        rating: 0, leaderboardScore: 0, penaltyPoints: 0, solvedCount: 0, simSolvedCount: 0, skillLevel: 'Beginner', badges: [], reviews: [], joinedAt: new Date().toISOString(), bio: '', skills: []
      };
      if (role === UserRole.STUDENT) newUser.university = extraInfo || "";
      else if (role === UserRole.COMPANY) newUser.companyName = extraInfo || "";
      await db.collection("users").doc(uid).set(newUser);
      await userCredential.user!.sendEmailVerification();
      await auth.signOut();
    },
    logout: async () => { await auth.signOut(); },
    resetPassword: (email: string) => auth.sendPasswordResetEmail(email),
    addProblem: async (data: Partial<Problem>) => { 
        if (user?.verificationStatus === 'VERIFIED') {
            await db.collection("problems").add({ ...data, companyId: user.id, companyName: user.companyName || user.name, status: 'OPEN', createdAt: new Date().toISOString() }); 
        }
    },
    bulkAddProblems: async (problemsData: Partial<Problem>[]) => {
      if (user?.role !== UserRole.ADMIN) return;
      const batch = db.batch();
      problemsData.forEach(data => batch.set(db.collection("problems").doc(), { ...data, companyId: user.id, companyName: data.companyName || 'Simulation Hub', status: 'OPEN', createdAt: new Date().toISOString(), isSimulation: data.isSimulation ?? true }));
      await batch.commit();
    },
    acceptSolution: async (pId: string, sId: string, stId: string, r: number, f: string) => {
      await db.runTransaction(async t => { t.update(db.collection("problems").doc(pId).collection("solutions").doc(sId), { isAccepted: true, rating: r, feedback: f }); t.update(db.collection("problems").doc(pId), { status: 'CLOSED' }); });
    },
    editProblem: async (id: string, d: any) => { await db.collection("problems").doc(id).update(d); },
    manualCloseProblem: async (id: string) => { await db.collection("problems").doc(id).update({ status: 'CLOSED' }); },
    updateSiteConfig: async (c: any) => { await db.collection("settings").doc("global").set(c, { merge: true }); },
    updateUserProfile: async (d: any) => { if(user) await db.collection("users").doc(user.id).update(d); },
    adminBanUser: async (id: string, s: boolean) => { await db.collection("users").doc(id).update({ isBanned: !s }); },
    adminVerifyUser: async (id: string) => { await db.collection("users").doc(id).update({ isVerified: true, verificationStatus: 'VERIFIED' }); },
    adminUpdateCompanyStatus: async (userId: string, status: VerificationStatus) => {
        await db.collection("users").doc(userId).update({ 
            verificationStatus: status,
            isVerified: status === 'VERIFIED'
        });
    },
    adminDeleteUser: async (id: string) => { await db.collection("users").doc(id).delete(); },
    adminDeleteProblem: async (id: string) => { await db.collection("problems").doc(id).delete(); },
    bulkDeleteProblems: async (ids: string[]) => { const batch = db.batch(); ids.forEach(id => batch.delete(db.collection("problems").doc(id))); await batch.commit(); },
    fetchSingleUser: async (id: string) => { const doc = await db.collection("users").doc(id).get(); return doc.exists ? { id: doc.id, ...doc.data() } as User : null; },
    fetchUserByUsername: async (u: string) => { const snap = await db.collection("users").where("username", "==", u).limit(1).get(); return !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } as User : null; },
    clearAuditNotification: async () => { if(user) await db.collection("users").doc(user.id).update({ auditNotification: null }); },
    overridePlagiarismStatus: async (pId: string, sId: string, status: any) => { await db.collection("problems").doc(pId).collection("solutions").doc(sId).update({ "plagiarismMetadata.status": status }); },
  }), [user]);

  const contextValue = useMemo(() => ({
    user, loading, allUsers, problems, payments, siteConfig,
    ...stableActions, addSolution, verifySimulationSolution, lockProblem, unlockProblem
  }), [user, loading, allUsers, problems, payments, siteConfig, stableActions, addSolution, verifySimulationSolution, lockProblem, unlockProblem]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};
