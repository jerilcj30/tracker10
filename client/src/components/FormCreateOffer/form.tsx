import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getaffiliateNetworkNames, createOffer } from "../../api/apiOffers";

const FormSchema = z.object({
  OfferName: z.string({
    required_error: 'Please enter name of the offer',
  }),
  OfferURL: z.string({
    required_error: 'Please enter off url',
  }),
  OfferAffiliateNetwork: z.number({
    required_error: 'Please select affiliate network.',
  }),
  OfferPayout: z.coerce.number({
    required_error: 'Please enter offer payout',
  }),  
});

export function OfferForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate: submitOffer } = useMutation<
    void, //this refers to the return type of the mutation
    unknown, //expected type error which is unknown
    z.infer<typeof FormSchema> //data shape passed to the mutation, which is inferred from FormSchema
  >({
    mutationFn: async (data) => createOffer(data),
    onSuccess: () => {
      toast({ description: 'Offer created successfully' });
      // displayCampaigns react query from table.tsx will be refetched when this mutation function sends a post request
      queryClient.invalidateQueries({ queryKey: ['displayOffers'] });
    },
    onError: () => {
      toast({
        description: 'Something went wrong, please try again',
        variant: 'destructive',
      });
    },
  });

  const affiliateNetworkNames = useQuery({
    queryKey: ['affiliateNetworkNames'],
    queryFn: getaffiliateNetworkNames,
  });


  function onSubmit(data: z.infer<typeof FormSchema>) {
    // call the mutation
    submitOffer(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* campaign name field */}
        <FormField
          control={form.control}
          name="OfferName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Offer Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="OfferURL"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Offer URL" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* affiliate network field */}
        <FormField
          control={form.control}
          name="OfferAffiliateNetwork"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? affiliateNetworkNames.data?.find(
                            (affiliateNetwork: any) =>
                              affiliateNetwork.Id ===
                              field.value
                          )?.AffiliateNetworkName
                        : 'Select Affiliate Network'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Affiliate Network..."
                      className="h-9"
                    />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {affiliateNetworkNames.data?.map(
                        (affiliateNetwork: any) => (
                          <CommandItem
                            value={affiliateNetwork.AffiliateNetworkName}
                            key={affiliateNetwork.Id}
                            onSelect={() => {
                              form.setValue(
                                'OfferAffiliateNetwork',
                                affiliateNetwork.Id
                              );
                            }}
                          >
                            {affiliateNetwork.AffiliateNetworkName}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                affiliateNetwork.Id ===
                                  field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        )
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* offer payput field */}
        <FormField
          control={form.control}
          name="OfferPayout"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Offer Payout" {...field} />
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
