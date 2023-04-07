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
interface User {
  id: number;
  name: string;
  picture: string;
  email: string;
  updateTime: Date;
}


interface AuthContextValue {
  setUser: any;
  user?: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: any;
  setToken: any;
  getCookie: Function;
  friendList?: IFriendList[];
  setFriendList: Function;
  messages?: IMessage[];
  setMessages: Function;
  talkingTo?:ITalkingTo;
  setTalkingTo:Function;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [messages, setMessages] = useState<IMessage[] | undefined>(undefined);
  const [talkingTo, setTalkingTo] = useState<ITalkingTo | undefined>(undefined);
  const [friendList, setFriendList] = useState<IFriendList[] | undefined>(
    undefined
  );
  const [token, setToken] = useState();

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
        setTalkingTo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
