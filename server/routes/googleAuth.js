const express = require("express");
const {firebase,admin} = require("../firebase/admin");
const router = express.Router();
const auth = admin.auth();
const db = admin.firestore();

const newUser = {};
const provider = new firebase.auth.GoogleAuthProvider();

router.get("/",
    // firebase.auth.useDeviceLanguage();
    admin.auth().signInWithPopup(provider).then(
        async (result) => {
            //3 - pick the result and store the token
            const token = await auth.currentUser.getIdToken(true);                               
            //4 - check if have token in the current user
            if (token) {
            //5 - put the token at localStorage (We'll use this to make requests)
            localStorage.setItem("@token", token);
            //6 - navigate user to the book list
            history.push("/calendar");
            }
            var usr = result.user;
            newUser = {
                name: usr.displayName,
                email: usr.email,
                photoUrl: usr.photoURL
            }
            // db.doc(`/users/${}`)
            console.log(newUser);
        },
        function (err) {
            console.log(err);
        }
    )
);

module.exports = router;
