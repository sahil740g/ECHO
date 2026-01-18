import LogoSection from "./logosection";
import SearchBar from "./searchbar";
import NavbarActions from "./navbaractions";
const Navbar=()=>{
  return(
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center bg-gray-900 px-6 border-b border-gray-600 z-50">
      {/*LEFT*/}
      <div className="flex items-center gap-2">
        <LogoSection />
        </div>
        {/*CENTER*/}
        <div className="flex-1 flex justify-center px-6">
        <SearchBar />
        </div>
        {/*RIGHT*/}
        <div className="flex items-center gap-3 flex-shrink-0">
      <NavbarActions />
      </div>
    </nav>
  );
};
export default Navbar;