import transporter from "../config/mailer.js";

export const sendEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: `"ITCHgramm" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
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
              ITCHgramm
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
              Your ITCHgramm account has been successfully created.
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
              See you on ITCHgramm!
            </p>

            <p style="font-size:15px;font-weight:bold;">
              The ITCHgramm Team
            </p>
          </div>

          <div style="padding:20px;text-align:center;background-color:#fafafa;border-top:1px solid #eeeeee;">
            <p style="font-size:12px;color:#888888;margin:0;">
              © ITCHgramm · Made for sharing
            </p>
            <p style="font-size:12px;color:#888888;margin:10px 0 0;">
              You received this email because an ITCHgramm account
              was registered using this address.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(to, "Welcome to ITCHgramm! 🎉", html);
};
