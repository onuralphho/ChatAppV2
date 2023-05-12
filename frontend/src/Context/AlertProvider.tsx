import { createContext, useState, useContext } from "react";
import { AlertContextType, IAlert } from "../@types/alertType";
import { sleep } from "../utils/sleep";
import { useTranslation } from "react-i18next";

const AlertContext = createContext<AlertContextType | null>(null);

const AlertProvider = (props: any) => {
  const [alert, setAlert] = useState<IAlert>({
    shown: false,
    type: "Message Delivered",
  });
  const { t } = useTranslation();

  const alertStarter = async (message: string) => {
    setAlert({ shown: true, type: t(message) });
    await sleep(2000);
    setAlert({ shown: false, type: t(message) });
  };

  return (
    <AlertContext.Provider value={{ alert, alertStarter }}>
      {props.children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);

export default AlertProvider;
