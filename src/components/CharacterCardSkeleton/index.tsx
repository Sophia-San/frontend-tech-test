import { SkeletonRectangle, SkeletonTypography, Typography } from "@lumx/react";

import styles from "./CharacterCardSkeleton.module.scss";

export const CharacterCardSkeleton = () => {
  return (
    <article className={styles.card} aria-hidden="true">
      <SkeletonRectangle className={styles.image} variant="rounded" />

      <div className={styles.body}>
        <div className={styles.heading}>
          <SkeletonTypography typography={Typography.title} width="40%" />
          <SkeletonRectangle className={styles.tag} variant="rounded" />
          <SkeletonRectangle className={styles.tag} variant="rounded" />
        </div>

        <SkeletonTypography typography={Typography.body1} width="100%" />
        <SkeletonTypography typography={Typography.body1} width="95%" />
        <SkeletonTypography typography={Typography.body1} width="70%" />

        <div className={styles.affiliations}>
          <SkeletonRectangle
            className={styles.affiliationTag}
            variant="rounded"
          />
          <SkeletonRectangle
            className={styles.affiliationTag}
            variant="rounded"
          />
        </div>
      </div>
    </article>
  );
};
