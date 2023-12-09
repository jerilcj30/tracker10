import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  flow_node_id: string
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

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "flow_node_id",
    header: "Flow ID",
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
