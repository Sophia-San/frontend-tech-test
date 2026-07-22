import { useCharacters } from "../../hooks/useCharacters";
import { CharacterCard } from "../CharacterCard";
import { CharacterCardSkeleton } from "../CharacterCardSkeleton";
import { Pagination } from "../Pagination";

import styles from "./Content.module.scss";

interface ContentProps {
  name: string;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Content = ({
  name,
  page,
  pageSize,
  onPageChange,
}: ContentProps) => {
  const result = useCharacters({ name, page, pageSize });

  return (
    <section className={`${styles.content} lumx-spacing-padding-huge`}>
      <div aria-live="polite">
        {result.status === "loading" && (
          <p className="visually-hidden">Loading characters…</p>
        )}
        {result.status === "error" && (
          <p role="alert">Something went wrong while loading characters.</p>
        )}
        {result.status === "success" && result.characters.length === 0 && (
          <p>No character matches your search.</p>
        )}
        {result.status === "success" && result.characters.length > 0 && (
          <p>
            {result.total} {result.total > 1 ? "results" : "result"} found
          </p>
        )}
      </div>

      <ul className={styles.list}>
        {result.status === "loading" &&
          Array.from({ length: pageSize }, (_, index) => (
            <li key={index}>
              <CharacterCardSkeleton />
            </li>
          ))}

        {result.status === "success" &&
          result.characters.map((character) => (
            <li key={character.id}>
              <CharacterCard character={character} />
            </li>
          ))}
      </ul>

      {result.status === "success" && result.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={result.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
};
