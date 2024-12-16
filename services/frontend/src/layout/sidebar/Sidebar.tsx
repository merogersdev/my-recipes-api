import {
  LuChevronFirst,
  LuChevronLast,
  LuBanana,
  LuHouse,
  LuPizza,
} from "react-icons/lu";

import { Link } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../app/store";
import { toggleExpanded } from "../../features/sidebar/sidebarSlice";

import "./Sidebar.scss";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: <LuHouse className="sidebar__icon" />,
  },
  {
    name: "Recipes",
    href: "/recipes",
    icon: <LuPizza className="sidebar__icon" />,
  },
];

export default function Sidebar() {
  const expanded = useAppSelector((state) => state.sidebar.value);
  const dispatch = useAppDispatch();

  // Toggle expanded state
  const toggle = () => dispatch(toggleExpanded());

  return (
    <aside className={`sidebar${expanded ? " sidebar--expanded" : ""}`}>
      <div className="sidebar__header">
        <Link
          to="/"
          className={`sidebar__logo${
            expanded ? " sidebar__logo--expanded" : ""
          }`}
        >
          <LuBanana className="sidebar__main-icon" />
          <div className="sidebar__title">My Recipes</div>
        </Link>
      </div>
      <button className="sidebar__toggle" onClick={toggle}>
        {expanded ? (
          <LuChevronFirst className="sidebar__icon" />
        ) : (
          <LuChevronLast className="sidebar__icon" />
        )}
      </button>

      <nav className="sidebar__nav">
        <ul className="sidebar__items">
          {navItems &&
            navItems.map(({ name, href, icon }) => (
              <li className="sidebar__item">
                <Link to={href} className="sidebar__link">
                  <div className="sidebar__container">{icon}</div>
                  <span
                    className={`sidebar__text${
                      expanded ? " sidebar__text--expanded" : ""
                    }`}
                  >
                    {name}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
      <div className="sidebar__user">
        <img
          src="https://ui-avatars.com/api/?background=random"
          alt="Avatar"
          className="sidebar__avatar"
        />
        <div
          className={`sidebar__info${
            expanded ? " sidebar__info--expanded" : ""
          }`}
        >
          John Doe<button className="sidebar__btn">Logout</button>
        </div>
      </div>
    </aside>
  );
}
