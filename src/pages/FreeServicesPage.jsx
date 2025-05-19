
import React, { useState, useEffect, useCallback } from 'react';
import OfferCard from '@/components/OfferCard';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

function FreeServicesPage() {
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const { user } = useAuth(); 
  const { toast } = useToast();

  const fetchOffers = useCallback(async () => {
    setLoadingOffers(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching offers for FreeServicesPage:", error);
      toast({ title: "Error", description: "Could not fetch offers.", variant: "destructive" });
      setOffers([]);
    } else {
      setOffers(data || []);
    }
    setLoadingOffers(false);
  }, [toast]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Free Premium Services & Offers</h1>
      </div>

      {user && !user.isAdmin && (
         <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-400 rounded-md">
            <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-300 mr-3" />
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    <strong>Note:</strong> The offers listed here are managed by the site administrator. If you have any questions about an offer, please refer to our contact page.
                </p>
            </div>
        </div>
      )}

      {loadingOffers ? (
         <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground">No free services or offers available at the moment.</h2>
          <p className="text-muted-foreground mt-2">Please check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map(offer => (
            <div key={offer.id} className="relative group">
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FreeServicesPage;
