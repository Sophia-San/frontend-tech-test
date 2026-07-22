import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";

import { server } from "../__mocks/server";
import { allCharacters } from "../__mocks/data";
import { PAGE_SIZE } from "../constants";
import { AppRoutes } from "../components/AppRoutes";

const renderAppRoutes = (initialEntry = "/") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppRoutes />
    </MemoryRouter>,
  );

describe("AppRoutes", () => {
  it("should render the first page of every character by default", async () => {
    renderAppRoutes();

    await waitFor(() =>
      expect(screen.getAllByRole("heading")).toHaveLength(PAGE_SIZE),
    );

    expect(
      screen.getByRole("heading", { name: allCharacters[0].name }),
    ).toBeInTheDocument();
  });

  it("should read the initial search term from the URL", async () => {
    renderAppRoutes("/?name=han");

    expect(screen.getByLabelText("Search")).toHaveValue("han");

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Han Solo" }),
      ).toBeInTheDocument(),
    );
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("should reset to page 1 when a new search is submitted", async () => {
    const user = userEvent.setup();
    renderAppRoutes("/?page=2");

    await waitFor(() =>
      expect(screen.getAllByRole("heading")).toHaveLength(PAGE_SIZE),
    );
    expect(
      screen.getByRole("heading", { name: allCharacters[4].name }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search"), "han{enter}");

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Han Solo" }),
      ).toBeInTheDocument(),
    );
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("should navigate to the next page when pagination is used", async () => {
    const user = userEvent.setup();
    renderAppRoutes();

    await waitFor(() =>
      expect(screen.getByLabelText("Page 2")).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText("Page 2"));

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: allCharacters[PAGE_SIZE].name }),
      ).toBeInTheDocument(),
    );
  });

  it("should keep the current search term when navigating pages", async () => {
    const user = userEvent.setup();

    // Override with a fixed dataset spanning 2 pages: the mock data has no name
    // prefix shared by more than PAGE_SIZE characters, so a real filter wouldn't
    // reliably produce a "Page 2" button to click here.
    const characters = Array.from({ length: PAGE_SIZE + 2 }, (_, index) => ({
      id: index + 1,
      name: `Character ${index + 1}`,
      affiliations: [],
    }));
    server.use(
      http.get("/api/characters", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page")) || 1;
        const limit = Number(url.searchParams.get("limit")) || PAGE_SIZE;
        const start = (page - 1) * limit;

        return HttpResponse.json({
          results: characters.slice(start, start + limit),
          total: characters.length,
          page,
          limit,
          next: start + limit < characters.length ? "next" : null,
          previous: page > 1 ? "previous" : null,
        });
      }),
    );

    renderAppRoutes("/?name=o");

    await waitFor(() =>
      expect(screen.getByLabelText("Page 2")).toBeInTheDocument(),
    );

    await user.click(screen.getByLabelText("Page 2"));

    await waitFor(() =>
      expect(screen.getByLabelText("Search")).toHaveValue("o"),
    );
  });
});
