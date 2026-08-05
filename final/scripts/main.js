/* ==========================================================================
   Morning Bliss - Main ES Module Entry Point
   ========================================================================== */

import { initNavigation, initContactModal, updateFooterDates } from './navigation.js';
import { initScopeEstimator } from './estimator.js';
import { initPortfolio } from './portfolioFilter.js';
import { fetchGitHubRepos } from './githubApi.js';

document.addEventListener('DOMContentLoaded', () => {
    // Global components initialization across all pages
    initNavigation();
    initContactModal();
    updateFooterDates();

    // Page-specific module initialization (guarded inside their respective functions)
    initScopeEstimator();
    initPortfolio();
    fetchGitHubRepos('buyan-pro');

    // URLSearchParams logic for thankyou.html form submission display
    const summaryContainer = document.getElementById('form-summary');
    const summaryName = document.getElementById('summary-name');

    if (summaryContainer || summaryName) {
        const params = new URLSearchParams(window.location.search);

        const fullName = params.get('fullName') || params.get('name') || 'Valued Client';
        const email = params.get('email') || 'N/A';
        const serviceType = params.get('serviceType') || params.get('service') || 'General Inquiry';

        if (summaryName) summaryName.textContent = fullName;

        const emailEl = document.getElementById('summary-email');
        if (emailEl) emailEl.textContent = email;

        const serviceEl = document.getElementById('summary-service');
        if (serviceEl) serviceEl.textContent = serviceType;
    }
});