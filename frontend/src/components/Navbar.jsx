import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">Book Library</NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/books">
          Books
        </NavLink>

        <NavLink to="/stats">
          Stats
        </NavLink>

        {user && (
          <NavLink to="/profile">
            Profile
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
