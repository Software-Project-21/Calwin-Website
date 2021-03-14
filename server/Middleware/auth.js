const {firebase} = require("../firebase/admin");

function auth(req, res, next) {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.send({ message: "No token provided" }).status(401);
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    res.send({ message: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ")[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => res.send({ message: "Could not authorize" }).status(403));
}

module.exports = auth;