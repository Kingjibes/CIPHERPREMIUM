import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCircle, Lock, Save, Eye, EyeOff, Edit3, Mail, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

function ProfilePage() {
  const { user, changePassword, updateUsername, loading: authLoading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const [newUsername, setNewUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isSubmittingUsername, setIsSubmittingUsername] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setNewUsername(user.name || '');
    }
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Change Failed",
        description: "New passwords do not match. Please re-enter.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmittingPassword(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsSubmittingPassword(false);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || newUsername.trim() === user.name) {
      setIsEditingUsername(false);
      return;
    }
    setIsSubmittingUsername(true);
    const success = await updateUsername(newUsername.trim());
    setIsSubmittingUsername(false);
    if (success) {
      setIsEditingUsername(false);
    }
  };

  if (authLoading && !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">Please log in to view your profile.</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-2xl mx-auto p-4 md:p-0"
    >
      <div className="text-center">
        <UserCircle className="h-24 w-24 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-tight gradient-text">{user.name}</h1>
        <p className="text-lg text-muted-foreground flex items-center justify-center">
          <Mail className="mr-2 h-5 w-5 text-muted-foreground" /> {user.email}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCircle className="mr-2 h-5 w-5 text-primary" />
            Account Details
          </CardTitle>
          <CardDescription>View and update your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            {isEditingUsername ? (
              <form onSubmit={handleUpdateUsername} className="flex items-center gap-2 mt-1">
                <Input
                  id="username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  disabled={isSubmittingUsername}
                />
                <Button type="submit" size="sm" disabled={isSubmittingUsername || newUsername.trim() === user.name}>
                  {isSubmittingUsername ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditingUsername(false); setNewUsername(user.name); }} disabled={isSubmittingUsername}>
                  Cancel
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-between mt-1">
                <p className="text-lg">{user.name}</p>
                <Button variant="outline" size="sm" onClick={() => setIsEditingUsername(true)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Change
                </Button>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email (Login ID)</Label>
            <p id="email" className="text-lg text-muted-foreground mt-1">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Your email is used for logging in and cannot be changed here.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password for enhanced security. Must be 8+ characters and include letters, numbers, and symbols.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="relative">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1"
                disabled={isSubmittingPassword}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-7 h-7 w-7"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isSubmittingPassword}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="relative">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1"
                disabled={isSubmittingPassword}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-7 h-7 w-7"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isSubmittingPassword}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="relative">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="mt-1"
                disabled={isSubmittingPassword}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-7 h-7 w-7"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                disabled={isSubmittingPassword}
              >
                {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmittingPassword}>
              {isSubmittingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ProfilePage;
