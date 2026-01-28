# ECHO - Frontend Product Requirements Document (PRD)

**Version:** 1.2
**Date:** 2026-01-26
**Status:** In Development (Mobile Optimization Phase)

---

## 1. Project Overview
**ECHO** is a modern, developer-focused social platform designed for sharing knowledge, code snippets, and tech discussions. It combines the feed-based discovery of Twitter/X with the community aspects of discord/forums, wrapped in a sleek, dark-themed UI tailored for programmers.

### Core Value Proposition
- **For Developers**: Syntax-highlighted code sharing, tag-based discovery, and real-time community chat.
- **Privacy/Speed**: Fast client-side interactions with a reactive UI.
- **Aesthetics**: Premium "Cyberpunk/Dev" aesthetic using dark modes, glassmorphism, and vibrant accents.

---

## 2. Technology Stack
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS (Utility-first architecture)
- **Icons**: Lucide React
- **Libraries**:
    - `emoji-picker-react`: For emoji selection in chat and posts.
    - `react-easy-crop`: For profile image customization (Avatar & Banner).
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`AuthContext`, `PostsContext`, `CommentsContext`)
- **Build Tool**: Vite

---

## 3. Core Features & Architecture

### 3.1 Authentication & User Management
- **Current State**: Simulated Client-Side Auth.
- **Features**:
  - Login/Logout simulation.
  - Mock User Profile (`@currentuser`).
  - Follow/Unfollow logic (persisted in local state).
  - Saved Posts / Bookmarking system.

### 3.2 Main Feed (`/feed`)
The central hub for content discovery.
- **Post Rendering**: Cards displaying user info, timestamps, text content, and **syntax-highlighted code blocks**.
- **Interactions**:
  - Upvote/Downvote system.
  - Comments section (expandable).
  - "Trending Languages" sidebar widget (Desktop).
  - "Community Stats" widget (Desktop).
- **Responsive Design**: Sidebar hides on mobile; widgets move/adapt.

### 3.2.1 Query Section (`/query`)
Dedicated space for technical questions.
- **Layout**: Follows the standard **2/3 Main Content + 1/3 Sidebar** layout (consistent with Feed).
- **Header**: "Community Queries" title for clear context.
- **Components**: Reuses `PostCard` logic but filters for 'query' type.

### 3.3 Trending & Discovery (`/trending`)
Analytics-driven discovery engine.
- **Logic**: Client-side calculation of top tags based on post frequency.
- **Features**:
  - **Trending Technologies**: visual list of top tags (e.g., #React, #JavaScript).
  - **Filtering**: Clicking a tag filters the post feed to show only relevant content.
  - **Mobile Optimization**: Trending widgets move to the top of the feed on mobile devices for easy access.

### 3.4 Community Chat (`/community`)
Real-time messaging interface.
- **Current State**: Global Channel (`#global-chat`).
- **Features**:
  - Discord-like message streaming.
  - Message grouping (consecutive messages from same user).
  - Mock "ECHO Bot" for simulated activity.
  - **Interaction**: Integrated **Emoji Picker** for rich expressions (optimized for mobile with responsive sizing).
  - **Mobile Optimization**:
    - Full-screen chat interface.
    - Simplified layout (Active Users sidebar removed on all views for cleaner UX).

### 3.5 Personal Direct Messaging (`/chat`)
Private Communication System.
- **Features**:
  - **Functionality**: Real-time messaging simulation (local state) with "Send on Enter" support.
  - **Emoji Picker**: Integrated smile icon in input for easy emoji access.
  - **Profile Integration**: "Message" button on user profiles (visible only if following the user) to initiate chats.
  - **Routing Refactor**: Active chats use URL parameters (`/chat/:id`) for deep linking and navigation.
- **Mobile Optimization**:
  - **Smart Navigation**: Bottom Navigation Bar is visible on the Contact List view but **automatically hides** when inside a conversation to maximize vertical screen space.
  - **Adaptive Padding**: App layout dynamically adjusts padding to prevent content overlap or cutoff.

### 3.6 User Profile (`/profile`)
Comprehensive identity management.
- **Header**: Avatar, Bio, Location, Website, Stats (Followers/Following).
- **Tabs**:
  - **Posts**: User's created content.
  - **Saved**: Bookmarked posts.
  - **Tagged**: Posts where user is mentioned.
- **Social Integration**: Links to GitHub, LinkedIn, X, etc., open in **new tabs** (`target="_blank"`).

- **Edit Profile**: 
  - **Image Cropping**: Advanced pan/zoom cropping for both avatars and banners.
  - **Mobile Optimized**: Compact bottom-sheet style modal on mobile for better reachability.

### 3.6 Navigation Structure
- **Desktop**: Persistent Left Sidebar (Navigation) + Right Sidebar (Widgets).
- **Mobile**:
  - Top Navbar (Logo, basic actions).
  - Bottom Navigation Bar (Feed, Query, Trending, Community, Profile).
  - **Floating Action Button (+)**: Configured to open **New Query** modal directly for quick help.
  - Smart hiding of non-essential UI elements.

---

## 4. Feature Highlights

### 4.1 Content Creation
- **New Post / New Query Modal**:
    - Title, Body, Tagging system.
    - **Code Snippet** support with syntax highlighting.
    - **Emoji Picker** integration (Dark themed, responsive width, hidden scrollbar).
    - Integrated with Mobile "+" button for separate work streams.

### 4.2 Code Solutions
- **Query Posts**: Special post type for help requests.
- **Comment Solutions**: 
    - Supports **Code Snippets in Comments** exclusively for Query-type posts.
    - "View Code" toggle to keep threads clean.
    - One-click copy functionality.

---

## 5. UI/UX Design System
- **Color Palette**:
  - Background: `#0d1117` (GitHub Dim Black)
  - Surface: `#161b22`, `#1A1A1A`
  - Accents: Blue (`#60a5fa`), Green (`#4ade80`), Purple (`#c084fc`) for stats/highlights.
- **Typography**: Sans-serif, optimized for readability of technical content.
- **Components**: Modular, reusable components (`PostCard`, `Button`, `Modal`).

---

## 6. Data Flow & State
The application uses a **Context-based architecture** to simulate a backend:
- **`PostsContext`**: Manages the master list of posts, CRUD operations, and trending logic.
- **`AuthContext`**: Manages current user session, bookmarks, and following lists.
- **`CommentsContext`**: Manages threads and replies for posts (supports code snippets).
- **`ChatContext`**: Manages personal direct messages, active conversation routing, and mock chat data.

*Note: Currently using mock data arrays. Ready for API integration.*

---

## 7. Future Roadmap (Backend Integration)
To transition to production, the following endpoints are required:
1.  **Auth**: `POST /api/auth/login`, `POST /api/auth/register`.
2.  **Posts**: `GET /api/posts`, `POST /api/posts`, `PUT /api/posts/:id/vote`.
3.  **Real-time**: WebSocket integration for `/community` chat.
4.  **Profile**: `PUT /api/user/profile` for updates.

---

*This document serves as the primary reference for the ECHO Frontend logic and features.*
