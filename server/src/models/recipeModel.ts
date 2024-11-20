import { Ingredient } from "./ingredientModel";

export interface Recipe {
  id: string;
  name: string;
  total: number;
  ingredients?: Ingredient[];
}
