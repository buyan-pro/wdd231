// chamber/scripts/main.js
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Toggle Navigation Menu with accessibility attributes
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        const navId = navMenu.id || "nav-menu";
        menuToggle.setAttribute("aria-controls", navId);
        const isOpen = navMenu.classList.contains("open");
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuToggle.innerHTML = isOpen ? "✕" : "☰";

        function setToggle(open) {
            if (open) {
                navMenu.classList.add("open");
                menuToggle.innerHTML = "✕";
                menuToggle.setAttribute("aria-expanded", "true");
            } else {
                navMenu.classList.remove("open");
                menuToggle.innerHTML = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            }
        }

        menuToggle.addEventListener("click", () => setToggle(!navMenu.classList.contains("open")));
        menuToggle.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
                ev.preventDefault();
                setToggle(!navMenu.classList.contains("open"));
            }
        });
    }

    // Footer metrics
    const currentYearEl = document.getElementById("current-year");
    const lastModifiedEl = document.getElementById("last-modified-date");
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified || "Not available";
});