const express = require("express");
const groceryRouter = express.Router();
const { middleware } = require("../utils/middleware");

const {
  readAllGroceries,
  createGrocery,
  updateGrocery
} = require("../services/groceries");

//get all user groceries
groceryRouter.get("/", middleware, readAllGroceries);

//add a grocery
groceryRouter.post("/", middleware, createGrocery);

//update a groceries
groceryRouter.put("/", middleware, updateGrocery);

module.exports = groceryRouter;
