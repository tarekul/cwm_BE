const express = require("express");
const userRouter = express.Router();
const { middleware } = require("../utils/middleware");
const {
  signUpUser,
  loginUser,
  logoutUser,
  getUser,
  uploadImage,
  updateName
} = require("../services/users");

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/cred", middleware, getUser);
userRouter.post("/image", middleware, uploadImage);
userRouter.post("/name", middleware, updateName);

module.exports = userRouter;
