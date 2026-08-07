// chamber/scripts/spotlights.js
// Safer spotlight loader: preload images off-DOM and use emoji fallback when image missing or fails.
// Overwrite your current spotlights.js with this one.

document.addEventListener("DOMContentLoaded", () => {
    const spotlightContainer = document.querySelector("#spotlight-container");
    if (!spotlightContainer) return;

    // Inline placeholder used as an initial src to avoid 404 broken icon flashes
    const INLINE_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>" +
            "<rect width='100%' height='100%' fill='%23f3f6f8'/>" +
            "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239aa4ad' font-size='18'>Image</text>" +
            "</svg>"
        );

    // Helper to fetch JSON with a couple of likely paths
    async function fetchMembers() {
        const candidates = [
            '/chamber/data/members.json',
            '/wdd231/chamber/data/members.json',
            './data/members.json',
            '../data/members.json',
            '/data/members.json'
        ];

        for (const p of candidates) {
            try {
                const res = await fetch(p);
                if (res.ok) return await res.json();
            } catch (e) {
                // ignore and try next
            }
        }
        throw new Error('Could not load members.json from any path.');
    }

    function createEmojiElement(label = "office building", sizeClass = "") {
        const e = document.createElement("div");
        e.className = "emoji-icon " + sizeClass;
        e.setAttribute("role", "img");
        e.setAttribute("aria-label", label);
        e.textContent = "🏢";
        return e;
    }

    function getRandomMembers(array, count) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, Math.min(count, copy.length));
    }

    function displaySpotlights(arr) {
        spotlightContainer.innerHTML = "";
        arr.forEach(m => {
            const s = document.createElement("article");
            s.className = "spotlight card";

            const h = document.createElement("h3");
            h.textContent = m.name || "Member";
            s.appendChild(h);

            // Image wrapper with reserved height to avoid reflow
            const imgWrap = document.createElement("div");
            imgWrap.className = "spotlight-img-wrap";
            imgWrap.style.width = "100%";
            imgWrap.style.height = "64px";
            imgWrap.style.display = "flex";
            imgWrap.style.alignItems = "center";
            imgWrap.style.justifyContent = "center";
            imgWrap.style.margin = "0.45rem 0";

            // Start with a neutral inline placeholder img element (so DOM has stable layout)
            const img = document.createElement("img");
            img.src = INLINE_PLACEHOLDER;
            img.alt = m.name ? `${m.name} logo` : "member logo";
            img.style.maxHeight = "64px";
            img.style.objectFit = "contain";
            img.style.display = "block";
            imgWrap.appendChild(img);
            s.appendChild(imgWrap);

            // Preload real image off-DOM and swap only if it loads successfully
            if (m.image) {
                const pre = new Image();
                pre.onload = () => {
                    // swap to the loaded image (no broken icon)
                    img.src = m.image;
                };
                pre.onerror = () => {
                    // replace the <img> element with an emoji fallback (clean)
                    const emoji = createEmojiElement(m.name || "office building");
                    imgWrap.replaceChild(emoji, img);
                };
                pre.src = m.image;
            } else {
                // no image specified — show emoji immediately
                const emoji = createEmojiElement(m.name || "office building");
                imgWrap.replaceChild(emoji, img);
            }

            // Tagline / short description if present
            if (m.tagline) {
                const p = document.createElement("p");
                p.className = "spotlight-tagline";
                p.textContent = m.tagline;
                s.appendChild(p);
            }

            // Contact lines
            const info = document.createElement("ul");
            info.style.listStyle = "none";
            info.style.padding = 0;
            info.style.margin = "8px 0 0 0";
            if (m.phone) {
                const liPhone = document.createElement("li");
                liPhone.textContent = `📞 ${m.phone}`;
                info.appendChild(liPhone);
            }
            if (m.address) {
                const liAddr = document.createElement("li");
                liAddr.textContent = `📍 ${m.address}`;
                info.appendChild(liAddr);
            }
            s.appendChild(info);

            // Visit link
            const a = document.createElement("a");
            a.className = "btn";
            a.href = m.url || "#";
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = "Visit website";
            s.appendChild(a);

            spotlightContainer.appendChild(s);
        });
    }

    async function init() {
        try {
            const all = await fetchMembers();
            if (!Array.isArray(all)) throw new Error("members.json must be an array");
            // pick premium/sponsored members if fields exist, else pick any
            const premium = all.filter(x => x && (x.membership === 2 || x.membership === 3));
            const source = premium.length ? premium : all;
            const selected = getRandomMembers(source, 3);
            displaySpotlights(selected);
        } catch (err) {
            console.error("spotlights.js error:", err);
            spotlightContainer.innerHTML = "<p>Spotlights unavailable.</p>";
        }
    }

    init();
});