import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import { AuthProvider } from "./Context/AuthProvider";
import ChatPage from "./Pages/ChatPage";

function App() {
 

console.log("App");
  return (
      <AuthProvider>
        <Routes>
          <Route index path="/" element={<AuthPage />} />
          <Route path="/chats">
            <Route path="" element={<ChatPage />} />
          </Route>
        </Routes>
      </AuthProvider>
  );
}

export default App;
