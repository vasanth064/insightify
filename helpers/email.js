import { createTransport } from 'nodemailer';

const sendEmail = async (options) => {
  const transport = createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'vasanthvdev@gmail.com',
    to: options.email,
    subject: options.subject,
    message: options.message,
  };
  await transport.sendMail(mailOptions);
};

export default sendEmail;
