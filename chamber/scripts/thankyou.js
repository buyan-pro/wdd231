// chamber/scripts/thankyou.js
document.addEventListener("DOMContentLoaded", () => {
    const summaryContainer = document.getElementById("submission-summary");
    if (!summaryContainer) return;

    const params = new URLSearchParams(window.location.search);

    function getParam(name, fallback = "N/A") {
        const v = params.get(name);
        return v && v.trim().length ? v : fallback;
    }

    const fname = getParam("fname");
    const lname = getParam("lname");
    const email = getParam("email");
    const phone = getParam("phone");
    const title = getParam("title");
    const org = getParam("organization");
    const level = getParam("membership-level");
    const rawTimestamp = params.get("timestamp");

    let formattedDate = "N/A";
    if (rawTimestamp) {
        try {
            const dateObj = new Date(rawTimestamp);
            if (!isNaN(dateObj)) {
                formattedDate = dateObj.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
            }
        } catch (e) { console.warn("thankyou.js: timestamp parse failed", e); }
    }

    summaryContainer.innerHTML = "";

    function appendRow(labelText, contentNodeOrString) {
        const p = document.createElement("p");
        p.style.margin = "8px 0";
        const strong = document.createElement("strong");
        strong.textContent = labelText;
        p.appendChild(strong);
        p.appendChild(document.createTextNode(" "));
        if (typeof contentNodeOrString === "string") {
            p.appendChild(document.createTextNode(contentNodeOrString));
        } else if (contentNodeOrString instanceof Node) {
            p.appendChild(contentNodeOrString);
        }
        summaryContainer.appendChild(p);
    }

    appendRow("👤 Candidate Applicant:", `${fname} ${lname}`);
    appendRow("💼 Position Title:", title);
    appendRow("🏢 Registered Entity:", org);

    if (email !== "N/A") {
        const a = document.createElement("a");
        a.href = `mailto:${email}`;
        a.textContent = email;
        a.style.color = "var(--cta)";
        a.style.textDecoration = "none";
        appendRow("✉️ Email Address:", a);
    } else {
        appendRow("✉️ Email Address:", "N/A");
    }

    appendRow("📞 Mobile Contact:", phone);

    const levelSpan = document.createElement("span");
    levelSpan.textContent = `${level}` !== "N/A" ? `${String(level).toUpperCase()} Tier` : "N/A";
    levelSpan.style.fontWeight = "700";
    levelSpan.style.color = "var(--cta)";
    appendRow("🏅 Membership Selection:", levelSpan);

    const footerP = document.createElement("p");
    footerP.style.margin = "15px 0 0 0";
    footerP.style.paddingTop = "10px";
    footerP.style.borderTop = "1px dashed var(--border)";
    footerP.style.fontSize = "0.85rem";
    footerP.style.color = "var(--muted)";
    footerP.textContent = `📅 Server Submission Marker: ${formattedDate}`;
    summaryContainer.appendChild(footerP);
});