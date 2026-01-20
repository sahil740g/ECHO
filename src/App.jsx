import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import {Navigate,Routes,Route} from "react-router-dom";
import Feed from "./pages/feed";
import Query from "./pages/query";
import Trending from "./pages/trending";
import Community from "./pages/community";
import PostCard from "./components/postcard/postcard";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex">
      <Sidebar />
      <main className="pt-16 pl-52 min-h-screen p-6 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/feed"/>}/>
          <Route path="/feed" element={<Feed/>}/>
          <Route path="/query" element={<Query/>}/>
          <Route path="/trending" element={<Trending/>}/>
          <Route path="/community" element={<Community/>}/>
        </Routes>
      </main>
      </div>
    </>
  );
}
export default App;