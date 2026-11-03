import { OpenLibrarySearchResponse } from "../types/book";

const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks (
    query: string
) : Promise<OpenLibrarySearchResponse> {
    const url = `${BASE_URL }?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,cover_i&limit=20`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('failed to fetch books')
    }

    const data: OpenLibrarySearchResponse = await response.json()

    return data;
}