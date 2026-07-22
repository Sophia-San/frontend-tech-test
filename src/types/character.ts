export interface Character {
  id: number;
  name: string;
  species?: string;
  birthYear?: string;
  description?: string;
  imageUrl?: string;
  affiliations: string[];
}

export interface Reaction {
  id: string;
  content: string;
  characterId: number;
  deleted: boolean;
}
