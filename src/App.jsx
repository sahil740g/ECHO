import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Feed from "./pages/feed";
import Query from "./pages/query";
import Trending from "./pages/trending";
import Community from "./pages/community";
import PostDetails from "./pages/postdetails";
import Profile from "./pages/profile";
import SearchResults from "./pages/searchresults";
import BottomNav from "./components/bottomnav/bottomnav";
import SplashScreen from "./components/splashscreen/splashscreen";
import { ChatProvider } from "./context/ChatContext";

import Chat from "./pages/chat";
import Notifications from "./pages/notifications";
import Guidelines from "./pages/guidelines";
import HelpCenter from "./pages/helpcenter";
import Blog from "./pages/blog";
import BlogPost from "./pages/blogpost";
import About from "./pages/about";
import Settings from "./pages/settings";
import { useState } from "react";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <ChatProvider>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className={`pt-16 pl-0 md:pl-52 min-h-screen w-full ${location.pathname.startsWith('/chat/') ? 'pb-0' : 'pb-20 md:pb-0'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/feed" />} />
            <Route path="/post/:postId" element={<PostDetails />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/query" element={<Query />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile key={location.pathname} />} />
            <Route path="/profile/:username" element={<Profile key={location.pathname} />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <BottomNav />
    </ChatProvider>
  );
}
export default App;