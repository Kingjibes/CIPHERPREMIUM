import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  const cVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgba(99, 102, 241, 0)" 
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgba(99, 102, 241, 1)", 
      transition: {
        pathLength: { delay: 0.5, type: "tween", duration: 2, ease: "easeInOut" },
        fill: { delay: 1.5, type: "tween", duration: 1, ease: "easeIn" },
        opacity: { duration: 0.5 }
      }
    }
  };

  const dotVariants = {
    initial: { y: 0, opacity: 0 },
    animate: (i) => ({
      y: [-5, 5, -5],
      opacity: [0.5, 1, 0.5],
      transition: {
        delay: 2 + i * 0.15,
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 2.5, duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-accent"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 3.5 } }} 
    >
      <motion.svg
        width="150"
        height="150"
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
      >
        <motion.path
          d="M 75 20 A 40 40 0 1 0 75 80"
          stroke="url(#cGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          variants={cVariants}
        />
        <defs>
          <linearGradient id="cGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "hsl(var(--primary))", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor: "hsl(var(--secondary))", stopOpacity:1}} />
          </linearGradient>
        </defs>
      </motion.svg>
      
      <motion.div 
        className="mt-6 text-2xl font-bold tracking-wider gradient-text"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        CIPHERTECH
      </motion.div>
      
      <motion.div className="flex space-x-1.5 mt-3">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-primary rounded-full"
            custom={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
