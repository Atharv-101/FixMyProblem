import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Problem, UserRole, Solution, Review, SiteConfig } from '../types';
import { auth, db } from '../services/firebase';
import { supabase } from '../services/supabase'; // Import Supabase Client

interface AppContextType {
  user: User | null;
  loading: boolean;
  allUsers: User[];
  problems: Problem[];
  siteConfig: SiteConfig;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, name: string, extraInfo: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  addProblem: (title: string, description: string, bounty: string, tags: string[]) => void;
  editProblem: (problemId: string, title: string, description: string, bounty: string, tags: string[]) => Promise<void>;
  manualCloseProblem: (problemId: string) => Promise<void>;
  addSolution: (problemId: string, content: string, file?: File) => Promise<void>;
  acceptSolution: (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string) => void;
  // Profile Functions
  updateUserProfile: (name: string, bio: string, skills: string[], file?: File, websiteUrl?: string) => Promise<void>;
  // Admin Functions
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
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ baseFontSize: 16, enableDarkMode: true });
  
  // Refs to track subscriptions to prevent memory leaks and duplicate listeners
  const solutionUnsubscribes = useRef<Record<string, () => void>>({});

  // 0. Sync Site Config
  useEffect(() => {
    const docRef = db.collection("settings").doc("global");
    const unsub = docRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
            setSiteConfig(docSnap.data() as SiteConfig);
        } else {
            docRef.set({ baseFontSize: 16, enableDarkMode: true }).catch(e => console.warn("Config init failed", e));
        }
    }, (error) => {
        console.warn("Site config sync failed (Permission Denied?): Using defaults.", error.message);
    });
    return () => unsub();
  }, []);

  // 1. Monitor Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const docRef = db.collection("users").doc(firebaseUser.uid);
          let docSnap = await docRef.get();

          if (!docSnap.exists) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            docSnap = await docRef.get();
          }

          if (docSnap.exists) {
            const userData = { id: firebaseUser.uid, ...docSnap.data() } as User;
            
            if (userData.isBanned) {
                console.warn("User is banned. Forcing logout.");
                await auth.signOut();
                alert("Your account has been suspended by the Administrator.");
                setUser(null);
            } else {
                setUser(userData);
            }
          } else {
            console.error("User authenticated but profile missing in Firestore. Auto-cleaning up.");
            await auth.signOut();
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sync All Users
  useEffect(() => {
    const q = db.collection("users");
    const unsubscribe = q.onSnapshot((snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() } as User);
      });
      setAllUsers(usersList);
    }, (error) => {
      if (!user) setAllUsers([]);
    });
    return () => unsubscribe();
  }, [user?.id]); 

  // 3. Sync Problems
  useEffect(() => {
    const q = db.collection("problems").orderBy("createdAt", "desc");
    
    const unsubscribeProblems = q.onSnapshot((snapshot) => {
      const problemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        solutions: [] 
      })) as Problem[];

      setProblems(prevProblems => {
        return problemsData.map(newProb => {
          const existing = prevProblems.find(p => p.id === newProb.id);
          return existing ? { ...newProb, solutions: existing.solutions } : newProb;
        });
      });

      if (user) {
        problemsData.forEach(problem => {
          if (!solutionUnsubscribes.current[problem.id]) {
            const solutionsRef = db.collection("problems").doc(problem.id).collection("solutions");
            
            const unsub = solutionsRef.onSnapshot((solSnap) => {
              const solutions = solSnap.docs.map(s => ({ id: s.id, ...s.data() } as Solution));
              
              setProblems(current => current.map(p => {
                if (p.id === problem.id) {
                  return { ...p, solutions };
                }
                return p;
              }));
            }, (error) => {
              console.warn(`Error fetching solutions for problem ${problem.id}:`, error.message);
            });

            solutionUnsubscribes.current[problem.id] = unsub;
          }
        });
      }
      
    }, (error) => {
      console.warn("Error fetching problems:", error.message);
    });

    return () => {
      unsubscribeProblems();
      (Object.values(solutionUnsubscribes.current) as (() => void)[]).forEach(unsub => unsub());
      solutionUnsubscribes.current = {};
    };
  }, [user?.id]); 

  // 4. Presence Heartbeat
  useEffect(() => {
    if (!user) return;
    const updatePresence = async () => {
      try {
        await db.collection("users").doc(user.id).update({
          lastSeen: new Date().toISOString()
        });
      } catch (e) {}
    };
    updatePresence();
    const interval = setInterval(updatePresence, 120000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    if (!userCredential.user!.emailVerified) {
      await auth.signOut();
      throw new Error("Please verify your email address before logging in. Check your inbox.");
    }
  };

  const register = async (email: string, password: string, role: UserRole, name: string, extraInfo: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user!.uid;

    try {
      const newUser: User = {
        id: uid,
        email,
        name,
        role,
        university: role === UserRole.STUDENT ? (extraInfo || null) : null,
        companyName: role === UserRole.COMPANY ? (extraInfo || null) : null,
        rating: role === UserRole.STUDENT ? 0 : null,
        solvedCount: 0,
        reviews: [],
        lastSeen: new Date().toISOString(),
        bio: '',
        profilePicUrl: '',
        skills: []
      };

      await db.collection("users").doc(uid).set(newUser as any);
      await userCredential.user!.sendEmailVerification();
      await auth.signOut();
    } catch (error) {
      console.error("Failed to create user profile in Firestore. Rolling back Auth.", error);
      await userCredential.user!.delete();
      throw new Error("Registration failed. Please try again.");
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setAllUsers([]);
  };

  const resetPassword = async (email: string) => {
    await auth.sendPasswordResetEmail(email);
  };

  const updateUserProfile = async (name: string, bio: string, skills: string[], file?: File, websiteUrl?: string) => {
    if (!user) throw new Error("You must be logged in to update your profile.");
    
    const updates: any = {
        name,
        bio: bio || "",
        skills: skills || [],
    };
    if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl;

    try {
        await db.collection("users").doc(user.id).update(updates);
        console.log("Firestore profile updated successfully.");
        setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (e: any) {
        console.error("Error updating Firestore profile:", e);
        if (e.code === 'permission-denied') {
             throw new Error("Permission denied: Check Firestore Rules.");
        }
        throw new Error("Failed to save profile data.");
    }
  };

  const addProblem = async (title: string, description: string, bounty: string, tags: string[]) => {
    if (!user || user.role !== UserRole.COMPANY) return;
    const newProblem = {
      companyId: user.id,
      companyName: user.companyName || 'Unknown Company',
      title,
      description,
      bounty,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      tags,
    };
    await db.collection("problems").add(newProblem);
  };

  const editProblem = async (problemId: string, title: string, description: string, bounty: string, tags: string[]) => {
    if (!user || user.role !== UserRole.COMPANY) return;
    const problemRef = db.collection("problems").doc(problemId);
    await problemRef.update({ title, description, bounty, tags });
  };

  const manualCloseProblem = async (problemId: string) => {
    if (!user || user.role !== UserRole.COMPANY) return;
    const problemRef = db.collection("problems").doc(problemId);
    await problemRef.update({ status: 'CLOSED' });
  };

  const addSolution = async (problemId: string, content: string, file?: File) => {
    if (!user) throw new Error("You must be logged in.");
    if (user.role !== UserRole.STUDENT) throw new Error("Only students can submit solutions.");

    let attachmentUrl = null;
    let attachmentName = null;
    let finalContent = content;

    if (file) {
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${problemId}/${user.id}/${Date.now()}_${safeName}`;
        
        const { error } = await supabase.storage.from('solutions').upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage.from('solutions').getPublicUrl(filePath);
        attachmentUrl = publicUrlData.publicUrl;
        attachmentName = file.name;
        
      } catch (error: any) {
        console.error("File upload failed (Supabase):", error);
        alert(`File upload failed: ${error.message}. Submitting text only.`);
        finalContent += `\n\n[System Note: Attachment '${file.name}' upload failed.]`;
      }
    }

    try {
        const newSolution = {
            problemId,
            studentId: user.id,
            studentName: user.name,
            content: finalContent,
            submittedAt: new Date().toISOString(),
            isAccepted: false,
            attachmentUrl,
            attachmentName
        };
        await db.collection("problems").doc(problemId).collection("solutions").add(newSolution);
    } catch (e: any) {
        console.error("Database save failed:", e);
        throw new Error("Failed to save solution to database.");
    }
  };

  const acceptSolution = async (problemId: string, solutionId: string, studentId: string, rating: number, feedback: string) => {
    try {
      await db.runTransaction(async (transaction) => {
        const problemRef = db.collection("problems").doc(problemId);
        const solutionRef = db.collection("problems").doc(problemId).collection("solutions").doc(solutionId);
        const studentRef = db.collection("users").doc(studentId);
        
        const studentDoc = await transaction.get(studentRef);
        const problemDoc = await transaction.get(problemRef); 
        const studentData = studentDoc.data();
        if (!studentData) throw "Student not found";
        
        const problemTitle = problemDoc.exists ? problemDoc.data()!.title : "Unknown Problem";

        transaction.update(solutionRef, { isAccepted: true, rating, feedback });
        transaction.update(problemRef, { status: 'CLOSED' });

        const currentSolved = studentData.solvedCount || 0;
        const currentRating = studentData.rating || 0;
        const currentReviews = studentData.reviews || [];

        const newReview: Review = {
          id: solutionId, 
          problemTitle,
          rating,
          feedback,
          createdAt: new Date().toISOString(),
          companyName: user?.companyName || 'Company'
        };

        const totalScore = (currentRating * currentReviews.length) + rating;
        const newRating = Number((totalScore / (currentReviews.length + 1)).toFixed(1));

        transaction.update(studentRef, {
          solvedCount: currentSolved + 1,
          rating: newRating,
          reviews: [...currentReviews, newReview]
        });
      });
    } catch (e) {
      console.error("Transaction failed: ", e);
      alert("Failed to accept solution. Please try again.");
    }
  };

  const adminBanUser = async (userId: string, currentStatus: boolean) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    try {
        await db.collection("users").doc(userId).update({
            isBanned: !currentStatus
        });
    } catch (e) {
        console.error("Failed to ban/unban user", e);
        throw e;
    }
  };

  const adminDeleteUser = async (userId: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    try { await db.collection("users").doc(userId).delete(); } catch (e) { throw e; }
  };

  const adminDeleteProblem = async (problemId: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    try { await db.collection("problems").doc(problemId).delete(); } catch (e) { throw e; }
  };

  const updateSiteConfig = async (newConfig: Partial<SiteConfig>) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    await db.collection("settings").doc("global").set(newConfig, { merge: true });
  };

  return (
    <AppContext.Provider value={{ 
        user, loading, allUsers, problems, siteConfig,
        login, register, logout, resetPassword, 
        addProblem, addSolution, acceptSolution,
        editProblem, manualCloseProblem,
        updateUserProfile,
        adminBanUser, adminDeleteUser, adminDeleteProblem, updateSiteConfig
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};