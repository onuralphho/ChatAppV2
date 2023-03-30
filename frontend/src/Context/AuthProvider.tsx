import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
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
    // Make a request to the backend to authenticate the user
    const response = await fetch("http://localhost:5159/api/Authentication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data[0]);
    // Save the user to local storage and set the user state
    if (data[0] !== undefined) {
      localStorage.setItem("user", JSON.stringify(data[0]));
      setUser(data[0]);
      navigate('/chats')
    }
    console.log(user)
  };

  const logout = () => {
    // Remove the user from local storage and set the user state to undefined
  
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
