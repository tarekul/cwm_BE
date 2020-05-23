const { db } = require("../utils/admin");

exports.readAllGroceries = (req, res) => {
  return db
    .doc(`/groceries/${req.user}`)
    .get()
    .then(doc => {
      if (doc.data().groceries)
        return res.status(200).json(doc.data().groceries);
    })
    .catch(err => res.status(500).json({ error: err.code }));
};

exports.createGrocery = (req, res) => {
  const { grocery } = req.body;
  return db
    .doc(`/groceries/${req.user}`)
    .get()
    .then(doc => {
      const groceries = doc.data().groceries;
      groceries.push(grocery);
      return db.doc(`/groceries/${req.user}`).set({ groceries });
    })
    .then(() => res.status(200).json({ message: "grocery added" }))
    .catch(err => res.status(500).json({ error: err.code }));
};

exports.updateGrocery = (req, res) => {
  const { groceries } = req.body;
  return db
    .doc(`/groceries/${req.user}`)
    .update({ groceries })
    .then(() => {
      res.status(200).json({ message: "grocery updated" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ err });
    });
};
