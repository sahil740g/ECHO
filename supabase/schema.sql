-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  handle text unique not null,
  name text,
  bio text,
  location text,
  website text,
  avatar_url text,
  cover_url text,
  created_at timestamptz default now()
);

-- POSTS
create table posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  code_snippet text,
  tags text[] default '{}',
  type text default 'post' check (type in ('post', 'query')),
  votes int default 0,
  created_at timestamptz default now()
);

-- COMMENTS (supports nested replies via parent_id)
create table comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  parent_id uuid references comments(id) on delete cascade,
  text text not null,
  code_snippet text,
  language text,
  likes int default 0,
  dislikes int default 0,
  created_at timestamptz default now()
);

-- VOTES (tracks user votes on posts)
create table votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  vote_type text check (vote_type in ('up', 'down')),
  unique(user_id, post_id)
);

-- FOLLOWS
create table follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references profiles(id) on delete cascade not null,
  following_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

-- BOOKMARKS
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- CONVERSATIONS (for DMs)
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now()
);

-- CONVERSATION PARTICIPANTS
create table conversation_participants (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  unique(conversation_id, user_id)
);

-- MESSAGES (stored for persistence, delivered via Socket.io)
create table messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now()
);

-- COMMUNITY MESSAGES (global chat)
create table community_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now()
);
