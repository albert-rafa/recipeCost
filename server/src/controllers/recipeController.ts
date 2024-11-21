import { Request, Response } from "express";

import { recipeServices } from "../services";
import { Recipe } from "../models";

// TODO Request validation

async function getAllRecipes(
  request: Request,
  response: Response
): Promise<void> {
  const recipes = await recipeServices.getAllRecipes();

  if (!recipes) {
    response.status(500).send({ message: "Erro na requisição das receitas." });
    return;
  }

  response.status(200).send({ recipes });
  return;
}

async function getRecipe(request: Request, response: Response): Promise<void> {
  const { recipeId } = request.params;

  const recipe: Recipe | null = await recipeServices.getRecipe(recipeId);

  if (!recipe) {
    response.status(500).send({ message: "Erro na requisição da receita." });
    return;
  }

  response.status(200).send(recipe);
  return;
}

async function createRecipe(
  request: Request,
  response: Response
): Promise<void> {
  const recipeInfo = request.body;

  const recipe: Recipe | null = await recipeServices.createRecipe(recipeInfo);

  if (!recipe) {
    response.status(500).send({ message: "Erro na criação da receita." });
    return;
  }

  response.status(201).send({ recipe });
  return;
}

async function deleteRecipe(
  request: Request,
  response: Response
): Promise<void> {
  const { recipeId } = request.params;

  const deletedRecipeName: string | null = await recipeServices.deleteRecipe(
    recipeId
  );

  if (!deletedRecipeName) {
    response.status(500).send({ message: "Erro ao tentar deletar a receita." });
    return;
  }

  response.status(200).send({ deletedRecipe: deletedRecipeName });
  return;
}

async function addIngredient(
  request: Request,
  response: Response
): Promise<void> {
  const { recipeId } = request.params;
  const ingredientInfo = request.body;

  const name: string = ingredientInfo.name;
  const quantity: number = parseFloat(ingredientInfo.quantity);
  const pricePerKg: number = parseFloat(ingredientInfo.pricePerKg);

  const recipe: Recipe | null = await recipeServices.addIngredient(recipeId, {
    name,
    quantity,
    pricePerKg,
  });

  if (!recipe) {
    response
      .status(500)
      .send({ message: "Erro ao tentar adicionar o ingrediente." });
    return;
  }

  response.status(201).send({ recipe });
  return;
}

async function removeIngredient(request: Request, response: Response) {
  const { recipeId, ingredientId } = request.params;

  const recipe: Recipe | null = await recipeServices.removeIngredent(
    recipeId,
    ingredientId
  );

  if (!recipe) {
    response
      .status(500)
      .send({ message: "Erro na remoção do ingrediente da receita." });
    return;
  }

  response.status(200).send({ recipe });
}

export const recipeController = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  addIngredient,
  removeIngredient,
};
