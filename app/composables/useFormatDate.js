export default function useFormatDate() {
  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  // Format date to "Sam. 29 nov."
  function dayNumberMonth(dateString) {
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  return {
    formatDate,
    dayNumberMonth,
  };
}