import LogoSection from "./logosection";
import SearchBar from "./searchbar";
import NavbarActions from "./navbaractions";

const Navbar=()=>{
  return (
    <nav className="w-full h-16 flex items-center bg-gray-900 px-6 border-b">
      {/*LEFT*/}
      <div className="flex items-center flex-shrink-0">
        <LogoSection />
        </div>
        {/*CENTTER*/}
        <div className="flex-1 flex justify-center">
        <SearchBar />
        </div>
        {/*RIGHT*/}
        <div className="flex items-center flex-shrink-0">
      <NavbarActions />
      </div>
    </nav>
  );
};
export default Navbar;