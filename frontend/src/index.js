import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import "./styles/main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <HelmetProvider>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </HelmetProvider>
);