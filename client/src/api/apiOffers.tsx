import axios from 'axios';

export async function getOffers(startDate: any, endDate: any) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/offers?from=${startDate}&to=${endDate}`
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

export async function getaffiliateNetworkNames() {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/affiliatenetworks/affiliatenetworkids`
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

export async function createOffer(data: any) {
  
  
  try {
    await axios.post('http://localhost:4000/offers', data);
  } catch (error) {
    console.log('Error in API');
  }
}

