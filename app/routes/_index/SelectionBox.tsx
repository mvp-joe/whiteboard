
import { useDraggable } from "@dnd-kit/core";
import { Box } from "@mantine/core";
import { resizeShape } from "~/routes/_index/Shapes";
import { Delta, Shape } from "~/types";

import classes from './SelectionBox.module.css';

type SelectionBoxProps = {
    selectedShapes?: Shape[]
    delta: Delta
    isDragging?: boolean
}

const RESIZE_HANDLE_SIZE = 10
const RESIZE_HANDLE_HALF_SIZE = RESIZE_HANDLE_SIZE / 2

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
                pointerEvents: 'none',                
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

    const left = location === 'top-left' || location === 'bottom-left' || location === 'left' ? -RESIZE_HANDLE_HALF_SIZE : undefined;    

    return (
        <Box
            className={classes.resizeHandle}
            pos="absolute"
            ref={setNodeRef}
            style={{
                pointerEvents: 'all',
                top: top(location, height),
                left,
                bottom: bottom(location, height),
                right: right(location, width),
                width: RESIZE_HANDLE_SIZE,
                height: RESIZE_HANDLE_SIZE,
                cursor: cursor(location),             
            }}   
            bd="1px solid blue.4"            
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
            return -RESIZE_HANDLE_HALF_SIZE
        case 'bottom-left':
        case 'bottom-right':
        case 'bottom':
            return undefined
        case 'left':
        case 'right':
            return height / 2 - RESIZE_HANDLE_HALF_SIZE
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
            return -RESIZE_HANDLE_HALF_SIZE
        case 'left':
        case 'right':
            return height / 2 - RESIZE_HANDLE_HALF_SIZE
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
            return -RESIZE_HANDLE_HALF_SIZE
        case 'top':
        case 'bottom':
            return width / 2 - RESIZE_HANDLE_HALF_SIZE
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