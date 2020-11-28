import { PrismaClient } from "@prisma/client";
import { Box } from "@chakra-ui/react";
const prisma = new PrismaClient();

export default function Home(props) {
  return <Box>Hello</Box>;
}

export async function getStaticProps() {
  const recordings = await prisma.recording.findMany();
  return {
    props: {
      recordings,
    },
  };
}
