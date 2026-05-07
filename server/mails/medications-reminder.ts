type ReminderMedication = {
  name: string;
  nextDoseDate: Date | string;
  frequencyDays: number;
  isLate?: boolean;
};

type MedicationsReminderEmailParams = {
  clientName: string;
  petName: string;
  medications: ReminderMedication | ReminderMedication[];
  medicationsUrl: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const medicationStatus = (medication: ReminderMedication) => {
  if (medication.isLate ?? new Date(medication.nextDoseDate) < new Date()) {
    return {
      label: "En retard",
      color: "#D4183D",
      background: "#FDECEF",
    };
  }

  return {
    label: "Dans 7 jours",
    color: "#269394",
    background: "#E8F6F6",
  };
};

const settingsUrl = `${process.env.CLIENT_URL}/account/notifications`;

export function medicationsReminderEmail({
  clientName,
  petName,
  medications,
  medicationsUrl,
}: MedicationsReminderEmailParams) {
  const medicationList = Array.isArray(medications)
    ? medications
    : [medications];

  const medicationsHtml = medicationList
    .map((medication) => {
      const status = medicationStatus(medication);

      return `
        <tr>
          <td style="padding:0 0 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:8px;background-color:#FFFFFF;">
              <tr>
                <td style="padding:16px 16px 10px;">
                  <p style="margin:0;color:#030213;font-size:18px;line-height:26px;font-weight:700;">
                    ${escapeHtml(medication.name)}
                  </p>
                </td>
                <td style="padding:16px 16px 10px;text-align:right;">
                  <span style="display:inline-block;padding:4px 10px;border-radius:999px;background-color:${status.background};color:${status.color};font-size:13px;line-height:18px;font-weight:700;">
                    ${status.label}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:10px 16px 0;border-top:1px solid #F0F1F3;">
                  <p style="margin:0 0 6px;color:#717182;font-size:14px;line-height:20px;">
                    Prochaine dose
                  </p>
                  <p style="margin:0;color:#030213;font-size:16px;line-height:24px;font-weight:700;">
                    ${formatDate(medication.nextDoseDate)}
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:12px 16px 16px;color:#4B5563;">
                  <p style="margin:0;font-size:14px;line-height:20px;">
                    Fréquence : tous les <strong>${medication.frequencyDays} jours</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Rappel de médicament</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F3F3F5;">
    <div style="margin:0;padding:24px;background-color:#F3F3F5;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#030213;">
        <tr>
          <td style="padding:24px;background-color:#269394;border-radius:10px 10px 0 0;">
            <p style="margin:0 0 8px;color:#DFF5F5;font-size:14px;line-height:20px;font-weight:700;">
              PetCare
            </p>
            <h1 style="margin:0;color:#FFFFFF;font-size:26px;line-height:34px;font-weight:700;">
              Rappel de médicament
            </h1>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 24px 8px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <p style="margin:0 0 12px;font-size:16px;line-height:24px;">
              Bonjour ${escapeHtml(clientName)},
            </p>
            <p style="margin:0;color:#4B5563;font-size:16px;line-height:24px;">
              Voici les traitements à surveiller pour <strong style="color:#030213;">${escapeHtml(petName)}</strong>.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px 8px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;border-collapse:collapse;">
              ${medicationsHtml}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 24px 28px;background-color:#FFFFFF;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            <a href="${escapeHtml(medicationsUrl)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background-color:#269394;color:#FFFFFF;font-size:15px;line-height:20px;font-weight:700;text-decoration:none;">
              Voir les médicaments
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:18px 24px;background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 10px 10px;">
            <p style="margin:0;color:#717182;font-size:13px;line-height:20px;">
              Vous recevez cet email car un rappel de médicament est actif dans PetCare.
            </p>
            <p style="margin:0;color:#717182;font-size:13px;line-height:20px;">
              Ce mail est envoyé automatiquement par PetCare, veuillez ne pas y répondre.
            </p>
            <p style="margin:0;color:#717182;font-size:13px;line-height:20px;">
              Vous pouvez modifier vos préférences de notification et vous désinscrire à ce type de mail à tout moment dans votre espace client.
              <a href="${escapeHtml(settingsUrl)}" style="color:#269394;text-decoration:none;">Gérer mes notifications</a>.
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}
