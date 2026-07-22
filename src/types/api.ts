import { Character, Reaction } from "./character";

export interface CharactersResponse {
  results: Character[];
  total: number;
  page: number;
  limit: number;
  next: string | null;
  previous: string | null;
}

export interface ReactionsResponse {
  reactions: Reaction[];
}

export interface GetCharactersParams {
  name?: string;
  page?: number;
  limit?: number;
}
