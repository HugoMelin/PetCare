<script setup>
const reminder = {
  ownerName: "Hugo",
  petName: "Naya",
  medications: [
    {
      name: "Bravecto",
      status: "En retard",
      statusColor: "#D4183D",
      statusBackground: "#FDECEF",
      nextDoseDate: "29 avril 2026",
      frequencyDays: 90,
    },
    {
      name: "Vermifuge",
      status: "Dans 7 jours",
      statusColor: "#269394",
      statusBackground: "#E8F6F6",
      nextDoseDate: "6 mai 2026",
      frequencyDays: 120,
    },
  ],
};
</script>

<template>
  <div style="margin: 0; padding: 24px; background-color: #f3f3f5">
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
        border-collapse: collapse;
        font-family:
          Arial,
          Helvetica,
          sans-serif;
        color: #030213;
      "
    >
      <tr>
        <td
          style="
            padding: 24px;
            background-color: #269394;
            border-radius: 10px 10px 0 0;
          "
        >
          <p
            style="
              margin: 0 0 8px;
              color: #dff5f5;
              font-size: 14px;
              line-height: 20px;
              font-weight: 700;
            "
          >
            PetCare
          </p>
          <h1
            style="
              margin: 0;
              color: #ffffff;
              font-size: 26px;
              line-height: 34px;
              font-weight: 700;
            "
          >
            Rappel de médicament
          </h1>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding: 28px 24px 8px;
            background-color: #ffffff;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
          "
        >
          <p style="margin: 0 0 12px; font-size: 16px; line-height: 24px">
            Bonjour {{ reminder.ownerName }},
          </p>
          <p
            style="
              margin: 0;
              color: #4b5563;
              font-size: 16px;
              line-height: 24px;
            "
          >
            Voici les traitements à surveiller pour
            <strong style="color: #030213">{{ reminder.petName }}</strong
            >.
          </p>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding: 16px 24px 8px;
            background-color: #ffffff;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
          "
        >
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="width: 100%; border-collapse: collapse"
          >
            <tr
              v-for="medication in reminder.medications"
              :key="medication.name"
            >
              <td
                style="
                  padding: 16px;
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  background-color: #ffffff;
                "
              >
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="width: 100%; border-collapse: collapse"
                >
                  <tr>
                    <td style="padding: 0 0 10px">
                      <p
                        style="
                          margin: 0;
                          color: #030213;
                          font-size: 18px;
                          line-height: 26px;
                          font-weight: 700;
                        "
                      >
                        {{ medication.name }}
                      </p>
                    </td>
                    <td style="padding: 0 0 10px; text-align: right">
                      <span
                        :style="{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          backgroundColor: medication.statusBackground,
                          color: medication.statusColor,
                          fontSize: '13px',
                          lineHeight: '18px',
                          fontWeight: '700',
                        }"
                      >
                        {{ medication.status }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      style="
                        padding: 10px 0 0;
                        border-top: 1px solid #f0f1f3;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 6px;
                          color: #717182;
                          font-size: 14px;
                          line-height: 20px;
                        "
                      >
                        Prochaine dose
                      </p>
                      <p
                        style="
                          margin: 0;
                          color: #030213;
                          font-size: 16px;
                          line-height: 24px;
                          font-weight: 700;
                        "
                      >
                        {{ medication.nextDoseDate }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      style="padding: 12px 0 0; color: #4b5563"
                    >
                      <p style="margin: 0; font-size: 14px; line-height: 20px">
                        Fréquence : tous les
                        <strong>{{ medication.frequencyDays }} jours</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding: 20px 24px 28px;
            background-color: #ffffff;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
          "
        >
          <a
            href="https://petcare.torefi.fr/medicaments"
            style="
              display: inline-block;
              padding: 12px 18px;
              border-radius: 8px;
              background-color: #269394;
              color: #ffffff;
              font-size: 15px;
              line-height: 20px;
              font-weight: 700;
              text-decoration: none;
            "
          >
            Voir les médicaments
          </a>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding: 18px 24px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 10px 10px;
          "
        >
          <p
            style="
              margin: 0;
              color: #717182;
              font-size: 13px;
              line-height: 20px;
            "
          >
            Vous recevez cet email car un rappel de médicament est actif dans
            PetCare.
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>
