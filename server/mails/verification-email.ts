const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function verificationEmail({
  verificationUrl,
}: {
  verificationUrl: string;
}) {
  const safeUrl = escapeHtml(verificationUrl);

  return `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8"><title>Confirmez votre adresse email</title></head>
  <body style="margin:0;padding:24px;background:#F3F3F5;font-family:Arial,Helvetica,sans-serif;color:#030213;">
    <div style="max-width:640px;margin:auto;padding:24px;background:#FFFFFF;border-radius:10px;">
      <h1 style="color:#269394;">Confirmez votre adresse email PetCare</h1>
      <p>Cliquez sur le bouton ci-dessous pour confirmer cette adresse email.</p>
      <p>Si vous avez demandé un changement d’adresse, votre adresse actuelle reste inchangée tant que vous n’avez pas confirmé.</p>
      <p>Ce lien est valable pendant 60 minutes.</p>
      <p><a href="${safeUrl}" style="display:inline-block;padding:12px 18px;background:#269394;color:#FFFFFF;border-radius:8px;text-decoration:none;">Confirmer mon adresse email</a></p>
      <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
      <p style="word-break:break-all;"><a href="${safeUrl}">${safeUrl}</a></p>
      <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
    </div>
  </body>
</html>`;
}
