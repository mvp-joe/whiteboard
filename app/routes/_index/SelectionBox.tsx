
import { useDraggable } from "@dnd-kit/core";
import { Box } from "@mantine/core";
import { resizeShape } from "~/routes/_index/Shapes";
import { Delta, Shape } from "~/types";

type SelectionBoxProps = {
    selectedShapes?: Shape[]
    delta: Delta
    isDragging?: boolean
}

export function SelectionBox({ selectedShapes, delta, isDragging }: SelectionBoxProps) {

    if (!selectedShapes || selectedShapes.length === 0) {
        return null
    }

    const pos = delta.pos
    
    // Calculate the bounding box of the selected shapes
    const selectionBox = {
        top: Math.min(...selectedShapes.map((shape) => shape.top)) + pos.y,
        left: Math.min(...selectedShapes.map((shape) => shape.left)) + pos.x,
        bottom: Math.max(...selectedShapes.map((shape) => shape.top + shape.height)) + pos.y,
        right: Math.max(...selectedShapes.map((shape) => shape.left + shape.width)) + pos.x,
    }
    
    // Apply the delta to the selection box
    const resizedShape = resizeShape({
        id: 'selection-box',
        type: 'rectangle',
        top: selectionBox.top,
        left: selectionBox.left,
        width: selectionBox.right - selectionBox.left,
        height: selectionBox.bottom - selectionBox.top
    }, delta)

    const { top, left, width, height } = resizedShape

    return (
        <Box
            bd="1px solid blue.4"
            pos="absolute"
            style={{
                top,
                left,
                width,
                height,
                pointerEvents: 'none'
            }}
        >
            {!isDragging && (
                <>
                    <ResizeHandle location="top-left" />
                    <ResizeHandle location="top-right" />
                    <ResizeHandle location="bottom-left" />
                    <ResizeHandle location="bottom-right" />
                </>
            )}

        </Box>
    )
}

type ResizeHandleProps = {
    location: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

function ResizeHandle({ location }: ResizeHandleProps) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: 'resize-handle:' + location,
        attributes: {
            role: 'resize-handle',            
        },
        data: {
            location
        }
    });

    const cursor = location === 'top-left' || location === 'bottom-right' ? 'nwse-resize' : 'nesw-resize';
    const bottom = location === 'bottom-left' || location === 'bottom-right' ? -5 : undefined;
    const right = location === 'top-right' || location === 'bottom-right' ? -5 : undefined;
    const top = location === 'top-left' || location === 'top-right' ? -5 : undefined;
    const left = location === 'top-left' || location === 'bottom-left' ? -5 :
        location === 'top-right' || location === 'bottom-right' ? undefined : undefined;

    return (
        <Box
            pos="absolute"
            ref={setNodeRef}
            style={{
                pointerEvents: 'all',
                top,
                left,
                bottom,
                right,
                width: 10,
                height: 10,
                cursor: cursor,
            }}
            bg="blue.4"
            {...attributes}
            {...listeners}
        />
    )
}
