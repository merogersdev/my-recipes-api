import { LuBanana, LuHouse, LuPizza } from "react-icons/lu";

import { NavLink, Link } from "react-router";

import { useAppSelector } from "../../app/store";
import Toggle from "./toggle/Toggle";
import Nav from "./nav/Nav";

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

  return (
    <aside className={`sidebar${expanded ? " sidebar--expanded" : ""}`}>
      <div
        className={`sidebar__underlay${
          expanded ? " sidebar__underlay--expanded" : ""
        }`}
      />
      <Toggle />
      <Nav />
    </aside>
  );
}
