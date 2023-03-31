import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import { AuthProvider } from "./Context/AuthProvider";
import ChatPage from "./Pages/ChatPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useAuth } from "./Context/AuthProvider";

function App() {
  const ctx = useAuth()

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route index path="/" element={<AuthPage />} />

          <Route
            path="/chats"
            element={
              // <ProtectedRoute user={ctx?.user}>
              //   <ChatPage />
              // </ProtectedRoute>
              <ChatPage />
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
