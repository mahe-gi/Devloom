import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/lora";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
