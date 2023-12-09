import axios from 'axios';

export async function getTrafficSourceTokenById(originalId: number) {
 
  try {
  

    const { data } = await axios.get(
      `http://localhost:4000/trafficsourcetokens/${originalId}`
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

