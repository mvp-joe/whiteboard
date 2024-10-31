import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";
import { ShapeProps } from "~/types";
import { useWhiteboardStore } from "./store";

export function RectangleShape({ shape, delta }: ShapeProps) {       
    return (        
        <Shape
            shape={shape}
            delta={delta}            
            bd="1px solid gray.5"
            bg="gray.1"            
        >
        </Shape>
    )
}


export function OvalShape({ shape, delta }: ShapeProps) {    
    const theme = useMantineTheme()
    const fill = theme.colors.gray[1]
    const stroke = theme.colors.gray[5]

    return (        
        <Shape
            shape={shape}
            delta={delta}           
        >
            <svg width={shape.width} height={shape.height} viewBox={`0 0 ${shape.width} ${shape.height}`} style={{overflow: 'visible'}} xmlns="http://www.w3.org/2000/svg">
                <ellipse cx={shape.width / 2} cy={shape.height / 2} rx={shape.width / 2} ry={shape.height / 2} fill={fill} stroke={stroke} />
            </svg>
        </Shape>
    )
}

interface ShapePropsWithBox extends ShapeProps, BoxProps, PropsWithChildren {

}

export function Shape({ shape, delta, children, ...rest }: ShapePropsWithBox) {
    const select = useWhiteboardStore(s => s.select)
    const deselect = useWhiteboardStore(s => s.deselect)    
    const selection = useWhiteboardStore(s => s.selection)
    console.log('selection', selection)

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
            onMouseDown={handleMouseDown}
            style={style}
            {...listeners}
            {...attributes}
            {...rest}
        >
            {children}
        </Box>        
    )

    function handleMouseDown(e: React.MouseEvent) {                
        if (selection.includes(shape.id)) {
            if (e.shiftKey) {                                
                setTimeout(() => {
                    deselect(shape.id)
                }, 1)                
            } else {
                // if multi-select and this is selected, let's exit out so we don't cancel selection for multi-select drag
                return
            }
        }
        select(shape.id, e.shiftKey)
    }
}