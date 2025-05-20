import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const hash = location.hash.substring(1); // Remove #
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    if (accessToken) {
      setToken(accessToken);
    } else {
      toast({
        title: "Invalid Link",
        description: "The password reset link is invalid or has expired. Please request a new one.",
        variant: "destructive",
        duration: 7000,
      });
      navigate('/forgot-password');
    }
  }, [location, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (!token) {
      toast({
        title: "Error",
        description: "Password reset token is missing. Please use the link from your email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const success = await resetPassword(token, password);
    setIsSubmitting(false);

    if (success) {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. You can now log in with your new password.",
        className: "bg-green-500 text-white",
        duration: 7000,
      });
      navigate('/login');
    }
  };

  if (!token && !isSubmitting) { // Only show loader if token is being processed or submitting
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-accent p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-accent p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <Lock className="h-16 w-16 gradient-text mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold gradient-text">Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below. Must be 8+ characters and include letters, numbers, and symbols.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-7 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-7 h-7 w-7"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity duration-300 text-primary-foreground" disabled={isSubmitting || !token}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default ResetPasswordPage;
