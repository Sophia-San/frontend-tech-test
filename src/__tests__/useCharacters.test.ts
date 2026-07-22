import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "../__mocks/server";
import { allCharacters } from "../__mocks/data";
import { useCharacters } from "../hooks/useCharacters";

describe("useCharacters", () => {
  it("should start in a loading state", () => {
    const { result } = renderHook(() =>
      useCharacters({ name: "", page: 1, pageSize: 4 }),
    );

    expect(result.current.status).toBe("loading");
  });

  it("should resolve with the requested page of characters", async () => {
    const { result } = renderHook(() =>
      useCharacters({ name: "", page: 1, pageSize: 4 }),
    );

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(result.current).toEqual({
      status: "success",
      characters: allCharacters.slice(0, 4),
      total: allCharacters.length,
      totalPages: Math.ceil(allCharacters.length / 4),
    });
  });

  it("should filter by name", async () => {
    const { result } = renderHook(() =>
      useCharacters({ name: "han", page: 1, pageSize: 4 }),
    );

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(result.current.status).toBe("success");
    if (result.current.status === "success") {
      expect(result.current.characters).toEqual(
        allCharacters.filter((character) =>
          character.name.toLowerCase().startsWith("han"),
        ),
      );
    }
  });

  it("should go back to loading when params change, then resolve with the new page", async () => {
    const { result, rerender } = renderHook(
      ({ page }) => useCharacters({ name: "", page, pageSize: 4 }),
      {
        initialProps: { page: 1 },
      },
    );

    await waitFor(() => expect(result.current.status).toBe("success"));

    rerender({ page: 2 });
    expect(result.current.status).toBe("loading");

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.status).toBe("success");
    if (result.current.status === "success") {
      expect(result.current.characters).toEqual(allCharacters.slice(4, 8));
    }
  });

  it("should report an error status when the request fails", async () => {
    server.use(
      http.get(
        "/api/characters",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const { result } = renderHook(() =>
      useCharacters({ name: "", page: 1, pageSize: 4 }),
    );

    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
