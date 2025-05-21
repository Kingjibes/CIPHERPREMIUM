import { supabase } from '@/lib/supabaseClient';

const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);

export const handleLogin = async (email, password, setLoading, toast) => {
  if (!validateEmail(email)) {
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

export const handleRegister = async (name, email, password, setLoading, toast) => {
  if (!name.trim() || !email.trim() || !password.trim()) {
    toast({ title: "Registration Failed", description: "All fields are required.", variant: "destructive" });
    return false;
  }
  if (!validateEmail(email)) {
      toast({ title: "Registration Failed", description: "Please enter a valid email address.", variant: "destructive" });
      return false;
  }
  
  if (!validatePassword(password)) {
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
      data: { name: name.trim() },
      emailRedirectTo: `${window.location.origin}/success`
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

export const handleLogout = async (setLoading, setUser, toast) => {
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

export const handleChangePassword = async (newPassword, setLoading, toast, user) => {
  if (!user) {
    toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
    return false;
  }
  
  if (!validatePassword(newPassword)) {
      toast({ 
          title: "Password Change Failed", 
          description: "New password must be at least 8 characters long and include letters, numbers, and symbols.", 
          variant: "destructive",
          duration: 7000 
      });
      return false;
  }
  
  setLoading(true);
  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  setLoading(false);

  if (updateError) {
    toast({ title: "Password Change Failed", description: updateError.message || "Could not update password.", variant: "destructive" });
    return false;
  }

  toast({ title: "Success", description: "Password changed successfully.", className: "bg-green-500 text-white" });
  return true;
};

export const handleSendPasswordResetEmail = async (email, setLoading, toast) => {
  if (!validateEmail(email)) {
    toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" });
    return false;
  }
  setLoading(true);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
     redirectTo: `${window.location.origin}/reset-password`, // This URL must be whitelisted in Supabase
  });
  setLoading(false);

  if (error) {
    toast({ title: "Error Sending Reset Link", description: error.message, variant: "destructive" });
    return false;
  }
  toast({ title: "Reset Link Sent", description: "If an account exists for this email, a password reset link has been sent.", className: "bg-green-500 text-white", duration: 7000 });
  return true; 
};

// newPassword is the only argument needed as Supabase handles the session
export const handleResetPassword = async (newPassword, setLoading, toast) => { 
  if (!validatePassword(newPassword)) {
      toast({ 
          title: "Password Reset Failed", 
          description: "New password must be at least 8 characters long and include letters, numbers, and symbols.", 
          variant: "destructive",
          duration: 7000 
      });
      return false;
  }

  setLoading(true);
  // Supabase uses the active session (established by the token from the email link)
  // to know which user's password to update.
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  setLoading(false);

  if (error) {
    toast({ title: "Password Reset Failed", description: error.message, variant: "destructive" });
    return false;
  }
  return true;
};

export const handleUpdateUsername = async (newName, setLoading, toast, user) => {
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
    toast({ title: "Success", description: "Username updated successfully!", className: "bg-green-500 text-white" });
  }
  return true;
};
