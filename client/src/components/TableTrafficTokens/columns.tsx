import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TrafficSourceType = {
  traffic_source_param_name: string
  traffic_source_param_query: string
  traffic_source_param_token: string
}

export const columns: ColumnDef<TrafficSourceType>[] = [
  {
    accessorKey: "traffic_source_param_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue('traffic_source_param_name')}
        </div>
      );
    },
  },
  {
    accessorKey: "traffic_source_param_query",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Query
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue('traffic_source_param_query')}
        </div>
      );
    },
  },
  {
    accessorKey: "traffic_source_param_token",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Token
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue('traffic_source_param_token')}
        </div>
      );
    },
  },
  
]
