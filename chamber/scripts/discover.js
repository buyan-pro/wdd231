// chamber/scripts/discover.js
// Robust loader + renderer for the Discover page data (chamber/data/discover.mjs).
// Overwrite your current file with this one and reload discover.html.

document.addEventListener("DOMContentLoaded", async () => {
    const discoverGrid = document.querySelector("#discover-items-grid");
    const visitMessageEl = document.querySelector("#visit-message");

    // Try dynamic import of a module path; return default export or null on failure
    async function tryImport(path) {
        try {
            const mod = await import(path);
            if (mod && mod.default) return mod.default;
            return null;
        } catch (err) {
            return null;
        }
    }

    // Attempt multiple likely file locations for discover.mjs, then try JSON fetch
    async function loadItems() {
        const candidates = [
            '/chamber/data/discover.mjs',            // typical repo root /chamber
            '/wdd231/chamber/data/discover.mjs',     // project path when hosted under /wdd231
            './data/discover.mjs',                   // relative to current script if served from root
            '../data/discover.mjs',                  // relative when script is in scripts/
            '/data/discover.mjs'                     // other possibilities
        ];

        for (const p of candidates) {
            const items = await tryImport(p);
            if (items) return items;
        }

        // final fallback: try fetching JSON if present
        try {
            const res = await fetch('/chamber/data/discover.json');
            if (res.ok) return await res.json();
        } catch (e) {
            // ignore
        }

        throw new Error('Could not load discover data from any path.');
    }

    function updateVisitMessage() {
        if (!visitMessageEl) return;
        const last = localStorage.getItem("chamber-last-visit");
        const now = Date.now();
        if (!last) {
            visitMessageEl.textContent = '✨ Welcome! Let us know if you have any questions.';
        } else {
            const diff = now - parseInt(last, 10);
            const oneDay = 24 * 60 * 60 * 1000;
            if (diff < oneDay) {
                visitMessageEl.textContent = '⚡ Back so soon? Awesome!';
            } else {
                const days = Math.floor(diff / oneDay);
                const dayWord = days === 1 ? 'day' : 'days';
                visitMessageEl.textContent = `📅 You last visited ${days} ${dayWord} ago.`;
            }
        }
        localStorage.setItem('chamber-last-visit', String(now));
    }

    // Inline SVG placeholder (data URI) used when an image fails to load
    const INLINE_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>" +
            "<rect width='100%' height='100%' fill='%23e6ecf2'/>" +
            "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239aa4ad' font-size='20'>Image</text>" +
            "</svg>"
        );

    // Create emoji fallback element (office building)
    function createEmojiElement(label = "office building", sizeClass = "") {
        const e = document.createElement("div");
        e.className = "emoji-icon " + sizeClass;
        e.setAttribute("role", "img");
        e.setAttribute("aria-label", label);
        e.textContent = "🏢";
        return e;
    }

    function createCard(item, idx) {
        const article = document.createElement("article");
        article.className = `discover-card card card--${idx + 1}`;
        article.setAttribute("data-index", idx + 1);

        // Title
        const h3 = document.createElement("h3");
        h3.textContent = item.title || "Untitled";
        article.appendChild(h3);

        // Figure / image or emoji fallback
        const fig = document.createElement("figure");
        fig.className = "discover-figure";

        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.alt || item.title || "Discover image";
            img.loading = "lazy";
            img.style.width = "100%";
            img.style.height = "auto";

            // On error, replace the <img> with an emoji element (no broken icon)
            img.onerror = () => {
                const emoji = createEmojiElement(item.title || "office building");
                fig.replaceChild(emoji, img);
            };

            fig.appendChild(img);
        } else {
            // No image specified — show emoji fallback
            const emoji = createEmojiElement(item.title || "office building");
            fig.appendChild(emoji);
        }

        article.appendChild(fig);

        // Address
        if (item.address) {
            const addr = document.createElement("address");
            addr.className = "discover-address";
            addr.textContent = item.address;
            article.appendChild(addr);
        }

        // Description
        if (item.description) {
            const p = document.createElement("p");
            p.className = "discover-desc";
            p.textContent = item.description;
            article.appendChild(p);
        }

        // CTA
        if (item.url) {
            const a = document.createElement("a");
            a.className = "discover-btn btn";
            a.href = item.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = "Learn More";
            article.appendChild(a);
        } else {
            const btn = document.createElement("button");
            btn.className = "discover-btn btn";
            btn.type = "button";
            btn.disabled = true;
            btn.textContent = "Learn More";
            article.appendChild(btn);
        }

        return article;
    }

    function renderCards(items) {
        if (!discoverGrid) return;
        discoverGrid.innerHTML = "";
        items.forEach((it, i) => {
            const node = createCard(it, i);
            discoverGrid.appendChild(node);
        });
    }

    // Load & render
    try {
        const items = await loadItems();
        updateVisitMessage();
        renderCards(items);
    } catch (err) {
        console.error("discover.js: failed to load items", err);
        if (discoverGrid) {
            discoverGrid.innerHTML = '<p style="padding:1rem;color:var(--muted)">Discover listings are unavailable right now.</p>';
        }
    }
});