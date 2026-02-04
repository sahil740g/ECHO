-- ====================================
-- CHAT MEDIA FEATURE
-- ====================================
-- This script adds support for photo/video sharing in chat messages

-- Add media fields to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'video'));

-- Make text nullable since messages can be media-only
ALTER TABLE messages 
ALTER COLUMN text DROP NOT NULL;

-- Add constraint: message must have either text or media
ALTER TABLE messages
ADD CONSTRAINT message_content_check 
CHECK (
  (text IS NOT NULL AND text != '') OR 
  (media_url IS NOT NULL AND media_url != '')
);

-- Create index for filtering media messages
CREATE INDEX IF NOT EXISTS idx_messages_media ON messages(media_type) WHERE media_type IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN messages.media_url IS 'Supabase Storage URL for image/video attachments';
COMMENT ON COLUMN messages.media_type IS 'Type of media: image or video';
