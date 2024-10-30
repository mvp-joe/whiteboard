export type Shape = {
    id: string
    type: 'rectangle' | 'circle'
    top: number
    left: number
    width: number
    height: number
}

export interface ShapeProps {
    shape: Shape
    delta?: Position
}

export type Position = { x: number, y: number }

