import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Send, Smartphone } from 'lucide-react';

const contactDetails = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    method: "Email",
    value: "your-email@example.com",
    link: "mailto:your-email@example.com",
    cta: "Send Email"
  },
  {
    icon: <Smartphone className="h-6 w-6 text-green-500" />,
    method: "WhatsApp",
    value: "CipherTech Support",
    link: "https://wa.me/YOUR_WHATSAPP_NUMBER",
    cta: "Chat on WhatsApp"
  },
  {
    icon: <Send className="h-6 w-6 text-blue-500" />,
    method: "Telegram",
    value: "@YourTelegramUsername",
    link: "https://t.me/YOUR_TELEGRAM_USERNAME",
    cta: "Message on Telegram"
  }
];

function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 max-w-3xl mx-auto"
    >
      <header className="text-center space-y-4">
        <MessageSquare className="h-20 w-20 gradient-text mx-auto" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text">
          Get In Touch
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          We'd love to hear from you! Whether you have a question, suggestion, or just want to say hi, here's how you can reach us.
        </p>
      </header>

      <section className="grid md:grid-cols-1 gap-6">
        {contactDetails.map((detail, index) => (
          <motion.div
            key={detail.method}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className="flex flex-row items-center space-x-4 p-6 bg-muted/50">
                {detail.icon}
                <CardTitle className="text-2xl text-foreground">{detail.method}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-lg text-muted-foreground">
                  {detail.value}
                </p>
                <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  <a href={detail.link} target="_blank" rel="noopener noreferrer">
                    {detail.cta}
                  </a>
                </Button>
                {detail.method === "Email" && <p className="text-xs text-muted-foreground">Replace "your-email@example.com" with your actual email address.</p>}
                {detail.method === "WhatsApp" && <p className="text-xs text-muted-foreground">Replace "YOUR_WHATSAPP_NUMBER" in the link with your full WhatsApp number including country code (e.g., 1XXXXXXXXXX).</p>}
                {detail.method === "Telegram" && <p className="text-xs text-muted-foreground">Replace "YOUR_TELEGRAM_USERNAME" in the link with your Telegram username.</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

       <section className="text-center p-6 bg-accent/50 rounded-lg">
        <h3 className="text-xl font-semibold text-accent-foreground mb-2">Feedback & Suggestions</h3>
        <p className="text-muted-foreground">
          Your feedback helps us improve! Don't hesitate to reach out with any thoughts or ideas you have for CIPHERTECH PREMIUM offers.
        </p>
      </section>
    </motion.div>
  );
}

export default ContactPage;
