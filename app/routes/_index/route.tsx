import { DndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { ActionIcon, Box, Divider, Flex, Group, Paper, Stack, Tooltip } from "@mantine/core";
import { ArrowClockwise, ArrowCounterClockwise, Rectangle } from "@phosphor-icons/react";
import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Whiteboard" },
    { name: "description", content: "Whiteboard Takehome Assignment" },
  ];
};

export default function Index() {
  return (
    <Stack p="lg" h="100vh" w="100vw" pos="relative" bg="gray.2">
      <Toolbar />
      <Canvas />
    </Stack>
  );
}

function Toolbar() {
  return (
    <Flex align="center" justify="center">
      <Paper withBorder radius="md" shadow="md">
        <Group p={6} gap="xs" >
          <Tooltip label="Add Rectangle">
            <ActionIcon variant="transparent" size="lg"><Rectangle size={20} /></ActionIcon>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip label="Undo">
            <ActionIcon variant="transparent" size="lg" ><ArrowCounterClockwise size={20} /> </ActionIcon>
          </Tooltip>
          <Tooltip label="Redo">
            <ActionIcon variant="transparent" size="lg" disabled ><ArrowClockwise size={20} /> </ActionIcon>
          </Tooltip>
        </Group>
      </Paper>
    </Flex>
  )
}

function Canvas() {
  const [pos, setPos] = useState({top: 0, left: 0});
  return (
    <Paper withBorder shadow="sm" h="100%" radius="sm" pos="relative">
      <DndContext onDragEnd={({delta})=> {
        setPos({top: pos.top + delta.y, left: pos.left + delta.x})
      }}>
        {pos && 
          <RectangleShape pos={pos} /> 
        }
      </DndContext>
    </Paper>
  )
}

function RectangleShape({pos}:{pos: {top: number, left: number}}) {
  console.log('pos', pos)
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
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
