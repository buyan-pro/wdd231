document.addEventListener("DOMContentLoaded", () => {
    const timestampField = document.getElementById("form-timestamp");
    if (timestampField) {
        // Automatically injects current date and time string on load
        timestampField.value = new Date().toISOString();
    }
});
