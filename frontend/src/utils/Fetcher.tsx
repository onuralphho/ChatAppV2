export const Fetcher = async (
  body: Record<string, unknown>,
  method: string,
  url: string
): Promise<Response> => {
  if (url === "/api/register") {
    console.log("girdi")
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
    return await fetch(`${process.env.REACT_APP_ENDPOINT_URL}${url}`, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  if (url === "/api/logout") {
    return await fetch(`${process.env.REACT_APP_ENDPOINT_URL}${url}`, {
      method: method,
      credentials:"include",
      headers: { "Content-Type": "application/json" },
    });
  }
  return await fetch(`${process.env.REACT_APP_ENDPOINT_URL}${url}`, {});
};
