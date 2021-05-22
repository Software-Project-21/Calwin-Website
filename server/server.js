const express = require("express");
const bodyParser = require("body-parser");
const authMiddleware = require("./Middleware/auth");
const invitesRoute = require("./routes/invite");
const cors = require('cors');
// const https = require("https");
const axios = require("axios");
const path = require('path');
// const {firebase,admin} = require("./firebase/admin");

const app = express();
const port = process.env.PORT || 5000;
// const db = admin.firestore();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

 app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );

if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use("/",authMiddleware);
app.use("/api/invite",invitesRoute);
// app.post("/api/invite",(req,res)=>{
//   const emails = req.body.emails;
//   const event = req.body.event;
//   sendInviteEmail(emails,event);
//   console.log("aa gaye yaha");
// });

if(process.env.NODE_ENV === 'production')
{
  app.get("*", (req, res) => { 
    res.sendFile(path.join(__dirname , "../client/build/index.html"));
  });
}

app.listen(port, function(){
    console.log(`Server started at port ${port}`);
});