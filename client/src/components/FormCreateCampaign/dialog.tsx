import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,  
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import CampaignForm from './form';

export function DialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Campaign</Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>
            Create a campaign by filling up the form.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {/* Write the form code here */}
            <CampaignForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
