import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Auto clear jika data lama corrupt
const stored = localStorage.getItem("dhuwitlog-storage");
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    // Cek apakah format data valid
    if (!parsed?.state?.transactions || !parsed?.state?.accounts) {
      localStorage.removeItem("dhuwitlog-storage");
    }
  } catch (e) {
    localStorage.removeItem("dhuwitlog-storage");
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
