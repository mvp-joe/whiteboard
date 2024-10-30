import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { Stack } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { Canvas } from "~/routes/_index/Canvas";
import { Toolbar } from "~/routes/_index/Toolbar";

export const meta: MetaFunction = () => {
  return [
    { title: "Whiteboard" },
    { name: "description", content: "Whiteboard Takehome Assignment" },
  ];
};

export default function Index() {
  return (
    <RoomProvider id="whiteboard"
      initialStorage={{
        shapes: new LiveList([])
      }}
    >
      <ClientSideSuspense fallback={<p>Loading...</p>} >
        <Stack p="lg" h="100vh" w="100vw" pos="relative" bg="gray.2">
          <Toolbar />
          <Canvas />
        </Stack>
      </ClientSideSuspense>
    </RoomProvider>
  );
}

