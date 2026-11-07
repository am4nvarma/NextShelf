import { 
  BookAuthor, 
  OpenLibrarySearchResponse,
  AuthorSearchResponse,
  AuthorRecommendation,
} from "../types/book";


const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks(
  query: string,
  signal?: AbortSignal,
  offset: number = 0,
): Promise<OpenLibrarySearchResponse> {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,cover_i&limit=20&offset=${offset}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data: OpenLibrarySearchResponse = await response.json();

  return data;
}

export async function getBookDetails(bookKey: string) {
  const url = `https://openlibrary.org/works/${bookKey}.json`;

  console.log("Details API URL:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch book details: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function getAuthorDetails(authorKey: string): Promise<BookAuthor> {
  const url = `https://openlibrary.org${authorKey}.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch author details");
  }

  const data: BookAuthor = await response.json();

  return data;
}

export async function getAuthorsByGenre(
  genre: string,
  limit: number,
  signal?: AbortSignal,
): Promise<AuthorRecommendation[]> {
  const url =
    `https://openlibrary.org/search.json?` +
    `subject=${encodeURIComponent(genre)}` +
    `&fields=author_key,author_name` +
    `&limit=100`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch authors for ${genre}`);
  }

  const data: AuthorSearchResponse = await response.json();

  const authorCounts = new Map<string, AuthorRecommendation>();

  for (const book of data.docs) {
    if (!book.author_key || !book.author_name) continue;

    for (let i = 0; i < book.author_key.length; i++) {
      const key = book.author_key[i];
      const name = book.author_name[i];

      if (!key || !name) continue;

      const existing = authorCounts.get(key);

      if (existing) {
        existing.workCount++;
      } else {
        authorCounts.set(key, {
          key,
          name,
          genres: [genre],
          workCount: 1,
          photoUrl: `https://covers.openlibrary.org/a/olid/${key.replace("/authors/", "")}-M.jpg`,
        });
      }
    }
  }

  return Array.from(authorCounts.values())
    .sort((a, b) => b.workCount - a.workCount)
    .slice(0, limit);
}

export async function getPersonalizedAuthorRecommendations(
  selectedGenres : string[],
  signal? : AbortSignal,
): Promise<AuthorRecommendation[]> {
  if (selectedGenres.length === 0) {
    return [];
  }

  const genreCount = selectedGenres.length;

  const totalTarget = 14;

  const authorsPerGenre = Math.max(
    1,
    Math.floor(totalTarget / genreCount),
  );

  const results = await Promise.all (
    selectedGenres.map((genre) => 
    getAuthorsByGenre(genre, authorsPerGenre, signal),
  ),
  );

  const authorMap = new Map<string, AuthorRecommendation> ();

  results.forEach((authors, index) => {
    const genre = selectedGenres[index];

    authors.forEach((author) => {
      const existing = authorMap.get(author.key);

      if (existing) {
        if (!existing.genres.includes(genre)) {
          existing.genres.push(genre)
        } 

        existing.workCount += author.workCount;
      } else {
        authorMap.set(author.key, {...author});
      }
    });
  });

  return Array.from(authorMap.values()).sort(
    (a, b) => b.workCount - a.workCount,
  );
};
