import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "../components/Pagination";

describe("Pagination", () => {
  it("should render a button for each page when there are few pages", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 3")).toBeInTheDocument();
  });

  it("should mark the current page with aria-current", () => {
    render(<Pagination page={2} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByLabelText("Page 2")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByLabelText("Page 1")).not.toHaveAttribute("aria-current");
  });

  it("should disable the previous button on the first page", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  it("should disable the next button on the last page", () => {
    render(<Pagination page={3} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByLabelText("Next page")).toBeDisabled();
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
  });

  it("should call onPageChange with the clicked page number", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText("Page 2"));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should collapse far-away pages behind an ellipsis", () => {
    render(<Pagination page={1} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 10")).toBeInTheDocument();
    expect(screen.queryByLabelText("Page 5")).not.toBeInTheDocument();
  });
});
