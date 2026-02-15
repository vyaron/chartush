---
name: deployToGitHubPages
description: Configure a Vite/React SPA for deployment to GitHub Pages with CI/CD
argument-hint: Repository name for the base path configuration
---
Help me deploy my Vite + React application to GitHub Pages. Include the following:

1. **Vite Configuration**: Set up `vite.config.ts` with the correct `base` path for the repository
2. **Routing**: Switch from `BrowserRouter` to `HashRouter` for client-side routing compatibility
3. **Asset Paths**: Ensure all static assets (images, workers, etc.) use relative paths instead of absolute paths
4. **GitHub Actions Workflow**: Create a `.github/workflows/deploy.yml` that automatically builds and deploys on push to main
5. **Package Scripts**: Add deploy scripts to `package.json` if using gh-pages package approach
6. **README**: Update with a link to the live site

Also check for and fix any TypeScript/build errors that would prevent deployment.
