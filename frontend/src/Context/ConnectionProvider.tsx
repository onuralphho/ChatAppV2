import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import React, { createContext, useState, useEffect, useContext } from "react";

type ConnectionContextType = {
  connection: HubConnection | undefined;
  disconnectConnection: () => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export const useConnectionContext = () => useContext(ConnectionContext);

const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connection, setConnection] = useState<HubConnection>();

  const disconnectConnection = () => {
    if (connection) {
      connection.stop();
      connection.off("ReceiveMessage");
      setConnection(undefined);
    }
  };

  useEffect(() => {
    const connect = async () => {
      const newConnection = await new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_ENDPOINT_URL}/chatHub`)
        .configureLogging(LogLevel.Information)
        .build();

        await newConnection.start();
        

      setConnection(newConnection);
    };

    connect();

    return () => {
   
      if (connection) {
        connection.off("ReceiveMessage");
        connection.stop();
      }
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ connection, disconnectConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
