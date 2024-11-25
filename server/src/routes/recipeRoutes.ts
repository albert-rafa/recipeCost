import { Router } from "express";

import { recipeController } from "../controllers";
import { validation } from "../middleware";
import { ingredientIdSchema, ingredientSchema, recipeIdSchema, recipeSchema } from "../schemas";

const recipeRouter = Router();

recipeRouter.get("/", recipeController.getAllRecipes);
recipeRouter.get(
  "/:recipeId",
  validation.params(recipeIdSchema),
  recipeController.getRecipe
);
recipeRouter.post(
  "/",
  validation.body(recipeSchema),
  recipeController.createRecipe
);
recipeRouter.delete(
  "/:recipeId",
  validation.params(recipeIdSchema),
  recipeController.deleteRecipe
);

recipeRouter.post(
  "/:recipeId",
  validation.params(recipeIdSchema),
  validation.body(ingredientSchema),
  recipeController.addIngredient
);
recipeRouter.delete(
  "/:recipeId/ingredient/:ingredientId",
  validation.params(recipeIdSchema),
  validation.params(ingredientIdSchema),
  recipeController.removeIngredient
);

export default recipeRouter;
