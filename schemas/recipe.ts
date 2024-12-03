import { z } from "zod";

export const Recipe = z.object({
  PK: z.string(),
  SK: z.string(),
  recordType: z.string(),
  createdAt: z.string().datetime(),
  recipeId: z.string(),
  recipeName: z.string(),
  category: z.string(),
  cookTemp: z.number(),
  cookTime: z.number(),
  prepTime: z.number(),
  description: z.string(),
  method: z.array(z.string()),
  photoUrl: z.string(),
  level: z.string(),
  likeCount: z.number(),
  commentCount: z.number(),
});

export type Recipe = z.infer<typeof Recipe>;
