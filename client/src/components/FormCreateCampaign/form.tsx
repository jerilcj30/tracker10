import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { nanoid } from 'nanoid'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
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
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Country } from 'country-state-city';
import {
  createCampaign,
  getTrafficSourceNames,
  getflowNames,
} from '../../api/apiCampaigns';

const trackingDomains = [
  { value: 1, label: 'https://one.com' },
  { value: 2, label: 'https://two.com' },
  { value: 3, label: 'https://three.com' },
];

const FormSchema = z.object({
  CampaignUUID: z.string({
    required_error: 'Please enter campaign UUID',
  }),
  CampaignName: z.string({
    required_error: 'Please select a campaign name',
  }),
  CampaignTrafficSource: z.number({
    required_error: 'Please select a trafficSource.',
  }),
  CampaignCountry: z.string({
    required_error: 'Please select a country.',
  }),
  CampaignTrackingDomain: z.number({
    required_error: 'Please select a tracking domain',
  }),
  CampaignFlow: z.number({
    required_error: 'Please select a flow',
  }),
  CampaignCPC: z.coerce.number({
    required_error: 'Please enter CPC',
  }),
});

export default function CampaignForm() {
  const countries = Country.getAllCountries();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      CampaignUUID: nanoid(11),
      CampaignName: "",
      CampaignTrafficSource: 0,
      CampaignCountry: "",
      CampaignTrackingDomain: 0,
      CampaignFlow: 0,
      CampaignCPC: 0

    },
  });

  const { mutate: submitCampaign } = useMutation<
    void, //this refers to the return type of the mutation
    unknown, //expected type error which is unknown
    z.infer<typeof FormSchema> //data shape passed to the mutation, which is inferred from FormSchema
  >({
    mutationFn: async (data) => createCampaign(data),    
    onSuccess: () => {
      toast({ description: 'Campaign created successfully' });
      // displayCampaigns react query from table.tsx will be refetched when this mutation function sends a post request
      queryClient.invalidateQueries({ queryKey: ['displayCampaigns'] });
    },
    onError: () => {
      toast({
        description: 'Something went wrong, please try again',
        variant: 'destructive',
      });
    },
  });

  const trafficSourceNames = useQuery({
    queryKey: ['trafficSourceNames'],
    queryFn: getTrafficSourceNames,
  });

  //console.log(trafficSourceNames.data.response[0].Id)
  //console.log(trafficSourceNames.data.response[0].TrafficSourceName)

  const flowNames = useQuery({
    queryKey: ['flowNames'],
    queryFn: getflowNames,
  });

  //console.log(flowNames.data.response[0].Id)
  //console.log(flowNames.data.response[0]FlowNodeId)

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // call the mutation
    submitCampaign(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* campaign name field */}
        <FormField
          control={form.control}
          name="CampaignUUID"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Campaign UUID" {...field} disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="CampaignName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Campaign Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* traffic source field */}
        <FormField
          control={form.control}
          name="CampaignTrafficSource"
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
                        ? trafficSourceNames.data?.find(
                            (trafficSource: any) =>
                              trafficSource.Id === field.value
                          )?.TrafficSourceName
                        : 'Select Traffic Source'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Traffic Source..."
                      className="h-9"
                    />
                    <CommandEmpty>No Traffic Sources found.</CommandEmpty>
                    <CommandGroup>
                      {trafficSourceNames.data?.map(
                        (trafficSource: any) => (
                          <CommandItem
                            value={trafficSource.TrafficSourceName}
                            key={trafficSource.Id}
                            onSelect={() => {
                              form.setValue(
                                'CampaignTrafficSource',
                                trafficSource.Id
                              );
                            }}
                          >
                            {trafficSource.TrafficSourceName}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                trafficSource.Id ===
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

        {/* country field */}

        <FormField
          control={form.control}
          name="CampaignCountry"
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
                        ? countries.find(
                            (country) => country.name === field.value
                          )?.name
                        : 'Select Country'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Country..."
                      className="h-9"
                    />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          value={country.name}
                          key={country.name}
                          onSelect={() => {
                            form.setValue('CampaignCountry', country.name);
                          }}
                        >
                          {country.name}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              country.name === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
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

        {/* tracking domain field */}
        <FormField
          control={form.control}
          name="CampaignTrackingDomain"
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
                        ? trackingDomains.find(
                            (trackingDomain) =>
                              trackingDomain.value === field.value
                          )?.label
                        : 'Select Tracking Domain'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Tracking Domain..."
                      className="h-9"
                    />
                    <CommandEmpty>No Tracking Domain found.</CommandEmpty>
                    <CommandGroup>
                      {trackingDomains.map((trackingDomain) => (
                        <CommandItem
                          value={trackingDomain.label}
                          key={trackingDomain.value}
                          onSelect={() => {
                            form.setValue(
                              'CampaignTrackingDomain',
                              trackingDomain.value
                            );
                          }}
                        >
                          {trackingDomain.label}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              trackingDomain.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
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

        {/* Flow field */}

        <FormField
          control={form.control}
          name="CampaignFlow"
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
                        ? flowNames.data?.find(
                            (flow: any) => flow.Id === field.value
                          )?.FlowNodeId
                        : 'Select Flow'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Flow..."
                      className="h-9"
                    />
                    <CommandEmpty>No Flow found.</CommandEmpty>
                    <CommandGroup>
                      {flowNames.data?.map((flow: any) => (
                        <CommandItem
                          value={flow.FlowNodeId}
                          key={flow.Id}
                          onSelect={() => {
                            form.setValue('CampaignFlow', flow.Id);
                          }}
                        >
                          {flow.FlowNodeId}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              flow.Id === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
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

        <FormField
          control={form.control}
          name="CampaignCPC"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="CPC" {...field} />
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
