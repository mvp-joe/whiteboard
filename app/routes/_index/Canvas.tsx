import { DndContext, DragMoveEvent, PointerSensor, useSensor } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useMutation, useStorage } from "@liveblocks/react";
import { LoadingOverlay, Paper } from "@mantine/core";
import { useState } from "react";
import { Position } from "~/types";
import { SelectionBox } from "./SelectionBox";
import { OvalShape, RectangleShape } from "./Shapes";
import { useWhiteboardStore } from "./store";

export function Canvas() {
    const setMoveDelta = useWhiteboardStore(state => state.setMoveDelta)
    const resetMoveDelta = useWhiteboardStore(state => state.resetMoveDelta)
    const moveDelta = useWhiteboardStore(state => state.moveDelta)
    const selection = useWhiteboardStore(state => state.selection)    
    const deselectAll = useWhiteboardStore(state => state.deselectAll)
    const [isDragging, setIsDragging] = useState(false)

    const shapes = useStorage((r) => r.shapes)
    const selectedShapes = shapes?.filter((shape) => selection.includes(shape.id))

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

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10
        }
    })
     
    return (
        <Paper withBorder shadow="sm" h="100%" radius="sm" pos="relative" onClick={handleCanvasClick} >
            <DndContext
                sensors={[pointerSensor]}
                modifiers={[restrictToParentElement]}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
                onDragCancel={handleDragCancel}   
            >

                {shapes && shapes.map((shape) => {
                    const selected = selection.includes(shape.id)
                    if (shape.type === 'rectangle') {
                        return <RectangleShape key={shape.id} shape={shape} delta={selected ? moveDelta : undefined} />
                    } else if (shape.type === 'oval') {
                        return <OvalShape key={shape.id} shape={shape} delta={selected ? moveDelta : undefined} />
                    } else {
                        return null
                    }
                })}
                
                <SelectionBox selectedShapes={selectedShapes} delta={moveDelta} isDragging={isDragging} />
                
                <LoadingOverlay visible={!shapes} loaderProps={{ type: 'dots', size: 'lg' }} />
            </DndContext>
        </Paper>
    )
    
    function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            deselectAll()
        }
    }

    function handleDragStart() {
        setIsDragging(true)
    }

    function handleDragEnd() {
        moveShapes(selection, moveDelta)
        resetMoveDelta()
        setIsDragging(false)
    }

    function handleDragMove({ delta }: DragMoveEvent) {
        setMoveDelta(delta)
    }

    function handleDragCancel() {
        resetMoveDelta()
        setIsDragging(false)
    }
}
