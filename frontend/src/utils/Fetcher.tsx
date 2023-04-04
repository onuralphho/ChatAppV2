export const Fetcher = async (
  body: Record<string, unknown>,
  method: string, //TODO : Obje gönderilecek (interface'e bağla)
  url: string//TODO:TOken kullanımı için boolean value
) => {
  const response = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}${url}`, {
    method: method,
    credentials: "include",//TODO:Headera jwt yazılacak cookie silinecek
    headers: { "Content-Type": "application/json" },
    body: method === "POST" ? JSON.stringify(body) : null,
  });
  const data = await response.json();

  return data;
};
