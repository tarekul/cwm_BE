const { admin, db } = require("../utils/admin");

exports.middleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer"))
    return res.status(403).json({ error: "unauthorized" });

  const token = authorization.split("Bearer ")[1];

  admin
    .auth()
    .verifyIdToken(token)
    .then(decodedToken => {
      let uid = decodedToken.uid;
      db.collection("users")
        .where("userId", "==", uid)
        .limit(1)
        .get()
        .then(snapshot => {
          req.user = snapshot.docs[0].id;
          next();
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(403).json({ error: err.code });
    });
};
