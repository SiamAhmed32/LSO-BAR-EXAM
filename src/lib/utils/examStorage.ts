/**
 * Helper functions for user-specific exam progress storage
 * Exam progress is stored in localStorage with userId prefix to make it user-specific
 */

/**
 * Generate a user-specific storage key for exam progress
 * @param examTitle - The title of the exam (e.g., "Barrister Free Exam")
 * @param userId - The current user's ID (null for guest users)
 * @returns Storage key like "exam-progress-{userId}-free-exam-barrister-free-exam" or "exam-progress-guest-free-exam-barrister-free-exam"
 */
export function getExamStorageKey(examTitle: string, userId: string | null): string {
  const normalizedTitle = examTitle.toLowerCase().replace(/\s+/g, "-");
  const userPrefix = userId ? userId : "guest";
  return `exam-progress-${userPrefix}-free-exam-${normalizedTitle}`;
}

/**
 * Generate all possible storage keys for an exam (handles variations like "Sample Exam" vs "Free Exam")
 * @param examTitle - The title of the exam
 * @param userId - The current user's ID (null for guest users)
 * @returns Array of possible storage keys
 */
export function getExamStorageKeys(examTitle: string, userId: string | null): string[] {
  const normalizedTitle = examTitle.toLowerCase().replace(/\s+/g, "-");
  const userPrefix = userId ? userId : "guest";
  const keys = [`exam-progress-${userPrefix}-free-exam-${normalizedTitle}`];
  
  // For free exams: check both "Sample Exam" and "Free Exam" variations
  if (normalizedTitle.includes("sample")) {
    keys.push(`exam-progress-${userPrefix}-free-exam-${normalizedTitle.replace("sample", "free")}`);
  } else if (normalizedTitle.includes("free") && !normalizedTitle.includes("set")) {
    keys.push(`exam-progress-${userPrefix}-free-exam-${normalizedTitle.replace("free", "sample")}`);
  }
  
  return keys;
}

/**
 * Clear all exam progress for a specific user
 * @param userId - The user ID whose exam progress should be cleared (null for guest)
 */
export function clearUserExamProgress(userId: string | null): void {
  if (typeof window === "undefined") return;
  
  const userPrefix = userId ? userId : "guest";
  const prefix = `exam-progress-${userPrefix}-`;
  
  // Get all keys that start with the user's prefix
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all user's exam progress
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
  
}

/**
 * Check if exam progress exists for a specific user
 * @param storageKeys - Array of possible storage keys to check
 * @returns true if valid exam progress exists
 */
export function hasValidExamProgress(storageKeys: string[]): boolean {
  if (typeof window === "undefined") return false;
  
  for (const key of storageKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Only consider it "in progress" if there's valid exam progress data
        const hasValidProgress = parsed && (
          (parsed.answers && Object.keys(parsed.answers).length > 0) ||
          (parsed.bookmarked && parsed.bookmarked.length > 0) ||
          (typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0)
        );
        if (hasValidProgress) {
          return true;
        }
      } catch (error) {
        // Invalid JSON, ignore
      }
    }
  }
  return false;
}

