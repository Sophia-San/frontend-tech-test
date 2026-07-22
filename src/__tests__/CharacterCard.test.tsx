import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Character, Reaction } from "../types/character";
import { CharacterCard } from "../components/CharacterCard";

const baseCharacter: Character = {
  id: 1,
  name: "Han Solo",
  species: "Human",
  birthYear: "29 BBY",
  description: "A charismatic and quick-witted smuggler.",
  imageUrl: "/images/han-solo.png",
  affiliations: ["Rebel Alliance", "Resistance"],
};

const reactions: Reaction[] = [
  { id: "1", content: "⭐", characterId: 1, deleted: false },
  { id: "2", content: "🚀", characterId: 1, deleted: false },
];

describe("CharacterCard", () => {
  it("should render the character name, species, birth year and description", () => {
    render(<CharacterCard character={baseCharacter} reactions={[]} />);

    expect(
      screen.getByRole("heading", { name: "Han Solo" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Human")).toBeInTheDocument();
    expect(screen.getByText("29 BBY")).toBeInTheDocument();
    expect(
      screen.getByText("A charismatic and quick-witted smuggler."),
    ).toBeInTheDocument();
  });

  it("should render every affiliation", () => {
    render(<CharacterCard character={baseCharacter} reactions={[]} />);

    expect(screen.getByText("Rebel Alliance")).toBeInTheDocument();
    expect(screen.getByText("Resistance")).toBeInTheDocument();
  });

  it("should render the character image when imageUrl is provided", () => {
    const { container } = render(
      <CharacterCard character={baseCharacter} reactions={[]} />,
    );

    // alt="" makes the image decorative, so it's intentionally excluded from the
    // accessibility tree (no img role) — query the DOM directly instead.
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", "/images/han-solo.png");
  });

  it("should not render an img when imageUrl is missing", () => {
    const { container } = render(
      <CharacterCard
        character={{ ...baseCharacter, imageUrl: undefined }}
        reactions={[]}
      />,
    );

    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("should not crash when optional fields are missing", () => {
    render(
      <CharacterCard
        character={{ id: 2, name: "Count Dooku", affiliations: [] }}
        reactions={[]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Count Dooku" }),
    ).toBeInTheDocument();
  });

  it("should render every reaction", () => {
    render(<CharacterCard character={baseCharacter} reactions={reactions} />);

    const list = screen.getByRole("list", { name: "Han Solo's reactions" });
    expect(list).toBeInTheDocument();
    expect(screen.getByText("⭐")).toBeInTheDocument();
    expect(screen.getByText("🚀")).toBeInTheDocument();
  });

  it("should not render a reactions list when there are none", () => {
    render(<CharacterCard character={baseCharacter} reactions={[]} />);

    expect(
      screen.queryByRole("list", { name: "Han Solo's reactions" }),
    ).not.toBeInTheDocument();
  });

  it("should render reaction placeholders instead of the real reactions while loading", () => {
    const { container } = render(
      <CharacterCard
        character={baseCharacter}
        reactions={reactions}
        reactionsLoading
      />,
    );

    expect(
      screen.queryByRole("list", { name: "Han Solo's reactions" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("⭐")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".lumx-skeleton-rectangle")).toHaveLength(
      2,
    );
  });
});
