import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
// import { toast } from '@/components/ui/use-toast';
import { getLanderNames, getOfferNames } from "../../api/apiFlows";
import { nanoid } from 'nanoid'

interface FormModal {
  onSubmit: (nodeType: string, nodeId: string, nodeName: number, nodeWeight: number) => void;
}

const FormSchema = z.object({
  type: z.enum(["lander", "offer"], {
    required_error: "You need to select a node type.",
  }),
  id: z.string(),
  node: z.number(),
  weight: z.coerce.number(),
});

export const FlowForm: React.FC<FormModal> = ({ onSubmit }) => {
  const [isLanderSelected, setIsLanderSelected] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "lander",
      id: nanoid(11),
      node: 0,
      weight: 50,
    },
  });

  function whenSubmit(data: z.infer<typeof FormSchema>) {
    // pass data back to props in tree.tsx
    onSubmit(data.type, data.id, data.node, data.weight);
  }

  const landerNames = useQuery({
    queryKey: ["landerNames"],
    queryFn: getLanderNames,
  });


  console.log(landerNames.data)

  // @ts-ignore
  const offerNames = useQuery({
    queryKey: ["offerNames"],
    queryFn: getOfferNames,
  });

  const handleRadioChange = (event: string) => {
    if (event === "lander") {
      setIsLanderSelected(true);
      form.setValue("type", "lander");
    } else {
      setIsLanderSelected(false);
      form.setValue("type", "offer");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(whenSubmit)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Type...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={handleRadioChange}
                  defaultValue={field.value}
                  className="flex"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="lander" />
                    </FormControl>
                    <FormLabel className="font-normal">Lander</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="offer" />
                    </FormControl>
                    <FormLabel className="font-normal">Offer</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <FormField 
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node ID</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} disabled />
              </FormControl>             
              <FormMessage />
            </FormItem>
          )}
        />

        {isLanderSelected ? (
          <FormField
            control={form.control}
            name="node"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Lander</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? landerNames.data?.find(
                              (lander: any) =>
                                lander.Id === field.value
                            )?.LanderName
                          : "Select Lander"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search Lander..." />
                      <CommandEmpty>No Landers found.</CommandEmpty>
                      <CommandGroup>
                        {landerNames.data?.map((lander: any) => (
                          <CommandItem
                            value={lander.LanderName}
                            key={lander.Id}
                            onSelect={() => {
                              form.setValue("node", lander.Id);
                            }}
                          >
                            {lander.LanderName}
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                lander.Id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="node"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Offer</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? offerNames.data?.find(
                              (offer: any) => offer.Id === field.value
                            )?.OfferName
                          : "Select Offer"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search Offer..." />
                      <CommandEmpty>No offers found.</CommandEmpty>
                      <CommandGroup>
                        {offerNames.data?.map((offer: any) => (
                          <CommandItem
                            value={offer.OfferName}
                            key={offer.Id}
                            onSelect={() => {
                              form.setValue("node", offer.Id);
                            }}
                          >
                            {offer.OfferName}
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                offer.Id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
