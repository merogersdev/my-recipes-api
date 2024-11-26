import { z } from "zod";

export const User = z.object({
  PK: z.string(),
  SK: z.string(),
  recordType: z.string(),
  username: z.string(),
  fullName: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof User>;
