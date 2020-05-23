const { db } = require("../utils/admin");

exports.readUserFavs = (req, res) => {
  return db
    .collection("favorites")
    .where("userId", "==", req.user)
    .get()
    .then(data => {
      const favs = [];
      data.forEach(doc => {
        const favData = doc.data();
        favData.id = doc.id;
        favs.push(favData);
      });
      return res.status(200).json(favs);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ err });
    });
};
exports.writeUserFav = (req, res) => {
  return db
    .collection("favorites")
    .add({
      userId: req.user,
      ...req.body
    })
    .then(doc => {
      return res.status(200).json({ id: doc.id });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ err });
    });
};
exports.deleteUserFav = (req, res) => {
  const { title } = req.params;
  return db
    .collection("favorites")
    .where("userId", "==", req.user)
    .where("title", "==", title)
    .limit(1)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        doc.ref.delete();
      });
      return res.status(200).json({ message: "delete successful" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ err });
    });
};
