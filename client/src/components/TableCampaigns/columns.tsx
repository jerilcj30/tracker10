import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getcampaignURL } from "../../api/apiCampaigns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Headers = {
  CampaignUUID: string;
  CampaignName: string;
  CampaignFlowID: string;
  CampaignTrafficSource: string;
  CampaignCountry: string;
  CampaignCPC: number;
  CampaignConversions: string  
  CampaignImpressions: number;
  CampaignUniqueImpressions: number;
  CampaignTotalCost: number;
  CampaignRevenue: number;
  CampaignProfit: number;
  CampaignROI: number;
  CampaignEPC: number;
  CampaignDaysLapsed: number;
  CampaignHoursLapsed: number;
};

const handleItemClick = async (campaignId: string) => {
  window.location.href = `/campaign/${campaignId}`;
};

export const columns: ColumnDef<Headers>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const campaign = row.original;      
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
            <DropdownMenuItem
              onClick={async () => {
                const campaignURL = await getcampaignURL(
                  campaign.CampaignUUID
                );
                console.log(campaignURL)
                navigator.clipboard.writeText(campaignURL);
                console.log("copied");
              }}
            >
              Copy Campaign URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleItemClick(row.original.CampaignUUID)}>
              View Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Clone Campaign</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "CampaignUUID",
    header: "Campaign ID",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignUUID")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Campaign Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignName")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignFlowID",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Campaign Flow
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignFlowID")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignTrafficSource",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Traffic Source
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignTrafficSource")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignCountry",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignCountry")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignCPC",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CPC
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignCPC")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignConversions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Conversions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignConversions")}
        </div>
      );
    },
  },
 
  {
    accessorKey: "CampaignImpressions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Impressions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("CampaignImpressions")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignUniqueImpressions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Impressions (Unique)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium rounded-md p-1">
          {row.getValue("CampaignUniqueImpressions")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignTotalCost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalCost = parseFloat(row.getValue("CampaignTotalCost"));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalCost);
      return (
        <div className="text-center font-medium rounded-md p-1">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignRevenue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const revenue = parseFloat(row.getValue("CampaignRevenue"));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(revenue);
      return (
        <div className="text-center font-medium rounded-md p-1">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignProfit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium rounded-md p-1">
          ${row.getValue("CampaignProfit")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignROI",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ROI
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium  rounded-md p-1">
          {row.getValue("CampaignROI")}%
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignEPC",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          EPC
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const epc = parseFloat(row.getValue("CampaignEPC"));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(epc);
      return (
        <div className="text-center font-medium  rounded-md p-1">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignDaysLapsed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Days Lapsed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium  rounded-md p-1">
          {row.getValue("CampaignDaysLapsed")}
        </div>
      );
    },
  },
  {
    accessorKey: "CampaignHoursLapsed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hours Lapsed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium  rounded-md p-1">
          {row.getValue("CampaignHoursLapsed")}
        </div>
      );
    },
  },
];
