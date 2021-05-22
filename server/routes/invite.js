const express = require("express");
const router = express.Router();
const sendInviteEmail = require("../utils/email");

router.get("/",(req,res) => {
    res.send("Welcome to Email Invite");
})

router.post("/",(req,res) => {
    var emails = req.body.emails;
    var event = req.body.event;
    sendInviteEmail(emails,event);
    res.send("sent").status(200);
});

module.exports = router;