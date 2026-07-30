document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Toggle Navigation Menu
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            // Swaps icon between three-bar hamburger (☰) and an close mark (✕)
            menuToggle.innerHTML = navMenu.classList.contains("open") ? "&#x2715;" : "&#9776;";
        });
    }

    // 2. Dynamic Footer Metrics Components
    const currentYearEl = document.getElementById("current-year");
    const lastModifiedEl = document.getElementById("last-modified-date");

    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;
});
