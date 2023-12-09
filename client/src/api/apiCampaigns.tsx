import axios from 'axios';

// for aff_networks

// for campaigns

export async function getcampaignURL(campaignUUID: string) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/campaigns/generatecampaignurl?campaign_id=${campaignUUID}`      
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

export async function getCampaigns(startDate: any, endDate: any) {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/campaigns?from=${startDate}&to=${endDate}`
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

export async function createCampaign(data: any) {
  try {
    await axios.post('http://localhost:4000/campaigns', data);
    console.log('success')
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

export async function getflowNames() {
  try {
    const { data } = await axios.get(      
      'http://localhost:4000/flows/flowids'
    );
    return data;
  } catch (error) {
    console.log('Error in API');
  }
}