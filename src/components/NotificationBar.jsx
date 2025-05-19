
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, XCircle, X, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/contexts/NotificationContext';

const icons = {
  info: <Info className="h-6 w-6 text-blue-500" />,
  warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
  success: <CheckCircle className="h-6 w-6 text-green-500" />,
  error: <XCircle className="h-6 w-6 text-red-500" />,
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 whatsapp-logo-path" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.61 15.35 3.48 16.81L2 22L7.33 20.5C8.75 21.32 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.57 3.67 20.28 7.38 20.28 11.91C20.28 16.44 16.57 20.15 12.04 20.15C10.52 20.15 9.08 19.72 7.85 19L7.54 18.82L4.44 19.6L5.26 16.61L5.06 16.29C4.18 14.93 3.8 13.38 3.8 11.91C3.8 7.38 7.51 3.67 12.04 3.67M9.03 7.44C8.83 7.44 8.66 7.46 8.51 7.76C8.36 8.06 7.84 8.67 7.84 9.8C7.84 10.93 8.53 11.99 8.68 12.16C8.83 12.33 10.12 14.41 12.19 15.26C13.91 16.01 14.29 15.86 14.68 15.81C15.31 15.71 16.03 15.13 16.25 14.48C16.47 13.83 16.47 13.29 16.39 13.19C16.32 13.09 16.15 13.01 15.91 12.89C15.67 12.77 14.57 12.22 14.35 12.13C14.13 12.04 13.98 12 13.83 12.29C13.68 12.59 13.18 13.19 13.06 13.34C12.93 13.49 12.81 13.51 12.57 13.39C12.03 13.12 11.02 12.72 9.92 11.72C9.12 10.99 8.59 10.12 8.44 9.82C8.29 9.52 8.41 9.39 8.53 9.28C8.64 9.17 8.77 9.01 8.89 8.87C9.01 8.73 9.06 8.63 9.19 8.41C9.31 8.18 9.26 8.01 9.19 7.89C9.11 7.77 8.96 7.72 8.76 7.72" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 telegram-logo-path" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 11.9c-.88-.25-.89-.86.2-1.3l15.97-5.85c.73-.27 1.36.17 1.15.93l-2.66 12.57c-.27.97-1.01 1.23-1.73.76l-4.84-3.56l-2.31 2.2a.8.8 0 0 1-.65.3z" />
  </svg>
);


function NotificationBar() {
  const { notification, hideNotification } = useNotification();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100, transition: { duration: 0.3 } }}
          className={`fixed top-0 left-0 right-0 z-50 p-4 bg-card border-b shadow-lg`}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              {icons[notification.type] || <Info className="h-6 w-6" />}
              <p className="ml-3 text-sm font-medium text-foreground">{notification.message}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-100" onClick={() => window.open('https://wa.me', '_blank')}>
                <WhatsAppIcon />
                <span className="ml-1.5 hidden sm:inline">WhatsApp</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100" onClick={() => window.open('https://t.me', '_blank')}>
                <TelegramIcon />
                <span className="ml-1.5 hidden sm:inline">Telegram</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={hideNotification}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close notification</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NotificationBar;
