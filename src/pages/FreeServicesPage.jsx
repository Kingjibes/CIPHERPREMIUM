
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, ShieldCheck } from 'lucide-react';

const services = [
  {
    title: "Basic Cloud Storage",
    description: "Get 5GB of free cloud storage to back up your essential files securely.",
    icon: <Gift className="h-10 w-10 text-primary" />,
  },
  {
    title: "Community Support Forum",
    description: "Access our vibrant community forum to ask questions and share knowledge.",
    icon: <Zap className="h-10 w-10 text-secondary" />,
  },
  {
    title: "Weekly Tips Newsletter",
    description: "Subscribe to our newsletter for free tips and tricks delivered to your inbox.",
    icon: <ShieldCheck className="h-10 w-10 text-green-500" />,
  },
];

function FreeServicesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold tracking-tight gradient-text">Our Free Services</h1>
      <p className="text-lg text-muted-foreground">
        Explore the range of complimentary services we offer to enhance your experience.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-card p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center mb-4 bg-primary/10 rounded-full h-16 w-16 mx-auto">
              {service.icon}
            </div>
            <h2 className="text-xl font-semibold text-center text-foreground mb-2">{service.title}</h2>
            <p className="text-sm text-muted-foreground text-center">{service.description}</p>
          </motion.div>
        ))}
      </div>
       <div className="mt-12 p-6 bg-accent rounded-lg text-center">
        <h3 className="text-xl font-semibold text-accent-foreground mb-2">More to Come!</h3>
        <p className="text-muted-foreground">We are constantly working on adding more value. Stay tuned for new free services!</p>
      </div>
    </motion.div>
  );
}

export default FreeServicesPage;
