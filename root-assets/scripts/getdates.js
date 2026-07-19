document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic Footer Dates
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;

    // 2. Mobile Hamburger Menu Toggle Functionality
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");

        if (navMenu.classList.contains("open")) {
            menuToggle.textContent = "X";
        } else {
            menuToggle.textContent = "≡";
        }
    });
});
