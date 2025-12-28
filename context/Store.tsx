
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Problem, UserRole, Solution, Review, SiteConfig, Payment } from '../types.ts';
import { auth, db } from '../services/firebase.ts';
import { supabase } from '../services/supabase.ts';

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
  addProblem: (title: string, description: string, bounty: string, tags: string[]) => void;
  editProblem: (problemId: string, title: string, description: string, bounty: string, tags: string[]) => Promise<void>;
  manualCloseProblem: (problemId: string) => Promise<void>;
  addSolution: (problemId: string, content: string, file?: File) => Promise<void>;
  acceptSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, paymentMethod: string) => Promise<void>;
  updateUserProfile: (name: string, bio: string, skills: string[], file?: File, websiteUrl?: string) => Promise<void>;
  adminBanUser: (userId: string, currentStatus: boolean) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminDeleteProblem: (problemId: string) => Promise<void>;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ baseFontSize: 16, enableDarkMode: true });
  
  const solutionUnsubscribes = useRef<Record<string, () => void>>({});

  useEffect(() => {
    const docRef = db.collection("settings").doc("global");
    const unsub = docRef.onSnapshot(
      (docSnap) => {
        if (docSnap.exists) {
            setSiteConfig(docSnap.data() as SiteConfig);
        }
      },
      (error) => {
        console.warn("Settings listener restricted:", error.message);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const docRef = db.collection("users").doc(firebaseUser.uid);
          const docSnap = await docRef.get();
          if (docSnap.exists) {
            const userData = { id: firebaseUser.uid, ...docSnap.data() } as User;
            if (!userData.isBanned) setUser(userData);
            else await auth.signOut();
          }
        } catch (error) { setUser(null); }
      } else { setUser(null); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setAllUsers([]);
      return;
    }
    const unsub = db.collection("users").onSnapshot(
      (snapshot) => {
        setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      },
      (error) => {
        console.warn("Users list listener restricted:", error.message);
      }
    );
    return () => unsub();
  }, [user?.id]);

  useEffect(() => {
    const unsub = db.collection("problems").orderBy("createdAt", "desc").onSnapshot(
      (snapshot) => {
        const problemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), solutions: [] })) as Problem[];
        setProblems(problemsData);
        
        problemsData.forEach(p => {
          if (!solutionUnsubscribes.current[p.id]) {
            solutionUnsubscribes.current[p.id] = db.collection("problems").doc(p.id).collection("solutions").onSnapshot(
              (s) => {
                setProblems(current => current.map(cp => cp.id === p.id ? { ...cp, solutions: s.docs.map(sd => ({ id: sd.id, ...sd.data() } as Solution)) } : cp));
              },
              (err) => {
                console.warn(`Solutions listener restricted for problem ${p.id}:`, err.message);
              }
            );
          }
        });
      },
      (error) => {
        console.warn("Problems listener restricted:", error.message);
      }
    );
    return () => {
      unsub();
      Object.values(solutionUnsubscribes.current).forEach(u => u());
      solutionUnsubscribes.current = {};
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user) { setPayments([]); return; }
    const q = db.collection("payments").orderBy("timestamp", "desc");
    const unsub = q.onSnapshot(
      (snap) => {
        const allPayments = snap.docs.map(d => ({ id: d.id, ...d.data() } as Payment));
        if (user.role === UserRole.ADMIN) setPayments(allPayments);
        else setPayments(allPayments.filter(p => p.fromId === user.id || p.toId === user.id));
      },
      (error) => {
        console.warn("Payments listener restricted:", error.message);
      }
    );
    return () => unsub();
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const register = async (email: string, password: string, role: UserRole, name: string, extraInfo: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user!.uid;
    const newUser = { id: uid, email, name, role, university: role === UserRole.STUDENT ? extraInfo : null, companyName: role === UserRole.COMPANY ? extraInfo : null, rating: role === UserRole.STUDENT ? 0 : null, solvedCount: 0, reviews: [], lastSeen: new Date().toISOString(), bio: '', profilePicUrl: '', skills: [] };
    await db.collection("users").doc(uid).set(newUser);
    await userCredential.user!.sendEmailVerification();
    await auth.signOut();
  };

  const logout = () => auth.signOut();
  const resetPassword = (email: string) => auth.sendPasswordResetEmail(email);

  const addProblem = async (title: string, description: string, bounty: string, tags: string[]) => {
    if (!user || user.role !== UserRole.COMPANY) return;
    await db.collection("problems").add({ companyId: user.id, companyName: user.companyName, title, description, bounty, status: 'OPEN', createdAt: new Date().toISOString(), tags });
  };

  const editProblem = async (id: string, title: string, description: string, bounty: string, tags: string[]) => {
    await db.collection("problems").doc(id).update({ title, description, bounty, tags });
  };

  const manualCloseProblem = async (id: string) => {
    await db.collection("problems").doc(id).update({ status: 'CLOSED' });
  };

  const addSolution = async (problemId: string, content: string, file?: File) => {
    if (!user) return;
    let attachmentUrl = null, attachmentName = null;
    if (file) {
      const path = `${problemId}/${user.id}/${Date.now()}_${file.name}`;
      await supabase.storage.from('solutions').upload(path, file);
      attachmentUrl = supabase.storage.from('solutions').getPublicUrl(path).data.publicUrl;
      attachmentName = file.name;
    }
    await db.collection("problems").doc(problemId).collection("solutions").add({ problemId, studentId: user.id, studentName: user.name, content, submittedAt: new Date().toISOString(), isAccepted: false, attachmentUrl, attachmentName });
  };

  const acceptSolution = async (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, paymentMethod: string) => {
    if (!user) return;
    const prob = problems.find(p => p.id === problemId);
    const student = allUsers.find(u => u.id === studentId);
    if (!prob || !student) return;

    const grossAmount = parseFloat(prob.bounty.replace(/[^0-9.]/g, '')) || 0;
    const commission = grossAmount * 0.1;
    const netPayout = grossAmount - commission;

    await db.runTransaction(async (transaction) => {
      const probRef = db.collection("problems").doc(problemId);
      const solRef = probRef.collection("solutions").doc(solutionId);
      const studentRef = db.collection("users").doc(studentId);
      const payRef = db.collection("payments").doc();

      transaction.update(solRef, { isAccepted: true, rating, feedback });
      transaction.update(probRef, { status: 'CLOSED' });

      const newReview = { id: solutionId, problemTitle: prob.title, rating, feedback, createdAt: new Date().toISOString(), companyName: user.companyName };
      const totalScore = ((student.rating || 0) * (student.reviews?.length || 0)) + rating;
      const newRating = Number((totalScore / ((student.reviews?.length || 0) + 1)).toFixed(1));

      transaction.update(studentRef, { 
        solvedCount: (student.solvedCount || 0) + 1, 
        rating: newRating, 
        reviews: [...(student.reviews || []), newReview] 
      });

      transaction.set(payRef, {
        problemId,
        problemTitle: prob.title,
        amount: prob.bounty,
        commissionAmount: `₹${commission.toFixed(0)}`,
        netAmount: `₹${netPayout.toFixed(0)}`,
        status: 'COMPLETED',
        fromId: user.id,
        fromName: user.companyName,
        toId: studentId,
        toName: student.name,
        timestamp: new Date().toISOString(),
        method: paymentMethod
      });
    });
  };

  const updateUserProfile = async (name: string, bio: string, skills: string[], file?: File, websiteUrl?: string) => {
    if (!user) return;
    await db.collection("users").doc(user.id).update({ name, bio, skills, websiteUrl });
    setUser(prev => prev ? { ...prev, name, bio, skills, websiteUrl } : null);
  };

  const adminBanUser = async (id: string, status: boolean) => {
    await db.collection("users").doc(id).update({ isBanned: !status });
  };
  const adminDeleteUser = async (id: string) => { await db.collection("users").doc(id).delete(); };
  const adminDeleteProblem = async (id: string) => { await db.collection("problems").doc(id).delete(); };
  const updateSiteConfig = async (c: Partial<SiteConfig>) => { await db.collection("settings").doc("global").set(c, { merge: true }); };

  return (
    <AppContext.Provider value={{ user, loading, allUsers, problems, payments, siteConfig, login, register, logout, resetPassword, addProblem, addSolution, acceptSolution, editProblem, manualCloseProblem, updateUserProfile, adminBanUser, adminDeleteUser, adminDeleteProblem, updateSiteConfig }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};
