import { create } from "zustand";
import { BoundingBox, Position } from "~/types";

type State = {
    moveDelta:Position
    sizeDelta: BoundingBox
    selection: string[]
}

type Store = State & {
    setMoveDelta: (delta: { x: number, y: number }) => void
    resetMoveDelta: () => void
    setSizeDelta: (size: BoundingBox) => void
    resetSizeDelta: () => void
    select: (id: string, additive: boolean) => void
    deselect: (id: string) => void
    deselectAll: () => void
}

export const useWhiteboardStore = create<Store>((set) => ({
    moveDelta: { x: 0, y: 0 },
    selection: [],
    sizeDelta: { top: 0, left: 0, bottom: 0, right: 0 },
    setMoveDelta: (delta) => set(() => ({ moveDelta: delta })),
    resetMoveDelta: () => set(() => ({ moveDelta: { x: 0, y: 0 } })),    
    setSizeDelta: (size) => set(() => ({ sizeDelta: size })),
    resetSizeDelta: () => set(() => ({ sizeDelta: { top: 0, left: 0, bottom: 0, right: 0 } })),
    select: (id, additive) => set((state) => ({ selection: additive ? [...state.selection, id] : [id] })),
    deselect: (id) => set((state) => {
        const filtered = state.selection.filter((s) => s !== id)        
        return ({ selection: filtered })
    }),
    deselectAll: () => set(() => ({ selection: [] }))
}));
