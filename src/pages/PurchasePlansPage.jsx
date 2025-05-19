import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Zap } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";


const plans = [
  {
    name: "Basic Plan",
    price: "$9.99",
    frequency: "/month",
    features: [
      "Access to 10 premium offers",
      "Standard support",
      "Weekly updates",
    ],
    icon: <Star className="h-8 w-8 text-primary" />,
    cta: "Choose Basic",
    popular: false,
    link: "https://wa.link/t8wg2v"
  },
  {
    name: "Pro Plan",
    price: "$19.99",
    frequency: "/month",
    features: [
      "Access to all premium offers",
      "Priority support",
      "Daily updates",
      "Exclusive content",
    ],
    icon: <Zap className="h-8 w-8 text-secondary" />,
    cta: "Choose Pro",
    popular: true,
    link: "https://wa.link/t8wg2v"
  },
  {
    name: "Enterprise Plan",
    price: "$49.99",
    frequency: "/month",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Custom integrations",
      "Team access",
    ],
    icon: <CheckCircle className="h-8 w-8 text-green-500" />,
    cta: "Contact Us",
    popular: false,
    link: "https://wa.link/t8wg2v"
  },
];

function PurchasePlansPage() {
  const { toast } = useToast();

  const handleChoosePlan = (planName, planLink) => {
    window.open(planLink, '_blank', 'noopener,noreferrer');
    toast({
      title: "Redirecting to WhatsApp!",
      description: `You've selected the ${planName}. You will be redirected to WhatsApp to discuss this plan.`,
      className: "bg-blue-500 text-white"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight gradient-text mb-4">Our Pricing Plans</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan that fits your needs and unlock more premium features.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col bg-card p-8 rounded-2xl shadow-xl border ${plan.popular ? 'border-primary ring-2 ring-primary' : ''} hover:shadow-2xl transition-shadow`}
          >
            {plan.popular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 text-sm font-semibold text-primary-foreground bg-primary rounded-full shadow-md">
                  Most Popular
                </span>
              </div>
            )}
            <div className="flex-shrink-0 mb-6 text-center">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                {plan.icon}
              </div>
              <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
              <p className="text-4xl font-extrabold gradient-text mt-2">
                {plan.price}
                <span className="text-lg font-medium text-muted-foreground">{plan.frequency}</span>
              </p>
            </div>

            <ul className="flex-grow space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              size="lg" 
              className={`w-full text-lg py-3 ${plan.popular ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              onClick={() => handleChoosePlan(plan.name, plan.link)}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PurchasePlansPage;
