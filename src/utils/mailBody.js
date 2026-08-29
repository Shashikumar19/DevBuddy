const mailBody = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; font-family:Arial, Helvetica, sans-serif;">

          <!-- Header -->
          <tr>
            <td style="background-color:#111827; padding:24px 32px;">
              <span style="color:#ffffff; font-size:20px; font-weight:bold;">DevBuddy</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px; font-size:15px; color:#111827;">Hi <strong>{{recipient}}</strong>,</p>

              <p style="margin:0 0 16px; font-size:15px; color:#374151; line-height:1.6;">
            <strong> {{connectionrequester}} </strong>  would like to connect with you and stay in touch.
              </p>

              <p style="margin:0 0 24px; font-size:15px; color:#374151; line-height:1.6;">
               Visit their profile to learn more and accept the connection request if you'd like to connect.
              </p>

              <p style="margin:28px 0 0; font-size:15px; color:#111827;">
                Best,<br>
                DevBuddy.com <br>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:20px 32px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                DevBuddy 
                <a style="  :#9ca3af;">devbuddy.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

module.exports = { mailBody }