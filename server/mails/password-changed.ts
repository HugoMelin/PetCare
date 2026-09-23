type PasswordChangedEmailParams = {
  clientName: string;
  recoveryUrl: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function passwordChangedEmail({
  clientName,
  recoveryUrl,
}: PasswordChangedEmailParams) {
  const safeUrl = escapeHtml(recoveryUrl);

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Votre mot de passe a été modifié</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F3F3F5;">
    <div style="margin:0;padding:24px;background-color:#F3F3F5;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#030213;">
        <tr>
          <td style="padding:24px;background-color:#269394;border-radius:10px 10px 0 0;">
            <p style="margin:0 0 8px;color:#DFF5F5;font-size:14px;line-height:20px;font-weight:700;">PetCare</p>
            <h1 style="margin:0;color:#FFFFFF;font-size:26px;line-height:34px;font-weight:700;">Votre mot de passe a été modifié</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px 8px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <p style="margin:0 0 12px;font-size:16px;line-height:24px;">Bonjour${clientName.trim() ? ` ${escapeHtml(clientName.trim())}` : ""},</p>
            <p style="margin:0;color:#4B5563;font-size:16px;line-height:24px;">Le mot de passe de votre compte PetCare vient d’être modifié. Si vous êtes à l’origine de ce changement, aucune action n’est nécessaire.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 8px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:16px;border-radius:8px;background-color:#E8F6F6;">
                  <p style="margin:0;color:#269394;font-size:14px;line-height:22px;font-weight:700;">Vous n’êtes pas à l’origine de ce changement ? Réinitialisez votre mot de passe pour sécuriser votre compte.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px 28px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <a href="${safeUrl}" style="display:inline-block;padding:12px 18px;border-radius:8px;background-color:#269394;color:#FFFFFF;font-size:15px;line-height:20px;font-weight:700;text-decoration:none;">Réinitialiser mon mot de passe</a>
            <p style="margin:20px 0 8px;color:#717182;font-size:13px;line-height:20px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
            <p style="margin:0;font-size:13px;line-height:20px;word-break:break-all;overflow-wrap:anywhere;"><a href="${safeUrl}" style="color:#269394;text-decoration:underline;">${safeUrl}</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px;background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 10px 10px;">
            <p style="margin:0 0 8px;color:#717182;font-size:13px;line-height:20px;">Le bouton vous permet de demander un lien sécurisé par email pour choisir un nouveau mot de passe.</p>
            <p style="margin:0;color:#717182;font-size:13px;line-height:20px;">Ce mail est envoyé automatiquement par PetCare, veuillez ne pas y répondre.</p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}
