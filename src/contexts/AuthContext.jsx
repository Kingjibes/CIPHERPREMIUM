
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

const ADMIN_EMAIL = "richvybs92@gmail.com"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        toast({ title: "Session Error", description: "Could not fetch session.", variant: "destructive" });
      }
      if (session) {
        const userData = { 
          id: session.user.id, 
          email: session.user.email, 
          name: session.user.user_metadata?.name || session.user.email,
          isAdmin: session.user.email === ADMIN_EMAIL 
        };
        setUser(userData);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const userData = { 
          id: session.user.id, 
          email: session.user.email, 
          name: session.user.user_metadata?.name || session.user.email,
          isAdmin: session.user.email === ADMIN_EMAIL
        };
        setUser(userData);
      } else {
        setUser(null);
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
        data: { name: name }
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
    const { error: reauthError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });

    if (reauthError) {
        setLoading(false);
        toast({ title: "Error", description: "Incorrect current password.", variant: "destructive" });
        return false;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) {
      toast({ title: "Password Change Failed", description: updateError.message, variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Password changed successfully.", className: "bg-green-500 text-white" });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword, loading, isAdmin: user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
