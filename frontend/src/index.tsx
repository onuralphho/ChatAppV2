import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Layout from "./Layout/Layout";
import { HashRouter } from "react-router-dom";
import AlertProvider from "./Context/AlertProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <HashRouter>
    <AlertProvider>
      <Layout>
        <App />
      </Layout>
    </AlertProvider>
  </HashRouter>
);
