import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import {Routes,Route} from "react-router-dom";
import Feed from "./pages/feed";
import PostCard from "./components/postcard/postcard";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex">
      <Sidebar />
      <main className="pt-16 pl-52 min-h-screen p-6 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Feed/>}/>
          <Route path="/feed" element={<Feed/>}/>
        </Routes>
      </main>
      </div>
    </>
  );
}
export default App;