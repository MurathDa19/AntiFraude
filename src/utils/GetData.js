const SUPABASE_URL = "https://kevinitzeuvtobijvzga.supabase.co"
const SUPABASE_KEY= "sb_publishable_eesjjwwa6NgO3NH8VuXZ0g_JEpALxVa"
  
async function fetchData() {
  const url = `${SUPABASE_URL}/rest/v1/e14_forms`;

  try{
    const response = await fetch(url,{
        method: "GET",
        headers:{
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': "application/json"
        },
    });

    if(!response.ok){
        const errorBody = await response.text();
        throw new Error(
            `Error HTTP ${response.status}: ${response.statusText} - ${errorBody}`
        )
    }

    const data = await response.text()
    return data
  }catch (error){
    throw new Error (`Paila manito ${error.message}`)

  }
}
// module.exports = fetchData
