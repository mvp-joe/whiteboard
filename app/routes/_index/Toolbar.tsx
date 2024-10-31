import { useCanRedo, useCanUndo, useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { ActionIcon, Divider, Flex, Group, Paper, Tooltip } from "@mantine/core";
import { ArrowClockwise, ArrowCounterClockwise, Circle, Eraser, Rectangle, Trash } from "@phosphor-icons/react";
import { useWhiteboardStore } from "~/routes/_index/store";
import mut from './liveblock-mutations';

export function Toolbar() {
    const canUndo = useCanUndo()
    const undo = useUndo()
    const canRedo = useCanRedo()           
    const redo = useRedo()
    const select = useWhiteboardStore(s => s.select)
    const selection = useWhiteboardStore(s => s.selection)
    const shapes = useStorage((r) => r.shapes)
    const selectedShapes = shapes?.filter((shape) => selection.includes(shape.id))

    const deleteAll = useMutation((c) => {
        mut.deleteAll(c.storage.get('shapes'))        
    }, [])

    const addRectangle = useMutation((c) => {
        console.log('add rectangle')
        const id = mut.addRectangle(c.storage.get('shapes'))
        select(id, false)        
    }, [])

    const addOval = useMutation((c) => {
        const id = mut.addOval(c.storage.get('shapes'))        
        select(id, false)
    }, [])

    const deleteShapes = useMutation((c, ids: string[]) => {
        mut.deleteShapes(c.storage.get('shapes'), ids)        
    }, [])

    return (
        <Flex align="center" justify="center">
            <Paper withBorder radius="md" shadow="md">
                <Group p={6} gap="xs" >
                    <Tooltip label="Add Rectangle">
                        <ActionIcon variant="transparent" size="lg" onClick={addRectangle}><Rectangle size={20} /></ActionIcon>
                    </Tooltip>
                    <Tooltip label="Add Oval">
                        <ActionIcon variant="transparent" size="lg" onClick={addOval}><Circle size={20} /></ActionIcon>
                    </Tooltip>
                    <Divider orientation="vertical" />
                    <Tooltip label="Delete Selected">
                        <ActionIcon variant="transparent" size="lg" disabled={!selectedShapes || selectedShapes.length == 0} onClick={deleteSelected}><Trash size={20} /></ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete All">
                        <ActionIcon variant="transparent" size="lg" onClick={deleteAll}><Eraser size={22} /></ActionIcon>
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
    
    function deleteSelected() {
        deleteShapes(selection)
    }
}