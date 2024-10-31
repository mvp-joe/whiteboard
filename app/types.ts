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
    delta?: Position
}

export type Position = { x: number, y: number }

