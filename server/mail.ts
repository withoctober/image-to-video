import nodemailer from 'nodemailer';

// we initialize the nodemailer config onceso we can use it in the callbacks
export const mailConfig = {
  server: {
    host: process.env.MAIL_HOST as string,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER as string,
      pass: process.env.MAIL_PASSWORD as string,
    },
  },
  from: 'kontakt@sedecon.tech',
};

export async function sendEmail(params: { to: string; subject: string; text: string; html?: string }) {
  const { to, subject, text, html } = params;
  console.log('sending mail', { to, subject, text, html });

  const transporter = nodemailer.createTransport({
    ...mailConfig.server,
  });
  try {
    await transporter.sendMail({
      to,
      from: mailConfig.from,
      subject,
      text,
      html,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
