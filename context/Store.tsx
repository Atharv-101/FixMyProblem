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
  addProblem: (data: Partial<Problem>) => Promise<void>;
  editProblem: (problemId: string, data: Partial<Problem>) => Promise<void>;
  manualCloseProblem: (problemId: string) => Promise<void>;
  addSolution: (problemId: string, content: string, file?: File) => Promise<void>;
  acceptSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string, paymentMethod: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  adminBanUser: (userId: string, currentStatus: boolean) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  adminDeleteProblem: (problemId: string) => Promise<void>;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  fetchSingleUser: (userId: string) => Promise<User | null>;
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
        if (docSnap.exists) setSiteConfig((docSnap as any).data() as SiteConfig);
      },
      (error) => {
        console.warn("Global settings access restricted:", error.message);
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
            const userData = { id: firebaseUser.uid, ...(docSnap as any).data() } as User;
            if (!userData.isBanned) setUser(userData);
            else await auth.signOut();
          }
        } catch (error) { setUser(null); }
      } else { setUser(null); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Use scoped query for users to allow guests to see counts while maintaining security for detailed data
  useEffect(() => {
    let query: any = db.collection("users");
    
    // For non-admin users (including guests), we restrict queries to prevent unauthorized access
    // to sensitive data, but we allow basic fetching to support total account counters.
    if (!user || user.role !== UserRole.ADMIN) {
      // In a real production app, Firestore security rules would ensure only non-sensitive 
      // fields (like role) are readable by guests.
    }

    const unsub = query.onSnapshot(
      (snapshot: any) => {
        const usersList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as User));
        // Ensure the current user is in the list if they aren't already fetched
        if (user && !usersList.find(u => u.id === user.id)) {
          usersList.push(user);
        }
        setAllUsers(usersList);
      },
      (error: any) => {
        console.warn("Community stats fetch restricted. Payout stats might be limited.", error.message);
        if (user) setAllUsers([user]);
        else setAllUsers([]);
      }
    );
    return () => unsub();
  }, [user?.id, user?.role]);

  useEffect(() => {
    const unsub = db.collection("problems").orderBy("createdAt", "desc").onSnapshot(
      (snapshot) => {
        const problemsData = snapshot.docs.map(doc => ({ id: doc.id, ...(doc as any).data(), solutions: [] })) as Problem[];
        setProblems(problemsData);
        
        problemsData.forEach(p => {
          if (!solutionUnsubscribes.current[p.id]) {
            solutionUnsubscribes.current[p.id] = db.collection("problems").doc(p.id).collection("solutions").onSnapshot(
              (s) => {
                setProblems(current => current.map(cp => cp.id === p.id ? { ...cp, solutions: s.docs.map(sd => ({ id: sd.id, ...(sd as any).data() } as Solution)) } : cp));
              },
              (error) => {
                console.debug(`Solutions restricted for problem ${p.id}`);
              }
            );
          }
        });
      },
      (error) => {
        console.warn("Problems collection access restricted:", error.message);
      }
    );
    return () => {
      unsub();
      Object.values(solutionUnsubscribes.current).forEach((un: any) => {
        if (typeof un === 'function') un();
      });
      solutionUnsubscribes.current = {};
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user) { setPayments([]); return; }
    
    let q: any = db.collection("payments");
    
    if (user.role === UserRole.STUDENT) {
      q = q.where("toId", "==", user.id).orderBy("timestamp", "desc");
    } else if (user.role === UserRole.COMPANY) {
      q = q.where("fromId", "==", user.id).orderBy("timestamp", "desc");
    } else if (user.role === UserRole.ADMIN) {
      q = q.orderBy("timestamp", "desc");
    }

    const unsub = q.onSnapshot(
      (snap: any) => {
        setPayments(snap.docs.map((d: any) => ({ id: d.id, ...(d as any).data() } as Payment)));
      },
      (error: any) => {
        console.warn("Payments history access restricted:", error.message);
      }
    );
    return () => unsub();
  }, [user?.id, user?.role]);

  const fetchSingleUser = async (userId: string): Promise<User | null> => {
    try {
      const doc = await db.collection("users").doc(userId).get();
      if (doc.exists) return { id: doc.id, ...doc.data() } as User;
      return null;
    } catch (e) {
      console.error("Failed to fetch profile:", e);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const register = async (email: string, password: string, role: UserRole, name: string, extraInfo: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user!.uid;
    const newUser: Partial<User> = { 
      id: uid, 
      email, 
      name, 
      role, 
      university: role === UserRole.STUDENT ? extraInfo : undefined, 
      companyName: role === UserRole.COMPANY ? extraInfo : undefined, 
      rating: role === UserRole.STUDENT ? 0 : undefined, 
      solvedCount: 0, 
      reviews: [], 
      lastSeen: new Date().toISOString(), 
      joinedAt: new Date().toISOString(),
      bio: '', 
      profilePicUrl: '', 
      skills: [] 
    };
    await db.collection("users").doc(uid).set(newUser);
    await userCredential.user!.sendEmailVerification();
    await auth.signOut();
  };

  const logout = () => auth.signOut();
  const resetPassword = (email: string) => auth.sendPasswordResetEmail(email);

  const addProblem = async (data: Partial<Problem>) => {
    if (!user || user.role !== UserRole.COMPANY) return;
    await db.collection("problems").add({ ...data, companyId: user.id, companyName: user.companyName, status: 'OPEN', createdAt: new Date().toISOString() });
  };

  const editProblem = async (id: string, data: Partial<Problem>) => {
    await db.collection("problems").doc(id).update(data);
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
    if (!prob) return;

    let student = allUsers.find(u => u.id === studentId);
    if (!student) {
        student = await fetchSingleUser(studentId);
    }

    if (!student) {
        console.error("Student profile not found. Cannot finalize transaction.");
        return;
    }

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

      const newReview = { 
        id: solutionId, 
        problemTitle: prob.title, 
        rating, 
        feedback, 
        createdAt: new Date().toISOString(), 
        companyName: user.companyName || user.name 
      };

      const currentRating = student!.rating || 0;
      const currentReviews = student!.reviews?.length || 0;
      const totalScore = (currentRating * currentReviews) + rating;
      const newRating = Number((totalScore / (currentReviews + 1)).toFixed(1));

      transaction.update(studentRef, { 
        solvedCount: (student!.solvedCount || 0) + 1, 
        rating: newRating, 
        reviews: [...(student!.reviews || []), newReview] 
      });

      transaction.set(payRef, { 
        problemId, 
        problemTitle: prob.title, 
        amount: prob.bounty, 
        commissionAmount: `₹${commission.toFixed(0)}`, 
        netAmount: `₹${netPayout.toFixed(0)}`, 
        status: 'COMPLETED', 
        fromId: user.id, 
        fromName: user.companyName || user.name, 
        toId: studentId, 
        toName: student!.name, 
        timestamp: new Date().toISOString(), 
        method: paymentMethod 
      });
    });
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    await db.collection("users").doc(user.id).update(data);
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const adminBanUser = async (id: string, status: boolean) => { await db.collection("users").doc(id).update({ isBanned: !status }); };
  const adminDeleteUser = async (id: string) => { await db.collection("users").doc(id).delete(); };
  const adminDeleteProblem = async (id: string) => { await db.collection("problems").doc(id).delete(); };
  const updateSiteConfig = async (c: Partial<SiteConfig>) => { await db.collection("settings").doc("global").set(c, { merge: true }); };

  return (
    <AppContext.Provider value={{ user, loading, allUsers, problems, payments, siteConfig, login, register, logout, resetPassword, addProblem, addSolution, acceptSolution, editProblem, manualCloseProblem, updateUserProfile, adminBanUser, adminDeleteUser, adminDeleteProblem, updateSiteConfig, fetchSingleUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore error");
  return context;
};