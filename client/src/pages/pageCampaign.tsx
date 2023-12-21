import * as React from "react";
import { ColumnDef } from "@tanstack/react-table"
import {  MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams } from "react-router-dom";
import { DataTable } from "../components/TableLogs/data-table";
import { useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "../components/ui/date-range-picker";
import { getCampaign } from "../api/apiCampaigns";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getGroupings } from "@/api/apiGroupings";

export type Campaign = {
  Group1: string
  Group2: string
  Group3: string
  Sessions: string
  Impressions: number
  UniqueImpressions: number
  Conversions: number
  TotalCost: number
  Revenue: number
  Profit: number
  ROI: number
  EPC: number
}

export default function Campaign() {

  // accessing zustand store


  const { id } = useParams();

  const [open1, setOpen1] = React.useState(false);
  const [value1, setValue1] = React.useState("");

  const [open2, setOpen2] = React.useState(false);
  const [value2, setValue2] = React.useState("");

  const [open3, setOpen3] = React.useState(false);
  const [value3, setValue3] = React.useState("");

  const [startDate, setStartDate] = React.useState<String>("2023-01-01");
  const [endDate, setEndDate] = React.useState<String>("2023-12-31") || null;

  const { data: groupings, isLoading: groupingsLoading, isError: groupingsError } = useQuery({
    queryKey: ["displayGroupings"],
    queryFn: async () => {
      if (id !== undefined) {
      return await getGroupings(id);
      }
    },
  });


  const { data, isLoading, isError } = useQuery({
    queryKey: ["displayCampaign", startDate, endDate, value1, value2, value3],
    queryFn: async () => {
      try {
        if (id !== undefined) {
          // Use optional chaining directly on groupings
          const group1 = groupings?.[parseInt(value1)]?.Groupings;
          const group2 = groupings?.[parseInt(value2)]?.Groupings;
          const group3 = groupings?.[parseInt(value3)]?.Groupings;          
  
          return await getCampaign(id, startDate, endDate, group1, group2, group3);
        }
      } catch (error) {
        console.error("Error in API", error);
        return { message: [] };
      }
    },
  });

  // code to add dynamic columns. Dynamic columns are added based on the drop down values

  // Dynamically create columns based on selected groupings
  const dynamicColumns = [];  // Initialize dynamic columns as an empty array

  // If none of the dropdown box is selected then load the default session column

  if (!value1 && !value2 && !value3 ) {
    dynamicColumns.push({
      accessorKey: "Sessions",
      header: "Sessions",
    });
  }

  // Check if value1 is selected and the corresponding grouping is defined
  if (value1 && groupings?.[parseInt(value1)]?.Groupings) {
    dynamicColumns.push({
      accessorKey: "Group1",
      header: "Group1",
    });
  }

  // Check if value2 is selected and the corresponding grouping is defined
  if (value2 && groupings?.[parseInt(value2)]?.Groupings) {
    dynamicColumns.push({
      accessorKey: "Group2",
      header: "Group2",
    });
  }

  // Check if value3 is selected and the corresponding grouping is defined
  if (value3 && groupings?.[parseInt(value3)]?.Groupings) {
    dynamicColumns.push({
      accessorKey: "Group3",
      header: "Group3",
    });
  }


  const handleItemClick = async (flowId: string) => {
    window.location.href = `/heatmap/${flowId}`;
  }; 

  // columns is directly defined here. This is done to use react use zustand hook in this component


  const columns: ColumnDef<Campaign>[] = [
    {
      id: 'actions',
      cell: ({row}) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>           
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleItemClick(row.original.Sessions)}>View Heatmap</DropdownMenuItem>
          
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    ...dynamicColumns,  // Spread dynamicColumns array   
    {
      accessorKey: "Impressions",
      header: "Impressions",
    },
    {
      accessorKey: "UniqueImpressions",
      header: "Unique Impressions",
    },
    {
      accessorKey: "Conversions",
      header: "Conversions",
    },
    {
      accessorKey: "TotalCost",
      header: `Total Cost`,
    },
    {
      accessorKey: "Revenue",
      header: "Revenue",
    },
    {
      accessorKey: "Profit",
      header: "Profit",
    },
    {
      accessorKey: "ROI",
      header: "ROI",
    },
    {
      accessorKey: "EPC",
      header: "EPC",
    },
  ]

  return (
    <>
      <div>
        <div className="flex justify-end">
          <div className="flex gap-2 flex-1">
            {/* First grouping combobox */}
            <div>
              <Popover open={open1} onOpenChange={setOpen1}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open1}
                    className="w-[200px] justify-between"
                  >
                    {value1
                      ? groupings.find(
                          (grouping: any) => grouping.ID === value1
                        )?.Groupings
                      : "Select grouping..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search grouping..." />
                    <CommandEmpty>No grouping found.</CommandEmpty>
                    <CommandGroup>
                      {groupings?.map((grouping: any) => (
                        <CommandItem
                          key={grouping.ID}
                          value={grouping.ID}
                          onSelect={(currentValue) => {
                            setValue1(
                              currentValue === value1 ? "" : currentValue
                            );
                            setOpen1(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value1 === grouping.ID
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {grouping.Groupings}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* second grouping combobox */}
            <div>
              <Popover open={open2} onOpenChange={setOpen2}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open2}
                    className="w-[200px] justify-between"
                  >
                    {value2
                      ? groupings.find(
                          (grouping: any) => grouping.ID === value2
                        )?.Groupings
                      : "Select grouping..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search grouping..." />
                    <CommandEmpty>No grouping found.</CommandEmpty>
                    <CommandGroup>
                      {groupings?.map((grouping: any) => (
                        <CommandItem
                          key={grouping.ID}
                          value={grouping.ID}
                          onSelect={(currentValue) => {
                            setValue2(
                              currentValue === value2 ? "" : currentValue
                            );
                            setOpen2(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value2 === grouping.ID
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {grouping.Groupings}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* third grouping box */}
            <div>
              <Popover open={open3} onOpenChange={setOpen3}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open3}
                    className="w-[200px] justify-between"
                  >
                    {value3
                      ? groupings.find(
                          (grouping: any) => grouping.ID === value3
                        )?.Groupings
                      : "Select grouping..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search grouping..." />
                    <CommandEmpty>No grouping found.</CommandEmpty>
                    <CommandGroup>
                      {groupings?.map((grouping: any) => (
                        <CommandItem
                          key={grouping.ID}
                          value={grouping.ID}
                          onSelect={(currentValue) => {
                            setValue3(
                              currentValue === value2 ? "" : currentValue
                            );
                            setOpen3(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value3 === grouping.ID
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {grouping.Groupings}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="ml-3">
            <DateRangePicker
              onUpdate={(values) => {
                const fromTimestamp = values.range.from.toISOString();
                const toTimestamp = values.range.to?.toISOString();
                const fromDate = fromTimestamp.substring(0, 10);
                const toDate = toTimestamp?.substring(0, 10);
                setStartDate(fromDate);
                if (toDate !== undefined) {
                  setEndDate(toDate);
                }
              }}
              initialDateFrom="2023-01-01"
              initialDateTo="2023-12-31"
              align="start"
              locale="en-GB"
              showCompare={false}
            />
          </div>
        </div>

        <div>
          <DataTable columns={columns} data={data || []} />
        </div>
      </div>
    </>
  );
}
