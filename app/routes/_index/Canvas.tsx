import { DndContext, DragMoveEvent, PointerSensor, useSensor } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { LoadingOverlay, Paper } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useState } from "react";
import { BoundingBox, Delta, Position } from "~/types";
import mut from './liveblock-mutations';
import { SelectionBox } from "./SelectionBox";
import { OvalShape, RectangleShape } from "./Shapes";
import { useWhiteboardStore } from "./store";

export function Canvas() {
    const setMoveDelta = useWhiteboardStore(state => state.setMoveDelta)
    const resetMoveDelta = useWhiteboardStore(state => state.resetMoveDelta)
    const setSizeDelta = useWhiteboardStore(state => state.setSizeDelta)
    const resetSizeDelta = useWhiteboardStore(state => state.resetSizeDelta)
    const deselectAll = useWhiteboardStore(state => state.deselectAll)
    const select = useWhiteboardStore(state => state.select)

    const sizeDelta = useWhiteboardStore(state => state.sizeDelta)
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

    const resizeShapes = useMutation((c, ids: string[], sizeDelta: BoundingBox) => {
        mut.resizeShapes(c.storage.get('shapes'), ids, sizeDelta)        
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
                        return <RectangleShape key={shape.id} shape={shape} delta={selected ? delta : undefined} />
                    } else if (shape.type === 'oval') {
                        return <OvalShape key={shape.id} shape={shape} delta={selected ? delta : undefined} />
                    } else {
                        return null
                    }
                })}
                
                <SelectionBox selectedShapes={selectedShapes} delta={delta} isDragging={isDragging} />
                
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
        resizeShapes(selection, sizeDelta)
        resetMoveDelta()
        resetSizeDelta()
        setIsDragging(false)
    }

    function handleDragMove({ delta, active }: DragMoveEvent) {
        const id = active?.id.toString()
        if (id && id.startsWith('resize-handle')) {            
            const location = id.split(':').pop()
            const { x, y } = delta
            if (location === 'top-left') {
                setSizeDelta({ left: x, top: y, bottom: 0, right: 0 })
            } else if (location === 'top-right') {
                setSizeDelta({ right: x, top: y, bottom: 0, left: 0 })
            } else if (location === 'bottom-left') {
                setSizeDelta({ left: x, bottom: y, top: 0, right: 0 })
            } else if (location === 'bottom-right') {
                setSizeDelta({ right: x, bottom: y, top: 0, left: 0 })
            } else if (location === 'top') {
                setSizeDelta({ top: y, bottom: 0, left: 0, right: 0 })
            } else if (location === 'left') {
                setSizeDelta({ left: x, right: 0, top: 0, bottom: 0 })
            } else if (location === 'bottom') {
                setSizeDelta({ bottom: y, top: 0, left: 0, right: 0 })
            } else if (location === 'right') {
                setSizeDelta({ right: x, left: 0, top: 0, bottom: 0 })
            }
        } else {
            setMoveDelta(delta)
        }
    }

    function handleDragCancel() {
        resetMoveDelta()
        resetSizeDelta()
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
