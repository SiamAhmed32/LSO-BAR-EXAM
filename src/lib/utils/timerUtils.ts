/**
 * Parse duration string (e.g., "2 hours", "4 hours", "30 minutes") to milliseconds
 */
export function parseDurationToMs(duration: string): number {
  if (!duration || typeof duration !== "string") {
    return 0;
  }

  const normalized = duration.toLowerCase().trim();
  
  // Match patterns like "2 hours", "4 hours", "30 minutes", "1 hour", etc.
  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:hour|hours|hr|hrs)/);
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:minute|minutes|min|mins)/);
  
  let totalMs = 0;
  
  if (hourMatch) {
    const hours = parseFloat(hourMatch[1]);
    totalMs += hours * 60 * 60 * 1000;
  }
  
  if (minuteMatch) {
    const minutes = parseFloat(minuteMatch[1]);
    totalMs += minutes * 60 * 1000;
  }
  
  return Math.floor(totalMs);
}

/**
 * Format milliseconds to HH:MM:SS
 */
export function formatTime(ms: number): string {
  if (ms < 0) return "00:00:00";
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

