import { BookAuthor, OpenLibrarySearchResponse } from "../types/book";

const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks(
  query: string,
): Promise<OpenLibrarySearchResponse> {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,cover_i&limit=20`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("failed to fetch books");
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


export async function getAuthorDetails(
  authorKey: string
): Promise<BookAuthor> {
  const url = `https://openlibrary.org${authorKey}.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch author details");
  }

  const data: BookAuthor = await response.json();

  return data;
}
