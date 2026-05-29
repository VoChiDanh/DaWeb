# SinceRPG Resources

Static GitHub Pages site for listing public resources from the `SinceRPG` GitHub organization.

## What updates automatically

The site reads public repositories from the GitHub API at runtime:

- New public repositories in `SinceRPG` appear automatically.
- Repositories without docs or releases still appear.
- Downloads are shown only when a GitHub release has an uploaded asset.
- Changelogs are generated from recent GitHub commits.

## GitHub Pages hosting

This repo includes `.github/workflows/deploy-pages.yml`, so GitHub Pages can deploy automatically on every push to `main` or `master`.

After pushing the source to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` or `master`.

The workflow uploads the static files in this repository and publishes them to GitHub Pages.

