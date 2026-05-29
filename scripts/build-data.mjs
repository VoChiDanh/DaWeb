import { mkdir, writeFile } from "node:fs/promises";

const ORG = "SinceRPG";
const API = "https://api.github.com";
const token = process.env.GITHUB_TOKEN || "";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sincerpg-resources-pages"
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }
  return response.json();
}

async function fetchAllRepos() {
  const repos = [];
  let page = 1;

  while (page <= 10) {
    const batch = await fetchJson(`${API}/orgs/${ORG}/repos?per_page=100&page=${page}&sort=pushed`);
    repos.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return repos;
}

async function fetchLatestRelease(repo) {
  try {
    const release = await fetchJson(`${API}/repos/${ORG}/${repo.name}/releases/latest`);
    const asset = release.assets?.find((item) => /\.(jar|zip)$/i.test(item.name)) || release.assets?.[0];
    return {
      name: release.name,
      tagName: release.tag_name,
      htmlUrl: release.html_url,
      assetUrl: asset?.browser_download_url || "",
      publishedAt: release.published_at
    };
  } catch {
    return null;
  }
}

async function fetchCommits(repo) {
  try {
    return await fetchJson(`${API}/repos/${ORG}/${repo.name}/commits?per_page=30&sha=${encodeURIComponent(repo.default_branch || "main")}`);
  } catch {
    return [];
  }
}

const repos = await fetchAllRepos();
const visibleRepos = repos
  .filter((repo) => !repo.fork && repo.name !== ".github")
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

const catalogRepos = [];

for (const repo of visibleRepos) {
  const [release, commits] = await Promise.all([
    fetchLatestRelease(repo),
    fetchCommits(repo)
  ]);

  catalogRepos.push({
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    homepage: repo.homepage || "",
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    open_issues_count: repo.open_issues_count,
    pushed_at: repo.pushed_at,
    default_branch: repo.default_branch,
    has_pages: repo.has_pages,
    archived: repo.archived,
    release,
    commits
  });
}

await mkdir("data", { recursive: true });
await writeFile("data/catalog.json", JSON.stringify({
  generatedAt: new Date().toISOString(),
  org: ORG,
  repos: catalogRepos
}, null, 2));

console.log(`Wrote data/catalog.json with ${catalogRepos.length} repositories.`);
