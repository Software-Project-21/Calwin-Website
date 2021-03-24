const express = require("express");
const router = express.Router();
const https = require("https");

router.get('/',(req,res) => {
    console.log("hello");
    https.get("https://calendarific.com/api/v2/holidays?&api_key=8f7fc6ffe50904caf1e6caf88ed839004a6c8c66&country=in&year=2021",(res) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
         resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
        });

    }).on("error",(err) => {
        console.log("Error:"+ err.message);
    })
});

module.exports = router;
