/* ==========================================================================
   Navigation & Dialog Modal Module
   ========================================================================== */

export function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            menuToggle.classList.toggle('active');
            primaryNav.classList.toggle('show');
        });
    }
}

export function initContactModal() {
    const contactModal = document.getElementById('contact-modal');
    const openButtons = document.querySelectorAll('.open-contact-modal');
    const closeButton = document.getElementById('close-modal');

    if (!contactModal) return;

    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.showModal();
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            contactModal.close();
        });
    }

    // Backdrop click detection (triggers only when clicking overlay background)
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.close();
        }
    });
}

export function updateFooterDates() {
    const yearSpan = document.getElementById('current-year');
    const modifiedSpan = document.getElementById('last-modified-date');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (modifiedSpan) {
        modifiedSpan.textContent = document.lastModified;
    }
}