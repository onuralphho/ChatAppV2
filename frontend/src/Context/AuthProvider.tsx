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
  
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

 

  const login = async (email: string, password: string) => {
    const res = await Fetcher({ email, password }, "POST", "/api/login");
    console.log(res)
    return res;
  };

  const logout = async () => {
    setUser(undefined);
    localStorage.removeItem("session");
    const res = await Fetcher({}, "POST", "/api/logout");
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
