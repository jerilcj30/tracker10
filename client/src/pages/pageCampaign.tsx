import * as React from "react";
import { columns } from "../components/TableCampaign/columns";
import { DataTable } from "../components/TableLogs/data-table";
import { useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "../components/ui/date-range-picker";
import { getLanders } from "../api/apiLogs";
import { FancyMultiSelect } from "@/components/ui/fancy-multi-select";

export type Framework = Record<"value" | "label", string>;

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
  {
    value: "express.js",
    label: "Express.js",
  },
  {
    value: "nest.js",
    label: "Nest.js",
  }
] satisfies Framework[];

export default function Campaign() {

  const [startDate, setStartDate] = React.useState<String>("2023-01-01");
  const [endDate, setEndDate] = React.useState<String>("2023-12-31") || null;

  const { data, isLoading, isError } = useQuery({
    // react query will qutomatically refetch when the fromDate and toDate changes
    // queryKey: ['displayCampaigns', fromDate, toDate],
    queryKey: ["displayLanders", startDate, endDate],
    queryFn: async () => {
      try{
        return await getLanders(startDate, endDate);
      } catch(error){
        console.error("Error in API", error);
        return { message: [] }; 
      }
      
    },

    // Setting a large stale time to prevent automatic refetch
    // staleTime: 999999999,
  });

  
  return (
    <>
      <div>
        <div className="flex justify-end">
          <div>
            <FancyMultiSelect frameworks={FRAMEWORKS} />
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
          <DataTable columns={columns} data={data?.message || []} />
        </div>
      </div>
    </>
  );
}
