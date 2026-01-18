import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";

function App() {
  return (
    <>
      <Navbar />
      <Sidebar />

      <main className="pt-16 ml-50 min-h-screen bg-black">
        Your page content here
      </main>
    </>
  );
}

export default App;