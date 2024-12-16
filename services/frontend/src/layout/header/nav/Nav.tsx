import { useState } from "react";
import { Link } from "react-router-dom";

import "./Nav.scss";

type NavLink = {
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Login",
    href: "/login",
  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <button
        className="nav__hamburger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="nav__hamburger-line1" />
        <span className="nav__hamburger-line2" />
        <span className="nav__hamburger-line3" />
      </button>
      <ul className="nav__list">
        {navLinks &&
          navLinks.map(({ name, href }) => (
            <li className="nav__list-item">
              <Link to={href} className="nav__link">
                {name}
              </Link>
            </li>
          ))}
      </ul>
      <ul className={`nav__mobile${open ? " nav__mobile--open" : ""}`}>
        {navLinks &&
          navLinks.map(({ name, href }) => (
            <li className="nav__mobile-item">
              <Link to={href} className="nav__link">
                {name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
