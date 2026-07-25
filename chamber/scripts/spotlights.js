document.addEventListener("DOMContentLoaded", () => {
    // 1. Data Endpoint Configuration
    const membersUrl = "data/members.json";
    const spotlightContainer = document.querySelector("#spotlight-container");

    // 2. Fetch data from JSON database asynchronously
    async function getSpotlightMembers() {
        try {
            const response = await fetch(membersUrl);
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            const membersList = await response.json();

            // 3. Filter for Premium Tiers: Only Silver (2) or Gold (3) membership levels allowed
            const premiumMembers = membersList.filter(member =>
                member.membership === 2 || member.membership === 3
            );

            // 4. Randomize selection and pick exactly 2 or 3 entities
            const selectedSpotlights = getRandomMembers(premiumMembers, 3);

            // 5. Build and inject cards into the interface
            displaySpotlights(selectedSpotlights);
        } catch (error) {
            console.error("Error processing sponsor data stream profiles:", error);
            if (spotlightContainer) {
                spotlightContainer.innerHTML = `<p>Sponsor spotlights temporarily unavailable.</p>`;
            }
        }
    }

    // Shuffle Array Utility (Fisher-Yates style random selection)
    function getRandomMembers(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 6. Dynamic Card Generation Framework
    function displaySpotlights(spotlightArray) {
        if (!spotlightContainer) return;
        spotlightContainer.innerHTML = ""; // Clear loader placeholder

        spotlightArray.forEach(member => {
            const card = document.createElement("section");

            // Add semantic styling classes matching membership level variants
            card.className = `spotlight-card tier-${member.membership}`;

            card.innerHTML = `
                <div class="spotlight-header">
                    <span class="company-badge">${member.membership === 3 ? "⭐ Gold Sponsor" : "✨ Silver Member"}</span>
                    <h3>${member.name}</h3>
                </div>
                <p class="spotlight-tagline">"${member.tagline}"</p>
                <div class="spotlight-details">
                    <p><strong>📍 Address:</strong> ${member.address}</p>
                    <p><strong>📞 Phone:</strong> ${member.phone}</p>
                    <p><strong>🌐 Web:</strong> <a href="${member.url}" target="_blank" rel="noopener noreferrer">${member.url.replace('https://', '')}</a></p>
                </div>
            `;
            spotlightContainer.appendChild(card);
        });
    }

    // 7. Dynamic Date Timestamp Metrics Hooks - INSERT THIS RIGHT ABOVE getSpotlightMembers()
    const currentYearEl = document.getElementById("current-year");
    const lastModifiedEl = document.getElementById("last-modified-date");

    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

    // Initialize business randomizer loop (This is your existing final call line)
    getSpotlightMembers();
});
