import { useCharacters } from "../../hooks/useCharacters";
import { useReactions } from "../../hooks/useReactions";
import { Reaction } from "../../types/character";
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

const NO_REACTIONS: Reaction[] = [];

export const Content = ({
  name,
  page,
  pageSize,
  onPageChange,
}: ContentProps) => {
  const charactersResult = useCharacters({ name, page, pageSize });
  const reactionsResult = useReactions();

  const { status: charactersStatus } = charactersResult;
  const isCharactersLoading = charactersStatus === "loading";
  const isCharactersError = charactersStatus === "error";
  const {
    characters = [],
    total = 0,
    totalPages = 0,
  } = charactersStatus === "success" ? charactersResult : {};
  const isReactionsLoading = reactionsResult.status === "loading";
  const isReactionsError = reactionsResult.status === "error";
  const { reactionsByCharacterId = null } =
    reactionsResult.status === "success" ? reactionsResult : {};

  return (
    <section className={`${styles.content} lumx-spacing-padding-huge`}>
      <div aria-live="polite">
        {isCharactersLoading && (
          <p className="visually-hidden">Loading characters…</p>
        )}
        {isCharactersError && (
          <p role="alert">Something went wrong while loading characters.</p>
        )}
        {!isCharactersLoading &&
          !isCharactersError &&
          characters.length === 0 && <p>No character matches your search.</p>}
        {!isCharactersLoading &&
          !isCharactersError &&
          characters.length > 0 && (
            <p>
              {total} {total > 1 ? "results" : "result"} found
            </p>
          )}
        {isReactionsError && (
          <p role="alert">Something went wrong while loading reactions.</p>
        )}
      </div>

      <ul className={styles.list}>
        {isCharactersLoading &&
          Array.from({ length: pageSize }, (_, index) => (
            <li key={index}>
              <CharacterCardSkeleton />
            </li>
          ))}

        {characters.map((character) => (
          <li key={character.id}>
            <CharacterCard
              character={character}
              reactions={
                reactionsByCharacterId?.get(character.id) ?? NO_REACTIONS
              }
              reactionsLoading={isReactionsLoading}
            />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
};
