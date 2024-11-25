import { Recipe } from "../models";
import { AppError } from "../utils/error";
import { prisma } from "../utils/prisma";

// Return all recipes without ingredients
async function getAllRecipes(
  next: Function
): Promise<Partial<Recipe>[] | undefined> {
  try {
    const recipes: Partial<Recipe>[] = await prisma.recipe.findMany();

    if (!recipes) throw new AppError("Couldn't get all recipes.", 500);

    return recipes;
  } catch (error) {
    next(error);
  }
}

// Return specific recipe with all ingredients
async function getRecipe(
  recipeId: string,
  next: Function
): Promise<Recipe | undefined> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: true },
    });

    if (!recipe) throw new AppError("Couldn't find recipe.", 500);

    return recipe as Recipe;
  } catch (error) {
    next(error);
  }
}

// Returns the created recipe without ingredients
async function createRecipe(
  recipeName: string,
  next: Function
): Promise<Recipe | undefined> {
  try {
    const isNameAlreadyUsed = await prisma.recipe.findFirst({
      where: { name: recipeName },
    });

    if (isNameAlreadyUsed)
      throw new AppError(
        "Couldn't create recipe. This name is already being used.",
        400
      );

    const recipe = await prisma.recipe.create({
      data: {
        name: recipeName,
        total: 0,
      },
    });

    if (!recipe) throw new AppError("Couldn't find recipe.", 500);

    return recipe as Recipe;
  } catch (error) {
    next(error);
  }
}

// Return the deleted recipe's name
async function deleteRecipe(
  recipeId: string,
  next: Function
): Promise<string | undefined> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) throw new AppError("Couldn't find recipe.", 500);

    const result = await prisma.$transaction([
      prisma.ingredient.deleteMany({
        where: { recipeId },
      }),
      prisma.recipe.delete({
        where: { id: recipeId },
      }),
    ]);

    if (!result) throw new AppError("Couldn't delete recipe.", 500);

    const [_, deletedRecipe] = result;

    return deletedRecipe.name;
  } catch (error) {
    next(error);
  }
}

// Return the recipe with updated cost and all ingredients, including the added one
async function addIngredient(
  recipeId: string,
  ingredientName: string,
  ingredientQuantity: number,
  ingredientPrice: number,
  next: Function
): Promise<Recipe | undefined> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) throw new AppError("Couldn't find recipe.", 500);

    const isNameAlreadyUsed = await prisma.ingredient.findFirst({
      where: { recipeId, name: ingredientName },
    });

    if (isNameAlreadyUsed)
      throw new AppError(
        "Couldn't add ingredient. This name is already being used.",
        400
      );

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

    if (!updatedRecipe)
      throw new AppError("Couldn't add ingredient to the recipe.", 500);

    return updatedRecipe as Recipe;
  } catch (error) {
    next(error);
  }
}

// Return the recipe with updated cost and all ingredients, excluding the removed one
async function removeIngredent(
  recipeId: string,
  ingredientId: string,
  next: Function
): Promise<Recipe | undefined> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) throw new AppError("Couldn't find recipe.", 500);

    const ingredient = await prisma.ingredient.findFirst({
      where: {
        recipeId,
        id: ingredientId,
      },
    });

    if (!ingredient) throw new AppError("Couldn't find ingredient.", 500);

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

    if (!result)
      throw new AppError("Couldn't remove ingredient from recipe.", 500);

    const [_, updatedRecipe] = result;

    return updatedRecipe as Recipe;
  } catch (error) {
    next(error);
  }
}

export const recipeServices = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  addIngredient,
  removeIngredent,
};
