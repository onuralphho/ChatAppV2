export const Fetcher = async (
  body: Record<string, unknown>,
  method: string,
  url: string
): Promise<Response> => {
  return await fetch(`${process.env.REACT_APP_ENDPOINT_URL}${url}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};
