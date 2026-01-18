import { redis } from "@/lib/server/redis";

const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes
const OTP_LENGTH = 6;

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP in Redis with expiry
 */
export async function storeOTP(email: string, otp: string): Promise<void> {
  const key = `otp:${email}`;
  await redis.setex(key, OTP_EXPIRY_SECONDS, otp);
}

/**
 * Verify OTP from Redis
 */
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const key = `otp:${email}`;
  const storedOTP = await redis.get(key);
  
  if (!storedOTP) {
    return false; // OTP expired or doesn't exist
  }
  
  // Compare OTPs (case-insensitive)
  const isValid = storedOTP.toString().toLowerCase() === otp.toLowerCase();
  
  // Delete OTP after verification (one-time use)
  if (isValid) {
    await redis.del(key);
  }
  
  return isValid;
}

/**
 * Check if OTP exists for email (for rate limiting)
 */
export async function hasOTP(email: string): Promise<boolean> {
  try {
    const key = `otp:${email}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error("Error checking OTP existence:", error);
    // If Redis fails, return false to allow OTP sending (fail-open)
    return false;
  }
}

/**
 * Delete OTP (for cleanup)
 */
export async function deleteOTP(email: string): Promise<void> {
  const key = `otp:${email}`;
  await redis.del(key);
}

