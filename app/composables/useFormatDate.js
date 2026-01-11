export default function useFormatDate() {
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  // Format date to "Sam. 29 nov."
  function dayNumberMonth(dateString) {
    const options = { weekday: "short", day: "2-digit", month: "short" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  // Format date to "YYYY-MM-DDTHH:MM" for datetime-local input
  function formatForDatetimeLocal(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return {
    formatDate,
    dayNumberMonth,
    formatForDatetimeLocal,
  };
}
