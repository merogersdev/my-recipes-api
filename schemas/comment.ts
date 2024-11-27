import { z } from "zod";

export const Comment = z.object({
  PK: z.string(),
  SK: z.string(),
  recordType: z.string(),
  userName: z.string(),
  recipeId: z.string(),
  commentId: z.string(),
  commentBody: z.string(),
});

export type User = z.infer<typeof Comment>;
