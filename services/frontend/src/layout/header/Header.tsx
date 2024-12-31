import { LuBookMarked } from "react-icons/lu";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../app/store";

import "./Header.scss";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const user = useAppSelector((state) => state.auth.user);

  console.log(user);

  return (
    <>
      <header className="header">
        <div className="header__container">
          <Link to="/" className="header__logo">
            <LuBookMarked className="header__icon" />
            <span className="header__title">{title}</span>
          </Link>
          {!user && (
            <div className="header__user">
              <span className="header__name">John Doe</span>
              <img
                src="https://ui-avatars.com/api/?background=random"
                alt="Avatar"
                className="header__avatar"
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
}
