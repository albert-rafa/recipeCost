import { NextFunction, Request, Response } from "express";

import { recipeServices } from "../services";
import { Ingredient, Recipe } from "../models";

interface IngredientType
  extends Pick<Ingredient, "name" | "quantity" | "pricePerKg"> {}

async function getAllRecipes(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  try {
    const recipes: Partial<Recipe>[] | undefined =
      await recipeServices.getAllRecipes(next);

    if (recipes) return response.status(200).send({ recipes });
  } catch (error) {
    next(error);
  }
}

async function getRecipe(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  const { recipeId } = request.params;

  try {
    const recipe: Recipe | undefined = await recipeServices.getRecipe(
      recipeId,
      next
    );

    if (recipe) return response.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
}

async function createRecipe(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  const recipeInfo = request.body;

  try {
    const recipe: Recipe | undefined = await recipeServices.createRecipe(
      recipeInfo.name,
      next
    );

    if (recipe) return response.status(201).send({ recipe });
  } catch (error) {
    next(error);
  }
}

async function deleteRecipe(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  const { recipeId } = request.params;

  try {
    const deletedRecipeName: string | undefined =
      await recipeServices.deleteRecipe(recipeId, next);

    if (deletedRecipeName)
      return response.status(200).send({ deletedRecipe: deletedRecipeName });
  } catch (error) {
    next(error);
  }
}

async function addIngredient(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  const { recipeId } = request.params;
  const ingredientInfo: IngredientType = request.body;

  try {
    const recipe: Recipe | undefined = await recipeServices.addIngredient(
      recipeId,
      ingredientInfo.name,
      Number(ingredientInfo.quantity),
      Number(ingredientInfo.pricePerKg),
      next
    );

    if (recipe) return response.status(201).send({ recipe });
  } catch (error) {
    next(error);
  }
}

async function removeIngredient(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  const { recipeId, ingredientId } = request.params;

  try {
    const recipe: Recipe | undefined = await recipeServices.removeIngredent(
      recipeId,
      ingredientId,
      next
    );

    if (recipe) return response.status(200).send({ recipe });
  } catch (error) {
    next(error);
  }
}

export const recipeController = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  addIngredient,
  removeIngredient,
};
