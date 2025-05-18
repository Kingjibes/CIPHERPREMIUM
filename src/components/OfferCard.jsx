
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink } from 'lucide-react';

function OfferCard({ offer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader className="bg-gradient-to-br from-primary to-secondary p-6">
          <CardTitle className="text-2xl font-bold text-primary-foreground">{offer.title}</CardTitle>
          {offer.siteName && (
            <CardDescription className="text-primary-foreground/80 pt-1">
              From: {offer.siteName}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <h3 className="text-lg font-semibold mb-2 text-foreground">How to use:</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line mb-6">{offer.instructions}</p>
          
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-destructive flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Important Warnings:
            </h4>
            {offer.warnings.map((warning, index) => (
              <div key={index} className="p-3 bg-destructive/10 border-l-4 border-destructive rounded-md">
                <p className="text-xs text-destructive-foreground/90">{warning}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/50">
          {offer.link && (
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href={offer.link} target="_blank" rel="noopener noreferrer">
                Go to Offer <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default OfferCard;
