import {Link} from "react-router-dom";
import logo from "../../assets/ECHO_LOGO.png";
const LogoSection=()=>{
  return(
    <Link to="/feed" className="flex items-center gap-2 whitespace-nowrap">
      <img src={logo} alt="Echo Logo" className="w-7 h-7"/>
      <span className="text-xl font-bold">ECHO</span>
    </Link>
  )
}
export default LogoSection;