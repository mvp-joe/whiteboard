import { BoundingBox, Scale, Shape } from "~/types";

export function boundingBox(shapes: Shape[]) {
    const top = Math.min(...shapes.map((shape) => shape.top));
    const left = Math.min(...shapes.map((shape) => shape.left));
    const bottom = Math.max(...shapes.map((shape) => shape.top + shape.height));
    const right =  Math.max(...shapes.map((shape) => shape.left + shape.width));
    const width = right - left;
    const height = bottom - top;
    return {
        top, left, bottom, right,
        width, height,
    }    
}


export function resizeShape(shape: Shape, originalSize: BoundingBox, scaleDelta: Scale) : Shape {
    let {top, left, width, height} = shape
    
    if (scaleDelta.top) {
        const bottom = shape.top + shape.height
        const relativeBottom = bottom - originalSize.bottom
        const newBottom = bottom - (relativeBottom * scaleDelta.top)
        height = shape.height - (shape.height * scaleDelta.top)
        top = newBottom - height        
    } else if (scaleDelta.bottom) {        
        const relativeTop = shape.top - originalSize.top
        top = shape.top + (relativeTop * scaleDelta.bottom)
        height = shape.height + (shape.height * scaleDelta.bottom)
    }
    if (scaleDelta.left) {
        const right = shape.left + shape.width
        const relativeRight = right - originalSize.right
        const newRight = right - (relativeRight * scaleDelta.left)
        width = shape.width - (shape.width * scaleDelta.left)
        left = newRight - width
    } else if (scaleDelta.right) {           
           const relativeLeft = shape.left - originalSize.left
            left = shape.left + (relativeLeft * scaleDelta.right)
            width = shape.width + (shape.width * scaleDelta.right)
    }    
    return {
        ...shape,
        top,
        left,
        width,
        height,        
    };
}