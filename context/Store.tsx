
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  editProblem: (problemId: string, data: Partial<Problem>) => Promise<void>;
  manualCloseProblem: (problemId: string) => Promise<void>;
  addSolution: (problemId: string, content: string, file?: File) => Promise<void>;
  acceptSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, paymentMethod: string) => Promise<void>;
  verifySimulationSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, status: 'VERIFIED' | 'REJECTED') => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  adminBanUser: (userId: string, currentStatus: boolean) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminDeleteProblem: (problemId: string) => Promise<void>;
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

  const detectPlagiarism = (content: string, problemId: string): { similarity: number, status: 'CLEAN' | 'FLAGGED' | 'PENALIZED' } => {
    const currentProblem = problems.find(p => p.id === problemId);
    if (!currentProblem || !currentProblem.solutions) return { similarity: 0, status: 'CLEAN' };

    let maxSim = 0;
    currentProblem.solutions.forEach(s => {
      const common = s.content.split('').filter((c, i) => content[i] === c).length;
      const sim = (common / Math.max(content.length, s.content.length)) * 100;
      if (sim > maxSim) maxSim = sim;
    });

    if (maxSim > 90) return { similarity: maxSim, status: 'PENALIZED' };
    if (maxSim > 80) return { similarity: maxSim, status: 'FLAGGED' };
    return { similarity: maxSim, status: 'CLEAN' };
  };

  useEffect(() => {
    const unsub = db.collection("settings").doc("global").onSnapshot((doc) => {
        if (doc.exists) setSiteConfig(doc.data() as SiteConfig);
    }, (error) => {
        console.warn("Global settings access restricted:", error.message);
    });
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
        }, (error) => {
            console.error("User profile sync error:", error.message);
        });
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
    }, (error) => {
        console.warn("Users list restricted for guest/role:", error.message);
        setAllUsers(user ? [user] : []);
    });
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
              }, (error) => {
                  // Silently handle nested solutions permissions
              });
            }
          });
        }
      }, (error) => {
          console.warn("Problems feed restricted:", error.message);
          setProblems([]);
      });

    return () => {
      unsub();
      Object.values(solutionUnsubscribes.current).forEach((un: any) => un());
      solutionUnsubscribes.current = {};
    };
  }, [user?.id]);

  const clearAuditNotification = async () => {
    if (!user) return;
    await db.collection("users").doc(user.id).update({ auditNotification: null });
  };

  const fetchSingleUser = async (userId: string) => {
    try {
        const doc = await db.collection("users").doc(userId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as User : null;
    } catch { return null; }
  };

  const fetchUserByUsername = async (username: string) => {
    try {
        const snap = await db.collection("users").where("username", "==", username).limit(1).get();
        return !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } as User : null;
    } catch { return null; }
  };

  const login = async (email: string, password: string) => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const register = async (email: string, password: string, role: UserRole, name: string, extraInfo: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user!.uid;
    const username = name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);
    const newUser: Partial<User> = { 
      id: uid, username, email, name, role, 
      university: role === UserRole.STUDENT ? extraInfo : undefined, 
      companyName: role === UserRole.COMPANY ? extraInfo : undefined, 
      rating: 0, leaderboardScore: 0, penaltyPoints: 0, solvedCount: 0, simSolvedCount: 0, 
      skillLevel: 'Beginner', badges: [], reviews: [], joinedAt: new Date().toISOString(),
      bio: '', skills: [] 
    };
    await db.collection("users").doc(uid).set(newUser);
    await userCredential.user!.sendEmailVerification();
    await auth.signOut();
  };

  const logout = async () => {
    Object.values(solutionUnsubscribes.current).forEach((un: any) => un());
    solutionUnsubscribes.current = {};
    setUser(null);
    await auth.signOut();
  };

  const resetPassword = (email: string) => auth.sendPasswordResetEmail(email);

  const addProblem = async (data: Partial<Problem>) => {
    if (!user) return;
    await db.collection("problems").add({ 
        ...data, companyId: user.id, companyName: user.companyName || user.name, 
        status: 'OPEN', createdAt: new Date().toISOString() 
    });
  };

  const addSolution = async (problemId: string, content: string, file?: File) => {
    if (!user) return;
    const plag = detectPlagiarism(content, problemId);
    const prob = problems.find(p => p.id === problemId);
    const aiEval = await evaluateSolutionWithAI(prob?.description || "", content);

    let attachmentUrl = null;
    if (file) {
      const path = `solutions/${problemId}/${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('solutions').upload(path, file);
      
      if (uploadError) {
          console.error("Supabase Storage Error:", uploadError);
          if (uploadError.message.includes("Bucket not found")) {
              throw new Error("Critical: 'solutions' bucket missing in Supabase. Check dashboard.");
          }
          throw uploadError;
      }
      
      attachmentUrl = supabase.storage.from('solutions').getPublicUrl(path).data.publicUrl;
    }

    await db.collection("problems").doc(problemId).collection("solutions").add({ 
        problemId, studentId: user.id, studentName: user.name, 
        content, submittedAt: new Date().toISOString(), 
        isAccepted: false, isVerified: false, isRejected: false,
        reviewStatus: 'PENDING',
        aiEvaluation: aiEval,
        plagiarismMetadata: plag,
        attachmentUrl 
    });
  };

  const verifySimulationSolution = async (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!user || (user.role !== UserRole.MENTOR && user.role !== UserRole.ADMIN)) return;
    
    await db.runTransaction(async (transaction) => {
      const studentRef = db.collection("users").doc(studentId);
      const solRef = db.collection("problems").doc(problemId).collection("solutions").doc(solutionId);
      
      const studentSnap = await transaction.get(studentRef);
      const solSnap = await transaction.get(solRef);
      
      if (!studentSnap.exists || !solSnap.exists) {
          throw new Error("Target node or submission detached.");
      }

      const studentData = studentSnap.data() as User;
      const solData = solSnap.data() as Solution;
      const isVerified = status === 'VERIFIED';
      
      transaction.update(solRef, { 
        isVerified, 
        isRejected: !isVerified, 
        reviewStatus: status,
        rating, 
        feedback, 
        mentorId: user.id, 
        mentorName: user.name 
      });

      if (isVerified) {
        const verifiedSims = (studentData.simSolvedCount || 0) + 1;
        const pastScores = (studentData.reviews || []).map(r => r.rating).slice(-4);
        const allScores = [...pastScores, rating];
        const rollingAvg = Math.round(allScores.reduce((a,b) => a + b, 0) / allScores.length);
        
        let bonusPoints = 0;
        const earnedBadges = studentData.badges || [];
        const newBadges: Badge[] = [];
        BADGE_RULES.forEach(rule => {
            if (verifiedSims >= (rule as any).threshold && !earnedBadges.find(b => b.id === rule.id)) {
                const b = { ...rule, awardedAt: new Date().toISOString() };
                newBadges.push(b);
                bonusPoints += b.bonusPoints;
            }
        });

        const plag = solData.plagiarismMetadata;
        let penaltyInc = 0;
        if (plag?.status === 'PENALIZED') penaltyInc = 100;
        else if (plag?.status === 'FLAGGED') penaltyInc = 25;

        const finalScore = (verifiedSims * 10) + (rollingAvg * 2) + bonusPoints - ((studentData.penaltyPoints || 0) + penaltyInc);

        transaction.update(studentRef, {
            simSolvedCount: verifiedSims,
            rollingAverage: rollingAvg,
            skillLevel: calculateSkillLevel(rollingAvg),
            penaltyPoints: (studentData.penaltyPoints || 0) + penaltyInc,
            leaderboardScore: finalScore,
            badges: [...earnedBadges, ...newBadges],
            reviews: [...(studentData.reviews || []), {
                id: solutionId, problemTitle: 'Simulation Exercise',
                rating, feedback, createdAt: new Date().toISOString(),
                companyName: `Mentor: ${user.name}`
            }],
            auditNotification: { 
                problemId, 
                problemTitle: 'Simulation Verified', 
                status: 'VERIFIED', 
                feedback, 
                read: false 
            }
        });
      } else {
        transaction.update(studentRef, {
            auditNotification: { 
                problemId, 
                problemTitle: 'Simulation Review', 
                status: 'REJECTED', 
                feedback, 
                read: false 
            }
        });
      }
    });
  };

  const acceptSolution = async (pId: string, sId: string, stId: string, r: number, f: string) => {
      if (!user) return;
      await db.runTransaction(async (transaction) => {
          const studentRef = db.collection("users").doc(stId);
          const solRef = db.collection("problems").doc(pId).collection("solutions").doc(sId);
          const studentSnap = await transaction.get(studentRef);
          
          transaction.update(solRef, { isAccepted: true, rating: r, feedback: f });
          transaction.update(db.collection("problems").doc(pId), { status: 'CLOSED' });
          
          if (studentSnap.exists) {
            const data = studentSnap.data() as User;
            transaction.update(studentRef, { solvedCount: (data.solvedCount || 0) + 1 });
          }
      });
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    await db.collection("users").doc(user.id).update(data);
  };

  const adminBanUser = async (id: string, s: boolean) => { await db.collection("users").doc(id).update({ isBanned: !s }); };
  const adminDeleteUser = async (id: string) => { await db.collection("users").doc(id).delete(); };
  const adminDeleteProblem = async (id: string) => { await db.collection("problems").doc(id).delete(); };
  const updateSiteConfig = async (c: Partial<SiteConfig>) => { await db.collection("settings").doc("global").set(c, { merge: true }); };
  const editProblem = async (id: string, d: any) => { await db.collection("problems").doc(id).update(d); };
  const manualCloseProblem = async (id: string) => { await db.collection("problems").doc(id).update({ status: 'CLOSED' }); };

  return (
    <AppContext.Provider value={{ user, loading, allUsers, problems, payments, siteConfig, login, register, logout, resetPassword, addProblem, addSolution, acceptSolution, verifySimulationSolution, editProblem, manualCloseProblem, updateUserProfile, adminBanUser, adminDeleteUser, adminDeleteProblem, updateSiteConfig, fetchSingleUser, fetchUserByUsername, clearAuditNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore error");
  return context;
};
