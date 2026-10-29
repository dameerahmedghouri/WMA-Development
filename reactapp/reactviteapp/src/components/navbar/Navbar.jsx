import { NavLink } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar">

        <ul className="navbar-list">

          <li className="navbar-item">
            <NavLink className="navbar-link" to="/about">About</NavLink>
          </li>

          <li className="navbar-item">
            <NavLink className="navbar-link" to="/resume">Resume</NavLink>
          </li>

          <li className="navbar-item">
            <NavLink className="navbar-link" to="/portfolio">Portfolio</NavLink>
          </li>

          <li className="navbar-item">
            <NavLink className="navbar-link" to="/blog">Blog</NavLink>
          </li>

          <li className="navbar-item">
            <NavLink className="navbar-link" to="/github">GitHub</NavLink>
          </li>

        </ul>

      </nav>

  )
}

export default Navbar