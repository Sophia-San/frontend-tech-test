import { useEffect, useState } from "react";

import { getCharacters } from "../api";
import { Character } from "../types/character";

interface UseCharactersParams {
  name: string;
  page: number;
  pageSize: number;
}

type UseCharactersResult =
  | { status: "loading" }
  | {
      status: "success";
      characters: Character[];
      total: number;
      totalPages: number;
    }
  | { status: "error" };

type FetchResult =
  | {
      params: string;
      status: "success";
      characters: Character[];
      total: number;
      totalPages: number;
    }
  | { params: string; status: "error" };

export const useCharacters = ({
  name,
  page,
  pageSize,
}: UseCharactersParams): UseCharactersResult => {
  const [result, setResult] = useState<FetchResult | null>(null);
  const params = JSON.stringify({ name, page, pageSize });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getCharacters({ name, page, limit: pageSize });
        if (!cancelled) {
          setResult({
            params,
            status: "success",
            characters: response.results,
            total: response.total,
            totalPages: Math.ceil(response.total / pageSize),
          });
        }
      } catch {
        if (!cancelled) {
          setResult({ params, status: "error" });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [name, page, pageSize, params]);

  if (!result || result.params !== params) {
    return { status: "loading" };
  }

  if (result.status === "error") {
    return { status: "error" };
  }

  return {
    status: "success",
    characters: result.characters,
    total: result.total,
    totalPages: result.totalPages,
  };
};
