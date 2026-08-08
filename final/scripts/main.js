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

    // Services page only
    if (document.getElementById('estimator-form')) {
        initScopeEstimator();
    }

    // Portfolio page only
    if (document.getElementById('projects-grid')) {
        initPortfolio();
    }
    if (document.getElementById('github-repos-container')) {
        fetchGitHubRepos('buyan-pro');
    }

    // Thank you page only
    const summaryContainer = document.getElementById('form-summary');
    if (summaryContainer) {
        const params = new URLSearchParams(window.location.search);

        const fullName = params.get('fullName') || params.get('name') || 'Valued Client';
        const email = params.get('email') || 'N/A';
        const serviceType = params.get('serviceType') || params.get('service') || 'General Inquiry';

        const summaryName = document.getElementById('summary-name');
        if (summaryName) summaryName.textContent = fullName;

        const emailEl = document.getElementById('summary-email');
        if (emailEl) emailEl.textContent = email;

        const serviceEl = document.getElementById('summary-service');
        if (serviceEl) serviceEl.textContent = serviceType;
    }
});