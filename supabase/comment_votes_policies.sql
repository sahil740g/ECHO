-- Enable Row Level Security
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all comment votes (to see counts)
CREATE POLICY "Comment votes are viewable by everyone"
ON comment_votes FOR SELECT
USING (true);

-- Policy: Users can insert their own votes
CREATE POLICY "Users can insert their own comment votes"
ON comment_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own votes
CREATE POLICY "Users can update their own comment votes"
ON comment_votes FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own votes
CREATE POLICY "Users can delete their own comment votes"
ON comment_votes FOR DELETE
USING (auth.uid() = user_id);
