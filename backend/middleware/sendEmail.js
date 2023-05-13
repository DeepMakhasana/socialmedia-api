const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
    // const gmailEmail = functions.config().gmail.email;
    // const gmailPassword = functions.config().gmail.password;
    let testAccount = await nodemailer.createTestAccount();

  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    service: "gmail"
  });

//   var transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "5654ccb6f28b36",
//       pass: "6513d828210ae6"
//     }
//   });

  const mailOptions = {
    from: "dep7901@gmail.com",
    to: option.email,
    subject: option.subject,
    text: option.message
  }

  await transport.sendMail(mailOptions,function (err, res) {
    if(err){
        console.log('Error', err);
    } else {
        console.log('Email Sent');
    }
  });
};

module.exports = sendEmail;