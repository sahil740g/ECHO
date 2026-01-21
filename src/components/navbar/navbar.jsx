import LogoSection from "./logosection";
import SearchBar from "./searchbar";
import NavbarActions from "./navbaractions";
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 grid grid-cols-3 items-center bg-[#0d1117]/80 backdrop-blur-md px-6 border-b border-white/5 z-50">
      {/*LEFT*/}
      <div className="flex items-center gap-2 justify-start">
        <LogoSection />
      </div>
      {/*CENTER*/}
      <div className="flex justify-center px-6">
        <SearchBar />
      </div>
      {/*RIGHT*/}
      <div className="flex items-center gap-3 justify-end">
        <NavbarActions />
      </div>
    </nav>
  );
};
export default Navbar;