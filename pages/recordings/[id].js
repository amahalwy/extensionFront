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
  const [startTime, setStart] = React.useState(
    recording.events[0].startTimestamp
  );
  console.log(recording);

  const showColor = (event) => {
    switch (event.level) {
      case "log":
        return "black";
      case "warn":
        return "rgb(224, 172, 0)";
      case "error":
        return "rgb(255, 0, 0)";
      default:
        break;
    }
  };

  const showBottom = (event) => {
    if (event.fetchData) {
      return (
        <Box>
          <Box>
            <span>
              HTTP Method:{" "}
              <Text display="inline" fontWeight="bold">
                {event.fetchData.method}
              </Text>
            </span>
          </Box>
          <Box>
            <span>
              Request to:{" "}
              <Text display="inline" textDecor="underline">
                {event.fetchData.url}
              </Text>
            </span>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box>
          <Box>
            <span>
              Response:{" "}
              <Text display="inline" fontWeight="bold">
                {event.args[0]}
              </Text>
            </span>
          </Box>
        </Box>
      );
    }
  };

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
          {recording.events.length > 14 ? (
            <Text
              ml="10px"
              mb="6px"
              fontStyle="italic"
              fontSize="18px"
              display="inline-block"
            >
              (scrollable)
            </Text>
          ) : (
            ""
          )}
          <Accordion allowToggle>
            {recording.events.map((ev) => {
              return (
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Message:{" "}
                      {ev.fetchData ? (
                        <Text
                          color="rgb(21, 136, 21)"
                          fontStyle="italic"
                          display="inline-block"
                        >
                          sucess
                        </Text>
                      ) : (
                        <Text
                          color={showColor(ev)}
                          display="inline-block"
                          fontStyle="italic"
                        >
                          {ev.level}
                        </Text>
                      )}
                    </Box>
                    <Box>
                      {ev.fetchData &&
                      ev.fetchData.url.includes("authenticate") ? (
                        <Text textAlign="right" fontStyle="italic">
                          Initiated
                        </Text>
                      ) : ev.level === "warn" || ev.level === "error" ? (
                        <Text>
                          {((ev.time - startTime) / 1000).toFixed(2)} s
                        </Text>
                      ) : (
                        ""
                      )}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>{showBottom(ev)}</AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Box>
      </Stack>
    </Box>
  );
}
