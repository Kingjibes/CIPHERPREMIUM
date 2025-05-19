import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 
import { Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";

const defaultFormState = {
  title: '',
  siteName: '',
  instructions: '',
  warning1: '',
  warning2: '',
  warning3: '',
  link: ''
};

function OfferFormDialog({ isOpen, onClose, onSubmit, initialData }) {
  const [formState, setFormState] = useState(defaultFormState);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormState({
        title: initialData.title || '',
        siteName: initialData.siteName || '',
        instructions: initialData.instructions || '',
        warning1: initialData.warnings?.[0] || '',
        warning2: initialData.warnings?.[1] || '',
        warning3: initialData.warnings?.[2] || '',
        link: initialData.link || ''
      });
    } else {
      setFormState(defaultFormState);
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.title || !formState.instructions || !formState.warning1 || !formState.warning2 || !formState.warning3) {
      toast({ title: "Error", description: "Title, Instructions, and all three Warnings are required.", variant: "destructive" });
      return;
    }

    const offerDataPayload = {
      title: formState.title,
      siteName: formState.siteName,
      instructions: formState.instructions,
      warnings: [formState.warning1, formState.warning2, formState.warning3],
      link: formState.link
    };
    onSubmit(offerDataPayload);
    handleClose(); 
  };

  const handleClose = () => {
    setFormState(defaultFormState);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) handleClose(); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modify the details of the existing offer.' : 'Fill in the details for the new premium offer.'}
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
              <Button type="button" variant="outline" onClick={handleClose}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> {initialData ? 'Save Changes' : 'Add Offer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default OfferFormDialog;
