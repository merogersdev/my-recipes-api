import { z } from "zod";

export const User = z.object({
  PK: z.string(),
  SK: z.string(),
  recordType: z.string(),
  userName: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof User>;
