import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "../__mocks/server";
import { allCharacters } from "../__mocks/data";
import { Content } from "../components/Content";

describe("Content", () => {
  it("should show a loading message before the characters resolve", () => {
    render(<Content />);

    expect(screen.getByText("Loading characters…")).toBeInTheDocument();
  });

  it("should render every character once loaded", async () => {
    render(<Content />);

    await waitFor(() =>
      expect(screen.getAllByRole("heading")).toHaveLength(allCharacters.length),
    );

    expect(
      screen.getByRole("heading", { name: allCharacters[0].name }),
    ).toBeInTheDocument();
  });

  it("should show an error message when the request fails", async () => {
    server.use(
      http.get(
        "/api/characters",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    render(<Content />);

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });

  it("should show an empty message when there are no characters", async () => {
    server.use(
      http.get("/api/characters", () =>
        HttpResponse.json({
          results: [],
          total: 0,
          page: 1,
          limit: 0,
          next: null,
          previous: null,
        }),
      ),
    );

    render(<Content />);

    await waitFor(() =>
      expect(
        screen.getByText("No character matches your search."),
      ).toBeInTheDocument(),
    );
  });
});
