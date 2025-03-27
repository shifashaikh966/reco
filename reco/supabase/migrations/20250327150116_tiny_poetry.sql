/*
  # Create book statuses table

  1. New Tables
    - `book_statuses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `book_id` (text, from OpenLibrary)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `book_statuses` table
    - Add policies for authenticated users to manage their own book statuses
*/

CREATE TABLE IF NOT EXISTS book_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  book_id text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

ALTER TABLE book_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own book statuses"
  ON book_statuses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book statuses"
  ON book_statuses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book statuses"
  ON book_statuses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_book_statuses_updated_at
  BEFORE UPDATE
  ON book_statuses
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();