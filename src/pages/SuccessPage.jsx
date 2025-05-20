import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="bg-background p-10 rounded-xl shadow-2xl max-w-md w-full"
      >
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-foreground mb-3">Success!</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Your action was completed successfully.
        </p>
        <p className="text-sm text-muted-foreground">
          You will be redirected to the homepage shortly.
        </p>
        <div className="w-full bg-muted rounded-full h-2.5 mt-8 overflow-hidden">
          <motion.div
            className="bg-green-500 h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default SuccessPage;
