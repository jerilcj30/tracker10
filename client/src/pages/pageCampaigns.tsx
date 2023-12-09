import * as React from "react";
import { columns } from "../components/TableCampaigns/columns";
import { DataTable } from "../components/TableCampaigns/data-table";
import { useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "../components/ui/date-range-picker";
import { getCampaigns } from "../api/apiCampaigns";
import { DialogButton } from "../components/FormCreateCampaign/dialog";

export default function Campaigns() {
  // @ts-ignore
  const [startDate, setStartDate] = React.useState<String>("2023-01-01");
  // @ts-ignore
  const [endDate, setEndDate] = React.useState<String>("2023-12-31") || null;

  const { data } = useQuery({
    // react query will qutomatically refetch when the fromDate and toDate changes
    queryKey: ["displayCampaigns", startDate, endDate],
    queryFn: async () => {
      try {
        return await getCampaigns(startDate, endDate);
      } catch (error) {
        console.error("Error in API", error);
        return { message: [] };
      }
    },
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
          <DataTable columns={columns} data={data || []} />
        </div>
      </div>
    </>
  );
}
