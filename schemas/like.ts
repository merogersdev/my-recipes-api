import { z } from "zod";

export const Like = z.object({
  PK: z.string(),
  SK: z.string(),
  recordType: z.string(),
  userName: z.string(),
  recipeId: z.string(),
  likeId: z.string(),
  GSI1PK: z.string(),
  GSI1SK: z.string(),
});

export type User = z.infer<typeof Like>;
