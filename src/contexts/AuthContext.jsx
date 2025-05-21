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
  const [loading, setLoading] = useState(true); // Initialize loading to true
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
    // setLoading(true) is called at the start of this effect
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        // Consider a toast for critical session errors if needed, but often silent is fine
      }
      updateUserContext(session?.user);
      setLoading(false); // Set loading to false after session is fetched/processed
    };

    fetchSession(); // Initial session check

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // No need to setLoading(true) here as fetchSession already handles initial load.
      // Subsequent auth changes (login, logout, token refresh, password recovery) will update user.
      // The UI should react to `user` state changes.
      // If a component needs to know if an auth operation is in progress, it uses the `loading` state from useAuth()
      // which is set by individual auth action handlers (handleLogin, handleRegister etc.)
      
      updateUserContext(session?.user);
      if (event === "USER_UPDATED" && session?.user) {
        updateUserContext(session.user); 
      }
      // setLoading(false) is not strictly needed here for onAuthStateChange events themselves,
      // as the primary `loading` state is for the initial app load and specific actions.
      // However, if an action like PASSWORD_RECOVERY implicitly changes loading state, it should be managed there.
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [toast, updateUserContext]); // Removed `loading` from dependency array to prevent re-triggering fetchSession

  const login = async (email, password) => {
    return handleLogin(email, password, setLoading, toast);
  };

  const register = async (name, email, password) => {
    return handleRegister(name, email, password, setLoading, toast);
  };

  const logout = async () => {
    return handleLogout(setLoading, setUser, toast); // Pass setUser to clear user state immediately
  };
  
  // Updated to only take newPassword, as currentPassword is not needed for Supabase updateUser
  const changePassword = async (newPassword) => {
    return handleChangePassword(newPassword, setLoading, toast, user);
  };

  const sendPasswordResetEmail = async (email) => {
    return handleSendPasswordResetEmail(email, setLoading, toast);
  };

  const resetPassword = async (newPassword) => { 
    return handleResetPassword(newPassword, setLoading, toast);
  };

  const updateUsername = async (newName) => {
    const success = await handleUpdateUsername(newName, setLoading, toast, user);
    if (success) {
      // Re-fetch user data to ensure context has the absolute latest from DB,
      // especially if user_metadata updates might have slight delays in propagation to session object.
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
