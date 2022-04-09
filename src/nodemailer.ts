import * as nodemailer from 'nodemailer';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport(
  {
    host: env.get('MAIL_HOST').asString(),
    port: env.get('MAIL_PORT').required().asIntPositive(),
    secure: false,
    auth: {
      user: env.get('MAIL_USER').asString(),
      pass: env.get('MAIL_PASS').asString(),
    },
  },
  {
    from: `<${env.get('MAIL_USER').asString()}>`,
  },
);

const mailer = (message: { to: string; subject: string; text: string; html: string; }) => {
  transporter.sendMail(message, (err: Error) => {
    if (err) {
      return console.log(err);
    }
  });
};

export { mailer };
