const functions = require("firebase-functions");
const app = require("express")();

const firebase = require("firebase");
const { config } = require("./utils/config");
firebase.initializeApp(config);

const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});

//handlers
const userRouter = require("./route_handlers/users");
const recipeRouter = require("./route_handlers/recipes");
const favRouter = require("./route_handlers/favorites");
const groceryRouter = require("./route_handlers/groceries");

app.use("/users", userRouter);
app.use("/recipes", recipeRouter);
app.use("/favorites", favRouter);
app.use("/grocery", groceryRouter);

exports.api = functions.https.onRequest(app);
