# Setup Guide

Complete setup instructions for portfolio website.

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** 10+ (included with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Docker** (optional, for local testing)
- **GCP Account** (for deployment to Cloud Run)

## Local Development

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in browser.

### 4. Customize Portfolio

#### Update Hero Section

Edit `src/components/Hero.tsx`:

```tsx
export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Name</h1>
        <p>Your title | Your skills</p>
        <a href="#projects" className="cta-button">View My Work</a>
      </div>
    </section>
  );
}
```

#### Add Projects

Edit `src/components/Projects.tsx` - update `PROJECTS` array:

```typescript
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Your Project',
    description: 'Project description',
    image: '/images/project.webp',
    technologies: ['React', 'TypeScript'],
    github: 'https://github.com/...',
    demo: 'https://demo.com',
    featured: true,
  },
  // Add more projects
];
```

#### Update Resume

Edit `src/components/Resume.tsx`:

```typescript
const SKILLS = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Vite', ...],
  },
  // Add more categories
];

const EXPERIENCE = [
  {
    company: 'Company Name',
    position: 'Your Position',
    duration: '2023 - Present',
    description: 'Description...',
  },
  // Add more experience
];
```

#### Update Contact Info

Edit `src/components/Contact.tsx` and `src/components/Footer.tsx` to add your:
- Email
- GitHub profile
- LinkedIn profile
- Twitter/X
- Other social media

#### Customize Colors

Edit `src/styles/globals.css`:

```css
:root {
  --primary: #6366f1;      /* Main color */
  --secondary: #ec4899;    /* Accent color */
  --text: #1f2937;         /* Text color */
  --bg: #ffffff;           /* Background */
  --bg-light: #f9fafb;     /* Light background */
  /* ... other colors */
}
```

#### Add Images

1. Save images to `public/images/` (use WebP format)
2. Reference in components: `<img src="/images/project.webp" />`

## Building for Production

### Local Build

```bash
npm run build
npm run preview
```

Test production build at http://localhost:4173

### Performance Check

```bash
npm run analyze
```

Run Lighthouse audit in Chrome DevTools for scoring.

## Environment Configuration

### Local Development

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CONTACT_EMAIL=your.email@example.com
VITE_GITHUB_URL=https://github.com/yourusername
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
```

## Deployment to GCP Cloud Run

See [DEPLOYMENT.md](DEPLOYMENT.md) for full setup.

### Quick Deploy

1. Set GitHub secrets: `GCP_PROJECT_ID`, `GCP_SA_KEY`
2. Push to `main` branch
3. GitHub Actions deploys automatically

## Performance Tips

- Images: Use WebP format, optimize before upload
- Lazy loading: Add `loading="lazy"` to images
- Bundle: Monitor with `npm run analyze`
- Test: Run Lighthouse (Chrome DevTools)

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npm run analyze      # Analyze bundle size

make help            # Show Makefile commands
```

## Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 3001
```

### Dependencies Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
npm run lint           # Check for errors
npm run build          # Check build output
```

### Performance Issues

- Reduce image sizes
- Use WebP format
- Remove unused dependencies
- Check Lighthouse report

## Next Steps

1. ✅ Setup local development
2. ✅ Customize portfolio content
3. ✅ Test build locally
4. ✅ Deploy to GCP Cloud Run
5. ✅ Setup custom domain
6. ✅ Monitor performance

## Getting Help

- [Vite Docs](https://vite.dev)
- [React Docs](https://react.dev)
- [GCP Cloud Run](https://cloud.google.com/run/docs)
- [GitHub Issues](https://github.com/yourusername/portfolio/issues)

## Resources

- [Web Performance Guide](https://web.dev/performance/)
- [Lighthouse Scoring](https://web.dev/performance-scoring/)
- [CSS Tips](https://web.dev/css-web-vitals/)
