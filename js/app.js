const ORG = "SinceRPG";
const apiBase = "https://api.github.com";
const catalogUrl = "data/catalog.json";

const fallbackRepos = [
  {
    name: "StackCraft",
    html_url: "https://github.com/SinceRPG/StackCraft",
    description: "Public SinceRPG plugin repository.",
    homepage: "",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-29T13:57:00Z",
    default_branch: "master",
    has_pages: false
  },
  {
    name: "SinceUpdater",
    html_url: "https://github.com/SinceRPG/SinceUpdater",
    description: "Public SinceRPG updater plugin repository.",
    homepage: "",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-29T13:57:00Z",
    default_branch: "master",
    has_pages: false
  },
  {
    name: "SincePet",
    html_url: "https://github.com/SinceRPG/SincePet",
    description: "Public SinceRPG pet plugin repository.",
    homepage: "",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-29T13:57:00Z",
    default_branch: "master",
    has_pages: false
  },
  {
    name: "SinceMenu",
    html_url: "https://github.com/SinceRPG/SinceMenu",
    description: "Public SinceRPG menu plugin repository.",
    homepage: "",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-29T13:57:00Z",
    default_branch: "master",
    has_pages: false
  },
  {
    name: "SinceGPS",
    html_url: "https://github.com/SinceRPG/SinceGPS",
    description: "Public SinceRPG navigation plugin repository.",
    homepage: "",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-29T13:57:00Z",
    default_branch: "master",
    has_pages: false
  },
  {
    name: "SinceDungeon",
    html_url: "https://github.com/SinceRPG/SinceDungeon",
    description: "Premium-grade instanced dungeon plugin for modern Minecraft servers running Paper/Folia 1.21+.",
    homepage: "https://sincerpg.github.io/SinceDungeon/",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 1,
    pushed_at: "2026-05-29T13:56:51Z",
    default_branch: "master",
    has_pages: true
  },
  {
    name: "SinceEnchantments",
    html_url: "https://github.com/SinceRPG/SinceEnchantments",
    description: "Custom enchantment plugin designed for modern Paper/Folia servers.",
    homepage: "https://gitlab.com/sincerpg/SinceEnchantments/-/wikis/home",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-17T13:18:56Z",
    default_branch: "master",
    has_pages: false
  },
  {
    name: "SinceBooster",
    html_url: "https://github.com/SinceRPG/SinceBooster",
    description: "Plugin designed to support MMOCore by enhancing leveling through shared player boosters.",
    homepage: "",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-16T08:00:00Z",
    default_branch: "master",
    has_pages: false
  },
  {
    name: "PageLore",
    html_url: "https://github.com/SinceRPG/PageLore",
    description: "Public SinceRPG lore and page resource repository.",
    homepage: "https://sincerpg.github.io/PageLore/",
    language: "Java",
    stargazers_count: 1,
    open_issues_count: 0,
    pushed_at: "2026-05-22T10:00:00Z",
    default_branch: "master",
    has_pages: true
  },
  {
    name: "ClientCore",
    html_url: "https://github.com/SinceRPG/ClientCore",
    description: "Player-specific client-side gameplay: fake blocks, personal loot, drops, mobs, and NPCs.",
    homepage: "https://sincerpg.github.io/ClientCore/",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-29T03:09:15Z",
    default_branch: "master",
    has_pages: true
  },
  {
    name: "IslandPortal",
    html_url: "https://github.com/SinceRPG/IslandPortal",
    description: "Island portal plugin for Skyblock servers with custom portals and access policy data.",
    homepage: "https://sincerpg.github.io/IslandPortal/",
    language: "Java",
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-25T16:20:30Z",
    default_branch: "master",
    has_pages: true
  },
  {
    name: "MMOUpgrade-Wiki",
    html_url: "https://github.com/SinceRPG/MMOUpgrade-Wiki",
    description: "Wiki resource for MMOUpgrade, a configurable upgrade system for MMOItems.",
    homepage: "https://sincerpg.github.io/MMOUpgrade-Wiki/",
    language: null,
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-05-27T18:56:16Z",
    default_branch: "main",
    has_pages: true
  }
];

