import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { Box, useMantineTheme } from "@mantine/core";
import { ShapeProps } from "~/types";
import { useWhiteboardStore } from "./store";

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
            onMouseDown={(e) => select(shape.id, e.shiftKey) }
            style={style}
            {...listeners}
            {...attributes}
        >

        </Box>
    )

}


export function OvalShape({ shape, delta }: ShapeProps) {
    const select = useWhiteboardStore(s => s.select)
    const theme = useMantineTheme()
    const fill = theme.colors.gray[1]
    const stroke = theme.colors.gray[5]

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
            ref={setNodeRef}
            onMouseDown={(e) => select(shape.id, e.shiftKey) }
            style={style}
            {...listeners}
            {...attributes}
        >
            <svg width={shape.width} height={shape.height} viewBox={`0 0 ${shape.width} ${shape.height}`} style={{overflow: 'visible'}} xmlns="http://www.w3.org/2000/svg">
                <ellipse cx={shape.width / 2} cy={shape.height / 2} rx={shape.width / 2} ry={shape.height / 2} fill={fill} stroke={stroke} />
            </svg>
        </Box>
    )

}
