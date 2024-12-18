import "./Header.scss";

export default function Header() {
  return (
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
  );
}
