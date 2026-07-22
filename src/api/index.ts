import {
  CharactersResponse,
  ReactionsResponse,
  GetCharactersParams,
} from "../types/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getCharacters = async ({
  name,
  page,
  limit,
}: GetCharactersParams = {}): Promise<CharactersResponse> => {
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));

  const response = await fetch(`/api/characters?${params.toString()}`);
  return handleResponse<CharactersResponse>(response);
};

export const getReactions = async (): Promise<ReactionsResponse> => {
  const response = await fetch("/api/reactions");
  return handleResponse<ReactionsResponse>(response);
};
