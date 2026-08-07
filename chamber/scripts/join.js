// chamber/scripts/join.js
document.addEventListener("DOMContentLoaded", () => {
  const timestampField = document.getElementById("form-timestamp");
  if (!timestampField) return;

  try {
    if (!timestampField.value) {
      const now = new Date();
      timestampField.value = now.toISOString();
    }
    const displayEl = document.getElementById("form-timestamp-display");
    if (displayEl) {
      const displayDate = timestampField.value ? new Date(timestampField.value) : new Date();
      displayEl.textContent = displayDate.toLocaleString();
    }
  } catch (err) {
    console.error("join.js: failed to set timestamp:", err);
  }
});