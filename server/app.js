const express = require("express");
const bodyParser = require("body-parser");
const authMiddleware = require("./Middleware/auth");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use("/",authMiddleware);

app.listen(port, function(){
    console.log("Server started locally at port 5000");
});