import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
