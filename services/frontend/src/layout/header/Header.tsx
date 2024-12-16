import Nav from "./nav/Nav";

import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <div>Header</div>
        <Nav />
      </div>
    </header>
  );
}
