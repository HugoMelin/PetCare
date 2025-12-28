import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, subject, message } = body;

  if (!email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required.",
    });
  }

  // Create a transporter object using SMTP transport
  const port = Number(process.env.IONOS_SMTP_PORT) || 587;

  const transporter = nodemailer.createTransport({
    host: process.env.IONOS_SMTP_HOST,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.IONOS_SMTP_USER,
      pass: process.env.IONOS_SMTP_PASS,
    },
    requireTLS: port === 587,
  });

  await transporter.verify();

  const mailConfig = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    replyTo: email,
    text: `
      Vous avez reçu un nouveau message de feedback.

      Email: ${email}
      Sujet: ${subject || "Non fourni"}
      Message:
      ${message}
    `,
  };

  if (subject) {
    mailConfig.subject = `PetCare - ${subject} - feedback`;
  } else {
    mailConfig.subject = `PetCare - Nouveau message de feedback`;
  }

  await transporter.sendMail(mailConfig);

  return { success: true };
});
