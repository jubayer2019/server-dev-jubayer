import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const service = process.env.SMTP_SERVICE;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  const transportOptions = service
    ? {
        service,
        auth: {
          user,
          pass,
        },
      }
    : {
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      };

  if (!service && !host) {
    return null;
  }

  transporter = nodemailer.createTransport(transportOptions);

  return transporter;
}

export async function sendContactEmail(message) {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    throw new Error("Email service is not configured");
  }

  const recipient = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
  const sender = process.env.CONTACT_SENDER_EMAIL || process.env.SMTP_USER;

  if (!recipient || !sender) {
    throw new Error("Contact email recipient and sender must be configured");
  }

  await mailTransporter.sendMail({
    from: `Portfolio Contact <${sender}>`,
    to: recipient,
    replyTo: message.email,
    subject: `Portfolio contact: ${message.subject}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Subject: ${message.subject}`,
      "",
      message.message,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2 style="margin: 0 0 16px;">New portfolio contact submission</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
          ${String(message.message).replace(/\n/g, "<br />")}
        </div>
      </div>
    `,
  });
}
