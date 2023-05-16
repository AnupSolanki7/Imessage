import { create } from "zustand";

interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

const useActiveList = create<ActiveListStore>((set: any) => ({
  members: [],
  add: (id: any) => set((state: any) => ({ members: [...state.members, id] })),
  remove: (id: any) =>
    set((state: any) => ({
      members: state.members.filter((memberId: any) => memberId !== id),
    })),
  set: (ids: any) => set({ members: ids }),
}));

export default useActiveList;
