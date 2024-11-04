import { DndContext, DragMoveEvent, PointerSensor, useSensor } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { LoadingOverlay, Paper } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useState } from "react";
import { boundingBox } from "~/routes/_index/shape-utils";
import { BoundingBox, Delta, Position, Scale } from "~/types";
import mut from './liveblock-mutations';
import { SelectionBox } from "./SelectionBox";
import { OvalShape, RectangleShape } from "./Shapes";
import { useWhiteboardStore } from "./store";

export function Canvas() {
    const setMoveDelta = useWhiteboardStore(state => state.setMoveDelta)
    const resetMoveDelta = useWhiteboardStore(state => state.resetMoveDelta)
    const setScaleDelta = useWhiteboardStore(state => state.setScaleDelta)
    const resetScaleDelta = useWhiteboardStore(state => state.resetscaleDelta)
    const resetSizeDelta = useWhiteboardStore(state => state.resetSizeDelta)
    const deselectAll = useWhiteboardStore(state => state.deselectAll)
    const originalSize = useWhiteboardStore(state => state.originalSize)
    const setOriginalSize = useWhiteboardStore(state => state.setOriginalSize)
    const select = useWhiteboardStore(state => state.select)

    const sizeDelta = useWhiteboardStore(state => state.sizeDelta)
    const scaleDelta = useWhiteboardStore(state => state.scaleDelta)
    const moveDelta = useWhiteboardStore(state => state.moveDelta)
    const selection = useWhiteboardStore(state => state.selection)

    const [isDragging, setIsDragging] = useState(false)

    const shapes = useStorage((r) => r.shapes)
    const selectedShapes = shapes?.filter((shape) => selection.includes(shape.id))

    const undo = useUndo()
    const redo = useRedo()

    useHotkeys([
        ['Backspace', deleteSelectedShapes],
        ['Delete', deleteSelectedShapes],
        ['mod+z', undo],
        ['mod+shift+z', redo],
        ['mod+d', duplicateSelectedShapes],
    ])

    const moveShapes = useMutation((c, ids: string[], moveDelta: Position) => {
        mut.moveShapes(c.storage.get('shapes'), ids, moveDelta)
    }, [])

    const resizeShapes = useMutation((c, ids: string[], originalSize: BoundingBox, scaleDelta: Scale) => {
        mut.resizeShapes(c.storage.get('shapes'), ids, originalSize, scaleDelta)
    }, [])

    const deleteShapes = useMutation((c, ids: string[]) => {
        mut.deleteShapes(c.storage.get('shapes'), ids)
    }, [])

    const duplicateShapes = useMutation((c, ids: string[]) => {
        if (!ids || ids.length === 0) return
        const newIds = mut.duplicateShapes(c.storage.get('shapes'), ids)
        select(newIds[0], false)
    }, [])

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10
        }
    })

    const delta: Delta = {
        pos: moveDelta,
        size: sizeDelta,
        scale: scaleDelta
    }

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
                        return <RectangleShape
                            key={shape.id}
                            shape={shape}
                            delta={selected ? delta : undefined}
                            originalSize={originalSize}
                        />
                    } else if (shape.type === 'oval') {
                        return <OvalShape
                            key={shape.id}
                            shape={shape}
                            delta={selected ? delta : undefined}
                            originalSize={originalSize}
                        />
                    } else {
                        return null
                    }
                })}

                <SelectionBox selectedShapes={selectedShapes} delta={delta} originalSize={originalSize} isDragging={isDragging} />

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
        if (selectedShapes) {
            setOriginalSize(boundingBox(selectedShapes))
        }
    }

    function handleDragEnd() {
        moveShapes(selection, moveDelta)
        resizeShapes(selection, originalSize, scaleDelta)
        resetMoveDelta()
        resetSizeDelta()
        resetScaleDelta()
        setIsDragging(false)
    }

    function handleDragMove({ delta, active }: DragMoveEvent) {
        const id = active?.id.toString()
        if (id && id.startsWith('resize-handle')) {
            const location = id.split(':').pop()
            
            const scaleX = delta.x / originalSize.width;
            const scaleY = delta.y / originalSize.height;
            
            if (location === 'top-left') {                
                setScaleDelta({ top: scaleY, left: scaleX, bottom: 0, right: 0 })
            } else if (location === 'top-right') {
                setScaleDelta({ top: scaleY, right: scaleX, bottom: 0, left: 0 })
            } else if (location === 'bottom-left') {
                setScaleDelta({ bottom: scaleY, left: scaleX, top: 0, right: 0 })
            } else if (location === 'bottom-right') {                
                setScaleDelta({ bottom: scaleY, right: scaleX, top: 0, left: 0 })                
            } else if (location === 'top') {                
                setScaleDelta({ top: scaleY, left: 0, right: 0, bottom: 0 })
            } else if (location === 'left') {                
                setScaleDelta({ left: scaleX, top: 0, right: 0, bottom: 0 })
            } else if (location === 'bottom') {                
                setScaleDelta({ bottom: scaleY, top: 0, left: 0, right: 0 })
            } else if (location === 'right') {
                setScaleDelta({ right: scaleX, top: 0, left: 0, bottom: 0 })                
            }
        } else {
            setMoveDelta(delta)
        }
    }

    function handleDragCancel() {
        resetMoveDelta()
        resetSizeDelta()
        resetScaleDelta()
        setIsDragging(false)
    }

    function deleteSelectedShapes() {
        deleteShapes(selection)
        deselectAll()
    }

    function duplicateSelectedShapes() {
        duplicateShapes(selection)
    }
}
