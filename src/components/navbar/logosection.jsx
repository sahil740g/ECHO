import logo from "../../assets/ECHO_LOGO.png";
const LogoSection=()=>{
  return(
    <div className="flex items-center gap-2 whitespace-nowrap">
      <img src={logo} alt="Echo Logo" className="w-15 h-15"/>
      <span className="text-xl font-bold">ECHO</span>
    </div>
  );
};
export default LogoSection;