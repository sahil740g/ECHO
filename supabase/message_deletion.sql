-- ====================================
-- MESSAGE DELETION FEATURE
-- ====================================
-- This script adds support for WhatsApp-style message deletion
-- with "Delete for Me" and "Delete for Everyone" functionality

-- Update messages table to support "Delete for Everyone"
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS deleted_for_everyone BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Create deleted_messages table for "Delete for Me" tracking
CREATE TABLE IF NOT EXISTS deleted_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deleted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS on deleted_messages
ALTER TABLE deleted_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own deleted messages" ON deleted_messages;
DROP POLICY IF EXISTS "Users can delete messages for themselves" ON deleted_messages;
DROP POLICY IF EXISTS "Users can update own messages for deletion" ON messages;

-- RLS Policies for deleted_messages table
CREATE POLICY "Users can read own deleted messages"
  ON deleted_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete messages for themselves"
  ON deleted_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update messages for "Delete for Everyone"
CREATE POLICY "Users can update own messages for deletion"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_deleted_messages_user ON deleted_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_deleted_messages_message ON deleted_messages(message_id);
CREATE INDEX IF NOT EXISTS idx_messages_deleted ON messages(deleted_for_everyone);
