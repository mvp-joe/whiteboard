import { create } from "zustand";
import { BoundingBox, Position, Scale } from "~/types";

type State = {
    moveDelta:Position
    sizeDelta: BoundingBox
    scaleDelta: Scale
    selection: string[]
    originalSize: BoundingBox
}

type Store = State & {
    setMoveDelta: (delta: { x: number, y: number }) => void
    resetMoveDelta: () => void
    setOriginalSize: (size: BoundingBox) => void    
    resetOriginalSize: () => void
    setSizeDelta: (size: BoundingBox) => void
    setScaleDelta: (scale: Scale) => void
    resetSizeDelta: () => void
    resetscaleDelta: () => void
    select: (id: string, additive: boolean) => void
    deselect: (id: string) => void
    deselectAll: () => void
}

export const useWhiteboardStore = create<Store>((set) => ({
    moveDelta: { x: 0, y: 0 },
    selection: [],
    sizeDelta: { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 },
    originalSize: { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 },
    scaleDelta: { top: 0, left: 0, bottom: 0, right: 0 },
    setOriginalSize: (size) => set(() => ({ originalSize: size })),
    resetOriginalSize: () => set(() => ({ originalSize: { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 } })),
    setMoveDelta: (delta) => set(() => ({ moveDelta: delta })),
    resetMoveDelta: () => set(() => ({ moveDelta: { x: 0, y: 0 } })),    
    setSizeDelta: (size) => set(() => ({ sizeDelta: size })),
    setScaleDelta: (scale) => set(() => ({ scaleDelta: scale })),
    resetscaleDelta: () => set(() => ({ scaleDelta: { top: 0, left: 0, bottom: 0, right: 0 } })),
    resetSizeDelta: () => set(() => ({ sizeDelta: { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 } })),
    select: (id, additive) => set((state) => ({ selection: additive ? [...state.selection, id] : [id] })),
    deselect: (id) => set((state) => {
        const filtered = state.selection.filter((s) => s !== id)        
        return ({ selection: filtered })
    }),
    deselectAll: () => set(() => ({ selection: [] }))
}));
