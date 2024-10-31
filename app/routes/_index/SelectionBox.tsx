
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
                    <ResizeHandle location="top-left" width={width} height={height} />
                    <ResizeHandle location="top-right" width={width} height={height} />
                    <ResizeHandle location="bottom-left" width={width} height={height} />
                    <ResizeHandle location="bottom-right" width={width} height={height} />
                    <ResizeHandle location="top" width={width} height={height} />
                    <ResizeHandle location="left" width={width} height={height} />
                    <ResizeHandle location="bottom" width={width} height={height} />
                    <ResizeHandle location="right" width={width} height={height} />
                </>
            )}

        </Box>
    )
}

type ResizeHandleProps = {
    location: Location
    width: number
    height: number
}

type Location = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom'

function ResizeHandle({ location, width, height }: ResizeHandleProps) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: 'resize-handle:' + location,
        attributes: {
            role: 'resize-handle',            
        },
        data: {
            location
        }
    });

    const left = location === 'top-left' || location === 'bottom-left' || location === 'left' ? -5 : undefined;

    return (
        <Box
            pos="absolute"
            ref={setNodeRef}
            style={{
                pointerEvents: 'all',
                top: top(location, height),
                left,
                bottom: bottom(location, height),
                right: right(location, width),
                width: 10,
                height: 10,
                cursor: cursor(location),
            }}
            bg="blue.4"
            {...attributes}
            {...listeners}
        />
    )
}

function top(location: Location, height: number) {
    switch (location) {
        case 'top-left':
        case 'top-right':
        case 'top':
            return -5
        case 'bottom-left':
        case 'bottom-right':
        case 'bottom':
            return undefined
        case 'left':
        case 'right':
            return height / 2 - 5
    }
}

function bottom(location: Location, height: number) {
    switch (location) {
        case 'top-left':
        case 'top-right':
        case 'top':
            return undefined
        case 'bottom-left':
        case 'bottom-right':
        case 'bottom':
            return -5
        case 'left':
        case 'right':
            return height / 2 - 5
    }
}

function right(location: Location, width: number) {
    switch (location) {
        case 'top-left':
        case 'bottom-left':
        case 'left':
            return undefined
        case 'top-right':
        case 'bottom-right':
        case 'right':
            return -5
        case 'top':
        case 'bottom':
            return width / 2 - 5
    }
}

function cursor(location: Location) {
    switch (location) {
        case 'top-left':
        case 'bottom-right':
            return 'nwse-resize'
        case 'top-right':
        case 'bottom-left':
            return 'nesw-resize'
        case 'top':
        case 'bottom':
            return 'ns-resize'
        case 'left':
        case 'right':
            return 'ew-resize'
    }
}