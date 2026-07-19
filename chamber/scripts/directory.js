document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Drawer Navigation Controller
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            menuToggle.innerHTML = navMenu.classList.contains("open") ? "&#x2715;" : "&#9776;";
        });
    }

    // 2. Data Endpoint Declarations - FIXED to use standardized relative path string
    const dataUrl = "data/members.json";
    const displayContainer = document.getElementById("directory-display-container");
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");

    let loadedMembers = [];

    // Fetch and Initialize Directory Engine - FIXED to use standard async fetch formatting
    async function getMembersData() {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP Status Error: ${response.status}`);
            }
            loadedMembers = await response.json();
            renderDirectoryView(loadedMembers);
        } catch (error) {
            console.error("Critical Fetch Error Details:", error);
            if (displayContainer) {
                displayContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--secondary-color); padding: 20px; font-weight: bold;">Failed to safely execute directory fetch engine profile.</p>`;
            }
        }
    }

    // Dynamic HTML Template Generation Architecture - FIXED template literal string nesting bounds
    function renderDirectoryView(membersArray) {
        if (!displayContainer) return;
        displayContainer.innerHTML = "";

        membersArray.forEach(member => {
            const card = document.createElement("section");
            card.classList.add("business-card", `level-${member.membership}`);

            card.innerHTML = `
                <div class="card-logo-wrap" style="min-height: 80px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 2.5rem; color: #CED4DA;">🏢</span>
                </div>
                <h3>${member.name}</h3>
                <p class="tagline">"${member.tagline}"</p>
                <p class="address">📍 ${member.address}</p>
                <p class="phone">📞 ${member.phone}</p>
                <a href="${member.url}" target="_blank" rel="noopener noreferrer">Visit Corporate Website &rarr;</a>
            `;
            displayContainer.appendChild(card);
        });
    }

    // 3. View Switcher Interaction Handlers
    if (gridBtn && listBtn && displayContainer) {
        gridBtn.addEventListener("click", () => {
            displayContainer.classList.add("grid-layout");
            displayContainer.classList.remove("list-layout");
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
            renderDirectoryView(loadedMembers);
        });

        listBtn.addEventListener("click", () => {
            displayContainer.classList.add("list-layout");
            displayContainer.classList.remove("grid-layout");
            listBtn.classList.add("active");
            gridBtn.classList.remove("active");
            renderDirectoryView(loadedMembers);
        });
    }

    // 4. Automated Date Timestamp Metrics Hooks
    const currentYearEl = document.getElementById("current-year");
    const lastModifiedEl = document.getElementById("last-modified-date");

    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

    // Fire application engine loop
    getMembersData();
});
