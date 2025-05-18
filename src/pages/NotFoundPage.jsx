
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-accent p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AlertTriangle className="h-32 w-32 text-destructive mx-auto mb-8" />
        <h1 className="text-6xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-foreground mb-6">Oops! Page Not Found.</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          The page you're looking for doesn't seem to exist. It might have been moved, deleted, or maybe you just mistyped the URL.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
          <Link to="/">
            Go Back to Homepage
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
