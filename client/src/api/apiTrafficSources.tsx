import axios from 'axios';

export async function getTrafficSources() {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/trafficsources`
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

export async function createTrafficSourceTokens(data: any) {
  console.log(data)
  try {
    await axios.post(
      'http://localhost:4000/trafficsourcetokens', data);
  } catch (error) {
    console.log('Error in API');
  }
}

export async function getTrafficSourceNames() {
  try {
    const { data } = await axios.get(
      'http://localhost:4000/trafficsources/trafficsourceids'      
    );
    return data;
  } catch (error) {
    console.log('Error in API');
  }
}

export async function createTrafficSource(data: any) {
  try {
    await axios.post('http://localhost:4000/trafficsources', data);
  } catch (error) {
    console.log('Error in API');
  }
}