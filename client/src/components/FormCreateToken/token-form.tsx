import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createTrafficSourceTokens,
  getTrafficSourceNames,
} from "../../api/apiTrafficSources";

const FormSchema = z.object({
  TrafficSourceName: z.number({
    required_error: "Please enter traffic source name",
  }),
  Tokens: z.array(
    z.object({
      TrafficSourceTokenName: z.string({
        required_error: "Please enter the query",
      }),
      TrafficSourceTokenParam: z.string({
        required_error: "Please enter the token",
      }),
      TrafficSourceTokenQuery: z.string({
        required_error: "Please enter name",
      }),
    })
  ),
});

export function TokenForm() {
  const { toast } = useToast();

  const { control } = useForm({
    defaultValues: {
      TrafficSourceName: "",
      Tokens: [
        {
          TrafficSourceTokenName: "",
          TrafficSourceTokenParam: "",
          TrafficSourceTokenQuery: "",
        },
      ],
    },
  });

  const {
    fields: tokenFields,
    append: tokenAppend,
    remove: tokenRemove,
  } = useFieldArray({
    control,
    name: "Tokens",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate: submitTrafficSource } = useMutation<
    void, //this refers to the return type of the mutation
    unknown, //expected type error which is unknown
    z.infer<typeof FormSchema> //data shape passed to the mutation, which is inferred from FormSchema
  >({
    mutationFn: async (data) => createTrafficSourceTokens(data),
    onSuccess: () => {
      toast({ description: "Traffic tokens created successfully" });
      // displayCampaigns react query from table.tsx will be refetched when this mutation function sends a post request
      // queryClient.invalidateQueries({ queryKey: ['displayCampaigns'] });
    },
    onError: () => {
      toast({
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    },
  });

  const trafficSourceNames = useQuery({
    queryKey: ["trafficSourceNames"],
    queryFn: getTrafficSourceNames,
  });
 

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // call the mutation
    submitTrafficSource(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-5">
          <div className="section_1">
            {/* traffic source field */}
            <FormField
              control={form.control}
              name="TrafficSourceName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? trafficSourceNames.data?.find(
                                (trafficSource: any) =>
                                  trafficSource.Id === field.value
                              )?.TrafficSourceName
                            : "Select Traffic Source"}
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
                                    "TrafficSourceName",
                                    trafficSource.Id
                                  );
                                }}
                              >
                                {trafficSource.TrafficSourceName}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    trafficSource.Id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
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
          </div>

          <div className="section_2">
            {tokenFields.map((field, index) => (
              <div className="box flex gap-5 mb-3" key={field.id}>
                <FormField
                  control={form.control}
                  name={`Tokens.${index}.TrafficSourceTokenName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-40"
                          placeholder="name e.g. Zone ID"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`Tokens.${index}.TrafficSourceTokenParam`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-40"
                          placeholder="param e.g. zone_id"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`Tokens.${index}.TrafficSourceTokenQuery`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-40"
                          placeholder="query e.g. {zone_id}"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="btn-box">
                  {tokenFields.length !== 1 && (
                    <Button className="mr-1" onClick={() => tokenRemove(index)}>
                      Remove
                    </Button>
                  )}
                </div>
                {tokenFields.length - 1 === index && (
                  <Button
                    className=""
                    onClick={() =>
                      tokenAppend({
                        TrafficSourceTokenName: "",
                        TrafficSourceTokenParam: "",
                        TrafficSourceTokenQuery: "",
                      })
                    }
                  >
                    Add
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
