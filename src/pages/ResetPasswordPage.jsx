import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { resetPassword, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove #
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
      } else if (!params.has('error')) {
         toast({
          title: "Invalid Link",
          description: "Password reset link is invalid or has expired. Please request a new one.",
          variant: "destructive",
          duration: 7000
        });
        navigate('/forgot-password');
      }
    }
  }, [navigate, toast]);

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
    if (!accessToken && !authLoading && !window.location.hash.includes('access_token')) {
        toast({
            title: "Invalid Session",
            description: "Your session for password reset is invalid or has expired. Please try the link again or request a new one.",
            variant: "destructive",
        });
        navigate('/forgot-password');
        return;
    }

    setIsSubmitting(true);
    const success = await resetPassword(null, password); 
    setIsSubmitting(false);
    if (success) {
      navigate('/success'); // Changed from toast + /login to directly navigate to /success
    }
  };

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
                {isSubmitting || authLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <KeyRound className="mr-2 h-5 w-5" />}
                {isSubmitting || authLoading ? 'Resetting...' : 'Reset Password'}
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
