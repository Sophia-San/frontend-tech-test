import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./components/App";
import "./index.scss";

// 1. Define an async function to start the worker
async function enableMocking() {
  // Dynamically import the browser worker setup
  const { worker } = await import("./__mocks/browser");

  // Start the worker and wait for it to be ready
  return worker.start({
    // Optional: Log only the requests handled by MSW
    onUnhandledRequest: "bypass",
  });
}

// 2. Wrap the main render call in a promise chain
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
