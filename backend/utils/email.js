const nodemailer = require("nodemailer");

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function escapeHtml(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(value).replace(
    /[&<>"']/g,
    (character) => characters[character]
  );
}

function createTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: requiredEnv("SMTP_HOST"),
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: requiredEnv("SMTP_USER"),
      pass: requiredEnv("SMTP_PASSWORD"),
    },
  });
}

function getFrontendUrl() {
  return requiredEnv("FRONTEND_URL").replace(/\/+$/, "");
}

async function sendEmailChangeConfirmation({
  to,
  name,
  token,
}) {
  const transporter = createTransporter();
  const confirmationUrl =
    `${getFrontendUrl()}/confirm-email-change?token=` +
    encodeURIComponent(token);

  const safeName = escapeHtml(name || "there");
  const safeUrl = escapeHtml(confirmationUrl);

  await transporter.sendMail({
    from: requiredEnv("EMAIL_FROM"),
    to,
    subject: "Confirm your new Book Tracker email address",
    text: [
      `Hi ${name || "there"},`,
      "",
      "Someone requested to change the email address on your Book Tracker account.",
      "",
      `Confirm the new address here: ${confirmationUrl}`,
      "",
      "This link expires in 1 hour and can only be used once.",
      "",
      "If you did not request this, you can safely ignore this email.",
    ].join("\n"),
    html: `
      <p>Hi ${safeName},</p>
      <p>
        Someone requested to change the email address on your
        Book Tracker account.
      </p>
      <p>
        <a href="${safeUrl}">Confirm your new email address</a>
      </p>
      <p>This link expires in 1 hour and can only be used once.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
}

async function sendEmailChangeNotification({
  to,
  name,
  newEmail,
}) {
  const transporter = createTransporter();
  const safeName = escapeHtml(name || "there");
  const safeEmail = escapeHtml(newEmail);

  await transporter.sendMail({
    from: requiredEnv("EMAIL_FROM"),
    to,
    subject: "Your Book Tracker email is being changed",
    text: [
      `Hi ${name || "there"},`,
      "",
      `A request was made to change your Book Tracker email address to ${newEmail}.`,
      "",
      "The change will only complete after the new address confirms it.",
      "",
      "If you did not request this, log in and change your password immediately.",
    ].join("\n"),
    html: `
      <p>Hi ${safeName},</p>
      <p>
        A request was made to change your Book Tracker email address
        to <strong>${safeEmail}</strong>.
      </p>
      <p>
        The change will only complete after the new address confirms it.
      </p>
      <p>
        If you did not request this, log in and change your password immediately.
      </p>
    `,
  });
}

module.exports = {
  sendEmailChangeConfirmation,
  sendEmailChangeNotification,
};