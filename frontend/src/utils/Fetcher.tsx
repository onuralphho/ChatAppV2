interface fetchReq {
  body: Record<string, unknown> | null;
  method: string; //TODO : Obje gönderilecek (interface'e bağla) // DONE
  url: string; //TODO:TOken kullanımı için boolean value
  token?: string | null;
}

export const Fetcher = async (fetchReq: fetchReq) => {
  const response = await fetch(
    `${process.env.REACT_APP_ENDPOINT_URL}${fetchReq.url}`,
    {
      method: fetchReq.method,
      credentials: "include", //TODO:Headera jwt yazılacak cookie silinecek
      headers: fetchReq.token
        ? {
            "Content-Type": "application/json",
            Authorization: `Baerer ${fetchReq.token}`,
          }
        : { "Content-Type": "application/json" },
      body: fetchReq.body !== null ? JSON.stringify(fetchReq.body) : null,
    }
  );
  const data = await response.json();

  return data;
};
