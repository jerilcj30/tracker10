import axios from 'axios';
import { RawNodeDatum } from 'node_modules/react-d3-tree/lib/types/types/common';

interface TreeSchema {
  name: string;
  attributes?: Record<string, number> | undefined;
  children?: RawNodeDatum[] | undefined;
}


export async function getFlows(startDate: any, endDate: any) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/flows?from=${startDate}&to=${endDate}`
      // {
      //   headers: {
      //     'X-API-Key': '7d9e3c30',
      //   },
      // }
    );

    return data;
  } catch (error) {
    console.log('Error in API');
  }
}

export async function createFlow(data: TreeSchema) {
  try {
    await axios.post('http://localhost:4000/flows', data);
  } catch (error) {
    console.log('Error in API');
  }
}

export async function getLanderNames() {
  try {
    const { data } = await axios.get(
      'http://localhost:4000/landers/landerids'
    );
    return data;
  } catch (error) {
    console.log('Error in API');
  }
}

export async function getOfferNames() {
  try {
    const { data } = await axios.get(
      'http://localhost:4000/offers/offerids'
    );
    return data;
  } catch (error) {
    console.log('Error in API');
  }
}