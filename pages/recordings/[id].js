// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import React from "react";
import { PrismaClient } from "@prisma/client";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";

const prisma = new PrismaClient();

export const getServerSideProps = async ({ params }) => {
  const recording = await prisma.recording.findUnique({
    where: {
      id: Number(params.id),
    },
  });
  recording["createdAt"] = recording["createdAt"].toJSON();

  return {
    props: {
      recording,
    },
  };
};

export default function Recording(props) {
  const [recording, setRecording] = React.useState(props.recording);
  console.log(recording);

  return (
    <Box h="100%">
      <Box bg="white" p={5} shadow="md" borderWidth="1px" m="1%">
        <Heading m="2%">
          Recording for:{" "}
          <Text fontSize="24px" fontStyle="italic" color="rgb(60, 100, 255)">
            {recording.screenUrl}
          </Text>
        </Heading>
      </Box>

      <Stack direction={["row"]} m="2% auto">
        <Box
          bg="white"
          p={5}
          shadow="md"
          borderWidth="1px"
          m="0 1%"
          w={["100%"]}
          h="100%"
        >
          <ReactPlayer
            url={recording.screenUrl}
            controls={true}
            width="100%"
            height="100%"
          />
        </Box>

        <Box
          bg="white"
          p={5}
          shadow="md"
          borderWidth="1px"
          m="2% 1%"
          h="666px"
          w={["100%", "40%"]}
          overflowY="scroll"
        >
          <Heading mb="2%">Timeline</Heading>
          <Accordion allowToggle>
            {recording.events.map((ev) => {
              return (
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Message: <i>{ev.level}</i>
                    </Box>
                    <Box textAlign="right">{ev.time}</Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    Details of each event line
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Box>
      </Stack>
    </Box>
  );
}
