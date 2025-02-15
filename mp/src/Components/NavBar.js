import { NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuBox } from "react-icons/lu";
import { BiReceipt, BiError } from "react-icons/bi";
import { FaEdit, FaChartLine, FaCommentDots } from "react-icons/fa";
import kiot from "../Images/kiot.jpeg";
import "../Style/NavBar.css"; // Separate CSS for styling

const NavBar = () => {
  return (
    <div className="navBar">
      <div className="kiotBar">
        <img className="kiotimg" src={kiot} alt="Logo" />
      </div>
      <NavLink to="/dashboard" className="navButtons">
        <LuLayoutDashboard className="img" />
        <div className="label">Dashboard</div>
      </NavLink>
      <NavLink to="/stocks" className="navButtons">
        <LuBox className="img" />
        <div>Stock</div>
      </NavLink>
      <NavLink to="/bills" className="navButtons">
        <BiReceipt className="img" />
        <div className="label">Bills</div>
      </NavLink>
      <NavLink to="/prediction" className="navButtons">
        <FaChartLine className="img" />
        <div className="label">Predict</div>
      </NavLink>
      <NavLink to="/chatbot" className="navButtons">
        <FaCommentDots className="img" />
        <div className="label">Chat Bot</div>
      </NavLink>
      <NavLink to="/report" className="navButtons">
        <BiError className="img" />
        <div className="label">Report</div>
      </NavLink>
    </div>
  );
};

export default NavBar;
