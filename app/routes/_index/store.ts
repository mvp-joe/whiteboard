import { create } from "zustand";

type State = {
    moveDelta: { x: number, y: number }
    selection: string[]
}

type Store = State & {
    setMoveDelta: (delta: { x: number, y: number }) => void
    resetMoveDelta: () => void
    select: (id: string, additive: boolean) => void
    deselect: (id: string) => void
    deselectAll: () => void
}

export const useWhiteboardStore = create<Store>((set) => ({
    moveDelta: { x: 0, y: 0 },
    selection: [],
    setMoveDelta: (delta) => set(() => ({ moveDelta: delta })),
    resetMoveDelta: () => set(() => ({ moveDelta: { x: 0, y: 0 } })),
    select: (id, additive) => set((state) => ({ selection: additive ? [...state.selection, id] : [id] })),
    deselect: (id) => set((state) => {
        const filtered = state.selection.filter((s) => s !== id)
        console.log('filtered', filtered)
        return ({ selection: filtered })
    }),
    deselectAll: () => set(() => ({ selection: [] }))
}));
