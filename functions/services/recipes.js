//firestore db
const { admin, db } = require("../utils/admin");
//utils
const { validateRecipeDetails } = require("../utils/validators");
const { scrapeRecipe } = require("../utils/scrapper");

exports.readRecipe = (req, res) => {
  let { title } = req.params;
  let modTitle = title.split(" ").join("_");
  db.doc(`/recipes/${modTitle}`)
    .get()
    .then(doc => {
      if (!doc.data())
        return res.status(400).json({ message: "recipe does not exist" });
      return res.status(200).json({ title, ...doc.data() });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    });
};
exports.readAllRecipes = (req, res) => {
  return db
    .collection("recipes")
    .get()
    .then(snapshot => {
      const recipes = [];
      snapshot.forEach(doc => {
        const data = { ...doc.data() };
        data.title = doc.id.split("_").join(" ");
        recipes.push(data);
      });
      return res.status(200).json(recipes);
    })
    .catch(err => {
      console.error(err);
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};

exports.writeRecipe = async (req, res) => {
  let { title, picture_url, web_url } = req.body;
  let modTitle = title.split(" ").join("_");

  const results = await scrapeRecipe(web_url);
  if (!results.valid)
    return res.status(400).json("Unable to fetch recipe details");

  const { ingredients, steps } = results;

  const recipeDetails = {
    picture_url,
    web_url,
    ingredients,
    steps
  };
  db.doc(`/recipes/${modTitle}`)
    .set(recipeDetails)
    .then(() => res.status(200).json({ title, ...recipeDetails }))
    .catch(err => {
      console.error(err);
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};

exports.uploadRecipeImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png")
      return res.status(400).json({ error: "Wrong file type submitted" });

    imageFileName = filename;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const picture_url = `https://firebasestorage.googleapis.com/v0/b/cookwithme-fc78a.appspot.com/o/${imageFileName}?alt=media`;
        return res.status(200).json({ picture_url });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

//add user created recipe to db
exports.writeCreatedRecipe = (req, res) => {
  const { title, picture_url, ingredients, steps } = req.body;
  let modTitle = title.split(" ").join("_");
  return db
    .doc(`/recipes/${title}`)
    .get()
    .then(doc => {
      if (doc.data()) res.status(400).json({ error: "recipe already exists" });
      else {
        db.doc(`/recipes/${modTitle}`)
          .set({
            picture_url,
            ingredients: [...ingredients],
            steps: [...steps],
            userId: req.user
          })
          .then(() =>
            res.status(200).json({ message: "recipe created successfully" })
          );
      }
    })
    .catch(err => {
      console.error(err);
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};
