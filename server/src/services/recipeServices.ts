import { Recipe } from "../models";
import { prisma } from "../utils/prisma";

// Return all recipes without ingredients
async function getAllRecipes(): Promise<Partial<Recipe>[]> {
  const recipes: Partial<Recipe>[] = await prisma.recipe.findMany();
  return recipes;
}

// Return specific recipe with all ingredients
async function getRecipe(recipeId: string): Promise<Recipe> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { ingredients: true },
  });

  if (!recipe) throw new Error("Recipe not found.");

  return recipe as Recipe;
}

// Returns the created recipe without ingredients
async function createRecipe(recipeInfo: { name: string }): Promise<Recipe> {
  const isNameAlreadyUsed = await prisma.recipe.findFirst({
    where: { name: recipeInfo.name },
  });

  if (isNameAlreadyUsed) throw new Error("Recipe already exists.");

  const recipe = await prisma.recipe.create({
    data: {
      name: recipeInfo.name,
      total: 0,
    },
  });

  if (!recipe) throw new Error("Couldn't create recipe.");

  return recipe as Recipe;
}

// Return the deleted recipe's name
async function deleteRecipe(recipeId: string): Promise<string> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) throw new Error("Couldn't find recipe.");

  const result = await prisma.$transaction([
    prisma.ingredient.deleteMany({
      where: { recipeId },
    }),
    prisma.recipe.delete({
      where: { id: recipeId },
    }),
  ]);

  if (!result) throw new Error("Couldn't delete recipe.");

  const [_, deletedRecipe] = result;

  return deletedRecipe.name;
}

// Return the recipe with updated cost and all ingredients, including the added one
async function addIngredient(
  recipeId: string,
  ingredientInfo: { name: string; quantity: number; pricePerKg: number }
): Promise<Recipe> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) throw new Error("Couldn't find recipe.");

  const newTotalCost =
    ingredientInfo.pricePerKg * ingredientInfo.quantity + recipe.total;

  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      total: newTotalCost,
      ingredients: {
        create: {
          name: ingredientInfo.name,
          quantity: ingredientInfo.quantity,
          pricePerKg: ingredientInfo.pricePerKg,
        },
      },
    },
    include: {
      ingredients: true,
    },
  });

  if (!updatedRecipe) throw new Error("Couldn't add ingredient to recipe.");

  return updatedRecipe as Recipe;
}

// Return the recipe with updated cost and all ingredients, excluding the removed one
async function removeIngredent(
  recipeId: string,
  ingredientId: string
): Promise<Recipe> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) throw new Error("Coudn't find recipe.");

  const ingredient = await prisma.ingredient.findFirst({
    where: {
      recipeId,
      id: ingredientId,
    },
  });

  if (!ingredient) throw new Error("Couldn't find ingredient.");

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

  if (!result) throw new Error("Couldn't remove ingredient from recipe.");

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
