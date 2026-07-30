document.addEventListener("DOMContentLoaded", () => {
    // 1. Grab current active browser window location query parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const summaryContainer = document.getElementById("submission-summary");
    if (!summaryContainer) return;

    // 2. Extract values safely using the input attribute name tokens
    const fname = urlParams.get("fname") || "N/A";
    const lname = urlParams.get("lname") || "N/A";
    const email = urlParams.get("email") || "N/A";
    const phone = urlParams.get("phone") || "N/A";
    const title = urlParams.get("title") || "N/A";
    const org = urlParams.get("organization") || "N/A";
    const level = urlParams.get("membership-level") || "N/A";
    const rawTimestamp = urlParams.get("timestamp");

    // Format human-readable date strings from the encoded ISO millisecond values
    let formattedDate = "N/A";
    if (rawTimestamp) {
        const dateObj = new Date(decodeURIComponent(rawTimestamp));
        formattedDate = dateObj.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }

    // 3. Build HTML components structural string nodes
    const detailsHtml = `
        <p style="margin: 8px 0;"><strong>👤 Candidate Applicant:</strong> ${fname} ${lname}</p>
        <p style="margin: 8px 0;"><strong>💼 Position Title:</strong> ${title}</p>
        <p style="margin: 8px 0;"><strong>🏢 Registered Entity:</strong> ${org.replace(/\+/g, ' ')}</p>
        <p style="margin: 8px 0;"><strong>✉️ Email Address:</strong> <a href="mailto:${email.replace('%40', '@')}" style="color: var(--secondary-color); text-decoration: none;">${email.replace('%40', '@')}</a></p>
        <p style="margin: 8px 0;"><strong>📞 Mobile Contact:</strong> ${phone}</p>
        <p style="margin: 8px 0; text-transform: uppercase;"><strong>🏅 Membership Selection:</strong> <span style="font-weight: bold; color: var(--secondary-color);">${level} Tier</span></p>
        <p style="margin: 15px 0 0 0; padding-top: 10px; border-top: 1px dashed var(--btn-border); font-size: 0.8rem; color: var(--text-muted);">
            📅 Server Submission Marker: ${formattedDate}
        </p>
    `;

    // Append output list into layout container block
    summaryContainer.innerHTML += detailsHtml;
});
