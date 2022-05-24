import * as nodemailer from 'nodemailer';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

const transporter = nodemailer.createTransport(
  {
    host: env.get('MAIL_HOST').required().asString(),
    port: env.get('MAIL_PORT').required().asIntPositive(),
    secure: false,
    auth: {
      user: env.get('MAIL_USER').required().asString(),
      pass: env.get('MAIL_PASS').required().asString(),
    },
  },
  {
    from: `<${env.get('MAIL_USER').required().asString()}>`,
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
