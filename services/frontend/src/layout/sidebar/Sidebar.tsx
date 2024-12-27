import { useAppSelector } from "../../app/store";
import Toggle from "./toggle/Toggle";
import Nav from "./nav/Nav";

import "./Sidebar.scss";

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
      <Nav expanded={expanded} />
    </aside>
  );
}
