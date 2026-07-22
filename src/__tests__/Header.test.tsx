import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Header } from "../components/Header";

describe("Header", () => {
  it("should display the initial search value", () => {
    render(<Header initialSearch="Han" onSearch={() => {}} />);

    expect(screen.getByLabelText("Search")).toHaveValue("Han");
  });

  it("should not call onSearch while typing", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Header initialSearch="" onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search"), "Han");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should call onSearch with the trimmed value when Enter is pressed", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Header initialSearch="" onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search"), "  Han{enter}");

    expect(onSearch).toHaveBeenCalledWith("Han");
  });

  it("should not call onSearch when Enter is pressed without changing the value", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Header initialSearch="Han" onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search"), "{enter}");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should not call onSearch when Enter only adds surrounding whitespace", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Header initialSearch="Han" onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search"), "  {enter}");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should clear the value and call onSearch when the clear button is clicked", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Header initialSearch="Han" onSearch={onSearch} />);

    await user.click(screen.getByLabelText("Clear search"));

    expect(screen.getByLabelText("Search")).toHaveValue("");
    expect(onSearch).toHaveBeenCalledWith("");
  });

  it("should not call onSearch when clicking clear on an already empty search", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Header initialSearch="" onSearch={onSearch} />);

    await user.click(screen.getByLabelText("Clear search"));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should update the displayed value when initialSearch changes externally", () => {
    const { rerender } = render(
      <Header initialSearch="Han" onSearch={() => {}} />,
    );

    rerender(<Header initialSearch="Leia" onSearch={() => {}} />);

    expect(screen.getByLabelText("Search")).toHaveValue("Leia");
  });
});
