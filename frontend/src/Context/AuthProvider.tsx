import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Fetcher } from "../utils/Fetcher";
import { IFriendList } from "../@types/friendBoxType";
import { IMessage } from "../@types/messageType";
import { ITalkingTo } from "../@types/talkingTo";
import {
  HubConnection,
  HubConnectionBuilder,
  IHubProtocol,
  LogLevel,
} from "@microsoft/signalr";
interface IUser {
  id: number;
  name: string;
  picture: string;
  email: string;
  updateTime: Date;
}

interface AuthContextValue {
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  user?: IUser | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  getCookie: (name: string) => string | undefined;
  friendList?: IFriendList[];
  setFriendList: React.Dispatch<
    React.SetStateAction<IFriendList[] | undefined>
  >;
  messages?: IMessage[] | undefined;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | undefined>>;
  talkingTo?: ITalkingTo;
  setTalkingTo: React.Dispatch<React.SetStateAction<ITalkingTo | undefined>>;
  connection: HubConnection | undefined;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [messages, setMessages] = useState<IMessage[] | undefined>(undefined);
  const [talkingTo, setTalkingTo] = useState<ITalkingTo | undefined>(undefined);
  const [friendList, setFriendList] = useState<IFriendList[] | undefined>(
    undefined
  );
  const [token, setToken] = useState<string | undefined>();
  const [connection, setConnection] = useState<HubConnection | undefined>(
    undefined
  );

  const login = async (email: string, password: string) => {
    const res = await Fetcher({
      body: { email, password },
      method: "POST",
      url: "/api/authentication/login",
    });
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

    const expires = "expires=" + d.toUTCString();
    document.cookie = "jwt=" + res.tokenValue + ";" + expires + ";path=/";

    return res;
  };

  const logout = async () => {
    setUser(undefined);
    // localStorage.removeItem("session");
    document.cookie = "jwt=;" + 0 + ";path=/";
    const res = await Fetcher({
      body: null,
      method: "POST",
      url: "/api/authentication/logout",
    });
    return res;
  };

  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
  }

  useEffect(() => {
    const connect = async () => {
      console.log("SignalR connect");
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_ENDPOINT_URL}/chatHub`)
        .configureLogging(LogLevel.Information)
        .build();

      await newConnection.start();

     
      setConnection(newConnection);
    };

    connect();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        token,
        setToken,
        getCookie,
        setFriendList,
        friendList,
        messages,
        setMessages,
        talkingTo,
        setTalkingTo,
        connection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
