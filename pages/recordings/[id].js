// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import React from "react";
import { PrismaClient } from "@prisma/client";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";

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
  const [events, setEvents] = React.useState(
    JSON.parse(props.recording.events)
  );
  const [first, setFirst] = React.useState(events[0]);
  console.log(events[0]);

  return (
    <Stack direction={["row"]} spacing="40px" m="2% auto">
      <Box bg="white" p={5} shadow="md" borderWidth="1px">
        <Box mb="24px">
          <Heading>Details</Heading>
          <Flex ml="4px">
            <Text color="rgb(255, 0, 0)" mr="20px">
              Error
            </Text>
            <Text color="rgb(39, 196, 39)">No error</Text>
          </Flex>
        </Box>
        <Box m="5px">
          <Flex mb="5px">
            <Text mr="5px" fontWeight="bold">
              Request:
            </Text>
            <Text textDecor="italic">
              <i>{events[0]["args"][0]}</i>
            </Text>
          </Flex>
          <Flex>
            <Text mr="5px" fontWeight="bold">
              Started at:
            </Text>
            <Text textDecor="italic">
              <i>{new Date(events[0]["startTimestamp"]).toString()}</i>
            </Text>
          </Flex>
        </Box>
        <Flex>
          <Box w="60%" ml="5px">
            <Text fontSize="14px">Event</Text>
            {events.map((ev) => {
              let color = "";
              if (!ev["level"]) {
                return "";
              } else {
                if (ev["level"] === "log") {
                  color = "rgb(39, 196, 39)";
                }
                if (ev["level"] === "error") {
                  color = "rgb(255, 0, 0)";
                }
              }
              return (
                <Text key={ev.id} color={color}>
                  {ev["args"][0]}
                </Text>
              );
            })}
          </Box>
          <Box w="40%">
            <Text fontSize="14px">Event</Text>
            {events.map((ev) => {
              if (ev["time"]) {
                return (
                  <Text key={ev.id}>
                    {Number(
                      (ev["time"] - first["startTimestamp"]) / 1000
                    ).toFixed(2)}{" "}
                    seconds ago
                  </Text>
                );
              } else if (ev["startTimestamp"]) {
                return "";
              } else {
                return (
                  <Box>
                    <Text>n/a</Text>
                  </Box>
                );
              }
            })}
          </Box>
        </Flex>
      </Box>
      <Box bg="white" p={5} shadow="md" borderWidth="1px">
        <Box mb="24px">
          <Heading>Details</Heading>
          <Flex ml="4px">
            <Text color="rgb(255, 0, 0)" mr="20px">
              Error
            </Text>
            <Text color="rgb(39, 196, 39)">No error</Text>
          </Flex>
        </Box>
        <Box m="5px">
          <Flex mb="5px">
            <Text mr="5px" fontWeight="bold">
              Request:
            </Text>
            <Text textDecor="italic">
              <i>{events[0]["args"][0]}</i>
            </Text>
          </Flex>
          <Flex>
            <Text mr="5px" fontWeight="bold">
              Started at:
            </Text>
            <Text textDecor="italic">
              <i>{new Date(events[0]["startTimestamp"]).toString()}</i>
            </Text>
          </Flex>
        </Box>
        <Flex>
          <Box w="60%" ml="5px">
            <Text fontSize="14px">Event</Text>
            {events.map((ev) => {
              let color = "";
              if (!ev["level"]) {
                return "";
              } else {
                if (ev["level"] === "log") {
                  color = "rgb(39, 196, 39)";
                }
                if (ev["level"] === "error") {
                  color = "rgb(255, 0, 0)";
                }
              }
              return (
                <Text key={ev.id} color={color}>
                  {ev["args"][0]}
                </Text>
              );
            })}
          </Box>
          <Box w="40%">
            <Text fontSize="14px">Event</Text>
            {events.map((ev) => {
              if (ev["time"]) {
                return (
                  <Text key={ev.id}>
                    {Number(
                      (ev["time"] - first["startTimestamp"]) / 1000
                    ).toFixed(2)}{" "}
                    seconds ago
                  </Text>
                );
              } else if (ev["startTimestamp"]) {
                return "";
              } else {
                return (
                  <Box>
                    <Text>n/a</Text>
                  </Box>
                );
              }
            })}
          </Box>
        </Flex>
      </Box>
    </Stack>
  );
}
