// chamber/scripts/directory.js
// Directory renderer: fetch members.json, render grid/list, preload images and use emoji fallback,
// and show membership rank badges. Overwrite existing file with this content.

document.addEventListener("DOMContentLoaded", () => {
  const DIRECTORY_CONTAINER_SELECTORS = [
    "#directory-display-container",
    ".directory-display",
    "#directory-display"
  ];
  const container = DIRECTORY_CONTAINER_SELECTORS.map(s => document.querySelector(s)).find(Boolean);
  const gridBtn = document.querySelector("#grid-view-btn") || document.querySelector(".btn-grid");
  const listBtn = document.querySelector("#list-view-btn") || document.querySelector(".btn-list");

  if (!container) {
    console.warn("Directory container not found; expected #directory-display-container or .directory-display");
    return;
  }

  // Inline placeholder for initial img src to avoid broken-icon flashes
  const INLINE_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>" +
    "<rect width='100%' height='100%' fill='%23f3f6f8'/>" +
    "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239aa4ad' font-size='18'>Image</text>" +
    "</svg>"
  );

  // membership mapping (adjust if your members.json uses different codes)
  const MEMBERSHIP_LABEL = {
    0: { name: "NP", label: "NP Membership", short: "NP", class: "np" },
    1: { name: "Bronze", label: "Bronze Membership", short: "Bronze", class: "bronze" },
    2: { name: "Silver", label: "Silver Membership", short: "Silver", class: "silver" },
    3: { name: "Gold", label: "Gold Membership", short: "Gold", class: "gold" }
  };

  // Try multiple likely paths for members.json
  async function fetchMembers() {
    const candidates = [
      '/chamber/data/members.json',
      '/wdd231/chamber/data/members.json',
      './data/members.json',
      '../data/members.json',
      '/data/members.json',
      'data/members.json'
    ];
    for (const p of candidates) {
      try {
        const r = await fetch(p);
        if (r.ok) {
          return await r.json();
        }
      } catch (e) {
        // ignore and try next
      }
    }
    throw new Error("Could not load members.json from any known path.");
  }

  function createBadge(membership) {
    const m = MEMBERSHIP_LABEL[membership] || MEMBERSHIP_LABEL[0];
    const span = document.createElement("span");
    span.className = `membership-badge membership-badge--${m.class}`;
    span.textContent = m.short;
    span.title = m.label;
    return span;
  }

  function createEmojiElement(label = "office building", sizeClass = "") {
    const e = document.createElement("div");
    e.className = "emoji-icon " + sizeClass;
    e.setAttribute("role", "img");
    e.setAttribute("aria-label", label);
    e.textContent = "🏢";
    return e;
  }

  function createMemberCard(member) {
    // article.card
    const article = document.createElement("article");
    article.className = "business-card card";
    article.setAttribute("data-member-id", member.id || "");

    // Top row: logo + name + badge
    const top = document.createElement("div");
    top.className = "card-top";
    top.style.display = "flex";
    top.style.gap = "1rem";
    top.style.alignItems = "flex-start";

    // Logo wrapper: reserve fixed area to avoid layout shift
    const logoWrap = document.createElement("div");
    logoWrap.className = "card-logo-wrap";
    logoWrap.style.width = "110px";
    logoWrap.style.height = "72px"; // reserved height
    logoWrap.style.flex = "0 0 110px";
    logoWrap.style.display = "flex";
    logoWrap.style.alignItems = "center";
    logoWrap.style.justifyContent = "center";

    // Start with a neutral inline placeholder img element (so layout is stable)
    const img = document.createElement("img");
    img.src = INLINE_PLACEHOLDER;
    img.alt = member.name ? `${member.name} logo` : "member logo";
    img.style.maxHeight = "72px";
    img.style.objectFit = "contain";
    img.style.display = "block";
    img.style.width = "100%";
    logoWrap.appendChild(img);
    top.appendChild(logoWrap);

    // Name + badge column
    const meta = document.createElement("div");
    meta.style.flex = "1 1 auto";

    const nameRow = document.createElement("div");
    nameRow.style.display = "flex";
    nameRow.style.alignItems = "center";
    nameRow.style.gap = "0.6rem";

    const h3 = document.createElement("h3");
    h3.textContent = member.name || "Member";
    h3.style.margin = 0;
    h3.style.fontSize = "1rem";
    h3.style.lineHeight = "1.1";
    nameRow.appendChild(h3);

    // badge
    const badge = createBadge(member.membership || 0);
    badge.style.marginLeft = "6px";
    nameRow.appendChild(badge);

    meta.appendChild(nameRow);

    // Tagline / description (small)
    if (member.tagline) {
      const tagline = document.createElement("p");
      tagline.className = "member-tagline";
      tagline.textContent = member.tagline;
      tagline.style.margin = "6px 0 0 0";
      tagline.style.color = "var(--muted)";
      tagline.style.fontStyle = "italic";
      meta.appendChild(tagline);
    }

    top.appendChild(meta);
    article.appendChild(top);

    // Contact block (address / phone / website)
    const info = document.createElement("div");
    info.className = "member-info";
    info.style.marginTop = "0.9rem";

    if (member.address) {
      const addr = document.createElement("div");
      addr.className = "member-address";
      addr.textContent = `📍 ${member.address}`;
      addr.style.color = "var(--muted)";
      addr.style.marginBottom = "0.4rem";
      info.appendChild(addr);
    }
    if (member.phone) {
      const phone = document.createElement("div");
      phone.className = "member-phone";
      phone.textContent = `📞 ${member.phone}`;
      phone.style.color = "var(--muted)";
      phone.style.marginBottom = "0.4rem";
      info.appendChild(phone);
    }
    if (member.url) {
      const a = document.createElement("a");
      a.className = "member-link btn";
      a.href = member.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Visit Corporate Website →";
      a.style.display = "inline-block";
      a.style.marginTop = "0.5rem";
      info.appendChild(a);
    }

    article.appendChild(info);

    // Preload any real image off-DOM and swap only if it loads successfully
    if (member.image) {
      const pre = new Image();
      pre.onload = () => {
        img.src = member.image;
      };
      pre.onerror = () => {
        // show emoji fallback instead of broken img
        const emoji = createEmojiElement(member.name || "office building");
        logoWrap.replaceChild(emoji, img);
      };
      pre.src = member.image;
    } else {
      // no image specified — show emoji immediately
      const emoji = createEmojiElement(member.name || "office building");
      logoWrap.replaceChild(emoji, img);
    }

    return article;
  }

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function renderMembers(arr) {
    clearChildren(container);
    if (!Array.isArray(arr) || arr.length === 0) {
      container.innerHTML = "<p>No members found.</p>";
      return;
    }
    // create a fragment to avoid multiple reflows
    const frag = document.createDocumentFragment();
    arr.forEach(m => {
      const node = createMemberCard(m);
      frag.appendChild(node);
    });
    container.appendChild(frag);
  }

  // Grid/List toggle
  function setLayout(layout) {
    if (!container) return;
    container.classList.remove("grid-layout", "list-layout");
    if (layout === "list") {
      container.classList.add("list-layout");
      if (listBtn) listBtn.classList.add("active");
      if (gridBtn) gridBtn.classList.remove("active");
    } else {
      container.classList.add("grid-layout");
      if (gridBtn) gridBtn.classList.add("active");
      if (listBtn) listBtn.classList.remove("active");
    }
    localStorage.setItem("chamber-directory-layout", layout);
  }

  if (gridBtn) gridBtn.addEventListener("click", () => setLayout("grid"));
  if (listBtn) listBtn.addEventListener("click", () => setLayout("list"));

  // Init: load members and apply saved layout
  (async function init() {
    try {
      const members = await fetchMembers();
      renderMembers(members);
      const saved = localStorage.getItem("chamber-directory-layout") || "grid";
      setLayout(saved);
    } catch (err) {
      console.error("Directory error:", err);
      container.innerHTML = "<p>Members could not be loaded.</p>";
    }
  })();
});