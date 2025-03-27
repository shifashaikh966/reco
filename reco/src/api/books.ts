import { OpenLibraryBook, SearchResponse, Book } from '../types';

const OPEN_LIBRARY_API = 'https://openlibrary.org';

export async function searchBooks(query: string, page = 1): Promise<{ books: Book[], total: number }> {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const response = await fetch(
    `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&fields=key,title,author_name,first_publish_year,number_of_pages_median,ratings_average,cover_i,isbn,publisher,language,subject,first_sentence`
  );
  
  const data: SearchResponse = await response.json();
  
  const books: Book[] = data.docs.map(convertOpenLibraryBook);
  
  return {
    books,
    total: data.numFound
  };
}

function convertOpenLibraryBook(olBook: OpenLibraryBook): Book {
  const coverUrl = olBook.cover_i 
    ? `https://covers.openlibrary.org/b/id/${olBook.cover_i}-L.jpg`
    : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=400';

  return {
    id: olBook.key,
    title: olBook.title,
    author: olBook.author_name?.[0] || 'Unknown Author',
    synopsis: olBook.first_sentence?.[0] || 'No synopsis available.',
    genres: olBook.subject?.slice(0, 5) || ['Uncategorized'],
    readingLevel: 'Adult', // OpenLibrary doesn't provide this directly
    publicationDate: olBook.first_publish_year?.toString() || 'Unknown',
    pageCount: olBook.number_of_pages_median || 0,
    averageRating: olBook.ratings_average || 0,
    popularity: 0, // OpenLibrary doesn't provide this directly
    estimatedReadingTime: `${Math.ceil((olBook.number_of_pages_median || 300) / 30)} hours`,
    similarBooks: [], // Would need additional API calls to populate this
    contentWarnings: [], // OpenLibrary doesn't provide this information
    coverUrl,
    isbn: olBook.isbn?.[0],
    publisher: olBook.publisher?.[0],
    language: olBook.language?.[0]
  };
}