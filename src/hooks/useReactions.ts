import { useEffect, useState } from "react";

import { getReactions } from "../api";
import { Reaction } from "../types/character";

type UseReactionsResult =
  | { status: "loading" }
  | { status: "success"; reactionsByCharacterId: Map<number, Reaction[]> }
  | { status: "error" };

const groupReactionsByCharacter = (
  reactions: Reaction[],
): Map<number, Reaction[]> => {
  const reactionsByCharacterId = new Map<number, Reaction[]>();
  const seenIds = new Set<string>();

  for (const reaction of reactions) {
    if (reaction.deleted || seenIds.has(reaction.id)) {
      continue;
    }
    seenIds.add(reaction.id);

    const existing = reactionsByCharacterId.get(reaction.characterId);
    if (existing) {
      existing.push(reaction);
    } else {
      reactionsByCharacterId.set(reaction.characterId, [reaction]);
    }
  }

  return reactionsByCharacterId;
};

export const useReactions = (): UseReactionsResult => {
  const [result, setResult] = useState<UseReactionsResult>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getReactions();
        if (!cancelled) {
          setResult({
            status: "success",
            reactionsByCharacterId: groupReactionsByCharacter(
              response.reactions,
            ),
          });
        }
      } catch {
        if (!cancelled) {
          setResult({ status: "error" });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
};
