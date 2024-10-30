import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { Box } from "@mantine/core";
import { useWhiteboardStore } from "~/routes/_index/store";
import { ShapeProps } from "~/types";

export function RectangleShape({ shape, delta }: ShapeProps) {
    const select = useWhiteboardStore(s => s.select)

    const { attributes, listeners, setNodeRef } = useDraggable({
        id: shape.id,
        attributes: {
            role: 'graphics-symbol',
        }
    });

    const style = {
        top: shape.top,
        left: shape.left,
        width: shape.width,
        height: shape.height,        
        transform: delta ?
            CSS.Translate.toString({
                x: delta.x,
                y: delta.y,
                scaleX: 1, scaleY: 1
            })
            : CSS.Translate.toString({
                x: 0,
                y: 0,
                scaleX: 1, scaleY: 1
            })
    }

    return (
        <Box
            pos="absolute"
            bd="1px solid gray.5"
            bg="gray.1"
            ref={setNodeRef}
            onMouseDown={(e) => select(shape.id, e.shiftKey)}
            style={style}
            {...listeners}
            {...attributes}
        >

        </Box>
    )

}
