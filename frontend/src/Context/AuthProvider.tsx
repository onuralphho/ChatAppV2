import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Fetcher } from "../utils/Fetcher";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  setUser: any;
  user?: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: any;
  setToken: any;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const login = async (email: string, password: string) => {
    const res = await Fetcher(
      {body:{ email, password },
      method:"POST",
      url:"/api/authentication/login"}
    );
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

    const expires = "expires=" + d.toUTCString();
    document.cookie = "jwt=" + res.tokenValue + ";" + expires + ";path=/";
    
    return res;
  };

  const logout = async () => {
    setUser(undefined);
    localStorage.removeItem("session");
    const res = await Fetcher({body:null, method:"POST", url:"/api/authentication/logout"});
    return res;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, token, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
