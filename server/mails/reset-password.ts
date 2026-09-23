type ResetPasswordEmailParams = {
  clientName: string;
  resetUrl: string;
  expiresInMinutes: number;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function resetPasswordEmail({
  clientName,
  resetUrl,
  expiresInMinutes,
}: ResetPasswordEmailParams) {
  const safeUrl = escapeHtml(resetUrl);

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Réinitialisation de votre mot de passe</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F3F3F5;">
    <div style="margin:0;padding:24px;background-color:#F3F3F5;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#030213;">
        <tr>
          <td style="padding:24px;background-color:#269394;border-radius:10px 10px 0 0;">
            <p style="margin:0 0 8px;color:#DFF5F5;font-size:14px;line-height:20px;font-weight:700;">PetCare</p>
            <h1 style="margin:0;color:#FFFFFF;font-size:26px;line-height:34px;font-weight:700;">Un nouveau mot de passe</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px 8px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <p style="margin:0 0 12px;font-size:16px;line-height:24px;">Bonjour${clientName.trim() ? ` ${escapeHtml(clientName.trim())}` : ""},</p>
            <p style="margin:0;color:#4B5563;font-size:16px;line-height:24px;">Vous avez demandé à réinitialiser le mot de passe de votre compte PetCare. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 8px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:16px;border-radius:8px;background-color:#E8F6F6;">
                  <p style="margin:0;color:#269394;font-size:14px;line-height:22px;font-weight:700;">Ce lien est valable pendant ${expiresInMinutes} minutes et ne peut être utilisé qu’une seule fois.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px 28px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <a href="${safeUrl}" style="display:inline-block;padding:12px 18px;border-radius:8px;background-color:#269394;color:#FFFFFF;font-size:15px;line-height:20px;font-weight:700;text-decoration:none;">Choisir un nouveau mot de passe</a>
            <p style="margin:20px 0 8px;color:#717182;font-size:13px;line-height:20px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
            <p style="margin:0;font-size:13px;line-height:20px;word-break:break-all;overflow-wrap:anywhere;"><a href="${safeUrl}" style="color:#269394;text-decoration:underline;">${safeUrl}</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px;background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 10px 10px;">
            <p style="margin:0 0 8px;color:#717182;font-size:13px;line-height:20px;">Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email. Votre mot de passe reste inchangé.</p>
            <p style="margin:0;color:#717182;font-size:13px;line-height:20px;">Ce mail est envoyé automatiquement par PetCare, veuillez ne pas y répondre.</p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}
