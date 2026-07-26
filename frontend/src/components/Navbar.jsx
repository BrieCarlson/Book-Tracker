import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">
          Book Library
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/books">
          Books
        </NavLink>

        <NavLink to="/add">
          Add Book
        </NavLink>

        <NavLink to="/stats">
          Stats
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;