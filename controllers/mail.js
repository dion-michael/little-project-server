const nodemailer = require('nodemailer');
const credentials = require('../email_credentials.json');

async function sendMail(req, res) {
    const { email, username, password, display_name } = req.body;
    const transporter = nodemailer.createTransport(credentials);

    // setup email data with unicode symbols
    let mailOptions = {
        from: credentials.auth.user, // sender address
        to: email, // list of receivers
        subject: 'Account created', // Subject line
        text: 'Account details', // plain text body
        html: `<h2>Hello ${display_name}!</h2><br/><p>your account has been created</p><ul><li>username: ${username}</li><li>password: ${password}</li></ul>`, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message sent to ${email}: %s`, info.messageId);
    });

    res.json({ success: true });
}

module.exports = sendMail;
