const resetEmail = (url: string) =>
    `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f6f9fc;">
      <tr>
        <td align="center">

          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">

            <!-- Title -->
            <tr>
              <td style="font-size:22px;font-weight:600;color:#111;">
                Reset your password
              </td>
            </tr>

            <!-- Spacer -->
            <tr><td height="16"></td></tr>

            <!-- Message -->
            <tr>
              <td style="font-size:14px;color:#444;line-height:1.6;">
                You requested a password reset. Click the button below to create a new password.
              </td>
            </tr>

            <!-- Spacer -->
            <tr><td height="24"></td></tr>

            <!-- Button -->
            <tr>
              <td align="center">
                <a
                  href="{{RESET_URL}}"
                  style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:6px;"
                >
                  Reset Password
                </a>
              </td>
            </tr>

            <!-- Spacer -->
            <tr><td height="24"></td></tr>

            <!-- Expiry -->
            <tr>
              <td style="font-size:13px;color:#666;line-height:1.6;">
                This link will expire in 30 minutes. If you didn’t request a password reset, you can safely ignore this email.
              </td>
            </tr>

            <!-- Divider -->
            <tr><td height="32"></td></tr>

            <tr>
              <td style="border-top:1px solid #eee;padding-top:16px;font-size:12px;color:#888;">
                If the button doesn’t work, copy and paste this link into your browser:
                <br/>
                <a href="{{RESET_URL}}" style="color:#2563eb;">{{RESET_URL}}</a>
              </td>
            </tr>

          </table>

          <!-- Footer -->
          <table width="500" cellpadding="0" cellspacing="0" style="margin-top:16px;">
            <tr>
              <td align="center" style="font-size:12px;color:#999;">
                © {{YEAR}} Analytics Tracker
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`
        .replaceAll("{{RESET_URL}}", url)
        .replaceAll("{{YEAR}}", new Date().getFullYear().toString());

export default resetEmail;
