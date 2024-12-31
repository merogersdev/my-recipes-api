import Layout from "../../layout/Layout";
import { Button } from "../../components/buttons/Buttons";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
} from "../../components/typography/Typography";

export default function Home() {
  return (
    <Layout>
      <div>
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
        <H5>Heading 5</H5>
        <H6>Heading 6</H6>
        <P>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis
          impedit quos, eveniet praesentium ex velit ab harum consequatur,
          voluptatem et pariatur! Ratione, fugiat dignissimos. Totam facere
          asperiores dolores culpa in!
        </P>
        <P>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis
          impedit quos, eveniet praesentium ex velit ab harum consequatur,
          voluptatem et pariatur! Ratione, fugiat dignissimos. Totam facere
          asperiores dolores culpa in!
        </P>
      </div>
    </Layout>
  );
}
