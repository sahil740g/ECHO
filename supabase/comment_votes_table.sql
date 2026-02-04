-- COMMENT_VOTES (tracks user votes on comments)
CREATE TABLE IF NOT EXISTS comment_votes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  vote_type text CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user_id ON comment_votes(user_id);
