import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient'; 

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorFromUrl, setErrorFromUrl] = useState('');
  const { resetPassword, loading: authLoading, user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.substring(1)); // Remove '#'
    const errorDescription = hashParams.get('error_description');
    if (errorDescription) {
      setErrorFromUrl(errorDescription);
      toast({
        title: "Error Processing Link",
        description: errorDescription,
        variant: "destructive",
        duration: 7000
      });
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is now set, user can update their password.
        // The `user` object in AuthContext should be updated.
      }
    });

    // If not loading, no user, no token in hash, and no error in hash, then invalid access
    if (!authLoading && !user && !location.hash.includes('access_token') && !errorDescription) {
      toast({
        title: "Invalid Access",
        description: "Please use the password reset link from your email.",
        variant: "destructive",
        duration: 7000
      });
      navigate('/login');
    }

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [authLoading, user, navigate, toast, location.hash]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Password Reset Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!user && !authLoading) {
        toast({
            title: "Invalid Session",
            description: "Your session for password reset is invalid or has expired. Please request a new one.",
            variant: "destructive",
        });
        navigate('/forgot-password');
        return;
    }
    
    setIsSubmitting(true);
    const success = await resetPassword(password); 
    setIsSubmitting(false);
    if (success) {
      toast({
        title: "Password Reset Successful!",
        description: "Your password has been changed. You will be redirected.",
        className: "bg-green-500 text-white",
        duration: 4000 
      });
      setTimeout(() => {
        navigate('/success'); 
      }, 1000); 
    }
  };

  // This loading state is for when Supabase is trying to establish a session from the token in the URL
  if (authLoading && !user && location.hash.includes('access_token')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-purple-600 to-secondary p-4">
        <Loader2 className="h-16 w-16 animate-spin text-white mb-4" />
        <p className="text-xl text-white">Verifying reset link...</p>
      </div>
    );
  }

  // If there was an error from the URL (e.g., token expired), show an error message.
  if (errorFromUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-600 to-rose-700 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
              <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold text-destructive-foreground">Link Error</CardTitle>
              <CardDescription className="text-destructive-foreground/80">{errorFromUrl}</CardDescription>
            </CardHeader>
            <CardFooter className="text-center block mt-4">
              <Button variant="outline" asChild className="p-0 h-auto">
                <a href="/forgot-password">Request a new link</a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  // If no user session could be established (and no specific error from URL, meaning likely invalid/no token)
  // This check is a bit redundant with the useEffect redirect, but acts as a safeguard for rendering.
  if (!user && !authLoading) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-purple-600 to-secondary p-4">
        <KeyRound className="h-16 w-16 text-white mb-4" />
        <p className="text-xl text-white text-center">Invalid or expired link. <br/> Please request a new password reset link.</p>
         <Button variant="outline" asChild className="mt-4">
            <a href="/forgot-password">Request New Link</a>
        </Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-purple-600 to-secondary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <KeyRound className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-foreground">Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5 relative">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-7 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="space-y-1.5 relative">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={isSubmitting}
                />
                 <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-7 h-7 w-7"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters and include letters, numbers, and symbols (e.g., @, $, !).
              </p>
              <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || authLoading}>
                {isSubmitting || (authLoading && !user) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <KeyRound className="mr-2 h-5 w-5" />}
                {isSubmitting || (authLoading && !user) ? 'Processing...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
           <CardFooter className="text-center block mt-4">
            <p className="text-sm text-muted-foreground">
              Remembered your password?{' '}
              <Button variant="link" asChild className="p-0 h-auto text-primary" disabled={isSubmitting}>
                <a href="/login">Log in</a>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default ResetPasswordPage;
