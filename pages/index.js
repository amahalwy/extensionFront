import { PrismaClient } from "@prisma/client";
import { Box } from "@chakra-ui/react";
const prisma = new PrismaClient();

export default function Home(props) {
  console.log(props.recordings);
  return <Box>Index</Box>;
}

export async function getStaticProps() {
  const recordings = await prisma.recording.findMany();

  recordings.forEach(
    (recording) => (recording["createdAt"] = recording["createdAt"].toJSON())
  );
  return {
    props: {
      recordings,
    },
  };
}
