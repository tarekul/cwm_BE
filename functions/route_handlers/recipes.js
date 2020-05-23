const express = require("express");
const recipeRouter = express.Router();
const { middleware } = require("../utils/middleware");

const {
  readRecipe,
  readAllRecipes,
  writeRecipe,
  writeCreatedRecipe,
  uploadRecipeImage
} = require("../services/recipes");

recipeRouter.get("/:title", readRecipe);
recipeRouter.get("/", readAllRecipes);
recipeRouter.post("/", writeRecipe);
recipeRouter.post("/uploadimage", uploadRecipeImage);
recipeRouter.post("/usercreated", middleware, writeCreatedRecipe);

module.exports = recipeRouter;
