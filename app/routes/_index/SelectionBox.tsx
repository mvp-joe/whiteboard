
import { Box } from "@mantine/core";
import { Position, Shape } from "~/types";

type SelectionBoxProps = {
    selectedShapes?: Shape[]
    delta: Position
    isDragging?: boolean
}

export function SelectionBox({ selectedShapes, delta, isDragging }: SelectionBoxProps) {
    if (!selectedShapes || selectedShapes.length === 0) {
        return null
    }

    const top = Math.min(...selectedShapes.map((shape) => shape.top)) + delta.y
    const left = Math.min(...selectedShapes.map((shape) => shape.left)) + delta.x
    const bottom = Math.max(...selectedShapes.map((shape) => shape.top + shape.height)) + delta.y
    const right = Math.max(...selectedShapes.map((shape) => shape.left + shape.width)) + delta.x

    const width = right - left
    const height = bottom - top

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
    const cursor = location === 'top-left' || location === 'bottom-right' ? 'nwse-resize' : 'nesw-resize';
    const bottom = location === 'bottom-left' || location === 'bottom-right' ? -5 : undefined;
    const right = location === 'top-right' || location === 'bottom-right' ? -5 : undefined;
    const top = location === 'top-left' || location === 'top-right' ? -5 : undefined;
    const left = location === 'top-left' || location === 'bottom-left' ? -5 :
        location === 'top-right' || location === 'bottom-right' ? undefined : undefined;
    return (
        <Box
            pos="absolute"
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
        />
    )
}
