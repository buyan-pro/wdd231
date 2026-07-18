document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Navigation Handle
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            menuToggle.innerHTML = navMenu.classList.contains("open") ? "&#x2715;" : "&#9776;";
        });
    }

    // 2. Directory Elements and Smart Path Configuration
    const displayContainer = document.getElementById("directory-display-container");
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");
    let loadedMembers = [];

    // Dynamically calculate paths to prevent 404 errors on GitHub Pages and local subfolders
    const currentPath = window.location.pathname;
    let dataUrl = "data/members.json"; // Default fallback fallback path

    if (currentPath.includes("/chamber/")) {
        // Force relative addressing if inside the assignment subfolder
        dataUrl = "data/members.json";
    }

    // Fetch and Initialize Directory Engine
    async function getMembersData() {
        try {
            console.log("Attempting to fetch JSON data from calculated path:", dataUrl);
            let response = await fetch(dataUrl);

            // Proactive fallback mechanism: Try root relative if the standard relative path fails
            if (!response.ok && !dataUrl.startsWith("/")) {
                console.warn("Primary relative path failed. Attempting root-relative fallback...");
                dataUrl = "./data/members.json";
                response = await fetch(dataUrl);
            }

            if (!response.ok) {
                throw new Error(`HTTP Status: ${response.status} (File not found at requested URL mapping: ${window.location.origin}/${dataUrl})`);
            }

            loadedMembers = await response.json();
            renderDirectoryView(loadedMembers);
        } catch (error) {
            console.error("Critical Fetch Error Details:", error);
            if (displayContainer) {
                displayContainer.innerHTML = `
                    <div class="error-msg" style="grid-column: 1/-1; text-align: center; color: #DA251D; padding: 20px; font-weight: bold;">
                        <p>Failed to securely load directory profiles.</p>
                        <small style="color: #6C757D; font-weight: normal; display: block; margin-top: 5px;">Reason: ${error.message}</small>
                        <div style="margin-top: 15px; padding: 10px; background: #F8F9FA; border: 1px dashed #CED4DA; font-size: 0.85rem; font-weight: normal; color: #495057; text-align: left; display: inline-block;">
                            <strong>💡 Double-check checklist:</strong><br>
                            1. Ensure you have a folder named exactly <code style="background:#E9ECEF; padding:2px 4px; border-radius:3px;">data</code> inside your <code style="background:#E9ECEF; padding:2px 4px; border-radius:3px;">chamber</code> directory.<br>
                            2. Verify that the file inside it is named exactly <code style="background:#E9ECEF; padding:2px 4px; border-radius:3px;">members.json</code> (all lowercase).
                        </div>
                    </div>`;
            }
        }
    }

    // Dynamic HTML Generation Architecture
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

    // 3. View Switcher State Handlers
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

    // 4. Global Structural Footer Dynamic Updates
    const currentYearEl = document.getElementById("current-year");
    const lastModifiedEl = document.getElementById("last-modified-date");

    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

    // Execute Data Gathering Initialization
    getMembersData();
});
