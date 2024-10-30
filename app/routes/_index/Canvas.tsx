import { DndContext } from "@dnd-kit/core";
import { useMutation, useStorage } from "@liveblocks/react";
import { Paper } from "@mantine/core";
import { RectangleShape } from "~/routes/_index/RectangleShape";
import { Position } from "~/types";
import { useWhiteboardStore } from "./store";

export function Canvas() {
    const setMoveDelta = useWhiteboardStore(state => state.setMoveDelta)
    const resetMoveDelta = useWhiteboardStore(state => state.resetMoveDelta)
    const moveDelta = useWhiteboardStore(state => state.moveDelta)
    const selection = useWhiteboardStore(state => state.selection)

    const shapes = useStorage((r) => r.shapes)

    const moveShapes = useMutation((c, selected: string[], moveDelta: Position) => {        
        const shapes = c.storage.get('shapes')        
        if (shapes) {
            shapes.forEach((shape, index) => {
                if (selected.includes(shape.id)) {
                    shapes.set(index, { ...shape, top: shape.top + moveDelta.y, left: shape.left + moveDelta.x })
                }
            })
        }        
    }, [])    

    return (
        <Paper withBorder shadow="sm" h="100%" radius="sm" pos="relative">
            <DndContext  onDragEnd={({ delta }) => {
                console.log('onDragEnd', delta, moveDelta)
                moveShapes(selection, moveDelta)              
                resetMoveDelta()                
            }}
                onDragMove={({ delta }) => {
                    console.log('onDragMove', delta)
                    setMoveDelta(delta)
                }}
                onDragCancel={() => {
                    resetMoveDelta()
                }}
            >             
                {shapes && shapes.map((shape) => {
                    const selected = selection.includes(shape.id)
                    if (shape.type === 'rectangle') {
                        return <RectangleShape key={shape.id} shape={shape} delta={selected ? moveDelta : undefined} />
                    } else {
                        return null
                    }
                })}
            </DndContext>
        </Paper>
    )
}
