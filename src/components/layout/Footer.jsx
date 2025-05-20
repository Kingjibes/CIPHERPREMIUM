import React from 'react';
import { ShieldAlert } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <ShieldAlert className="h-8 w-8 gradient-text mr-2" />
          <span className="text-xl font-semibold gradient-text">CIPHERTECH PREMIUM offers</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your trusted source for exclusive premium offers.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          &copy; {currentYear} CIPHERTECH. All rights reserved.
        </p>
        <div className="mt-4 text-xs text-muted-foreground/70">
          <p>Please use all offers responsibly and adhere to the terms and conditions of the respective service providers.</p>
          <p>This website provides information and guides; it is not directly affiliated with the services mentioned unless explicitly stated.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
