import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../__mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
