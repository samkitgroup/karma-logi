import { z } from "zod";

const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  if (digits.length === 10) {
    return digits;
  }

  throw new Error("Enter a valid 10-digit mobile number.");
}

export function isValidMobile(mobile: string): boolean {
  return MOBILE_PATTERN.test(mobile);
}

export const registerPlayerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  mobile: z
    .string()
    .trim()
    .min(10, "Enter a valid mobile number.")
    .max(15, "Mobile number is too long."),
});

export const submitScoreSchema = z.object({
  gameId: z.string().trim().min(1).max(64),
  score: z.number().int().min(0).max(1_000_000),
});

export type RegisterPlayerInput = z.infer<typeof registerPlayerSchema>;
export type SubmitScoreInput = z.infer<typeof submitScoreSchema>;

export function maskMobile(mobile: string): string {
  if (mobile.length < 4) {
    return mobile;
  }

  return `${mobile.slice(0, 2)}******${mobile.slice(-2)}`;
}
