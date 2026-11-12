import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ResumeProvider>
        <App />
      </ResumeProvider>
    </AuthProvider>
  </StrictMode>,
);
