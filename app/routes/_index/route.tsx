import { DndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense, RoomProvider, useCanRedo, useCanUndo, useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { ActionIcon, Box, Divider, Flex, Group, Paper, Stack, Tooltip } from "@mantine/core";
import { ArrowClockwise, ArrowCounterClockwise, Rectangle } from "@phosphor-icons/react";
import type { MetaFunction } from "@remix-run/node";

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
        rectangles: new LiveList([{
          id: 'rectangle-1',
          top: 0,
          left: 0
        }])
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

function Toolbar() {
  const canUndo = useCanUndo()
  const undo = useUndo()
  const canRedo = useCanRedo()
  const redo = useRedo()
  return (
    <Flex align="center" justify="center">
      <Paper withBorder radius="md" shadow="md">
        <Group p={6} gap="xs" >
          <Tooltip label="Add Rectangle">
            <ActionIcon variant="transparent" size="lg"><Rectangle size={20} /></ActionIcon>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip label="Undo">
            <ActionIcon variant="transparent" size="lg" disabled={!canUndo} ><ArrowCounterClockwise size={20} onClick={undo} /> </ActionIcon>
          </Tooltip>
          <Tooltip label="Redo">
            <ActionIcon variant="transparent" size="lg" disabled={!canRedo} ><ArrowClockwise size={20} onClick={redo} /> </ActionIcon>
          </Tooltip>
        </Group>
      </Paper>
    </Flex>
  )
}

type Position = { top: number, left: number }

function Canvas() {  
  const rectangles = useStorage((r) => r.rectangles)
  
  const setPos = useMutation((c, pos: Position) => {    
    const rects = c.storage.get('rectangles')
    const r1 = rects.length > 0 && rects.get(0)
    if (r1) {    
      c.storage.get('rectangles').set(0, { id: r1.id, top: pos.top, left: pos.left })
    }
  }, [])

  if (!rectangles) return null

  const pos = rectangles[0]
  return (
    <Paper withBorder shadow="sm" h="100%" radius="sm" pos="relative">
      <DndContext onDragEnd={({ delta }) => {
        setPos({ top: pos.top + delta.y, left: pos.left + delta.x })
      }}>
        {pos &&
          <RectangleShape pos={pos} />
        }
      </DndContext>
    </Paper>
  )
}

function RectangleShape({ pos }: { pos: { top: number, left: number } }) {
  console.log('pos', pos)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'rectangle',
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    width: '100px',
    height: '100px',
  }

  return (
    <Box pos="absolute" top={pos.top} left={pos.left} ref={setNodeRef} bd="1px solid dark.4" style={style} {...listeners} {...attributes}>

    </Box>
  )

}
