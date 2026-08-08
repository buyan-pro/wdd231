/* ==========================================================================
   Navigation, Modal Dialog, and Footer Date Module
   ========================================================================== */

export function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('primary-nav');

    if (!menuToggle || !navMenu) return;

    // Toggle mobile menu on hamburger click
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when any nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

export function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const openButtons = document.querySelectorAll('.open-contact-modal');
    const closeButton = document.getElementById('close-modal');

    if (!modal) return;

    // Open modal
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.showModal();
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal via X button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.close();
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking backdrop
    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (
            rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
            modal.close();
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key (native to dialog, but ensure cleanup)
    modal.addEventListener('close', () => {
        document.body.style.overflow = '';
    });
}

export function updateFooterDates() {
    const yearEl = document.getElementById('current-year');
    const modifiedEl = document.getElementById('last-modified-date');

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    if (modifiedEl) {
        modifiedEl.textContent = document.lastModified;
    }
}