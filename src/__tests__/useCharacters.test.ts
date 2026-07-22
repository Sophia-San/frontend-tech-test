import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "../__mocks/server";
import { allCharacters } from "../__mocks/data";
import { useCharacters } from "../hooks/useCharacters";

describe("useCharacters", () => {
  it("should start in a loading state", () => {
    const { result } = renderHook(() => useCharacters());

    expect(result.current.status).toBe("loading");
  });

  it("should resolve with every character", async () => {
    const { result } = renderHook(() => useCharacters());

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(result.current).toEqual({
      status: "success",
      characters: allCharacters,
    });
  });

  it("should report an error status when the request fails", async () => {
    server.use(
      http.get(
        "/api/characters",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCharacters());

    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
