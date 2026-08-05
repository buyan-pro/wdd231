/* ==========================================================================
   GitHub REST API Fetch Module
   ========================================================================== */

export async function fetchGitHubRepos(username = 'buyan-pro') {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);
        const repos = await response.json();

        container.innerHTML = repos.map(repo => `
      <article class="service-card github-card">
        <h3>${repo.name}</h3>
        <p>${repo.description || 'Public GitHub development repository.'}</p>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
          <span>⭐ ${repo.stargazers_count} Stars</span> | 
          <span>🍴 ${repo.forks_count} Forks</span> | 
          <span>${repo.language || 'Code'}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="card-link" style="margin-top: 0.75rem;">View Repository &rarr;</a>
      </article>
    `).join('');

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        container.innerHTML = `<p class="error-state">Unable to retrieve live GitHub repository data.</p>`;
    }
}