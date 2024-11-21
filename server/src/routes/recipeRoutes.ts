import { Router } from "express";

import { recipeController } from "./../controllers/recipeController";

const recipeRouter = Router();

recipeRouter.get("/", recipeController.getAllRecipes);
recipeRouter.get("/:recipeId", recipeController.getRecipe);
recipeRouter.post("/", recipeController.createRecipe);
recipeRouter.delete("/:recipeId", recipeController.deleteRecipe);

recipeRouter.post("/:recipeId", recipeController.addIngredient);
recipeRouter.delete(
  "/:recipeId/ingredient/:ingredientId",
  recipeController.removeIngredient
);

export default recipeRouter;
