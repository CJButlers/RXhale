import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { InhalerIllustration } from './InhalerIllustration';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

export function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only used for signup styling mostly, though we can save it to profile
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      if (isSignup) {
        if (!name.trim()) {
          toast.error('Please enter your full name');
          return;
        }
        // 1. Create Account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // 2. Add Name to Profile
        await updateProfile(userCredential.user, { displayName: name });
        
        toast.success("Account created successfully!");
      } else {
        // Login
        await setPersistence(auth, browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back");
      }
    } catch (error: any) {
      // content: Clean up Firebase error messages
      const message = error.message.replace('Firebase: ', '').replace(' (auth/invalid-email).', '');
      toast.error(message);
    }
    
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column - Illustration & Gradient (Restored from Old Design) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-12">
        <div className="space-y-4">
          <InhalerIllustration />
          <div className="text-center">
            <h1 className="text-7xl text-black tracking-wide" style={{ fontWeight: 700 }}>RXhale</h1>
            <p className="mt-4 text-slate-600 max-w-md">Professional COPD Patient Management System for Pharmacists</p>
          </div>
        </div>
      </div>

      {/* Right Column - Login/Signup Form */}
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl text-slate-800">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-slate-500">
              {isSignup ? 'Sign up to manage your patients' : 'Sign in to manage your patients'}
            </p>
            
            {/* Demo Account Hint (Updated for Email format) */}
            {!isSignup && (
              <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-800">
                  <strong>Demo Account:</strong><br/>
                  Email: <code>demo@rxhale.com</code><br/>
                  Password: <code>demo123</code>
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isSignup && (
                <div>
                  <label htmlFor="name" className="block mb-2 text-slate-700 font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block mb-2 text-slate-700 font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  placeholder="pharmacist@rxhale.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-slate-700 font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-lg font-normal shadow-lg shadow-teal-600/20 transition-all hover:shadow-xl hover:shadow-teal-600/30"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setEmail('');
                setPassword('');
              }}
              className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              {isSignup ? 'Already have an account? Sign in' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}