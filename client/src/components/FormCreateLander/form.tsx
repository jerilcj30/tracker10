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
import { createLander } from "../../api/apiLanders";

const FormSchema = z.object({
  LanderName: z.string({
    required_error: 'Please enter name of the lander',
  }),
  LanderURL: z.string({
    required_error: 'Please enter lander url',
  }),
});

export function LanderForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate: submitLander } = useMutation<
    void, //this refers to the return type of the mutation
    unknown, //expected type error which is unknown
    z.infer<typeof FormSchema> //data shape passed to the mutation, which is inferred from FormSchema
  >({
    mutationFn: async (data) => createLander(data),
    onSuccess: () => {
      toast({ description: 'Lander created successfully' });
      // displayCampaigns react query from table.tsx will be refetched when this mutation function sends a post request
      queryClient.invalidateQueries({ queryKey: ['displayLanders'] });
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
    submitLander(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* campaign name field */}
        <FormField
          control={form.control}
          name="LanderName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Lander Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="LanderURL"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Lander URL" {...field} />
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
