import { create } from "zustand"


const useHomeStore = create((set) => ({
  count: 1,
  addCount: () => set(state => ({ count: state.count + 1 })),
  increment: () => set(state => ({ count: state.count - 1 }))
}))

export default useHomeStore