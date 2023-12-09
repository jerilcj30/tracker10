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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  hit_session_id: string
  total_landers: number
  total_offers: number
  total_impressions: number
  unique_impressions: number
  conversions: number
  total_cost: number
  revenue: number
  profit: number
  roi: number
  epc: number
}


const handleItemClick = async (flowId: string) => {
  window.location.href = `/heatmap/${flowId}`;
}; 

export const columns: ColumnDef<Payment>[] = [
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
            <DropdownMenuItem onClick={() => handleItemClick(row.original.flow_node_id)}>View Heatmap</DropdownMenuItem>
        
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "hit_session_id",
    header: "Sessions",
  },
  {
    accessorKey: "total_landers",
    header: "Total Landers",
  },
  {
    accessorKey: "total_offers",
    header: "Total Offers",
  },
  {
    accessorKey: "impressions",
    header: "Impressions",
  },
  {
    accessorKey: "unique_impressions",
    header: "Unique Impressions",
  },
  {
    accessorKey: "conversions",
    header: "Conversions",
  },
  {
    accessorKey: "total_cost",
    header: `Total Cost`,
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
  },
  {
    accessorKey: "profit",
    header: "Profit",
  },
  {
    accessorKey: "roi",
    header: "ROI",
  },
  {
    accessorKey: "epc",
    header: "EPC",
  },
]
