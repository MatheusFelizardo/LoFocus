import { create } from "zustand";
import { Tag } from "./useTagsStore";

export type Session = {
  id?: string;
  title: string;
  tagIds: string[];
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cycles: number;
  expectedCycles: number;
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
};

type SessionState = {
  current: Session | null;
  history: Session[];
  isLoading: boolean;
  error: string | null;

  loadSessions: () => Promise<void>;
  startSession: (
    data: Omit<
      Session,
      "id" | "cycles" | "startTime" | "endTime" | "isCompleted"
    >
  ) => Promise<void>;
  incrementCycle: () => Promise<void>;
  finishSession: () => Promise<void>;
  resetSession: () => void;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  current: null,
  history: [],
  isLoading: false,
  error: null,

  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/sessions");
      if (!res.ok) throw new Error("Failed to load sessions");
      const data: Session[] = await res.json();
      set({ history: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  startSession: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          tagIds: data.tagIds.map((t) => t),
          focusDuration: data.focusDuration,
          shortBreak: data.shortBreakDuration,
          longBreak: data.longBreakDuration,
          expectedCycles: data.expectedCycles,
        }),
      });

      if (!res.ok) throw new Error("Failed to create session");
      const created = await res.json();

      set({
        current: {
          ...data,
          id: created.id,
          tagIds: created.tags.map((t: Tag) => t.id),
          cycles: 0,
          startTime: new Date(created.startedAt),
          endTime: null,
          isCompleted: false,
        },
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  incrementCycle: async () => {
    const session = get().current;
    if (!session) return;

    try {
      const res = await fetch(`/api/sessions/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cycles: session.cycles + 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update cycles");
      }

      const updated = await res.json();

      set({ current: updated });
    } catch (err) {
      console.error("Error updating cycles:", err);
    }
  },

  finishSession: async () => {
    const session = get().current;
    if (!session?.id) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/sessions/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: true }),
      });

      if (!res.ok) throw new Error("Failed to finish session");

      set({
        current: {
          ...session,
          endTime: new Date(),
          isCompleted: true,
        },
        isLoading: false,
      });

      get().loadSessions();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  resetSession: () => set({ current: null }),
}));
