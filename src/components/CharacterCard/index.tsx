import { Character, Reaction } from "../../types/character";

import styles from "./CharacterCard.module.scss";

interface CharacterCardProps {
  character: Character;
  reactions: Reaction[];
}

export const CharacterCard = ({ character, reactions }: CharacterCardProps) => {
  const { name, description, species, birthYear, affiliations, imageUrl } =
    character;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img className={styles.image} src={imageUrl} alt="" loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h2 className={styles.name}>{name}</h2>
          {species && <span className={styles.infoTag}>{species}</span>}
          {birthYear && <span className={styles.infoTag}>{birthYear}</span>}
        </div>

        {description && <p className={styles.description}>{description}</p>}

        {affiliations.length > 0 && (
          <ul className={styles.affiliations}>
            {affiliations.map((affiliation) => (
              <li key={affiliation} className={styles.affiliationTag}>
                {affiliation}
              </li>
            ))}
          </ul>
        )}

        {reactions.length > 0 && (
          <ul className={styles.reactions} aria-label={`${name}'s reactions`}>
            {reactions.map((reaction) => (
              <li key={reaction.id} className={styles.reaction}>
                <span aria-hidden="true">{reaction.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};
