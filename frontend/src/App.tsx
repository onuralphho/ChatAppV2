import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import { AuthProvider } from "./Context/AuthProvider";
import ConnectionProvider from "./Context/ConnectionProvider";
import ChatPage from "./Pages/ChatPage";

function App() {
  
  return (
    <AuthProvider>
      <Routes>
        <Route index path="/" element={<AuthPage />} />



          
          <Route path="/chats">
            <Route path="" element={<ConnectionProvider><ChatPage /></ConnectionProvider>} />
          </Route>
        
      </Routes>
    </AuthProvider>
  );
}

export default App;
