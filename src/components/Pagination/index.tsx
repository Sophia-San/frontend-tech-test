import { Button, Emphasis, IconButton } from "@lumx/react";
import { mdiChevronLeft, mdiChevronRight } from "@lumx/icons";

import styles from "./Pagination.module.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis";

const MAX_VISIBLE_PAGES = 5;

const getPageList = (page: number, totalPages: number): PageItem[] => {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const uniquePages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sortedPages = [...uniquePages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  return sortedPages.reduce<PageItem[]>((acc, current, index) => {
    if (index > 0 && current - sortedPages[index - 1] > 1) {
      acc.push("ellipsis");
    }
    acc.push(current);
    return acc;
  }, []);
};

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageList = getPageList(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <IconButton
        icon={mdiChevronLeft}
        label="Previous page"
        emphasis={Emphasis.medium}
        isDisabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      />

      {pageList.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className={styles.ellipsis}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            className={styles.pageButton}
            emphasis={item === page ? Emphasis.high : Emphasis.medium}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}

      <IconButton
        icon={mdiChevronRight}
        label="Next page"
        emphasis={Emphasis.medium}
        isDisabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  );
};
