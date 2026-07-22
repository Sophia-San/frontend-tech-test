import { useEffect, useState } from "react";

import { getCharacters } from "../api";
import { Character } from "../types/character";

export type UseCharactersResult =
  | { status: "loading" }
  | { status: "success"; characters: Character[] }
  | { status: "error" };

export const useCharacters = (): UseCharactersResult => {
  const [result, setResult] = useState<UseCharactersResult>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getCharacters();
        if (!cancelled) {
          setResult({ status: "success", characters: response.results });
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
