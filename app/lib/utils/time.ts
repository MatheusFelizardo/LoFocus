/**
 * Formats time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (MM:SS)
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}