const state = {
  repos: [],
  commits: new Map(),
  source: "live",
  filter: "all",
  search: ""
};

const els = {
  apiState: document.querySelector("#apiState"),
  resourceCount: document.querySelector("#resourceCount"),
  latestPush: document.querySelector("#latestPush"),
  terminalLine: document.querySelector("#terminalLine"),
  searchInput: document.querySelector("#searchInput"),
  resourceGrid: document.querySelector("#resourceGrid"),
  emptyState: document.querySelector("#emptyState"),
  updatedAt: document.querySelector("#updatedAt"),
  detailView: document.querySelector("#detailView"),
  detailContent: document.querySelector("#detailContent"),
  filterButtons: document.querySelectorAll(".filter-btn")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getType(repo) {
  const name = repo.name.toLowerCase();
  const description = (repo.description || "").toLowerCase();
  if (name.includes("wiki")) return "wiki";
  if (description.includes("plugin") || repo.language === "Java") return "plugin";
  if (repo.has_pages || repo.homepage) return "pages";
  return "resource";
}

function getReleaseText(repo) {
  if (repo.release?.name) return repo.release.name;
  if (repo.release?.tagName) return repo.release.tagName;
  return "";
}

function getResourceHash(repo) {
  return `#resource=${encodeURIComponent(repo.name)}`;
}

function getVisibleSections() {
  return [
    document.querySelector(".hero"),
    document.querySelector(".toolbar-section"),
    document.querySelector(".resources-section"),
    document.querySelector(".builds-section")
  ];
}

function setCatalogVisible(isVisible) {
  getVisibleSections().forEach((section) => {
    section?.classList.toggle("d-none", !isVisible);
  });
  els.detailView.classList.toggle("d-none", isVisible);
}

function createActionLinks(repo, includeChangelog = true) {
  const links = [];
  if (repo.release?.assetUrl) {
    links.push(`<a class="btn btn-primary" href="${escapeHtml(repo.release.assetUrl)}" target="_blank" rel="noreferrer">Download</a>`);
  }
  if (repo.homepage) {
    links.push(`<a class="btn btn-outline-light" href="${escapeHtml(repo.homepage)}" target="_blank" rel="noreferrer">Docs</a>`);
  }
  if (repo.release?.htmlUrl) {
    links.push(`<a class="btn btn-outline-light" href="${escapeHtml(repo.release.htmlUrl)}" target="_blank" rel="noreferrer">Release</a>`);
  }
  if (includeChangelog) {
    links.push(`<a class="btn btn-outline-light" href="${escapeHtml(getResourceHash(repo))}">Changelog</a>`);
  }
  if (links.length > 0) return links.join("");
  if (includeChangelog) return `<a class="btn btn-outline-light" href="${escapeHtml(getResourceHash(repo))}">Changelog</a>`;
  return "";
}

function renderSummary(repos, fromApi) {
  const latest = [...repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0];
  els.apiState.textContent = fromApi ? "Online" : state.source === "catalog" ? "Static catalog" : "Fallback";
  els.resourceCount.textContent = repos.length;
  els.latestPush.textContent = latest ? formatDate(latest.pushed_at) : "--";
  els.terminalLine.textContent = fromApi
    ? `loaded ${repos.length} public repositories`
    : state.source === "catalog"
      ? `loaded ${repos.length} repositories from catalog.json`
      : "using bundled fallback data";
  els.updatedAt.textContent = `Updated: ${formatDate(new Date().toISOString())}`;
}

function getFilteredRepos() {
  const query = state.search.trim().toLowerCase();
  return state.repos.filter((repo) => {
    const type = getType(repo);
    const matchesFilter = state.filter === "all" || type === state.filter;
    const haystack = `${repo.name} ${repo.description || ""} ${repo.language || ""}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });
}

function renderResources() {
  const repos = getFilteredRepos();
  els.emptyState.classList.toggle("d-none", repos.length > 0);
  els.resourceGrid.innerHTML = repos.map((repo) => {
    const type = getType(repo);
    const releaseBox = repo.release?.htmlUrl ? `
        <div class="release-box">
          <span>Latest release</span>
          <strong>${escapeHtml(getReleaseText(repo))}</strong>
          <small class="muted-text">${repo.release?.publishedAt ? formatDate(repo.release.publishedAt) : "Release details on GitHub"}</small>
        </div>
    ` : `
        <div class="release-box release-box-muted">
          <span>No release yet</span>
          <strong>Commit changelog available</strong>
          <small class="muted-text">Open the plugin to read changes generated from recent commits.</small>
        </div>
    `;
    return `
      <article class="resource-card" data-type="${escapeHtml(type)}" data-resource="${escapeHtml(repo.name)}" tabindex="0" role="link" aria-label="Open changelog for ${escapeHtml(repo.name)}">
        <div class="card-top">
          <div class="resource-meta">
            <span class="badge-soft badge-live">${escapeHtml(type)}</span>
            <span class="badge-soft">${escapeHtml(repo.language || "Docs")}</span>
            <span class="badge-soft">${repo.archived ? "Archived" : "Active"}</span>
          </div>
          <h3><a class="resource-title-link" href="${escapeHtml(getResourceHash(repo))}">${escapeHtml(repo.name)}</a></h3>
          <p class="resource-description">${escapeHtml(repo.description || "Public resource from SinceRPG.")}</p>
        </div>
        <div class="card-stats">
          <div class="stat">
            <span>Stars</span>
            <strong>${repo.stargazers_count ?? 0}</strong>
          </div>
          <div class="stat">
            <span>Issues</span>
            <strong>${repo.open_issues_count ?? 0}</strong>
          </div>
          <div class="stat">
            <span>Pushed</span>
            <strong>${formatDate(repo.pushed_at).split(",")[0]}</strong>
          </div>
        </div>
        ${releaseBox}
        <div class="card-actions">
          ${createActionLinks(repo)}
        </div>
      </article>
    `;
  }).join("");
}

function getResourceNameFromHash() {
  if (!location.hash.startsWith("#resource=")) return "";
  return decodeURIComponent(location.hash.replace("#resource=", ""));
}

async function loadCommits(repo) {
  if (state.commits.has(repo.name)) return state.commits.get(repo.name);
  if (Array.isArray(repo.commits)) {
    state.commits.set(repo.name, repo.commits);
    return repo.commits;
  }
  const commits = await fetchJson(`${apiBase}/repos/${ORG}/${repo.name}/commits?per_page=30`);
  state.commits.set(repo.name, commits);
  return commits;
}

function formatCommitMessage(commit) {
  const message = commit?.commit?.message || "Commit update";
  const [title, ...bodyLines] = message.split("\n").map((line) => line.trim()).filter(Boolean);
  return {
    title: title || "Commit update",
    body: bodyLines.join(" ")
  };
}

function renderCommitChangelog(repo, commits, isFallback = false) {
  const items = commits.map((commit) => {
    const message = formatCommitMessage(commit);
    const date = commit?.commit?.author?.date || commit?.commit?.committer?.date;
    const author = commit?.commit?.author?.name || commit?.author?.login || "SinceRPG";
    const sha = commit?.sha ? commit.sha.slice(0, 7) : "";
    const url = commit?.html_url || repo.html_url;
    return `
      <article class="changelog-item">
        <div class="changelog-meta">
          <span>${escapeHtml(formatDate(date))}</span>
          <span>${escapeHtml(author)}</span>
          ${sha ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(sha)}</a>` : ""}
        </div>
        <h3>${escapeHtml(message.title)}</h3>
        ${message.body ? `<p>${escapeHtml(message.body)}</p>` : ""}
      </article>
    `;
  }).join("");

  els.detailContent.innerHTML = `
    <div class="detail-hero">
      <div>
        <p class="eyebrow">${escapeHtml(getType(repo))} changelog</p>
        <h1>${escapeHtml(repo.name)}</h1>
        <p class="hero-text">${escapeHtml(repo.description || "Recent development changes from GitHub commits.")}</p>
      </div>
      <div class="detail-actions">
        ${createActionLinks(repo, false)}
      </div>
    </div>
    <div class="changelog-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Generated from commits</p>
          <h2>Recent changes</h2>
        </div>
        <p class="muted-text">${isFallback ? "Commit API unavailable" : `${commits.length} commits loaded`}</p>
      </div>
      <div class="changelog-list">
        ${items || `<div class="empty-state">No commits found for this resource.</div>`}
      </div>
    </div>
  `;
}

async function openResourceDetail(repoName) {
  const repo = state.repos.find((item) => item.name === repoName);
  if (!repo) {
    setCatalogVisible(true);
    return;
  }

  setCatalogVisible(false);
  els.detailContent.innerHTML = `
    <div class="detail-hero">
      <div>
        <p class="eyebrow">Loading changelog</p>
        <h1>${escapeHtml(repo.name)}</h1>
        <p class="hero-text">Reading recent GitHub commits...</p>
      </div>
    </div>
  `;

  try {
    const commits = await loadCommits(repo);
    renderCommitChangelog(repo, commits);
  } catch (error) {
    const fallbackCommit = {
      sha: "",
      html_url: repo.html_url,
      commit: {
        message: `Latest repository update\nGitHub commit data could not be loaded right now. Last pushed at ${formatDate(repo.pushed_at)}.`,
        author: {
          name: ORG,
          date: repo.pushed_at
        }
      }
    };
    renderCommitChangelog(repo, [fallbackCommit], true);
    console.warn(error);
  }
}

function handleRoute() {
  const repoName = getResourceNameFromHash();
  if (!repoName) {
    setCatalogVisible(true);
    return;
  }
  openResourceDetail(repoName);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}`);
  return response.json();
}

async function fetchOrgRepos() {
  const repos = [];
  let page = 1;

  while (page <= 10) {
    const batch = await fetchJson(`${apiBase}/orgs/${ORG}/repos?per_page=100&page=${page}&sort=pushed`);
    repos.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return repos;
}

async function fetchCatalog() {
  const response = await fetch(`${catalogUrl}?v=${Date.now()}`, {
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Catalog ${response.status}`);
  const catalog = await response.json();
  if (!Array.isArray(catalog.repos)) throw new Error("Invalid catalog");
  return catalog.repos;
}

