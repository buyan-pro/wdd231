/* ==========================================================================
   GitHub REST API Fetch Module
   ========================================================================== */

export async function fetchGitHubRepos(username = 'buyan-pro') {
  const container = document.getElementById('github-repos-container');
  if (!container) return;

  // Show a quick loading indicator while fetching
  container.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Loading live GitHub repositories...</p>`;

  const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

    const repos = await response.json();

    if (!repos || repos.length === 0) {
      container.innerHTML = `<p class="error-state">No public repositories found for user ${username}.</p>`;
      return;
    }

    container.innerHTML = repos.map(repo => {
      const description = repo.description ? repo.description : 'Public GitHub development repository.';
      const language = repo.language ? repo.language : 'Code';

      return `
              <article class="service-card github-card">
                <h3>${repo.name}</h3>
                <p>${description}</p>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
                  <span>⭐ ${repo.stargazers_count} Stars</span> | 
                  <span>🍴 ${repo.forks_count} Forks</span> | 
                  <span>${language}</span>
                </div>
                <a href="${repo.html_url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="card-link" 
                   aria-label="View ${repo.name} repository on GitHub (opens in a new tab)"
                   style="margin-top: 0.75rem;">
                   View Repository &rarr;
                </a>
              </article>
            `;
    }).join('');

  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    container.innerHTML = `<p class="error-state">Unable to retrieve live GitHub repository data right now.</p>`;
  }
}