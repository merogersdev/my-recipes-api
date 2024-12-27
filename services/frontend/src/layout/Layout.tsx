import type { ReactNode } from "react";

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Main from "./main/Main";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header title="My Recipes" />
      <Sidebar />
      <Main>{children}</Main>
      {/* <Footer /> */}
    </>
  );
}
