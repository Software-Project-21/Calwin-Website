const firebase = require("firebase-admin");  
const serviceAccount = require('./credentials.json'); 

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://calwin-smartcalendar-default-rtdb.firebaseio.com'
});

module.exports = firebase;
