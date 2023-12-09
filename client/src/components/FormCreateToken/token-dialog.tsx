import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,  
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TokenForm } from './token-form';

export function TokenDialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Tokens</Button>
      </DialogTrigger>

      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Create Tokens</DialogTitle>
          <DialogDescription>
            Create tokens by filling up the form.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {/* Write the form code here */}
            <TokenForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
