
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "../components/TableTrafficSources/data-table";

import { columns as tokenColumns } from "../components/TableTrafficTokens/columns";
import { DataTable as TokenDataTable } from "../components/TableTrafficTokens/data-table";

import { useQuery } from "@tanstack/react-query";
import { getTrafficSources } from "../api/apiTrafficSources";
import { getTrafficSourceTokenById } from "../api/apiTrafficSourcesTokens";
import { TokenDialogButton } from "../components/FormCreateToken/token-dialog";
import { TrafficSourceDialogButton } from "../components/FormCreateTrafficSource/traffic-source-dialog";
import { useState } from "react";

export type TrafficSourceType = {
  id: number
  traffic_source_name: string
}

export default function TrafficSources() { 

  // using the zustand store

  const [originalId, setOriginalId] = useState(0)

  // this calls traffic sources
  const { data} = useQuery({
    queryKey: ["displayTrafficSources"],
    queryFn: async () => {
      try{
        return await getTrafficSources();
      } catch(error){
        console.error("Error in API", error);
        return { message: [] };
      }
      
    },
  });

  // this calls the traffic source tokens
  const {
    data: tokenData,
   
  } = useQuery({
    queryKey: ["displayTrafficSourceTokens", originalId],
    queryFn: async () => {
      return await getTrafficSourceTokenById(originalId);
    },
  });


  // columns is directly defined here. This is done to use react use store hook in this component. row.original.id needs to be stored in a react state

  const columns: ColumnDef<TrafficSourceType>[] = [
    {
      id: 'actions',
      cell: () => {
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
              <DropdownMenuItem>Edit Traffic Source</DropdownMenuItem>
          
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => {row.toggleSelected(!!value)          
            // saving the row.original.id to the react state
            setOriginalId(row.original.id)
          }}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue('id')}
          </div>
        );
      },
    },
    {
      accessorKey: "traffic_source_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Traffic Source
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.getValue('traffic_source_name')}
          </div>
        );
      },
    },
    
  ]


  return (
    <>
      <div>
        <div className="flex justify-end">
          <div className="flex gap-3">
            <TokenDialogButton />
            <TrafficSourceDialogButton />
          </div>
        </div>

        <div className="flex gap-5">
          <div className="w-8/12">
            <DataTable columns={columns} data={data?.message || []} />
          </div>
          <div className="w-4/12">
            <TokenDataTable columns={tokenColumns} data={tokenData?.message || []} />
          </div>
        </div>
      </div>
    </>
  );
}
