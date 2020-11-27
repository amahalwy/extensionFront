// import { PrismaClient } from "@prisma/client";

function Page(props) {
  return <p>hello world</p>;
}

export default Page;

export const getStaticProps = () => ({
  props: {
    hello: "world",
  },
});
