import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";
import { resizeShape } from "~/routes/_index/shape-utils";
import { ShapeProps } from "~/types";
import { useWhiteboardStore } from "./store";

export function RectangleShape({ shape, delta, originalSize }: ShapeProps) {       
    return (        
        <ShapeBox
            shape={shape}
            delta={delta}  
            originalSize={originalSize}          
            bd="1px solid gray.5"
            bg="gray.1"            
        >
        </ShapeBox>
    )
}

export function OvalShape({ shape, delta, originalSize }: ShapeProps) {    
    const theme = useMantineTheme()
    const fill = theme.colors.gray[1]
    const stroke = theme.colors.gray[5]
    
    const resizedShape = delta && originalSize ? resizeShape(shape, originalSize, delta.scale) : shape;
    const width = Math.max(resizedShape.width, 0)
    const height = Math.max(resizedShape.height, 0)

    return (        
        <ShapeBox
            shape={shape}
            delta={delta}      
            originalSize={originalSize}     
        >
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}} xmlns="http://www.w3.org/2000/svg">
                <ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={fill} stroke={stroke} />
            </svg>
        </ShapeBox>
    )
}

interface ShapeBoxProps extends ShapeProps, BoxProps, PropsWithChildren {}

export function ShapeBox({ shape, delta, children, originalSize, ...rest }: ShapeBoxProps) {
    const select = useWhiteboardStore(s => s.select)
    const deselect = useWhiteboardStore(s => s.deselect)    
    const selection = useWhiteboardStore(s => s.selection)    
    
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: shape.id,
        attributes: {
            role: 'graphics-symbol',
        }
    });

    console.log('ShapeBox', shape.id, delta, originalSize   )
    const resizedShape = delta && originalSize ? resizeShape(shape, originalSize, delta.scale) : shape;

    const style = {
        top: resizedShape.top,
        left: resizedShape.left,
        width: resizedShape.width,
        height: resizedShape.height,   
        transform: delta ?
            CSS.Translate.toString({
                x: delta.pos.x,
                y: delta.pos.y,
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
