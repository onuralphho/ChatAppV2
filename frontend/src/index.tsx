import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Layout from "./Layout/Layout";
import { BrowserRouter } from "react-router-dom";
import AlertProvider from "./Context/AlertProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <AlertProvider>
      <Layout>
        <App />
      </Layout>
    </AlertProvider>
  </BrowserRouter>
);
