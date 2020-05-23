const admin = require("firebase-admin");
var serviceAccount = require("../cookwithme-fc78a-firebase-adminsdk-ulj6j-3ed75b7b32.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cookwithme-fc78a.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };
