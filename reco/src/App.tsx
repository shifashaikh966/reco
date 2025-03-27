import React, { useState, useEffect } from 'react';
import PreferencesForm from './components/PreferencesForm';
import BookList from './components/BookList';
import SearchBar from './components/SearchBar';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import { Book, UserPreferences, SortOption, BookStatus } from './types';
import { Library } from 'lucide-react';
import { searchBooks } from './api/books';
import { useQuery } from 'react-query';
import { supabase } from './lib/supabase';

function App() {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [bookStatuses, setBookStatuses] = useState<Record<string, BookStatus>>({});
  const [showForm, setShowForm] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: searchResults, isLoading, error } = useQuery(
    ['books', searchQuery, currentPage],
    () => searchBooks(searchQuery, currentPage),
    {
      enabled: !!searchQuery,
      keepPreviousData: true
    }
  );

  const handlePreferencesSubmit = (preferences: UserPreferences) => {
    setSearchQuery(preferences.searchQuery || '');
    setShowForm(false);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    const sorted = [...(searchResults?.books || [])].sort((a, b) => {
      switch (option) {
        case 'publicationDate':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'length':
          return a.pageCount - b.pageCount;
        case 'popularity':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });
    setRecommendations(sorted);
  };

  const handleStatusChange = async (bookId: string, status: BookStatus) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setBookStatuses(prev => ({
      ...prev,
      [bookId]: status
    }));

    try {
      await supabase
        .from('book_statuses')
        .upsert({ 
          user_id: user.id,
          book_id: bookId,
          status
        });
    } catch (error) {
      console.error('Error saving book status:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Library className="text-indigo-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Literary Explorer</h1>
            </div>
            <div className="flex items-center gap-4">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Update Preferences
                </button>
              )}
              {user ? (
                <UserMenu user={user} onSignOut={() => setUser(null)} />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
          {!showForm && (
            <div className="mt-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm ? (
          <PreferencesForm onSubmit={handlePreferencesSubmit} />
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 p-4">
                An error occurred while fetching books. Please try again.
              </div>
            ) : (
              <BookList
                books={searchResults?.books || []}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                onStatusChange={handleStatusChange}
                bookStatuses={bookStatuses}
                currentPage={currentPage}
                totalPages={Math.ceil((searchResults?.total || 0) / 10)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-white mt-12 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600">
            Powered by Open Library API • Explore over 130 million books
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;