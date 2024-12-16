import Sidebar from "../../layout/sidebar/Sidebar";
import Main from "../../layout/main/Main";
// import Footer from "../../layout/footer/Footer";

export default function Home() {
  return (
    <>
      <Main>
        <Sidebar />
        <p>Home Page</p>
      </Main>
      {/* <Footer /> */}
    </>
  );
}
