import { Link } from "react-router-dom";

import Layout from "../../layout/Layout";

export default function Home() {
  return (
    <Layout>
      <p>404: Page Not Found</p>
      <Link to="/">Go Back</Link>
    </Layout>
  );
}
