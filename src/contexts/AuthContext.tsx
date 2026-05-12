import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { UserProfile, UserRole, Department } from '@/src/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout to prevent infinite loading state if Firebase is slow
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(loadingTimeout);
      try {
        setUser(user);
        if (user) {
          // Fetch custom profile data from Firestore
          const profileRef = doc(db, 'staff', user.uid);
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            const profileData = profileSnap.data() as UserProfile;
            // Elevate specific user to super_admin
            if (user.email === 'funcionelmar@gmail.com') {
              profileData.role = 'super_admin';
            }
            setProfile(profileData);
          } else {
            // Check residents collection if not staff
            const resRef = doc(db, 'residents_users', user.uid);
            const resSnap = await getDoc(resRef);
            if (resSnap.exists()) {
              const resData = resSnap.data() as UserProfile;
              if (user.email === 'funcionelmar@gmail.com') {
                resData.role = 'super_admin';
              }
              setProfile(resData);
            } else {
              // New user, defaults to citizen pending registration
              setProfile({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Resident',
                role: user.email === 'funcionelmar@gmail.com' ? 'super_admin' : 'resident',
                department: 'citizen_portal',
                isApproved: false
              });
            }
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'super_admin' || profile?.role === 'barangay_captain'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
