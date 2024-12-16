import { Link } from "react-router-dom";

import Header from "../../layout/header/Header";
import Main from "../../layout/main/Main";
import Footer from "../../layout/footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Main>
        <p>404: Page Not Found</p>
        <Link to="/">Go Back</Link>
      </Main>
      <Footer />
    </>
  );
}
