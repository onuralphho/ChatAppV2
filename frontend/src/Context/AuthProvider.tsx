import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user?: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  login: async (email: string, password: string) => {},
  logout: () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {

    const response = await Fetcher({email,password},'POST','/api/Authentication')
    const data = await response.json();
    console.log(data)
  
    if (!data.message) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate('/chats')
    }
    
  };

  const logout = () => {
   
  
    localStorage.removeItem("user");
    
    setUser(undefined);
    navigate('/')
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
