/* ==========================================================================
   Portfolio Filter & Local JSON Data Module
   ========================================================================== */

export async function initPortfolio() {
    const projectsGrid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!projectsGrid) return;

    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const projects = await response.json();

        // Render all projects initially
        renderProjects(projects, projectsGrid);

        // Attach category filter event listeners
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.dataset.filter;
                const filtered = category === 'all'
                    ? projects
                    : projects.filter(proj => proj.category === category);

                renderProjects(filtered, projectsGrid);
            });
        });

    } catch (error) {
        console.error('Error fetching projects.json:', error);
        projectsGrid.innerHTML = `<p class="error-state">Unable to load projects at this time.</p>`;
    }
}

function renderProjects(projectsList, container) {
    if (projectsList.length === 0) {
        container.innerHTML = `<p class="empty-state">No projects found in this category.</p>`;
        return;
    }

    container.innerHTML = projectsList.map(project => {
        const techStackHtml = Array.isArray(project.techStack)
            ? project.techStack.map(tech => `<span style="background: var(--border-light); font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px;">${tech}</span>`).join('')
            : '';

        return `
            <article class="service-card project-card">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <div class="tech-tags" style="margin: 0.75rem 0; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${techStackHtml}
              </div>
              <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                <a href="${project.demoUrl}" class="card-link" aria-label="Live view for ${project.title}">Live View &rarr;</a>
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="card-link" style="color: var(--text-muted);" aria-label="Source code for ${project.title} (opens in new tab)">Source &rarr;</a>
              </div>
            </article>
        `;
    }).join('');
}