import axios from 'axios';

export async function getGroupings(id: string) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/groupings?id=${id}`
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