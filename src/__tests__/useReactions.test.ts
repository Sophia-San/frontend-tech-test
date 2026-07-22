import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "../__mocks/server";
import { useReactions } from "../hooks/useReactions";

describe("useReactions", () => {
  it("should start in a loading state", () => {
    const { result } = renderHook(() => useReactions());

    expect(result.current.status).toBe("loading");
  });

  it("should group non-deleted reactions by character id", async () => {
    server.use(
      http.get("/api/reactions", () =>
        HttpResponse.json({
          reactions: [
            { id: "1", content: "⭐", characterId: 1, deleted: false },
            { id: "2", content: "🚀", characterId: 1, deleted: false },
            { id: "3", content: "💙", characterId: 2, deleted: false },
            { id: "4", content: "😈", characterId: 2, deleted: true },
          ],
        }),
      ),
    );

    const { result } = renderHook(() => useReactions());

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(result.current.status).toBe("success");
    if (result.current.status === "success") {
      expect(result.current.reactionsByCharacterId.get(1)).toEqual([
        { id: "1", content: "⭐", characterId: 1, deleted: false },
        { id: "2", content: "🚀", characterId: 1, deleted: false },
      ]);
      expect(result.current.reactionsByCharacterId.get(2)).toEqual([
        { id: "3", content: "💙", characterId: 2, deleted: false },
      ]);
    }
  });

  it("should deduplicate reactions sharing the same id", async () => {
    server.use(
      http.get("/api/reactions", () =>
        HttpResponse.json({
          reactions: [
            { id: "1", content: "⭐", characterId: 1, deleted: false },
            { id: "1", content: "⭐", characterId: 1, deleted: false },
          ],
        }),
      ),
    );

    const { result } = renderHook(() => useReactions());

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(result.current.status).toBe("success");
    if (result.current.status === "success") {
      expect(result.current.reactionsByCharacterId.get(1)).toHaveLength(1);
    }
  });

  it("should report an error status when the request fails", async () => {
    server.use(
      http.get("/api/reactions", () => new HttpResponse(null, { status: 500 })),
    );

    const { result } = renderHook(() => useReactions());

    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
