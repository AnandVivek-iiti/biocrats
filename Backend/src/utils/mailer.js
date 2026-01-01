
import { Resend } from "resend";

let resend = null;

if (process.env.ENABLE_MAIL === "true") {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: auto;
      border-radius: 8px;
      padding: 24px;
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #4f46e5;
    }
    .content {
      font-size: 15px;
      color: #333333;
      line-height: 1.6;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #777777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Biocrats</div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Biocrats · All rights reserved
    </div>
  </div>
</body>
</html>
`;

export const sendMail = async ({ to, subject, html }) => {
  if (!resend) {
    console.log("📭 Mail disabled (ENABLE_MAIL=false)");
    return;
  }

  try {
    await resend.emails.send({
      from: "Biocrats <onboarding@resend.dev>",
      to,
      subject,
      html: baseTemplate(html),
    });

    console.log(`📧 Mail sent to ${to}`);
  } catch (err) {
    console.error("❌ Mail failed:", err.message);
  }
};
