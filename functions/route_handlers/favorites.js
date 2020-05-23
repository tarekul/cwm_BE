const express = require("express");
const favRouter = express.Router();
const { middleware } = require("../utils/middleware");

const {
  readUserFavs,
  writeUserFav,
  deleteUserFav
} = require("../services/favorites");

favRouter.get("/", middleware, readUserFavs);
favRouter.post("/", middleware, writeUserFav);
favRouter.delete("/:title", middleware, deleteUserFav);

module.exports = favRouter;
