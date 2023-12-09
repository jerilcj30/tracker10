import * as React from 'react';
import { columns } from '../components/TableAffiliateNetworks/columns';
import { DataTable } from '../components/TableAffiliateNetworks/data-table';
import { useQuery } from '@tanstack/react-query';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { getAffiliateNetworks } from '../api/apiAffiliateNetworks';
import { DialogButton } from '../components/FormCreateAffiliateNetwork/dialog';

export default function AffiliateNetworks() {
  const [startDate, setStartDate] = React.useState<String>();

  const [endDate, setEndDate] = React.useState<String>();

  const { data, isLoading, isError } = useQuery({
    // react query will qutomatically refetch when the fromDate and toDate changes
    queryKey: ['displayAffiliateNetworks', startDate, endDate],
    queryFn: async () => {
      try{
        return await getAffiliateNetworks(startDate, endDate);
      } catch (error) {
        console.error("Error in API", error);
        return { message: [] }; 
      }
      
    },  
  });


  return (
    // have the component fetch datas for the table
    // if loading render a loading message
    // if error render an error message
    //render the table

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
