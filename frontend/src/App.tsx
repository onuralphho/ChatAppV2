import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import { AuthProvider } from "./Context/AuthProvider";
import ChatPage from "./Pages/ChatPage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/chats");
    }
  }, []);
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route index path="/" element={<AuthPage />} />

          <Route
            path="/chats"
            element={
              <ProtectedRoute user={localStorage.getItem("user")}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
