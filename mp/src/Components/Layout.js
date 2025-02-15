import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import "../Style/Layout.css"; // CSS for layout

const Layout = () => {
  const location = useLocation();

  // Hide navbar for login & signup
  const hideNav = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="container">
      {!hideNav && <NavBar />}
      <div className="content">
        <Outlet />  {/* This changes dynamically */}
      </div>
    </div>
  );
};

export default Layout;
