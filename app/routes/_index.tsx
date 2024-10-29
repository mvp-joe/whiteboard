import { Box, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Whiteboard" },
    { name: "description", content: "Whiteboard Takehome Assignment" },
  ];
};

export default function Index() {
  return (
    <Box p="lg">
      <Title>Hi world!</Title>
    </Box>
  );
}

