import { DndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useMutation, useStorage } from "@liveblocks/react";
import { LoadingOverlay, Paper } from "@mantine/core";
import { useState } from "react";
import { RectangleShape } from "~/routes/_index/RectangleShape";
import { SelectionBox } from "~/routes/_index/SelectionBox";
import { Position } from "~/types";
import { useWhiteboardStore } from "./store";

export function Canvas() {
    const setMoveDelta = useWhiteboardStore(state => state.setMoveDelta)
    const resetMoveDelta = useWhiteboardStore(state => state.resetMoveDelta)
    const moveDelta = useWhiteboardStore(state => state.moveDelta)
    const selection = useWhiteboardStore(state => state.selection)    
    const deselectAll = useWhiteboardStore(state => state.deselectAll)
    const [isDragging, setIsDragging] = useState(false)

    const shapes = useStorage((r) => r.shapes)
    const selecteedShapes = shapes?.filter((shape) => selection.includes(shape.id))

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
        <Paper withBorder shadow="sm" h="100%" radius="sm" pos="relative" onClick={deselectAll}>
            <DndContext
                modifiers={[restrictToParentElement]}
                onDragStart={() => {
                    setIsDragging(true)
                }}
                onDragEnd={() => {
                    moveShapes(selection, moveDelta)
                    resetMoveDelta()
                    setIsDragging(false)
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
                
                <SelectionBox selectedShapes={selecteedShapes} delta={moveDelta} isDragging={isDragging} />
                
                <LoadingOverlay visible={!shapes} loaderProps={{ type: 'dots', size: 'lg' }} />
            </DndContext>
        </Paper>
    )
}
