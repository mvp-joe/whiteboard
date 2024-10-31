import { LiveList } from "@liveblocks/client"
import { v4 as uuid } from 'uuid'
import { Position, Shape, ShapeType } from "~/types"

function moveShapes(shapes: LiveList<Shape> | undefined, ids: string[], moveDelta: Position) {
    if (shapes) {
        shapes.forEach((shape, index) => {
            if (ids.includes(shape.id)) {
                shapes.set(index, { ...shape, top: shape.top + moveDelta.y, left: shape.left + moveDelta.x })
            }
        })
    }
}

function deleteShapes(shapes: LiveList<Shape> | undefined, ids: string[]) {
    if (shapes) {
        ids.forEach((id) => {
            shapes.delete(shapes.findIndex((shape) => shape.id === id))
        })
    }
}

function deleteAll(shapes: LiveList<Shape> | undefined) {
    shapes?.clear()
}

function addRectangle(shapes: LiveList<Shape>) {
    return addShape(shapes, 'rectangle')
}

function addOval(shapes: LiveList<Shape>) {
    return addShape(shapes, 'oval')
}

function addShape(shapes: LiveList<Shape>, type: ShapeType) {
    const id = uuid()
    const { top, left } = findUniqueStartingPosition(shapes)
    shapes.push({ id: id, type: type, top: top, left: left, width: 100, height: 100 })
    return id
}

function findUniqueStartingPosition(shapes: LiveList<Shape>) {
    let top = 20
    let left = 20
    while (shapes.some((shape) => shape.top === top && shape.left === left)) {
        top += 20
        left += 20
    }
    return { top, left }
}

export default { moveShapes, deleteShapes, deleteAll, addRectangle, addOval }