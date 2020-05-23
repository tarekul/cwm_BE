const firebase = require("firebase");

const { admin, db } = require("../utils/admin");

const { validateSignUp, validateLogin } = require("../utils/validators");

exports.signUpUser = (req, res) => {
  const { email, password, confirmPassword, name } = req.body;
  const validateRes = validateSignUp(email, password, confirmPassword, name);

  if (!validateRes.valid) return res.status(400).json(validateRes.errors);

  const noImg =
    "https://firebasestorage.googleapis.com/v0/b/cookwithme-fc78a.appspot.com/o/no-img.png?alt=media";

  let token, userId;
  db.doc(`/users/${email}`)
    .get()
    .then(doc => {
      if (doc.exists)
        return res.status(400).json({ email: "email already exists" });
      else
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        name,
        image: noImg,
        userId,
        createdAt: new Date().toISOString()
      };
      return db.doc(`/users/${email}`).set(userCredentials);
    })
    .then(() => {
      return db.doc(`/groceries/${email}`).set({ groceries: [] });
    })
    .then(() => res.status(200).json({ token }))
    .catch(err => {
      console.error(err);
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const validRes = validateLogin(email, password);
  if (!validRes.valid) return res.status(400).json(validRes.errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => res.status(200).json({ token }))
    .catch(err => {
      console.error(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        return res
          .status(403)
          .json({ general: "wrong credentials, please try again" });
      } else return res.status(500).json({ error: err.code });
    });
};

exports.logoutUser = (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      return res.status(200).json({ message: "user signed out" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getUser = (req, res) => {
  return db
    .doc(`/users/${req.user}`)
    .get()
    .then(doc => {
      const user = doc.data();
      user.id = doc.id;
      return res.status(200).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.updateName = (req, res) => {
  const { name } = req.body;
  db.doc(`/users/${req.user}`)
    .update({ name })
    .then(() => {
      return res.json({ message: "name change successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
};

exports.uploadImage = (req, res) => {
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
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };

    //created a writeable stream
    const writeStream = fs.createWriteStream(filepath);
    //streams the file data to a new stream
    file.pipe(writeStream);
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const image = `https://firebasestorage.googleapis.com/v0/b/cookwithme-fc78a.appspot.com/o/${imageFileName}?alt=media`;
        db.doc(`users/${req.user}`).update({ image });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};
