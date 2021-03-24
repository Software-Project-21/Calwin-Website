const express = require("express");
const bodyParser = require("body-parser");
const authMiddleware = require("./Middleware/auth");
const cors = require('cors');
// const https = require("https");
const axios = require("axios");
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

// const saveUser = require("./routes/saveUser");

// const getHolidays = require("./routes/getHolidays");


app.use("/",authMiddleware);

app.get("/holidays",(req,res) => {
  console.log("hello");
  axios.get("https://calendarific.com/api/v2/holidays?&api_key=8f7fc6ffe50904caf1e6caf88ed839004a6c8c66&country=in&year=2021"
  .then(res => res.data)
  .then(data => {
    console.log(data.response.holidays);
    res.data = data;
  }).catch(err => {
    console.log(err);
  }))
});
      // let data = '';
      // resp.on('data', (chunk) => {
      //     data += chunk;
      // });
      //   resp.on('end', () => {
      //     console.log(JSON.parse(data).explanation);
      // });

  // }).on("error",(err) => {
  //     console.log("Error:"+ err.message);
  // })
// })
// app.use("/holidays",getHolidays);
// app.use("/users",saveUser);

// const googleAuth = require('./routes/googleAuth');


// app.use("/auth/google",googleAuth);

app.listen(port, function(){
    console.log("Server started locally at port 5000");
});