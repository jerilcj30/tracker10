'use client';


import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AffiliateNetworkForm } from './form';

export function DialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Affiliate Network</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Affiliate Network</DialogTitle>
          <DialogDescription>
            Create affiliate network by filling up the form.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {/* Write the form code here */}
            <AffiliateNetworkForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
