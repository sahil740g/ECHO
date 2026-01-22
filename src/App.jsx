import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import { Navigate, Routes, Route } from "react-router-dom";
import Feed from "./pages/feed";
import Query from "./pages/query";
import Trending from "./pages/trending";
import Community from "./pages/community";
import PostDetails from "./pages/postdetails";
import Profile from "./pages/profile";
import SearchResults from "./pages/searchresults";
import BottomNav from "./components/bottomnav/bottomnav";
import SplashScreen from "./components/splashscreen/splashscreen";
import { useState } from "react";
function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="pt-16 pb-20 md:pb-0 pl-0 md:pl-52 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/feed" />} />
            <Route path="/post/:postId" element={<PostDetails />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/query" element={<Query />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
      </div>
      <BottomNav />
    </>
  );
}
export default App;