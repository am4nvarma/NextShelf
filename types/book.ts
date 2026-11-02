export type OpenLibraryBook = {
    key:string;
    title:string;
    author_name? : string[];
    first_publish_year? : number;
    cover_i?: number;
};

export type OpenLibrarySearchResponse = {
    docs: OpenLibraryBook[];
    numFound: number;
};