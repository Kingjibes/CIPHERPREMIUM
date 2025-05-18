import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);
const ADMIN_EMAIL = "admin@example.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('premiumOffersUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, isAdmin: parsedUser.email === ADMIN_EMAIL });
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('premiumOffersUser');
      }
    }
  }, []);

  const login = (email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('premiumOffersRegisteredUsers') || '[]');
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const isAdmin = foundUser.email === ADMIN_EMAIL;
      const userData = { email: foundUser.email, name: foundUser.name, isAdmin };
      setUser(userData);
      localStorage.setItem('premiumOffersUser', JSON.stringify(userData));
      toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name}!`, className: "bg-green-500 text-white" });
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    return false;
  };

  const register = (name, email, password) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Registration Failed", description: "All fields are required.", variant: "destructive" });
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast({ title: "Registration Failed", description: "Please enter a valid email address.", variant: "destructive" });
        return false;
    }
    if (password.length < 6) {
        toast({ title: "Registration Failed", description: "Password must be at least 6 characters long.", variant: "destructive" });
        return false;
    }

    let storedUsers = JSON.parse(localStorage.getItem('premiumOffersRegisteredUsers') || '[]');
    if (storedUsers.find(u => u.email === email)) {
      toast({ title: "Registration Failed", description: "This email is already registered.", variant: "destructive" });
      return false;
    }
    
    const isAdmin = email === ADMIN_EMAIL;
    storedUsers.push({ name, email, password }); 
    localStorage.setItem('premiumOffersRegisteredUsers', JSON.stringify(storedUsers));
    
    const userData = { email, name, isAdmin };
    setUser(userData);
    localStorage.setItem('premiumOffersUser', JSON.stringify(userData));
    toast({ title: "Registration Successful", description: `Welcome, ${name}! You are now logged in.`, className: "bg-green-500 text-white" });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('premiumOffersUser');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const changePassword = (currentPassword, newPassword) => {
    if (!user) {
      toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
      return false;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "New password must be at least 6 characters long.", variant: "destructive" });
      return false;
    }

    let storedUsers = JSON.parse(localStorage.getItem('premiumOffersRegisteredUsers') || '[]');
    const userIndex = storedUsers.findIndex(u => u.email === user.email);

    if (userIndex === -1 || storedUsers[userIndex].password !== currentPassword) {
      toast({ title: "Error", description: "Incorrect current password.", variant: "destructive" });
      return false;
    }

    storedUsers[userIndex].password = newPassword;
    localStorage.setItem('premiumOffersRegisteredUsers', JSON.stringify(storedUsers));
    toast({ title: "Success", description: "Password changed successfully.", className: "bg-green-500 text-white" });
    return true;
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);