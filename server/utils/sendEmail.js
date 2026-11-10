import "dotenv/config";
import { Resend } from "resend";

export const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM are required to send email");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
  if (error) {
    throw new Error(`Resend email failed: ${error.message}`, { cause: error });
  }
  if (!data?.id) {
    throw new Error("Resend returned no email ID");
  }
  return data;
};

export const sendWelcomeEmail = async (to, username) => {
  const safeUsername = username.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:32px 12px;background-color:#f4f4f6;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <div style="padding:32px;background-color:#171717;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:30px;letter-spacing:-1px;">
              ITCHgram
            </h1>
          </div>

          <div style="padding:36px 32px;color:#242424;">
            <h2 style="font-size:25px;margin:0 0 22px;">
              Welcome aboard! 🎉
            </h2>

            <p style="font-size:16px;line-height:1.7;">
              Hey, <strong>${safeUsername}</strong>!
            </p>

            <p style="font-size:16px;line-height:1.7;">
              Your ITCHgram account has been successfully created.
              You're officially part of our community!
            </p>

            <p style="font-size:16px;line-height:1.7;">
              Share your moments, discover interesting people,
              and make some unforgettable memories.
            </p>

            <div style="margin:28px 0;padding:20px;background-color:#f4f4f6;border-radius:12px;text-align:center;">
              <p style="margin:0;font-size:17px;font-weight:bold;">
                You did it! 🍪
              </p>
              <p style="margin:10px 0 0;font-size:15px;">
                Now go grab yourself a cookie.
                Actually, take two. The medium-sized ones.
              </p>
            </div>

            <p style="font-size:15px;line-height:1.7;">
              See you on ITCHgram!
            </p>

            <p style="font-size:15px;font-weight:bold;">
              The ITCHgram Team
            </p>
          </div>

          <div style="padding:20px;text-align:center;background-color:#fafafa;border-top:1px solid #eeeeee;">
            <p style="font-size:12px;color:#888888;margin:0;">
              © ITCHgram · Made for sharing
            </p>
            <p style="font-size:12px;color:#888888;margin:10px 0 0;">
              You received this email because an ITCHgram account
              was registered using this address.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(to, "Welcome to ITCHgram! 🎉", html);
};

export const sendPasswordResetEmail = async (to, code) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:32px 12px;background-color:#f4f4f6;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
                <tr>
                  <td align="center" bgcolor="#171717" style="padding:32px;background-color:#171717;border-radius:16px 16px 0 0;">
                    <h1 style="margin:0;color:#ffffff;font-size:30px;letter-spacing:-1px;">ITCHgram</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 32px;color:#242424;">
                    <h2 style="font-size:25px;margin:0 0 22px;">Reset your password 🔐</h2>
                    <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">
                      We received a request to reset your ITCHgram password.
                      Enter the code below to choose a new password.
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;">
                      <tr>
                        <td align="center" bgcolor="#f4f4f6" style="padding:24px 12px;background-color:#f4f4f6;border-radius:12px;text-align:center;">
                          <p style="margin:0 0 12px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#666666;">YOUR RESET CODE</p>
                          <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:36px;line-height:1.3;font-weight:bold;letter-spacing:6px;color:#171717;">${code}</p>
                        </td>
                      </tr>
                    </table>
                    <p style="font-size:15px;line-height:1.7;margin:24px 0 0;">
                      This code expires in <strong>10 minutes</strong>.
                    </p>
                    <p style="font-size:15px;line-height:1.7;margin:16px 0 24px;color:#666666;">
                      If you didn't request a password reset, you can safely ignore this email.
                    </p>
                    <p style="font-size:15px;font-weight:bold;margin:0;">The ITCHgram Team</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#fafafa" style="padding:20px;text-align:center;background-color:#fafafa;border-top:1px solid #eeeeee;border-radius:0 0 16px 16px;">
                    <p style="font-size:12px;color:#888888;margin:0;">© ITCHgram · Made for sharing</p>
                    <p style="font-size:12px;line-height:1.5;color:#888888;margin:10px 0 0;">
                      You received this email because a password reset was requested for your ITCHgram account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail(to, "ITCHgram - Password Reset", html);
};
