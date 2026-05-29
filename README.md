# SinceRPG Resources

Static GitHub Pages site for listing public resources from the `SinceRPG` GitHub organization.

## What updates automatically

The site reads public repositories from the GitHub API at runtime:

- New public repositories in `SinceRPG` appear automatically.
- Repositories without docs or releases still appear.
- Downloads are shown only when a GitHub release has an uploaded asset.
- Changelogs are generated from recent GitHub commits.

On GitHub Pages, `.github/workflows/deploy-pages.yml` runs `scripts/build-data.mjs` before deployment. That script uses the built-in `GITHUB_TOKEN` to write `data/catalog.json`, so visitors do not burn the public unauthenticated GitHub API rate limit.

## GitHub Pages hosting

This repo includes `.github/workflows/deploy-pages.yml`, so GitHub Pages can deploy automatically on every push to `main` or `master`, and refresh every 30 minutes for newly created organization repositories.

After pushing the source to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` or `master`.

The workflow uploads the static files in this repository and publishes them to GitHub Pages.
