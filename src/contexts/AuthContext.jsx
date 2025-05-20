import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { 
  handleLogin, 
  handleRegister, 
  handleLogout, 
  handleChangePassword,
  handleSendPasswordResetEmail,
  handleResetPassword,
  handleUpdateUsername
} from '@/lib/authActions';

const AuthContext = createContext(null);

const ADMIN_EMAIL = "richvybs92@gmail.com"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const updateUserContext = useCallback((sessionUser) => {
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
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
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
      setLoading(true);
      updateUserContext(session?.user);
      if (event === "USER_UPDATED" && session?.user) {
        updateUserContext(session.user);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [toast, updateUserContext]);

  const login = async (email, password) => {
    return handleLogin(email, password, setLoading, toast);
  };

  const register = async (name, email, password) => {
    return handleRegister(name, email, password, setLoading, toast, {
      data: { name },
      emailRedirectTo: 'https://cipherpremium.onrender.com/success'
    });
  };

  const logout = async () => {
    return handleLogout(setLoading, setUser, toast);
  };
  
  const changePassword = async (currentPassword, newPassword) => {
    return handleChangePassword(newPassword, setLoading, toast, user);
  };

  const sendPasswordResetEmail = async (email) => {
    return handleSendPasswordResetEmail(email, setLoading, toast);
  };

  const resetPassword = async (accessToken, newPassword) => {
    return handleResetPassword(newPassword, setLoading, toast);
  };

  const updateUsername = async (newName) => {
    const success = await handleUpdateUsername(newName, setLoading, toast, user);
    if (success) {
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      if (updatedUser) {
        updateUserContext(updatedUser);
      }
    }
    return success;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      changePassword, 
      sendPasswordResetEmail, 
      resetPassword, 
      updateUsername, 
      loading, 
      isAdmin: user?.isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
