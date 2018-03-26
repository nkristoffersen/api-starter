const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_API_DOMAIN
  }
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

function email(resetEmailContent) {
  return new Promise((resolve, reject) => {
    if (!resetEmailContent.email) {
      reject({message:'Please provide email'});
    } else if (resetEmailContent.email) {
      nodemailerMailgun.sendMail({
        from: process.env.MAILGUN_API_TEST_SENDER,
        to: process.env.MAILGUN_API_TEST_RECEIVER, // An array if you have multiple recipients.
        subject: 'Jobhero password reset',
        'h:Reply-To': 'reply2this@company.com',
        //You can use "html:" to send HTML email content. It's magic!
        html: '<b>Here is your reset link ' + resetEmailContent.link + '</b>',
        //You can use "text:" to send plain-text content. It's oldschool!
        text: 'Here is your reset link ' + resetEmailContent.link
      }, function (err, info) {
        if (err) {
          reject({message:'something went wrong when we tried to send an email'});
        }
        else {
          resolve({message:'message has been successfully sent!'});
        }
      });
    } else {
      reject({message:'Something went wrong when sending reset password email'});
    }
  });
}

module.exports = email;
