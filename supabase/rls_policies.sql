-- ====================================
-- RLS POLICIES FOR VOTES AND POSTS
-- ====================================
-- This script safely drops and recreates all policies to fix vote persistence

-- Enable RLS on votes table (if not already enabled)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on posts table (if not already enabled)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ====================================
-- DROP EXISTING POLICIES (if they exist)
-- ====================================

DROP POLICY IF EXISTS "Anyone can read votes" ON votes;
DROP POLICY IF EXISTS "Authenticated users can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can update own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete own votes" ON votes;

DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can update vote counts" ON posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON posts;

-- ====================================
-- VOTES TABLE POLICIES
-- ====================================

-- Allow anyone to read votes (needed for displaying vote counts)
CREATE POLICY "Anyone can read votes"
  ON votes
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own votes
CREATE POLICY "Authenticated users can insert votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own votes
CREATE POLICY "Users can update own votes"
  ON votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "Users can delete own votes"
  ON votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ====================================
-- POSTS TABLE POLICIES
-- ====================================

-- Allow anyone to read posts (public feed)
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- CRITICAL: Allow authenticated users to update vote counts on any post
-- This is needed for the voting system to work
CREATE POLICY "Authenticated users can update vote counts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authors to delete their own posts
CREATE POLICY "Authors can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);
