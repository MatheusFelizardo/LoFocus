import { create } from "zustand";

export type Tag = {
  id: string;
  name: string;
};

type TagState = {
  tags: Tag[];
  isLoading: boolean;
  fetchTags: () => Promise<void>;
  addTag: (name: string) => Promise<Tag | null>;
};

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  isLoading: false,

  fetchTags: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/tags");
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data: Tag[] = await res.json();
      console.log("Fetched tags:", data);
      set({ tags: data, isLoading: false });
    } catch (err) {
      console.error("Error fetching tags:", err);
      set({ isLoading: false });
    }
  },

  addTag: async (name: string) => {
    const existing = get().tags.find(
      (tag) => tag.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) return existing;

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.status === 409) {
        await get().fetchTags();
        return get().tags.find(
          (tag) => tag.name.toLowerCase() === name.toLowerCase()
        )!;
      }

      if (!res.ok) throw new Error("Failed to create tag");
      const newTag: Tag = await res.json();

      set((state) => ({ tags: [...state.tags, newTag] }));
      return newTag;
    } catch (err) {
      console.error("Error creating tag:", err);
      return null;
    }
  },
}));
