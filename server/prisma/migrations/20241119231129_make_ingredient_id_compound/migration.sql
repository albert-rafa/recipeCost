/*
  Warnings:

  - The primary key for the `ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipe_id` on the `ingredients` table. All the data in the column will be lost.
  - Added the required column `recipeId` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "pricePerKg" REAL NOT NULL,
    "recipeId" TEXT NOT NULL,

    PRIMARY KEY ("recipeId", "id"),
    CONSTRAINT "ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ingredients" ("id", "name", "pricePerKg", "quantity") SELECT "id", "name", "pricePerKg", "quantity" FROM "ingredients";
DROP TABLE "ingredients";
ALTER TABLE "new_ingredients" RENAME TO "ingredients";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
