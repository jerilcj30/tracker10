import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TrafficSourceForm } from './traffic-source-form';

export function TrafficSourceDialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Traffic Source</Button>
      </DialogTrigger>

      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Create Traffic Source</DialogTitle>
          <DialogDescription>
            Create traffic source by filling up the form.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {/* Write the form code here */}
            <TrafficSourceForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
