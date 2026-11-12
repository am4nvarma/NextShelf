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
 
export type BookDetails = {
  key: string;
  title: string;
  description?: string | {
    type: string;
    value: string;
  };
  covers?: number[];
  subjects?: string[];
  authors?: {
    author: {
      key: string;
    };
    type: {
      key: string;
    };
  }[];
};


export type BookAuthor = {
  key: string;
  name: string;
  bio?: string | {
    type: string;
    value: string;
  };
  photos?: number[];
};

export type AuthorSearchDocument = {
  author_key?: string[];
  author_name?: string[];
};

export type AuthorSearchResponse = {
  docs: AuthorSearchDocument[];
  numFound: number;
};

export type AuthorRecommendation = {
  key: string;
  name: string;
  genres: string[];
  workCount: number;
  photoUrl?: string;
};