-- Function to increment comment vote count
CREATE OR REPLACE FUNCTION increment_comment_vote(comment_id uuid, vote_type text)
RETURNS void AS $$
BEGIN
  IF vote_type = 'up' THEN
    UPDATE comments SET likes = likes + 1 WHERE id = comment_id;
  ELSE
    UPDATE comments SET dislikes = dislikes + 1 WHERE id = comment_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement comment vote count
CREATE OR REPLACE FUNCTION decrement_comment_vote(comment_id uuid, vote_type text)
RETURNS void AS $$
BEGIN
  IF vote_type = 'up' THEN
    UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = comment_id;
  ELSE
    UPDATE comments SET dislikes = GREATEST(0, dislikes - 1) WHERE id = comment_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to toggle vote (change from up to down or vice versa)
CREATE OR REPLACE FUNCTION toggle_comment_vote(comment_id uuid, old_type text, new_type text)
RETURNS void AS $$
BEGIN
  IF old_type = 'up' THEN
    UPDATE comments SET likes = GREATEST(0, likes - 1), dislikes = dislikes + 1 WHERE id = comment_id;
  ELSE
    UPDATE comments SET dislikes = GREATEST(0, dislikes - 1), likes = likes + 1 WHERE id = comment_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
