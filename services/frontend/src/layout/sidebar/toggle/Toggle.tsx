import { LuMenu, LuArrowLeftFromLine } from "react-icons/lu";

import { useAppDispatch, useAppSelector } from "../../../app/store";
import { toggleExpanded } from "../../../features/sidebar/sidebarSlice";

import "./Toggle.scss";

export default function Toggle() {
  const expanded = useAppSelector((state) => state.sidebar.value);
  const dispatch = useAppDispatch();

  // Toggle expanded state
  const toggle = () => dispatch(toggleExpanded());
  return (
    <button className="toggle" onClick={toggle}>
      {expanded ? (
        <LuArrowLeftFromLine className="toggle__icon" />
      ) : (
        <LuMenu className="toggle__icon" />
      )}
    </button>
  );
}
