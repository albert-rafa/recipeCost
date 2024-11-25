import { Request, Response } from "express";

import { recipeServices } from "../services";
import { Ingredient, Recipe } from "../models";

interface IngredientType
  extends Pick<Ingredient, "name" | "quantity" | "pricePerKg"> {}

async function getAllRecipes(
  request: Request,
  response: Response
): Promise<any> {
  const recipes = await recipeServices.getAllRecipes();

  if (!recipes) {
    return response
      .status(500)
      .send({ message: "Erro na requisição das receitas." });
  }

  return response.status(200).send({ recipes });
}

async function getRecipe(request: Request, response: Response): Promise<any> {
  const { recipeId } = request.params;

  const recipe: Recipe | null = await recipeServices.getRecipe(recipeId);

  if (!recipe) {
    return response
      .status(500)
      .send({ message: "Erro na requisição da receita." });
  }

  return response.status(200).send(recipe);
}

async function createRecipe(
  request: Request,
  response: Response
): Promise<any> {
  const recipeInfo = request.body;

  const recipe: Recipe | null = await recipeServices.createRecipe(recipeInfo);

  if (!recipe) {
    return response
      .status(500)
      .send({ message: "Erro na criação da receita." });
  }

  return response.status(201).send({ recipe });
}

async function deleteRecipe(
  request: Request,
  response: Response
): Promise<any> {
  const { recipeId } = request.params;

  const deletedRecipeName: string | null = await recipeServices.deleteRecipe(
    recipeId
  );

  if (!deletedRecipeName) {
    return response
      .status(500)
      .send({ message: "Erro ao tentar deletar a receita." });
  }

  return response.status(200).send({ deletedRecipe: deletedRecipeName });
}

async function addIngredient(
  request: Request,
  response: Response
): Promise<any> {
  const { recipeId } = request.params;
  const ingredientInfo: IngredientType = request.body;

  const recipe: Recipe | null = await recipeServices.addIngredient(
    recipeId,
    ingredientInfo.name,
    Number(ingredientInfo.quantity),
    Number(ingredientInfo.pricePerKg)
  );

  if (!recipe) {
    return response
      .status(500)
      .send({ message: "Erro ao tentar adicionar o ingrediente." });
  }

  return response.status(201).send({ recipe });
}

async function removeIngredient(
  request: Request,
  response: Response
): Promise<any> {
  const { recipeId, ingredientId } = request.params;

  const recipe: Recipe | null = await recipeServices.removeIngredent(
    recipeId,
    ingredientId
  );

  if (!recipe) {
    return response
      .status(500)
      .send({ message: "Erro na remoção do ingrediente da receita." });
  }

  return response.status(200).send({ recipe });
}

export const recipeController = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  addIngredient,
  removeIngredient,
};
