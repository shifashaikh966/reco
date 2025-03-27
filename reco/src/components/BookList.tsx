import React from 'react';
import { Book, BookStatus, SortOption } from '../types';
import { Clock, Star, ThumbsUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookListProps {
  books: Book[];
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onStatusChange: (bookId: string, status: BookStatus) => void;
  bookStatuses: Record<string, BookStatus>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BookList({
  books,
  sortOption,
  onSortChange,
  onStatusChange,
  bookStatuses,
  currentPage,
  totalPages,
  onPageChange,
}: BookListProps) {
  const sortButtons: Array<{ option: SortOption; label: string; icon: React.ReactNode }> = [
    { option: 'publicationDate', label: 'Date', icon: <Calendar size={16} /> },
    { option: 'rating', label: 'Rating', icon: <Star size={16} /> },
    { option: 'length', label: 'Length', icon: <Clock size={16} /> },
    { option: 'popularity', label: 'Popularity', icon: <ThumbsUp size={16} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {sortButtons.map(({ option, label, icon }) => (
            <button
              key={option}
              onClick={() => onSortChange(option)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                sortOption === option
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform">
            <div className="flex h-full">
              <div className="w-1/3 bg-gray-100">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-gray-600 mb-4">by {book.author}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onStatusChange(book.id, 'toRead')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        bookStatuses[book.id] === 'toRead'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      To Read
                    </button>
                    <button
                      onClick={() => onStatusChange(book.id, 'read')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        bookStatuses[book.id] === 'read'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Read
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{book.synopsis}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>Published: {book.publicationDate}</p>
                    <p>Pages: {book.pageCount}</p>
                    <p>Reading time: {book.estimatedReadingTime}</p>
                  </div>
                  <div>
                    <p>Rating: {book.averageRating.toFixed(1)} / 5.0</p>
                    <p>Language: {book.language || 'Unknown'}</p>
                    <p>ISBN: {book.isbn || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}