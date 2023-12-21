import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,  
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FlowTree from '../TreeCreateFlow/tree';
import { useTreeStore } from '../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { TreeSchema } from '../TreeCreateFlow/tree';
import { createFlow } from '../../api/apiFlows';

export function DialogButton() {
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {savedTree} = useTreeStore();
  
  const { mutate: submitCampaign } = useMutation<
    void, //this refers to the return type of the mutation
    unknown, //expected type error which is unknown
    TreeSchema //this refers to the data passed to the mutation
  >({
    mutationFn: async (data) => createFlow(data),
    onSuccess: () => {
      toast({ description: 'Campaign created successfully' });
      // displayCampaigns react query from table.tsx will be refetched when this mutation function sends a post request
      queryClient.invalidateQueries({ queryKey: ['displayFlows'] });
    },
    onError: () => {
      toast({
        description: 'Something went wrong, please try again',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = ()=>{
    // calling the mutation function above and passing the tree in the zustand store.
    // The tree is constructed and saved in the tree.tsx file 
    console.log(savedTree)
    submitCampaign(savedTree as TreeSchema);
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Flow</Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit min-h-fit">
        <DialogHeader>
          <DialogTitle>Create Flow</DialogTitle>
          <DialogDescription>
            Create a flow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {/* Write the form code here */}
            <FlowTree />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
