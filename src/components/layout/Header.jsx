import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

function Header({ toggleSidebar }) {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleNotificationClick = () => {
    showNotification("follow us on our channels for giveaway and constant updates!", "info", null);
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <Button size="icon" variant="outline" className="sm:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-semibold gradient-text">Welcome, {user?.name || 'User'}!</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
        <Bell className="h-5 w-5 text-primary" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
    </header>
  );
}

export default Header;
