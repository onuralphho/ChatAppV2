import { IMessage } from "../@types/messageType";

interface fetchReq {
  body?: Record<string, unknown> | string | number | null | IMessage;
  method: string;
  url: string;
  token?: string | null;
}

export const Fetcher = async (fetchReq: fetchReq) => {
  const response = await fetch(
    `${process.env.REACT_APP_ENDPOINT_URL}${fetchReq.url}`,
    {
      method: fetchReq.method,
      headers: fetchReq.token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fetchReq.token}`,
          }
        : { "Content-Type": "application/json" },
      body: fetchReq.body !== null ? JSON.stringify(fetchReq.body) : null,
    }
  );

  if (response.status === 401) {
    window.location.href = "/#"; //! REACT için uygun değil fakat hook kullanımı yapılamıyor component olmayan fonksiyonlarda
  }

  return response;
};
