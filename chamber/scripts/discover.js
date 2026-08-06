// W05: Chamber Discover Page JavaScript Engine Module
document.addEventListener("DOMContentLoaded", () => {
    // 1. LocalStorage Visit Metric Tracking Engine
    const visitContainer = document.querySelector("#visit-message");

    if (visitContainer) {
        const lastVisit = localStorage.getItem("chamber-last-visit");
        const currentTimestamp = Date.now();

        if (!lastVisit) {
            // Case A: First time visitor greeting match
            visitContainer.innerHTML = "✨ <strong>Welcome! Let us know if you have any questions.</strong>";
        } else {
            const timeDifference = currentTimestamp - parseInt(lastVisit);
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

            if (timeDifference < oneDayInMilliseconds) {
                // Case B: Less than a single day interval match
                visitContainer.innerHTML = "⚡ <strong>Back so soon? Awesome!</strong>";
            } else {
                // Case C: Return visit spanning days calculation
                const daysBetween = Math.floor(timeDifference / oneDayInMilliseconds);
                const dayWord = daysBetween === 1 ? "day" : "days";
                visitContainer.innerHTML = `📅 <strong>You last visited ${daysBetween} ${dayWord} ago.</strong>`;
            }
        }
        // Save current timestamp values into user local storage profile
        localStorage.setItem("chamber-last-visit", currentTimestamp.toString());
    }

    // 2. Asynchronous JSON Data Fetch and Dynamic Card Generator
    const discoverGrid = document.querySelector("#discover-items-grid");

    async function loadDiscoverCards() {
        try {
            const response = await fetch("data/discover.json");
            if (!response.ok) throw new Error("Discover data channel unreachable.");

            const places = await response.json();
            if (!discoverGrid) return;
            discoverGrid.innerHTML = ""; // Clear loader text

            places.forEach(item => {
                const card = document.createElement("div");
                card.className = "discover-card card";

                card.innerHTML = `
                    <h2>${item.title}</h2>
                    <figure class="discover-figure">
                        <img src="${item.image}" alt="Scenic view of ${item.title} located in ${item.address}" loading="lazy" width="300" height="200">
                    </figure>
                    <address class="discover-address">📍 ${item.address}</address>
                    <p class="discover-desc">${item.description}</p>
                    <button class="discover-btn">Learn More</button>
                `;
                discoverGrid.appendChild(card);
            });
        } catch (error) {
            console.error("Discover module parsing exception:", error);
            if (discoverGrid) {
                discoverGrid.innerHTML = "<p>Unable to load local attractions directory canvas elements.</p>";
            }
        }
    }

    loadDiscoverCards();
});
