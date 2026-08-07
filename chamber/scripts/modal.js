// chamber/scripts/modal.js
document.addEventListener('DOMContentLoaded', () => {
    const openers = document.querySelectorAll('.open-modal');
    const modals = document.querySelectorAll('.modal');

    function openModal(modal) {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'false');
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openers.forEach(btn => {
        btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            const id = btn.dataset.modal;
            const modal = document.getElementById(id);
            openModal(modal);
        });
    });

    modals.forEach(m => {
        m.addEventListener('click', (ev) => { if (ev.target === m) closeModal(m); });
        const closeBtn = m.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(m));
        m.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(m); });
    });
});