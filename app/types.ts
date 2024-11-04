export type Shape = {
    id: string
    type: ShapeType
    top: number
    left: number
    width: number
    height: number
}

export type ShapeType = 'rectangle' | 'oval'

export interface ShapeProps {
    shape: Shape
    delta?: Delta
    originalSize?: BoundingBox
}

export type Delta = {
    pos: Position
    scale: Scale
    size: BoundingBox
}

export type BoundingBox = {
    top: number
    left: number
    bottom: number
    right: number
    width: number
    height: number
}

export type Position = { x: number, y: number }

export type Scale = { top: number, left: number, bottom: number, right: number }