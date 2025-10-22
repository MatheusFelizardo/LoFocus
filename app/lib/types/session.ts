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
