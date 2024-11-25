import { z } from "zod";

export const recipeIdSchema = z.object({
  recipeId: z.string().uuid(),
});

export const recipeSchema = z.object({
  name: z.string().max(80),
});

export const ingredientIdSchema = z.object({
  ingredientId: z.string().uuid(),
});

export const ingredientSchema = z.object({
  name: z.string().max(50),
  quantity: z.coerce.number().positive(),
  pricePerKg: z.coerce.number().positive(),
});
