import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, LogIn, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const { user, profile, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const roleMessages: Record<string, string> = {
    'health': 'Authenticating Barangay Health Worker Access...',
    'youth': 'Preparing SK Management Dashboard...',
    'admin': 'Verifying Administrative Credentials...',
    'justice': 'Accessing Justice and Public Safety Portal',
    'treasury': 'Securing Financial and Treasury Records...'
  };

  const getLoadingMessage = (key: string) => {
    return roleMessages[key] || 'Initializing Secure Session...';
  };

  useEffect(() => {
    console.log("Login component mounted. Auth status:", { user: !!user, loading, profile });
    if (user && !loading && profile) {
      console.log("User already logged in with profile, redirecting to designated area...");
      // Determine where to send the user based on their profile
      setIsLoading(true);
      const deptKey = profile.department?.split('_')[0]; // Simple mapping
      setLoadingMessage(getLoadingMessage(deptKey || ''));
      
      const timer = setTimeout(() => {
        if (profile.role === 'super_admin' || profile.department === 'administration_governance') {
          navigate('/admin');
        } else if (profile.department === 'justice_public_safety' || profile.role === 'lupon_member' || profile.role === 'bpso_member') {
          navigate('/justice');
        } else if (profile.department === 'health_social_welfare' || profile.role === 'bhw') {
          navigate('/health');
        } else if (profile.department === 'youth_drrm_environment' || profile.role === 'sk_official' || profile.role === 'drrm_officer') {
          navigate('/resources');
        } else {
          navigate('/');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, loading, profile, navigate]);

  const demoAccounts: Record<string, { email: string, password: string, role: string, dept: string, path: string }> = {
    'admin': { email: 'admin@baluarte.gov.ph', password: 'admin123', role: 'super_admin', dept: 'administration_governance', path: '/admin' },
    'justice': { email: 'justice@baluarte.gov.ph', password: 'justice123', role: 'lupon_member', dept: 'justice_public_safety', path: '/justice' },
    'health': { email: 'health@baluarte.gov.ph', password: 'health123', role: 'bhw', dept: 'health_social_welfare', path: '/health' },
    'youth': { email: 'youth@baluarte.gov.ph', password: 'youth123', role: 'sk_official', dept: 'youth_drrm_environment', path: '/resources' },
  };

  const handleBypass = (key: string) => {
    const account = demoAccounts[key];
    if (account) {
      setIsLoading(true);
      setLoadingMessage(getLoadingMessage(key));
      setTimeout(() => {
        setIsLoading(false);
        navigate(account.path);
      }, 2000);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage('Verifying Credentials...');
    setError('');

    let loginEmail = username;
    let loginPassword = password;
    let userCredential: any;

    try {
      // Map demo usernames or emails to demo configuration
      const demoKey = Object.keys(demoAccounts).find(k => 
        k === username.toLowerCase().trim() || demoAccounts[k].email === username.toLowerCase().trim()
      );
      
      let account: any = null;
      if (demoKey) {
        account = demoAccounts[demoKey];
        loginEmail = account.email;
        setLoadingMessage(getLoadingMessage(demoKey));
      }

      try {
        userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        
        // If login succeeded, ensure staff profile exists
        if (account) {
          const staffRef = doc(db, 'staff', userCredential.user.uid);
          const staffSnap = await getDoc(staffRef);
          
          if (!staffSnap.exists()) {
            await setDoc(staffRef, {
              uid: userCredential.user.uid,
              email: loginEmail,
              displayName: `Brgy ${demoKey!.charAt(0).toUpperCase() + demoKey!.slice(1)} Officer`,
              role: account.role,
              department: account.dept,
              isApproved: true
            });
          }
          
          setTimeout(() => {
            navigate(account.path);
          }, 1500);
          return;
        }
      } catch (err: any) {
        // If login failed, check if it's a demo account we need to register
        const isMissingOrInvalid = err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password';

        if (account && isMissingOrInvalid) {
          setLoadingMessage(`Initializing ${demoKey} portal access...`);
          try {
            userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
            await setDoc(doc(db, 'staff', userCredential.user.uid), {
              uid: userCredential.user.uid,
              email: loginEmail,
              displayName: `Brgy ${demoKey!.charAt(0).toUpperCase() + demoKey!.slice(1)} Officer`,
              role: account.role,
              department: account.dept,
              isApproved: true
            });
            setTimeout(() => {
              navigate(account.path);
            }, 1000);
            return;
          } catch (createErr: any) {
            if (createErr.code === 'auth/email-already-in-use') {
              throw new Error('Wrong password for this account. Please try again or use the quick login buttons.');
            }
            throw createErr;
          }
        }
        throw err; // Re-throw to be caught by the outer catch
      }

      // Default redirect for successful non-demo login
      if (userCredential) {
        setLoadingMessage('Preparing Dashboard...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err: any) {
      console.error("Login component error:", err);
      setIsLoading(false);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Connection error. Please check your internet or firewall settings.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(err.message || 'An unexpected error occurred during login.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  if (loading && user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
        <p className="text-slate-500 text-sm">Synchronizing your profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center"
            >
              <div className="relative mb-8 inline-block">
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="w-24 h-24 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex items-center justify-center"
                >
                  <Sparkles className="text-blue-400 w-10 h-10" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
                </div>
              </div>
              
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-black text-white italic uppercase tracking-tighter mb-2"
              >
                {loadingMessage}
              </motion.h3>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-1 bg-blue-600 rounded-full mx-auto max-w-[200px]"
              />
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4 animate-pulse">
                Establishing Secure Encrypted Link...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Barangay Baluarte</h1>
          <p className="text-slate-500">Management Information System</p>
        </div>

        <Card className="shadow-xl border-slate-200 bg-white">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter credentials to access the BMIS portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin" 
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />} 
                Sign In
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-3">Quick Login (Skips Server Check)</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(demoAccounts).map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleBypass(key)}
                      className="text-[10px] text-blue-600 bg-white border border-blue-200 p-2 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-all text-left shadow-sm flex items-center justify-between group"
                    >
                      <span className="font-bold">{key}</span>
                      <LogIn size={10} className="text-blue-300 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center px-6"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Resident Access</span></div>
          </div>
          <CardFooter>
            <Button variant="outline" className="w-full border-slate-200" onClick={handleGoogleLogin}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg> 
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
