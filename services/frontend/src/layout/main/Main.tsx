import type { ReactNode } from "react";

import "./Main.scss";

type MainProps = {
  children: ReactNode;
};

export default function Main({ children }: MainProps) {
  return (
    <main className="main">
      <div className="main__container">{children}</div>
    </main>
  );
}
