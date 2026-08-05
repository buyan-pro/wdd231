/* ==========================================================================
   Interactive Scope Estimator Module
   ========================================================================== */

import { saveEstimateToStorage, getStoredEstimate } from './storage.js';

export function initScopeEstimator() {
    const estimatorForm = document.getElementById('estimator-form');
    if (!estimatorForm) return;

    const totalCostEl = document.getElementById('total-cost');
    const totalDaysEl = document.getElementById('total-days');
    const selectedCountEl = document.getElementById('selected-count');
    const saveBtn = document.getElementById('save-estimate-btn');
    const storageMessageEl = document.getElementById('storage-message');

    function calculateTotals() {
        const checkedBoxes = Array.from(estimatorForm.querySelectorAll('input[name="service"]:checked'));

        // Compute totals using Array.reduce()
        const totals = checkedBoxes.reduce((acc, checkbox) => {
            const price = parseFloat(checkbox.dataset.price) || 0;
            const days = parseInt(checkbox.dataset.days, 10) || 0;
            return {
                price: acc.price + price,
                days: acc.days + days
            };
        }, { price: 0, days: 0 });

        // Update DOM UI with formatted currency
        if (totalCostEl) totalCostEl.textContent = `$${totals.price.toLocaleString()}`;
        if (totalDaysEl) totalDaysEl.textContent = `${totals.days} Business Days`;
        if (selectedCountEl) selectedCountEl.textContent = `${checkedBoxes.length} Item${checkedBoxes.length !== 1 ? 's' : ''}`;

        return totals;
    }

    // Recalculate whenever checkbox selection changes
    estimatorForm.addEventListener('change', calculateTotals);

    // Save selection event listener
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const totals = calculateTotals();
            const success = saveEstimateToStorage(totals);
            if (storageMessageEl) {
                storageMessageEl.textContent = success ? '✓ Estimate saved to browser session!' : 'Failed to save estimate.';
                storageMessageEl.style.color = success ? '#059669' : '#DC2626';
            }
        });
    }

    // Initial calculation load
    calculateTotals();

    // Check for existing saved estimate in storage
    const existing = getStoredEstimate();
    if (existing && storageMessageEl) {
        storageMessageEl.textContent = `Last saved quote: $${existing.price.toLocaleString()} (${existing.days} Days)`;
    }
}