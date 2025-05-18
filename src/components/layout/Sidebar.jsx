
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gift, ShoppingCart, UserCircle, LogOut, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Free Services', icon: Gift, path: '/free-services' },
  { name: 'Purchase Plans', icon: ShoppingCart, path: '/purchase-plans' },
  { name: 'Profile', icon: UserCircle, path: '/profile' },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const backdropVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

function Sidebar({ isOpen, toggleSidebar }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isOpen) toggleSidebar();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={toggleSidebar}
            className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          />
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r bg-card sm:static sm:block sm:w-64 sm:translate-x-0"
          >
            <div className="flex h-14 items-center justify-between border-b px-6">
              <Link to="/" className="flex items-center gap-2 font-semibold gradient-text text-lg" onClick={isOpen ? toggleSidebar : undefined}>
                <ShieldAlert className="h-7 w-7" />
                <span>Offers Hub</span>
              </Link>
              <Button variant="ghost" size="icon" className="sm:hidden" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <ul className="grid gap-1 px-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Button
                      asChild
                      variant={location.pathname.startsWith(item.path) ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={isOpen ? toggleSidebar : undefined}
                    >
                      <Link to={item.path}>
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto border-t p-4">
              {user && (
                <div className="mb-4 p-3 bg-accent rounded-lg">
                  <p className="text-sm font-medium text-accent-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              )}
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </motion.aside>
        </>
      )}
      <aside className="hidden sm:flex sm:flex-col sm:w-64 border-r bg-card">
         <div className="flex h-14 items-center border-b px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold gradient-text text-lg">
              <ShieldAlert className="h-7 w-7" />
              <span>Offers Hub</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <ul className="grid gap-1 px-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Button
                    asChild
                    variant={location.pathname.startsWith(item.path) ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Link to={item.path}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto border-t p-4">
            {user && (
              <div className="mb-4 p-3 bg-accent rounded-lg">
                <p className="text-sm font-medium text-accent-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
      </aside>
    </AnimatePresence>
  );
}

export default Sidebar;
