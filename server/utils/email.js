const nodemailer = require("nodemailer");
// const emailCredentials = require("../strings");

const emailCredentials = {
    user: process.env.USER,
    pass: process.env.PASS
}

let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: emailCredentials
});

let baseUrl = process.env.BASE_URL || "http://localhost:3000/";

function sendInviteEmail(emails,event) {

    // console.log(new Date(event.startTime.seconds * 1000).toDateString());
    let start = new Date(event.startTime.seconds * 1000).toLocaleTimeString();
    let end = new Date(event.endTime.seconds * 1000).toLocaleTimeString();
    let day = new Date(event.eventDay.seconds * 1000).toDateString();
    let text = `You have been invited to an event ${event.title}\n`;

    emails.forEach(email => {

        let html = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Invitation</title>
              <style>
              @media (max-width: 500px) {
                              .form-wrapper {
                                  max-width: 300px;
                              }
                          }
              </style>
          </head>
          <body style="position: relative;font-family: 'Verdana', sans-serif;padding: 0;margin: 0; background-color: #0d6efd; display: flex; justify-content: center; margin-top: 2%;">
          <div style="background-color: #fff; width: 60%;color: #000">
                <nav class="navbar header navbar-dark bg-dark" style="position: absolute;top: 0;width: 60%;padding: .5rem;">
                    <center>
                        <div class="container">
                        <a class="navbar-brand" href="#">
                            <img src="https://www.pngkey.com/png/full/211-2115372_invitation-comments-newsletter-icon.png" alt="" height="64">
                        </a>
                        </div>
                    </center>
                </nav>
                <center>
                    <div class="form-wrapper" style="max-width: 600px;padding-top: 5em;padding-bottom: 5em;">
                    <center>
                            <h1>You've been Invited!</h1>
                            <p>Hi! You have a recieved an invitation to Event <b>${event.title}</b> by <b>${event.name}</b>, with the following details</p>
                            <h4>Event Date: ${day} </h4>
                            <h4>Event Timings: ${start} to ${end} </h4>
                            <a href="${baseUrl}notifications" class="btn btn-info" style="display: inline-block;font-weight: 400;line-height: 1.5;text-align: center;text-decoration: none;vertical-align: middle;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;border-radius: .25rem;color: #fff;background-color: #0d6efd;border-color: #0d6efd;">Check Invitations</a>
                            <br/><br/><br/>
                            <h6>If the button doesn't work, copy and open this link in your browser:${baseUrl}notifications</h6>
                        </center>
                    </div>
                    </center>
                    <nav class="footer navbar-dark bg-dark" style="position: absolute;bottom: 0;width: 60%;padding: 0.6em;">
                        <div class="container" style="text-align: center;">
                        <p style="margin: 0!important;">&copy; Calwin 2021</p>
                        </div>
                    </nav>
              </div>
          </body>
          </html>`;

        var mailOptions = {
            from: `"Calwin" <${emailCredentials.user}>`,
            to: email,
            subject: "New Event Invite",
            text: text,
            html: html,
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
            console.log("Some error occured"+err);
            } else {
            console.log("Email sent: " + info.response);
            }
        });
    });
}

module.exports = sendInviteEmail;