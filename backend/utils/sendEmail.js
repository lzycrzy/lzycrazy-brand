// import nodemailer from 'nodemailer';

// export const sendEmail = async (option) => {
//   //--
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     service: process.env.SMTP_SERVICE,
//     auth: {
//       user: process.env.SMTP_MAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   //--
//   const mailOptions = {
//     from: process.env.SMTP_MAIL,
//     to: option.email,
//     subject: option.subject,
//     text: option.message,
//   };

//   await transporter.sendMail(mailOptions); ////--
// };


import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Create transporter with Gmail SMTP config
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',       // host should be a string with quotes
    port: 587,                    // port for TLS
    secure: false,                // false for TLS (STARTTLS)
    auth: {
      user: 'bikashsharma5151@gmail.com',
      pass: 'mrbb xobt ayhc hecc',  // Your app password
    },
  });

  // Email options
  const mailOptions = {
    from: '"Test App" <bikashsharma5151@gmail.com>',  // sender address
    to: options.email,           // recipient address
    subject: options.subject,    // subject line
    text: options.message,       // plain text body
    // html: '<p>Your HTML here</p>',  // optional HTML body
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent:', info.messageId);
  // getTestMessageUrl only works with test accounts, so remove it here
};

