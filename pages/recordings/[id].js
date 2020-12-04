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
  const [playing, setPlaying] = React.useState(false);

  const playerRef = React.createRef();
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
            ref={playerRef}
            playing={playing}
            playsinline={true}
            controls={true}
            url={recording.screenUrl}
            width="100%"
            height="100%"
            onSeek={() => setPlaying(false)}
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
          <Box>
            {recording.events.map((ev, i) => {
              return (
                <Box
                  bg="white"
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  m="1%"
                  cursor="pointer"
                  _hover={{ bg: "rgb(230, 230, 230)" }}
                  onClick={() => {
                    playerRef.current.seekTo(
                      ((ev.time - startTime) / 1000).toFixed(2),
                      "seconds"
                    );
                  }}
                >
                  <Box>
                    <Flex justifyContent="space-between">
                      {ev.fetchData ? (
                        <Box>
                          <Text display="inline">HTTP Request: </Text>
                          <Text
                            color="rgb(255, 0, 0)"
                            display="inline-block"
                            fontStyle="italic"
                          >
                            {ev.fetchData.method}
                          </Text>
                        </Box>
                      ) : (
                        <Box>
                          <Text display="inline">Server response: </Text>
                          <Text
                            color="rgb(255, 0, 0)"
                            display="inline-block"
                            fontStyle="italic"
                          >
                            {ev.level}
                          </Text>
                        </Box>
                      )}
                      {ev.fetchData &&
                      ev.fetchData.url.includes("authenticate") ? (
                        <Text
                          textAlign="right"
                          display="inline-block"
                          fontStyle="italic"
                        >
                          Initiated
                        </Text>
                      ) : (
                        <Text
                          textAlign="right"
                          display="inline-block"
                          fontStyle="italic"
                        >
                          +{((ev.time - startTime) / 1000).toFixed(2)} s
                        </Text>
                      )}
                    </Flex>
                  </Box>
                  <Box>
                    {ev.fetchData ? (
                      <Box>
                        <Text display="inline" fontWeight="bold">
                          Request to:{" "}
                        </Text>
                        <Text display="inline" textDecor="underline">
                          {ev.fetchData.url}
                        </Text>
                      </Box>
                    ) : (
                      <Box>
                        <Text display="inline" fontWeight="bold">
                          Response:{" "}
                        </Text>
                        <Text display="inline">{ev.args[0]}</Text>
                      </Box>
                    )}
                  </Box>
                  <Box pb={4}>
                    {ev.fetchData &&
                    ev.args[1] &&
                    ev.args[1].body &&
                    (JSON.parse(ev.args[1].body).platform ||
                      JSON.parse(ev.args[1].body).code_a) ? (
                      <Box mt="6px">
                        <Box>Body: </Box>
                        {Object.keys(JSON.parse(ev.args[1].body)).map((key) => {
                          if (
                            typeof JSON.parse(ev.args[1].body)[key] !== "object"
                          ) {
                            return (
                              <Box ml="10px">
                                <Text display="inline" fontWeight="bold">
                                  {key}:{" "}
                                </Text>
                                <Text display="inline">
                                  {JSON.parse(ev.args[1].body)[key]}
                                </Text>
                              </Box>
                            );
                          }
                          if (
                            typeof JSON.parse(ev.args[1].body)[key] === "object"
                          ) {
                            for (var k in JSON.parse(ev.args[1].body)[key]) {
                              return (
                                <Box ml="10px">
                                  <Text display="inline" fontWeight="bold">
                                    {k}:{" "}
                                  </Text>
                                  <Text display="inline">
                                    {JSON.parse(ev.args[1].body)[key][k]}
                                  </Text>
                                </Box>
                              );
                            }
                          }
                        })}
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
