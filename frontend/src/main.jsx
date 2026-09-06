import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="421735411772-94j12bq7u1dm65b6btrc0e3idrvpv06u.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </StrictMode>
);