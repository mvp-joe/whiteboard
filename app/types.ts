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
}

export type Delta = {
    pos: Position
    size: BoundingBox
}

export type BoundingBox = {
    top: number
    left: number
    bottom: number
    right: number
}

export type Position = { x: number, y: number }

