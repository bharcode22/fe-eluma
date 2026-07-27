import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CurrencyProvider } from "./context/CurrencyContext";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./context/LanguageContext";

class ProviderErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Provider Error Caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || this.props.children;
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <CurrencyProvider>
                <ProviderErrorBoundary>
                    <LanguageProvider>
                        <ScrollToTop />
                        <App />
                    </LanguageProvider>
                </ProviderErrorBoundary>
            </CurrencyProvider>
        </AuthProvider>
    </BrowserRouter>
);
