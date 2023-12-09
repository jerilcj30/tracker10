import * as React from "react";
import { columns } from "../components/TableLanders/columns";
import { DataTable } from "../components/TableLanders/data-table";
import { useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "../components/ui/date-range-picker";
import { getLanders } from "../api/apiLanders";
import { DialogButton } from "../components/FormCreateLander/dialog";

export default function Landers() {
  
  const [startDate, setStartDate] = React.useState<String>("2023-01-01");
  const [endDate, setEndDate] = React.useState<String>("2023-12-31") || null;

  const { data } = useQuery({
    // react query will qutomatically refetch when the fromDate and toDate changes
    // queryKey: ['displayCampaigns', fromDate, toDate],
    queryKey: ["displayLanders", startDate, endDate],
    queryFn: async () => {
      try{
        return await getLanders(startDate, endDate);
      } catch (error){
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
          <div className="ml-3">
            <DialogButton />
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
