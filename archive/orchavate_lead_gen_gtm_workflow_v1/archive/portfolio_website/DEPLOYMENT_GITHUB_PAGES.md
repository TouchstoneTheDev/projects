# GitHub Pages Deployment Guide

Your portfolio is now configured to deploy to GitHub Pages automatically!

## Prerequisites

- Repository must be public
- GitHub CLI (`gh` command) installed locally OR you can use GitHub website directly

## One-Time Setup

### Option 1: Using GitHub CLI (Recommended)

```bash
# Navigate to the portfolio directory
cd portfolio_website

# Install dependencies
npm install
npm install --save-dev gh-pages

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Option 2: Using GitHub Web Interface

1. Go to your repository: https://github.com/TouchstoneTheDev/projects
2. Go to **Settings** → **Pages**
3. Under "Source", select:
   - Branch: `gh-pages` (or `main` if you prefer)
   - Folder: `/` (root)
4. Click "Save"

## Automatic Deployment with GitHub Actions

Create a file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm install
      working-directory: portfolio_website
    
    - name: Build
      run: npm run build
      working-directory: portfolio_website
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./portfolio_website/dist
```

## Manual Deployment

```bash
cd portfolio_website

# Install dependencies (first time only)
npm install

# Build the project
npm run build

# Deploy
npm run deploy
```

## Access Your Portfolio

After deployment, your portfolio will be live at:
```
https://TouchstoneTheDev.github.io/projects/
```

## Important Notes

1. **Admin Login Credentials:**
   - Username: `admin`
   - Password: `Portfolio@2026`

2. **Base Path:** The portfolio is configured with base path `/projects/` in `vite.config.ts`. This must match your GitHub repository name.

3. **Environment Variables:** If you add API keys or secrets:
   - Add them to GitHub Secrets in Settings → Secrets and variables → Actions
   - Update `.github/workflows/deploy.yml` to use `${{ secrets.YOUR_SECRET_NAME }}`

4. **Custom Domain:** To use a custom domain:
   - Create a `CNAME` file in the `public/` folder with your domain name
   - Update DNS settings at your domain registrar
   - Go to Settings → Pages and enter your custom domain

## Troubleshooting

### Pages not showing

- Check that the `gh-pages` branch exists in your repository
- Verify Settings → Pages is set to deploy from `gh-pages` branch
- Wait a few minutes for GitHub to build and deploy

### Assets not loading

- Ensure `base: '/projects/'` is set in `vite.config.ts`
- Rebuild and redeploy: `npm run build && npm run deploy`

### Login/Admin panel not working

- Check browser console for errors
- Ensure you're using the correct credentials
- LocalStorage may be cleared - try logging in again

## Profile Picture Updates

The portfolio fetches your GitHub profile picture automatically:
- GitHub API: `https://api.github.com/users/TouchstoneTheDev`
- Updates whenever the page loads

## Next Steps

1. Update `src/data/resume.ts` with your actual information
2. Replace project images in `public/images/`
3. Update technical writing links with your actual articles
4. Customize AI projects and developer concepts
5. Deploy and share your portfolio!

For more info: https://docs.github.com/en/pages
