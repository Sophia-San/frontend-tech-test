import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";

import { server } from "../__mocks/server";
import { allCharacters, allReactions } from "../__mocks/data";
import { getCharacters, getReactions } from "../api";

describe("getCharacters", () => {
  it("should return every character when called without params", async () => {
    const response = await getCharacters();

    expect(response.results).toHaveLength(allCharacters.length);
    expect(response.total).toBe(allCharacters.length);
    expect(response.next).toBeNull();
    expect(response.previous).toBeNull();
  });

  it("should filter characters whose name contains the search term, case-insensitively", async () => {
    const expected = allCharacters.filter((character) =>
      character.name.toLowerCase().includes("han"),
    );

    const response = await getCharacters({ name: "HAN" });

    expect(response.results).toEqual(expected);
    expect(response.total).toBe(expected.length);
  });

  it("should paginate results according to page and limit", async () => {
    const response = await getCharacters({ page: 1, limit: 4 });

    expect(response.results).toEqual(allCharacters.slice(0, 4));
    expect(response.page).toBe(1);
    expect(response.limit).toBe(4);
    expect(response.previous).toBeNull();
    expect(response.next).toContain("page=2");
  });

  it("should expose a previous link once past the first page", async () => {
    const response = await getCharacters({ page: 2, limit: 4 });

    expect(response.results).toEqual(allCharacters.slice(4, 8));
    expect(response.previous).toContain("page=1");
    expect(response.next).toContain("page=3");
  });

  it("should have no next link on the last page", async () => {
    const totalPages = Math.ceil(allCharacters.length / 10);
    const response = await getCharacters({ page: totalPages, limit: 10 });

    expect(response.next).toBeNull();
  });

  it("should throw when the API responds with an error status", async () => {
    server.use(
      http.get(
        "/api/characters",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    await expect(getCharacters()).rejects.toThrow(
      "Request failed with status 500",
    );
  });
});

describe("getReactions", () => {
  it("should return every reaction", async () => {
    const response = await getReactions();

    expect(response.reactions).toEqual(allReactions);
  });

  it("should throw when the API responds with an error status", async () => {
    server.use(
      http.get("/api/reactions", () => new HttpResponse(null, { status: 500 })),
    );

    await expect(getReactions()).rejects.toThrow(
      "Request failed with status 500",
    );
  });
});
