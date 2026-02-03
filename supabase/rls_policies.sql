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

-- ====================================
-- FOLLOWS TABLE POLICIES
-- ====================================

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read follows" ON follows;
DROP POLICY IF EXISTS "Authenticated users can follow others" ON follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON follows;

CREATE POLICY "Anyone can read follows"
  ON follows
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can follow others"
  ON follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- ====================================
-- BOOKMARKS TABLE POLICIES
-- ====================================

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can create own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON bookmarks;

CREATE POLICY "Users can read own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ====================================
-- PROFILES TABLE POLICIES
-- ====================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ====================================
-- CONVERSATIONS & MESSAGES POLICIES
-- ====================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read conversations they participate in" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can read their conversation participations" ON conversation_participants;
DROP POLICY IF EXISTS "Authenticated users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can read messages from their conversations" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;

-- Conversations
CREATE POLICY "Users can read conversations they participate in"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Conversation Participants
CREATE POLICY "Users can read their conversation participations"
  ON conversation_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can join conversations"
  ON conversation_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Messages
CREATE POLICY "Users can read messages from their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );
