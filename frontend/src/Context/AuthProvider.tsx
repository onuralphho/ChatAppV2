import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Fetcher } from "../utils/Fetcher";


interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  setUser:any;
  user?: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const response = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/user`,{
  //       headers:{'Content-Type':'application/json'},
  //       credentials:'include'
  //     })
  //     const storedUser = await response.json();
      
  //     if (storedUser) {
  //       setUser(storedUser);
  //     }
  //   }
  //   getUser();
  // }, []);

  const login  = async (email:string, password:string) => {
    
     await Fetcher({email,password},'POST','/api/login');
    

  }

  const logout = async () => {
    await Fetcher({},'POST','/api/logout');
  }

  return (
    <AuthContext.Provider value={{ user,setUser,login,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };