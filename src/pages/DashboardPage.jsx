
import React, { useState, useEffect, useCallback } from 'react';
import OfferCard from '@/components/OfferCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import OfferFormDialog from '@/components/dashboard/OfferFormDialog';
import { supabase } from '@/lib/supabaseClient';

function DashboardPage() {
  const [offers, setOffers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const fetchOffers = useCallback(async () => {
    setLoadingOffers(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching offers:", error);
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

  const openFormForNew = () => {
    setCurrentOffer(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (offer) => {
    if (!isAdmin) return;
    setCurrentOffer(offer);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (!isAdmin || !user) {
      toast({ title: "Error", description: "You are not authorized to perform this action.", variant: "destructive" });
      return;
    }

    const offerPayload = {
      ...formData,
      user_id: user.id, 
    };

    setLoadingOffers(true);
    if (currentOffer) {
      const { error } = await supabase
        .from('offers')
        .update(offerPayload)
        .eq('id', currentOffer.id);
      if (error) {
        toast({ title: "Error", description: `Failed to update offer: ${error.message}`, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Offer updated successfully!", className: "bg-green-500 text-white" });
      }
    } else {
      const { error } = await supabase
        .from('offers')
        .insert([offerPayload]);
      if (error) {
        toast({ title: "Error", description: `Failed to add offer: ${error.message}`, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "New offer added successfully!", className: "bg-green-500 text-white" });
      }
    }
    setIsFormOpen(false);
    setCurrentOffer(null);
    fetchOffers(); 
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast({ title: "Error", description: "You are not authorized to perform this action.", variant: "destructive" });
      return;
    }
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setLoadingOffers(true);
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast({ title: "Error", description: `Failed to delete offer: ${error.message}`, variant: "destructive" });
      } else {
        toast({ title: "Deleted", description: "Offer removed.", variant: "destructive" });
      }
      fetchOffers();
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Premium Offers Dashboard</h1>
        {isAdmin && (
          <Button onClick={openFormForNew} disabled={loadingOffers}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Offer
          </Button>
        )}
      </div>

      <OfferFormDialog
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setCurrentOffer(null); }}
        onSubmit={handleFormSubmit}
        initialData={currentOffer}
      />

      {loadingOffers ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground">No offers yet!</h2>
          {isAdmin && <p className="text-muted-foreground mt-2">Click "Add New Offer" to get started.</p>}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map(offer => (
            <div key={offer.id} className="relative group">
              <OfferCard offer={offer} />
              {isAdmin && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="outline" className="bg-background hover:bg-accent" onClick={() => openFormForEdit(offer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(offer.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
