import React from 'react';
// import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FlowForm } from '../FormAddNode/form';

interface TreeDialogModal {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nodeType: string, nodeId: string, nodeName: number, nodeWeight: number) => void;
}

export const TreeDialog: React.FC<TreeDialogModal> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger>
        <Button asChild={false} variant="outline">
          Edit Profile
        </Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FlowForm onSubmit={onSubmit} />
        </div>
        <DialogFooter>          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