async function enrichRelease(repo) {
  try {
    const release = await fetchJson(`${apiBase}/repos/${ORG}/${repo.name}/releases/latest`);
    const asset = release.assets?.find((item) => /\.(jar|zip)$/i.test(item.name)) || release.assets?.[0];
    return {
      ...repo,
      release: {
        name: release.name,
        tagName: release.tag_name,
        htmlUrl: release.html_url,
        assetUrl: asset?.browser_download_url,
        publishedAt: release.published_at
      }
    };
  } catch {
    return repo;
  }
}

async function loadResources() {
  try {
    const repos = await fetchCatalog();
    const visibleRepos = repos
      .filter((repo) => !repo.fork && repo.name !== ".github")
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    state.source = "catalog";
    state.repos = visibleRepos;
    renderSummary(state.repos, false);
  } catch (error) {
    try {
      const repos = await fetchOrgRepos();
      const visibleRepos = repos
        .filter((repo) => !repo.fork && repo.name !== ".github")
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

      state.source = "live";
      state.repos = await Promise.all(visibleRepos.map(enrichRelease));
      renderSummary(state.repos, true);
    } catch (apiError) {
      state.source = "fallback";
      state.repos = fallbackRepos;
      renderSummary(state.repos, false);
      console.warn(error, apiError);
    }
  }

  renderResources();
  handleRoute();
}

els.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderResources();
});

els.resourceGrid.addEventListener("click", (event) => {
  if (event.target.closest("a")) return;
  const card = event.target.closest(".resource-card");
  if (!card?.dataset.resource) return;
  location.hash = `resource=${encodeURIComponent(card.dataset.resource)}`;
});

els.resourceGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".resource-card");
  if (!card?.dataset.resource) return;
  event.preventDefault();
  location.hash = `resource=${encodeURIComponent(card.dataset.resource)}`;
});

els.filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    els.filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderResources();
  });
});

window.addEventListener("hashchange", handleRoute);

loadResources();
