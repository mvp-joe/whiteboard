import { useCanRedo, useCanUndo, useMutation, useRedo, useUndo } from "@liveblocks/react";
import { ActionIcon, Divider, Flex, Group, Paper, Tooltip } from "@mantine/core";
import { ArrowClockwise, ArrowCounterClockwise, Eraser, Rectangle } from "@phosphor-icons/react";
import { v4 as uuid } from 'uuid';

export function Toolbar() {
    const canUndo = useCanUndo()
    const undo = useUndo()
    const canRedo = useCanRedo()
    const redo = useRedo()
  
    const eraseAll = useMutation((c) => {
      c.storage.get('shapes').clear()    
    }, [])
  
    const addRectangle = useMutation((c) => {
      c.storage.get('shapes').push({ id: uuid(), type: 'rectangle', top: 20, left: 20, width: 100, height: 100 })
    }, [])
  
    return (
      <Flex align="center" justify="center">
        <Paper withBorder radius="md" shadow="md">
          <Group p={6} gap="xs" >
            <Tooltip label="Add Rectangle">
              <ActionIcon variant="transparent" size="lg" onClick={addRectangle}><Rectangle size={20} /></ActionIcon>
            </Tooltip>          
            <Divider orientation="vertical" />          
            <Tooltip label="Erase All">
              <ActionIcon variant="transparent" size="lg" onClick={eraseAll}><Eraser size={22} /></ActionIcon>
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