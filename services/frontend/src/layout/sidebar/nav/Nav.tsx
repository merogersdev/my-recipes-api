import { LuBanana, LuHouse, LuPizza } from "react-icons/lu";

import { NavLink } from "react-router";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: <LuHouse className="nav__icon" />,
  },
  {
    name: "Recipes",
    href: "/recipes",
    icon: <LuPizza className="nav__icon" />,
  },
];

import "./Nav.scss";

export default function Nav() {
  return (
    <nav className="nav">
      <ul className="nav__items">
        {navItems &&
          navItems.map(({ name, href, icon }) => (
            <li className="nav__item" key={name}>
              <NavLink to={href} className="nav__link">
                {icon}
                <span className="nav__text">{name}</span>
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
