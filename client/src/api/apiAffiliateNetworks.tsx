import axios from "axios";

export async function getLanders(startDate: any, endDate: any) {
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
    console.log("Error in API");
  }
}

export async function getAffiliateNetworks(startDate: any, endDate: any) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/affiliatenetworks?from=${startDate}&to=${endDate}`
      // {
      //   headers: {
      //     'X-API-Key': '7d9e3c30',
      //   },
      // }
    );

    return data;
  } catch (error) {
    console.log("Error in API");
  }
}

export async function createAffiliateNetwork(data: any) {
  try {
    await axios.post("http://localhost:4000/affiliatenetworks", data);
  } catch (error) {
    console.log("Error in API");
  }
}
