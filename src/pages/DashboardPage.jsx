import React, { useState, useEffect } from 'react';
import OfferCard from '@/components/OfferCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

const OFFERS_STORAGE_KEY = 'premiumOffersData';

const initialOffers = [
  {
    id: 1,
    title: "Premium Streaming Trial",
    siteName: "StreamFlix",
    instructions: "1. Sign up using the special link.\n2. Use promo code 'FREEPREMIUM'.\n3. Enjoy 30 days free.",
    warnings: [
      "Warning 1: This is a placeholder warning. You can edit this.",
      "Warning 2: Another placeholder warning for you to customize.",
      "Warning 3: Final placeholder warning. Make it impactful!"
    ],
    link: "https://example.com/streamflix"
  },
  {
    id: 2,
    title: "Pro Design Software Access",
    siteName: "DesignPro",
    instructions: "1. Download the software from the official site.\n2. During installation, select 'Trial Version'.\n3. Use the provided key: 'PRO-TRIAL-XYZ'.",
    warnings: [
      "Caution: Ensure your system meets the minimum requirements.",
      "Notice: Trial features may be limited compared to the full version.",
      "Alert: Offer valid for new users only."
    ],
    link: "https://example.com/designpro"
  }
];


function DashboardPage() {
  const [offers, setOffers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null); 
  const [formState, setFormState] = useState({
    title: '',
    siteName: '',
    instructions: '',
    warning1: '',
    warning2: '',
    warning3: '',
    link: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedOffers = localStorage.getItem(OFFERS_STORAGE_KEY);
    if (storedOffers) {
      try {
        const parsedOffers = JSON.parse(storedOffers);
        if (Array.isArray(parsedOffers) && parsedOffers.length > 0) {
          setOffers(parsedOffers);
        } else {
          setOffers(initialOffers); 
          localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(initialOffers));
        }
      } catch (error) {
        console.error("Failed to parse offers from localStorage:", error);
        setOffers(initialOffers);
      }
    } else {
      setOffers(initialOffers);
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(initialOffers));
    }
  }, []);

  useEffect(() => {
    if (offers.length > 0) { 
        localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
    }
  }, [offers]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState({ title: '', siteName: '', instructions: '', warning1: '', warning2: '', warning3: '', link: '' });
    setCurrentOffer(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.isAdmin) {
      toast({ title: "Error", description: "You are not authorized to perform this action.", variant: "destructive" });
      return;
    }
    if (!formState.title || !formState.instructions || !formState.warning1 || !formState.warning2 || !formState.warning3) {
      toast({ title: "Error", description: "Title, Instructions, and all three Warnings are required.", variant: "destructive" });
      return;
    }

    const newOfferData = {
      title: formState.title,
      siteName: formState.siteName,
      instructions: formState.instructions,
      warnings: [formState.warning1, formState.warning2, formState.warning3],
      link: formState.link
    };

    if (currentOffer) {
      setOffers(offers.map(offer => offer.id === currentOffer.id ? { ...offer, ...newOfferData } : offer));
      toast({ title: "Success", description: "Offer updated successfully!", className: "bg-green-500 text-white" });
    } else {
      setOffers([{ id: Date.now(), ...newOfferData }, ...offers]);
      toast({ title: "Success", description: "New offer added successfully!", className: "bg-green-500 text-white" });
    }
    resetForm();
  };

  const handleEdit = (offer) => {
    if (!user?.isAdmin) return;
    setCurrentOffer(offer);
    setFormState({
      title: offer.title,
      siteName: offer.siteName || '',
      instructions: offer.instructions,
      warning1: offer.warnings[0] || '',
      warning2: offer.warnings[1] || '',
      warning3: offer.warnings[2] || '',
      link: offer.link || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (!user?.isAdmin) {
      toast({ title: "Error", description: "You are not authorized to perform this action.", variant: "destructive" });
      return;
    }
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter(offer => offer.id !== id));
      toast({ title: "Deleted", description: "Offer removed.", variant: "destructive" });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Premium Offers Dashboard</h1>
        {user?.isAdmin && (
          <Dialog open={isFormOpen} onOpenChange={(open) => { if(!open) resetForm(); else setIsFormOpen(true); }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setCurrentOffer(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
                <DialogDescription>
                  {currentOffer ? 'Modify the details of the existing offer.' : 'Fill in the details for the new premium offer.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                  <Label htmlFor="title">Offer Title</Label>
                  <Input id="title" name="title" value={formState.title} onChange={handleInputChange} placeholder="E.g., Free Software License" />
                </div>
                <div>
                  <Label htmlFor="siteName">Site Name (Optional)</Label>
                  <Input id="siteName" name="siteName" value={formState.siteName} onChange={handleInputChange} placeholder="E.g., AwesomeSoft" />
                </div>
                <div>
                  <Label htmlFor="instructions">How to Use</Label>
                  <Textarea id="instructions" name="instructions" value={formState.instructions} onChange={handleInputChange} placeholder="Step 1: ...&#10;Step 2: ..." rows={4}/>
                </div>
                <div>
                  <Label htmlFor="warning1">Warning Message 1</Label>
                  <Input id="warning1" name="warning1" value={formState.warning1} onChange={handleInputChange} placeholder="Important: First warning" />
                </div>
                <div>
                  <Label htmlFor="warning2">Warning Message 2</Label>
                  <Input id="warning2" name="warning2" value={formState.warning2} onChange={handleInputChange} placeholder="Caution: Second warning" />
                </div>
                <div>
                  <Label htmlFor="warning3">Warning Message 3</Label>
                  <Input id="warning3" name="warning3" value={formState.warning3} onChange={handleInputChange} placeholder="Alert: Third warning" />
                </div>
                <div>
                  <Label htmlFor="link">Offer Link (Optional)</Label>
                  <Input id="link" name="link" type="url" value={formState.link} onChange={handleInputChange} placeholder="https://example.com/offer" />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> {currentOffer ? 'Save Changes' : 'Add Offer'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground">No offers yet!</h2>
          {user?.isAdmin && <p className="text-muted-foreground mt-2">Click "Add New Offer" to get started.</p>}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map(offer => (
            <div key={offer.id} className="relative group">
              <OfferCard offer={offer} />
              {user?.isAdmin && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="outline" className="bg-background hover:bg-accent" onClick={() => handleEdit(offer)}>
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