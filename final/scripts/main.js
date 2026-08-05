/* ==========================================================================
   Morning Bliss - Main ES Module Entry Point
   ========================================================================== */

import { initNavigation, initContactModal, updateFooterDates } from './navigation.js';
import { initScopeEstimator } from './estimator.js';
import { initPortfolio } from './portfolioFilter.js';
import { fetchGitHubRepos } from './githubApi.js';

document.addEventListener('DOMContentLoaded', () => {
    // Global components initialization
    initNavigation();
    initContactModal();
    updateFooterDates();

    // Page-specific module initialization
    initScopeEstimator();
    initPortfolio();
    fetchGitHubRepos('buyan-pro');

    // URLSearchParams logic for thankyou.html
    const summaryName = document.getElementById('summary-name');
    if (summaryName) {
        const params = new URLSearchParams(window.location.search);
        summaryName.textContent = params.get('fullName') || 'N/A';

        const emailEl = document.getElementById('summary-email');
        if (emailEl) emailEl.textContent = params.get('email') || 'N/A';

        const serviceEl = document.getElementById('summary-service');
        if (serviceEl) serviceEl.textContent = params.get('serviceType') || 'General Quote';
    }
});