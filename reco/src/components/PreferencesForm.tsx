import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { BookOpen, Clock, AlertTriangle, BookType, History, BookMarked } from 'lucide-react';

const GENRES = [
  'Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Romance',
  'Historical Fiction', 'Literary Fiction', 'Thriller', 'Horror',
  'Biography', 'Non-Fiction', 'Poetry'
];

const READING_LEVELS = ['Middle Grade', 'Young Adult', 'Adult', 'All Ages'];
const TIME_PERIODS = ['Contemporary', 'Classics', '2010s', '2000s', '1990s', 'Pre-1990s'];

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
}

export default function PreferencesForm({ onSubmit }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    readingLevel: '',
    recentBooks: ['', ''],
    timePeriod: '',
    maxLength: 500,
    contentWarningsToAvoid: [],
  });

  const handleGenreChange = (genre: string) => {
    if (preferences.genres.includes(genre)) {
      setPreferences({
        ...preferences,
        genres: preferences.genres.filter(g => g !== genre)
      });
    } else if (preferences.genres.length < 3) {
      setPreferences({
        ...preferences,
        genres: [...preferences.genres, genre]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Your Next Great Read</h2>
      
      <div className="mb-6">
        <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-700">
          <BookType size={20} />
          Select up to 3 favorite genres
        </label>
        <div className="grid grid-cols-3 gap-2">
          {GENRES.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => handleGenreChange(genre)}
              className={`p-2 rounded-md text-sm ${
                preferences.genres.includes(genre)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-700">
          <BookOpen size={20} />
          Reading Level
        </label>
        <select
          value={preferences.readingLevel}
          onChange={(e) => setPreferences({ ...preferences, readingLevel: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select reading level...</option>
          {READING_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-700">
          <BookMarked size={20} />
          Recent Books You've Enjoyed
        </label>
        {preferences.recentBooks.map((book, index) => (
          <input
            key={index}
            type="text"
            value={book}
            onChange={(e) => {
              const newBooks = [...preferences.recentBooks];
              newBooks[index] = e.target.value;
              setPreferences({ ...preferences, recentBooks: newBooks });
            }}
            placeholder={`Book ${index + 1}`}
            className="w-full p-2 border rounded-md mb-2"
          />
        ))}
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-700">
          <History size={20} />
          Time Period Preference
        </label>
        <select
          value={preferences.timePeriod}
          onChange={(e) => setPreferences({ ...preferences, timePeriod: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select time period...</option>
          {TIME_PERIODS.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-700">
          <Clock size={20} />
          Maximum Book Length (pages)
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={preferences.maxLength}
          onChange={(e) => setPreferences({ ...preferences, maxLength: Number(e.target.value) })}
          className="w-full"
        />
        <span className="text-gray-600">{preferences.maxLength} pages</span>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-700">
          <AlertTriangle size={20} />
          Content Warnings to Avoid
        </label>
        <input
          type="text"
          placeholder="Enter warnings separated by commas"
          value={preferences.contentWarningsToAvoid.join(', ')}
          onChange={(e) => setPreferences({
            ...preferences,
            contentWarningsToAvoid: e.target.value.split(',').map(w => w.trim()).filter(Boolean)
          })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Get Recommendations
      </button>
    </form>
  );
}