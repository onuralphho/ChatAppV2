import { createContext, useState, useContext } from "react";
import { AlertContextType,IAlert } from "../@types/alertType";
const AlertContext = createContext<AlertContextType | null>(null);

const AlertProvider = (props: any) => {
  const [alert, setAlert] = useState<IAlert>({ shown:false, type: "Message Delivered" });

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {props.children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);

export default AlertProvider;