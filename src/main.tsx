import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
