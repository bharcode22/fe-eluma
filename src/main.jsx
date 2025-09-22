import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CurrencyProvider } from "./context/CurrencyContext";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <CurrencyProvider>
                <LanguageProvider>
                    <ScrollToTop />
                    <App />
                </LanguageProvider>
            </CurrencyProvider>
        </AuthProvider>
    </BrowserRouter>
);
