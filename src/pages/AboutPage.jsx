import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Gift, Zap, Users, Info } from 'lucide-react';

function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 max-w-4xl mx-auto"
    >
      <header className="text-center space-y-4">
        <Info className="h-20 w-20 gradient-text mx-auto" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text">
          About CIPHERTECH PREMIUM offers
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your one-stop destination for discovering exclusive premium offers and learning how to make the most of them, all for free!
        </p>
      </header>

      <section>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              At CIPHERTECH PREMIUM offers, we believe that everyone deserves access to the best tools, services, and entertainment without breaking the bank. Our mission is to curate and share legitimate premium offers, trials, and methods that allow you to experience top-tier products and services for free or at significantly reduced costs.
            </p>
            <p>
              We meticulously research and verify each offer, providing clear, step-by-step instructions on how to avail them. Our goal is to empower you with the knowledge to unlock premium experiences responsibly and ethically.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center gradient-text">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: <Gift className="h-8 w-8 text-primary" />, title: "Curated Free Offers", description: "Handpicked collection of premium trials and free access opportunities for various services and software." },
            { icon: <ShieldCheck className="h-8 w-8 text-green-500" />, title: "Verified Instructions", description: "Detailed, easy-to-follow guides on how to claim each offer, ensuring a smooth experience." },
            { icon: <Zap className="h-8 w-8 text-secondary" />, title: "Exclusive Tips & Tricks", description: "Insider knowledge and methods to maximize the benefits of premium services legally and ethically." },
            { icon: <Users className="h-8 w-8 text-purple-500" />, title: "Community Focused", description: "A platform built for users to discover and share value, fostering a community of smart consumers." },
          ].map(item => (
            <Card key={item.title} className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-primary/10 rounded-full mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground flex-grow">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8 shadow-lg">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-3xl">Join Our Community!</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <p>
              Become a part of CIPHERTECH PREMIUM offers to stay updated on the latest deals, share your experiences, and learn from others. We are committed to transparency and providing genuine value to our users.
            </p>
            <p>
              Please remember to always use offers responsibly and respect the terms and conditions set by the service providers. Happy exploring!
            </p>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}

export default AboutPage;
