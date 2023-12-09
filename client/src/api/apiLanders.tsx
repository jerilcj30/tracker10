import axios from 'axios';

export async function getLanders(startDate: any, endDate: any) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/landers?from=${startDate}&to=${endDate}`
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

export async function createLander(data: any) {
  console.log(data)
  try {
    await axios.post('http://localhost:4000/landers', data);
  } catch (error) {
    console.log('Error in API');
  }
}
