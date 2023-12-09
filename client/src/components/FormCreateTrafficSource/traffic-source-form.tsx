import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrafficSource } from '../../api/apiTrafficSources';

const FormSchema = z.object({
  trafficSourceName: z.string({
    required_error: 'Please enter traffic source name',
  }),
});

export function TrafficSourceForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate: submitTrafficSource } = useMutation<
    void, //this refers to the return type of the mutation
    unknown, //expected type error which is unknown
    z.infer<typeof FormSchema> //data shape passed to the mutation, which is inferred from FormSchema
  >({
    mutationFn: async (data) => createTrafficSource(data),
    onSuccess: () => {
      toast({ description: 'Traffic Source created successfully' });
      // displayCampaigns react query from table.tsx will be refetched when this mutation function sends a post request
      queryClient.invalidateQueries({ queryKey: ['displayTrafficSources'] });
    },
    onError: () => {
      toast({
        description: 'Something went wrong, please try again',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // call the mutation
    submitTrafficSource(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="trafficSourceName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="Traffic Source Name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
