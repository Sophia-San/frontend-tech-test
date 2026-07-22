import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// This is the Service Worker instance
export const worker = setupWorker(...handlers);

// Optional: Log worker status
console.log("MSW Worker Initialized");
