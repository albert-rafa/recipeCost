import { Recipe } from "../models";
import { prisma } from "../utils/prisma";

// TODO Error handling

// Return all recipes without ingredients
async function getAllRecipes(): Promise<Partial<Recipe>[] | null> {
  const recipes: Partial<Recipe>[] = await prisma.recipe.findMany();

  if (!recipes) return null;

  return recipes;
}

// Return specific recipe with all ingredients
async function getRecipe(recipeId: string): Promise<Recipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { ingredients: true },
  });

  if (!recipe) return null;

  return recipe as Recipe;
}

// Returns the created recipe without ingredients
async function createRecipe(recipeInfo: {
  name: string;
}): Promise<Recipe | null> {
  const isNameAlreadyUsed = await prisma.recipe.findFirst({
    where: { name: recipeInfo.name },
  });

  if (isNameAlreadyUsed) return null;

  const recipe = await prisma.recipe.create({
    data: {
      name: recipeInfo.name,
      total: 0,
    },
  });

  if (!recipe) return null;

  return recipe as Recipe;
}

// Return the deleted recipe's name
async function deleteRecipe(recipeId: string): Promise<string | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) return null;

  const result = await prisma.$transaction([
    prisma.ingredient.deleteMany({
      where: { recipeId },
    }),
    prisma.recipe.delete({
      where: { id: recipeId },
    }),
  ]);

  if (!result) return null;

  const [_, deletedRecipe] = result;

  return deletedRecipe.name;
}

// Return the recipe with updated cost and all ingredients, including the added one
async function addIngredient(
  recipeId: string,
  ingredientName: string,
  ingredientQuantity: number,
  ingredientPrice: number
): Promise<Recipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) return null;

  const isNameAlreadyUsed = await prisma.ingredient.findFirst({
    where: { recipeId, name: ingredientName },
  });

  if (isNameAlreadyUsed) return null;

  const newTotalCost = ingredientPrice * ingredientQuantity + recipe.total;

  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      total: newTotalCost,
      ingredients: {
        create: {
          name: ingredientName,
          quantity: ingredientQuantity,
          pricePerKg: ingredientPrice,
        },
      },
    },
    include: {
      ingredients: true,
    },
  });

  if (!updatedRecipe) return null;

  return updatedRecipe as Recipe;
}

// Return the recipe with updated cost and all ingredients, excluding the removed one
async function removeIngredent(
  recipeId: string,
  ingredientId: string
): Promise<Recipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) return null;

  const ingredient = await prisma.ingredient.findFirst({
    where: {
      recipeId,
      id: ingredientId,
    },
  });

  if (!ingredient) return null;

  const newTotalCost =
    recipe.total - ingredient.quantity * ingredient.pricePerKg;

  const result = await prisma.$transaction([
    prisma.ingredient.deleteMany({
      where: {
        recipeId,
        id: ingredientId,
      },
    }),
    prisma.recipe.update({
      where: { id: recipeId },
      data: {
        total: newTotalCost,
      },
    }),
  ]);

  if (!result) return null;

  const [_, updatedRecipe] = result;

  return updatedRecipe as Recipe;
}

export const recipeServices = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  addIngredient,
  removeIngredent,
};
