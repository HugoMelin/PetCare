export default function useFeedback() {
  async function sendFeedback(payload) {
    const { type, email, subject, message } = payload;

    if (!email || !message) {
      throw new Error("All fields are required.");
    }

    const capitalizedType = type
      ? type.charAt(0).toUpperCase() + type.slice(1)
      : type;

    return await $fetch("/api/feedback/send", {
      method: "POST",
      body: {
        email,
        subject: subject ? `${capitalizedType} - ${subject}` : capitalizedType,
        message,
      },
    });
  }

  return {
    sendFeedback,
  };
}
