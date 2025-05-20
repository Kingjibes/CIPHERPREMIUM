import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

const ADMIN_EMAIL = "admin@example.com"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const updateUserContext = (sessionUser) => {
    if (sessionUser) {
      const userData = { 
        id: sessionUser.id, 
        email: sessionUser.email, 
        name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User',
        isAdmin: sessionUser.email === ADMIN_EMAIL 
      };
      setUser(userData);
      return userData;
    }
    setUser(null);
    return null;
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        toast({ title: "Session Error", description: "Could not fetch session.", variant: "destructive" });
      }
      updateUserContext(session?.user);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      updateUserContext(session?.user);
      if (event === 'PASSWORD_RECOVERY') {
        // This event is triggered after a successful password reset.
        // The user is typically redirected to the app, and we might want to show a success message.
        // However, the ResetPasswordPage handles its own success toast.
      }
      if (event === "USER_UPDATED") {
        // Refresh user data if it was updated (e.g. username change)
        if (session?.user) {
            updateUserContext(session.user);
        }
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [toast]);

  const login = async (email, password) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Login Failed", description: "Please enter a valid email address.", variant: "destructive" });
      return false;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({ title: "Login Failed", description: error.message || "Invalid email or password.", variant: "destructive" });
      return false;
    }
    toast({ title: "Login Successful", description: `Welcome back!`, className: "bg-green-500 text-white" });
    return true;
  };

  const register = async (name, email, password) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Registration Failed", description: "All fields are required.", variant: "destructive" });
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast({ title: "Registration Failed", description: "Please enter a valid email address.", variant: "destructive" });
        return false;
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        toast({ 
            title: "Registration Failed", 
            description: "Password must be at least 8 characters long and include letters, numbers, and symbols (e.g., @, $, !).", 
            variant: "destructive",
            duration: 7000 
        });
        return false;
    }
    
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: {
        data: { name: name },
        // emailRedirectTo: `${window.location.origin}/` // Redirect to home after confirmation
      } 
    });
    setLoading(false);

    if (error) {
      toast({ title: "Registration Failed", description: error.message || "Could not register user.", variant: "destructive" });
      return false;
    }
    if (data.user) {
       toast({ title: "Registration Successful", description: `Welcome, ${name}! Please check your email to confirm your account.`, className: "bg-green-500 text-white", duration: 7000 });
    }
    return true;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
      return;
    }
    setUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const changePassword = async (currentPassword, newPassword) => {
    if (!user) {
      toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
      return false;
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        toast({ 
            title: "Password Change Failed", 
            description: "New password must be at least 8 characters long and include letters, numbers, and symbols (e.g., @, $, !).", 
            variant: "destructive",
            duration: 7000 
        });
        return false;
    }
    
    setLoading(true);
    // Supabase updateUser doesn't require re-authentication for password change if user is already logged in.
    // However, it's good practice to verify current password if your app logic requires it.
    // For simplicity with Supabase's direct updateUser, we'll skip explicit re-auth here,
    // but you could add it by first calling signInWithPassword with currentPassword.
    // const { error: reauthError } = await supabase.auth.reauthenticate() // This is for OTP reauth
    // For now, we'll directly update. If you want to verify current password, you'd need a custom flow or ensure user is recently authenticated.

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) {
      toast({ title: "Password Change Failed", description: updateError.message || "Could not update password.", variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Password changed successfully.", className: "bg-green-500 text-white" });
    return true;
  };

  const sendPasswordResetEmail = async (email) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" });
      return false;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // redirectTo: `${window.location.origin}/reset-password`, // Supabase handles the full path now
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error Sending Reset Link", description: error.message, variant: "destructive" });
      return false;
    }
    return true; // Success is implied if no error, Supabase handles email sending
  };

  const resetPassword = async (accessToken, newPassword) => {
    // The access token is now handled by Supabase when the user clicks the link and is redirected.
    // The actual password update happens on the ResetPasswordPage after onAuthStateChange detects 'PASSWORD_RECOVERY'
    // This function is now more about updating the user's password once they are on the reset page.
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        toast({ 
            title: "Password Reset Failed", 
            description: "New password must be at least 8 characters long and include letters, numbers, and symbols.", 
            variant: "destructive",
            duration: 7000 
        });
        return false;
    }

    setLoading(true);
    // The user should be in a session initiated by the recovery link.
    // We can directly update the user's password.
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast({ title: "Password Reset Failed", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  };

  const updateUsername = async (newName) => {
    if (!user) {
      toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
      return false;
    }
    if (!newName || newName.trim().length < 3) {
      toast({ title: "Update Failed", description: "Username must be at least 3 characters long.", variant: "destructive" });
      return false;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { name: newName.trim() }
    });
    setLoading(false);

    if (error) {
      toast({ title: "Username Update Failed", description: error.message, variant: "destructive" });
      return false;
    }

    if (data.user) {
      updateUserContext(data.user); // Update local user state
      toast({ title: "Success", description: "Username updated successfully!", className: "bg-green-500 text-white" });
    }
    return true;
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword, sendPasswordResetEmail, resetPassword, updateUsername, loading, isAdmin: user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
