var admin = require("firebase-admin");

var serviceAccount = require("../maacrm-ba986-firebase-adminsdk-8bi4h-1582900386.json");

const fbAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount, "MAA-Firebase")
});

const fbAuth = defaultApp.auth();