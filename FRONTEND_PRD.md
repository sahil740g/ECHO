# ECHO - Frontend Product Requirements Document (PRD)

**Version:** 1.4
**Date:** 2026-02-02
**Status:** Feature Complete / Beta Polishing

---

## 1. Project Overview
**ECHO** is a modern, developer-focused social platform designed for sharing knowledge, code snippets, and tech discussions. It combines the feed-based discovery of Twitter/X with the community aspects of discord/forums, wrapped in a sleek, dark-themed UI tailored for programmers.

### Core Value Proposition
- **For Developers**: Syntax-highlighted code sharing, tag-based discovery, and real-time community chat.
- **Privacy/Speed**: Fast client-side interactions with optimistic UI updates.
- **Aesthetics**: Premium "Cyberpunk/Dev" aesthetic using dark modes, glassmorphism, and vibrant accents.

---

## 2. Technology Stack
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS (Utility-first architecture)
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Real-time Messaging**: Socket.io + Supabase
- **Libraries**:
    - `emoji-picker-react`: For emoji selection in chat and posts.
    - `react-easy-crop`: For profile image customization (Avatar & Banner).
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`AuthContext`, `PostsContext`, `CommentsContext`, `NotificationContext`)
- **Build Tool**: Vite

---

## 3. Core Features & Architecture

### 3.1 Authentication & User Management
- **Current State**: **Supabase Auth Integration**
- **Features**:
  - Full Email/Password Login & Registration.
  - Persistent User Sessions.
  - User Profiles linked to Supabase `profiles` table.
  - Follow/Unfollow logic (persisted in database).
  - Saved Posts / Bookmarking system.

### 3.2 Main Feed (`/feed`)
The central hub for content discovery.
- **Post Rendering**: Cards displaying user info, timestamps, text content, and **syntax-highlighted code blocks**.
- **Interactions**:
  - **Upvote/Downvote system**: Persisted to Supabase `votes` table. Retains state across sessions.
  - Comments section (expandable).
  - "Trending Languages" sidebar widget (Desktop).
  - "Community Stats" widget (Desktop): **Live data** fetching total users and posts from Supabase.
- **Responsive Design**: Sidebar hides on mobile; widgets move/adapt.

### 3.2.1 Query Section (`/query`)
Dedicated space for technical questions.
- **Layout**: Follows the standard **2/3 Main Content + 1/3 Sidebar** layout (consistent with Feed).
- **Header**: "Community Queries" title for clear context.
- **Components**: Reuses `PostCard` logic but filters for 'query' type.

### 3.3 Trending & Discovery (`/trending`)
Analytics-driven discovery engine.
- **Logic**: Client-side calculation of top tags based on current post feed.
- **Features**:
  - **Trending Technologies**: visual list of top tags (e.g., #React, #JavaScript).
  - **Filtering**: Clicking a tag filters the post feed to show only relevant content.
  - **Mobile Optimization**: Trending widgets move to the top of the feed on mobile devices for easy access.

### 3.4 Community Chat (`/community`)
Real-time messaging interface.
- **Current State**: Global Channel (`#global-chat`) powered by **Socket.io**.
- **Features**:
  - **Real-time Delivery**: Instant message broadcasting to all connected clients.
  - **Persistence**: Messages stored in Supabase `community_messages` table.
  - Message grouping (consecutive messages from same user).
  - **Interaction**: Integrated **Emoji Picker** for rich expressions.
  - **Mobile Optimization**:
    - Full-screen chat interface.
    - Simplified layout for cleaner UX.

### 3.5 Personal Direct Messaging (`/chat`)
Private Communication System.
- **Features**:
  - **Functionality**: Real-time messaging simulation with "Send on Enter" support.
  - **Emoji Picker**: Integrated smile icon.
  - **Profile Integration**: "Message" button on user profiles.
  - **Routing**: Active chats use URL parameters (`/chat/:id`) for deep linking.
- **Mobile Optimization**:
  - **Smart Navigation**: Bottom Navigation Bar auto-hides inside conversations.

### 3.6 User Profile (`/profile`)
Comprehensive identity management.
- **Header**: Avatar, Bio, Location, Website, Stats (Followers/Following).
- **Tabs**:
  - **Posts**: User's created content.
  - **Saved**: Bookmarked posts.
  - **Tagged**: Posts where user is mentioned.
- **Social Integration**: Links to GitHub, LinkedIn, X, etc.
- **Edit Profile**: 
  - **Image Cropping**: Advanced pan/zoom cropping for avatars/banners.
  - **Mobile Optimized**: Compact bottom-sheet style modal on mobile.

### 3.7 Notifications & Alerts
- **System**: Centralized notification center.
- **Trigger**:
  - Likes, Comments, New Followers.
- **UI**:
  - Desktop: Dropdown/Panel in NavbarActions.
  - Mobile: Integrated into Bottom Nav.
  - **Visuals**: Red notification badges.

### 3.8 Navigation Structure
- **Desktop**: Persistent Left Sidebar (Navigation) + Right Sidebar (Widgets).
- **Mobile**:
  - **Top Navbar**: Logo + Search + Settings.
  - **Bottom Navigation Bar**: Feed, Query, Trending, Community, Profile.
  - **Floating Action Button (+)**: Triggers "New Post" modal.
  - **Search**: Dedicated responsive Search Overlay.

---

## 4. Feature Highlights

### 4.1 Content Creation
- **New Post / New Query Modal**:
    - Title, Body, Tagging system.
    - **Code Snippet** support with syntax highlighting.
    - **Emoji Picker** integration.
    - Persisted to Supabase `posts` table.

### 4.2 Code Solutions
- **Query Posts**: Special post type for help requests.
- **Comment Solutions**: 
    - Supports **Code Snippets in Comments** exclusively for Query-type posts.
    - "View Code" toggle.
    - One-click copy functionality.

---

## 5. UI/UX Design System
- **Color Palette**:
  - Background: `#0d1117` (GitHub Dim Black)
  - Surface: `#161b22`, `#1A1A1A`
  - Accents: Blue (`#60a5fa`), Green (`#4ade80`), Purple (`#c084fc`).
- **Typography**: Sans-serif, optimized for readability.
- **Components**: Modular, reusable components (`PostCard`, `Button`, `Modal`, `Loader`).

---

## 6. Data Flow & State
The application uses a **Supabase + Context** architecture:
- **`PostsContext`**: Fetches posts from Supabase, handles voting (optimistic updates), and aggregates Community Stats.
- **`AuthContext`**: Manages Supabase session, user profile, and protected routes.
- **`CommentsContext`**: Manages comments linked to posts.
- **`NotificationContext`**: Handles real-time alerts.

---

## 7. Completed Roadmap (Backend Integration)
The following integrations have been completed:
1.  **Auth**: `Supabase Auth` (Login/Register/Logout).
2.  **Posts**: CRUD operations via Supabase Client.
3.  **Votes**: Persistent upvotes/downvotes via `votes` table.
4.  **Real-time**: Socket.io integration for `/community` chat.
5.  **Profile**: Profile fetching and updating via `profiles` table.

---

*This document serves as the primary reference for the ECHO Frontend logic and features.*
