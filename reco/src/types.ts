export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  genres: string[];
  readingLevel: string;
  publicationDate: string;
  pageCount: number;
  averageRating: number;
  popularity: number;
  estimatedReadingTime: string;
  similarBooks: string[];
  contentWarnings: string[];
  coverUrl?: string;
  isbn?: string;
  publisher?: string;
  language?: string;
}

export interface UserPreferences {
  genres: string[];
  readingLevel: string;
  recentBooks: string[];
  timePeriod: string;
  maxLength: number;
  contentWarningsToAvoid: string[];
  searchQuery?: string;
}

export type SortOption = 'publicationDate' | 'rating' | 'length' | 'popularity';
export type BookStatus = 'toRead' | 'read' | 'notInterested';

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  ratings_average?: number;
  cover_i?: number;
  isbn?: string[];
  publisher?: string[];
  language?: string[];
  subject?: string[];
  first_sentence?: string[];
}

export interface SearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}