import React, { ReactNode, createContext, useContext, useState } from "react";
import { Fetcher } from "../utils/Fetcher";
import { IFriendList } from "../@types/friendBoxType";
import { IMessage } from "../@types/messageType";
import { ITalkingTo } from "../@types/talkingTo";

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
  login: (email: string, password: string) => Promise<Response>;
  logout: () => void;

  getCookie: (name: string) => string | undefined;
  friendList?: IFriendList[];
  setFriendList: React.Dispatch<
    React.SetStateAction<IFriendList[] | undefined>
  >;
  messages?: IMessage[] | undefined;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | undefined>>;
  talkingTo?: ITalkingTo;
  setTalkingTo: React.Dispatch<React.SetStateAction<ITalkingTo | undefined>>;
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

  const login = async (email: string, password: string) => {

    const res = await Fetcher({
      body: { email, password },
      method: "POST",
      url: "/api/authentication/login",
    });

    const data = await res.json();

    // if (data.status !== 401) {
    //   const d = new Date();
    //   d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

    //   const expires = "expires=" + d.toUTCString();
    //   document.cookie = "jwt=" + data.tokenValue + ";" + expires + ";path=/";
    // }
    return data;
  };

  const logout = async () => {
    setUser(undefined);
    var token = getCookie("jwt");
    document.cookie = "jwt=;" + 0 + ";path=/";
    const res = await Fetcher({
      method: "GET",
      url: "/api/authentication/logout",
      token: token,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        getCookie,
        setFriendList,
        friendList,
        messages,
        setMessages,
        talkingTo,
        setTalkingTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
