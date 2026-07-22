import { useCharacters } from "../../hooks/useCharacters";
import { CharacterCard } from "../CharacterCard";

import styles from "./Content.module.scss";

export const Content = () => {
  const result = useCharacters();

  return (
    <section className={`${styles.content} lumx-spacing-padding-huge`}>
      <div aria-live="polite">
        {result.status === "loading" && <p>Loading characters…</p>}
        {result.status === "error" && (
          <p role="alert">Something went wrong while loading characters.</p>
        )}
        {result.status === "success" && result.characters.length === 0 && (
          <p>No character matches your search.</p>
        )}
      </div>

      <ul className={styles.list}>
        {result.status === "success" &&
          result.characters.map((character) => (
            <li key={character.id}>
              <CharacterCard character={character} />
            </li>
          ))}
      </ul>
    </section>
  );
};
