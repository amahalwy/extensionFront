// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getServerSideProps = async ({ params }) => {
  const recording = await prisma.recording.findUnique({
    where: {
      id: Number(params.id),
    },
  });
  return {
    props: {
      recording,
    },
  };
};

export default function Recording(props) {
  return <p>{props.recording.screenUrl}</p>;
}
