import { LuBanana } from "react-icons/lu";

import { Link } from "react-router-dom";

import "./Header.scss";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <>
      <Link to="/" className="header__logo">
        <LuBanana className="header__icon" />
        <span className="header__title">{title}</span>
      </Link>
      <header className="header">
        <div className="header__container">
          <div className="header__user">
            <span>John Doe</span>
            <img
              src="https://ui-avatars.com/api/?background=random"
              alt="Avatar"
              className="header__avatar"
            />
          </div>
        </div>
      </header>
    </>
  );
}
