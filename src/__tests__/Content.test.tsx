import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";

import { server } from "../__mocks/server";
import { allCharacters } from "../__mocks/data";
import { Content } from "../components/Content";

const noop = () => {};

describe("Content", () => {
  it("should show a loading message before the characters resolve", () => {
    render(<Content name="" page={1} pageSize={4} onPageChange={noop} />);

    expect(screen.getByText("Loading characters…")).toBeInTheDocument();
  });

  it("should show pageSize skeleton placeholders while loading", () => {
    const { container } = render(
      <Content name="" page={1} pageSize={4} onPageChange={noop} />,
    );

    expect(
      container.querySelectorAll('li > article[aria-hidden="true"]'),
    ).toHaveLength(4);
  });

  it("should render the requested page of characters once loaded", async () => {
    render(<Content name="" page={1} pageSize={4} onPageChange={noop} />);

    await waitFor(() => expect(screen.getAllByRole("heading")).toHaveLength(4));

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

    render(<Content name="" page={1} pageSize={4} onPageChange={noop} />);

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

    render(<Content name="" page={1} pageSize={4} onPageChange={noop} />);

    await waitFor(() =>
      expect(
        screen.getByText("No character matches your search."),
      ).toBeInTheDocument(),
    );
  });

  it("should show how many results were found", async () => {
    render(<Content name="" page={1} pageSize={4} onPageChange={noop} />);

    await waitFor(() =>
      expect(
        screen.getByText(`${allCharacters.length} results found`),
      ).toBeInTheDocument(),
    );
  });

  it("should use the singular form when there is only one result", async () => {
    server.use(
      http.get("/api/characters", () =>
        HttpResponse.json({
          results: [allCharacters[0]],
          total: 1,
          page: 1,
          limit: 4,
          next: null,
          previous: null,
        }),
      ),
    );

    render(<Content name="Han" page={1} pageSize={4} onPageChange={noop} />);

    await waitFor(() =>
      expect(screen.getByText("1 result found")).toBeInTheDocument(),
    );
  });

  it("should show reaction placeholders until reactions resolve, without blocking the character list", async () => {
    server.use(
      http.get("/api/reactions", async () => {
        await delay(50);
        return HttpResponse.json({ reactions: [] });
      }),
    );

    const { container } = render(
      <Content name="" page={1} pageSize={4} onPageChange={noop} />,
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: allCharacters[0].name }),
      ).toBeInTheDocument(),
    );

    expect(
      container.querySelectorAll(".lumx-skeleton-rectangle"),
    ).not.toHaveLength(0);

    await waitFor(() =>
      expect(
        container.querySelectorAll(".lumx-skeleton-rectangle"),
      ).toHaveLength(0),
    );
  });

  it("should show an error message when reactions fail to load, without blocking the character list", async () => {
    server.use(
      http.get(
        "/api/reactions",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    render(<Content name="" page={1} pageSize={4} onPageChange={noop} />);

    await waitFor(() =>
      expect(
        screen.getByText("Something went wrong while loading reactions."),
      ).toBeInTheDocument(),
    );

    expect(
      screen.getByRole("heading", { name: allCharacters[0].name }),
    ).toBeInTheDocument();
  });

  it("should attach the matching reactions to each character", async () => {
    render(<Content name="" page={1} pageSize={4} onPageChange={noop} />);

    const reactionsList = await screen.findByRole("list", {
      name: `${allCharacters[0].name}'s reactions`,
    });

    expect(reactionsList).toHaveTextContent("⭐");
  });

  it("should not show pagination when every character fits on one page", async () => {
    render(
      <Content
        name=""
        page={1}
        pageSize={allCharacters.length}
        onPageChange={noop}
      />,
    );

    await waitFor(() =>
      expect(screen.getAllByRole("heading")).toHaveLength(allCharacters.length),
    );

    expect(screen.queryByLabelText("Pagination")).not.toBeInTheDocument();
  });

  it("should show pagination and call onPageChange when navigating pages", async () => {
    const onPageChange = vi.fn();
    render(
      <Content name="" page={1} pageSize={4} onPageChange={onPageChange} />,
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Page 2")).toBeInTheDocument(),
    );

    screen.getByLabelText("Page 2").click();

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
