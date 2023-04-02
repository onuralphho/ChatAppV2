export const Fetcher = async (
  body: Record<string, unknown>,
  method: string,
  url: string
) => {
  if (url === "/api/register") {
   
    const response = await fetch(
      `${process.env.REACT_APP_ENDPOINT_URL}${url}`,
      {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
      
    );
    const data = await response.json();
    return data;
  }

  if (url === "/api/login") {
   const response =  await fetch(`${process.env.REACT_APP_ENDPOINT_URL}${url}`, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json()
    
    return data;
  }

  if (url === "/api/logout") {
   const response = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}${url}`, {
      method: method,
      credentials:"include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
   
    return data;
  }
  
};
