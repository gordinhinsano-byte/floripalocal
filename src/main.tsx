import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./theme-red.css";

try {
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");
  createRoot(root).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} catch (e) {
  console.error("CRITICAL RENDER ERROR:", e);
  document.body.innerHTML = `<div style="color:red; padding: 20px;"><h1>Critical Error</h1><pre>${e}</pre></div>`;
}
