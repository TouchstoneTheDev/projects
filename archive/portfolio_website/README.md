# Personal Portfolio Website

Professional responsive portfolio built with **React**, **Vite**, and modern CSS with automated CI/CD deployment to **GCP Cloud Run**.

## Features

- ✨ **Responsive Design** - Mobile-first approach, optimized for all devices
- ⚡ **High Performance** - 95+ Lighthouse score with code-splitting and lazy loading
- 🚀 **Fast Build** - Vite for instant HMR and optimized production builds
- 📱 **Sections** - Hero, Projects, Resume, Contact, and Footer
- 🎨 **Modern Styling** - Custom CSS with smooth animations and transitions
- 🔄 **CI/CD Pipeline** - GitHub Actions to GCP Cloud Run
- 📦 **Docker Ready** - Multi-stage builds for optimized image size
- 📊 **Performance Monitoring** - Lighthouse CI integration

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS3 (responsive, mobile-first)
- **Build**: Vite with code-splitting and compression
- **CI/CD**: GitHub Actions
- **Deployment**: Docker, GCP Cloud Run
- **Performance**: Lighthouse CI

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Customization

### Update Personal Information

Edit component files to add your:
- Name and title in [src/components/Hero.tsx](src/components/Hero.tsx)
- Projects in [src/components/Projects.tsx](src/components/Projects.tsx)
- Experience in [src/components/Resume.tsx](src/components/Resume.tsx)
- Contact info in [src/components/Contact.tsx](src/components/Contact.tsx)

### Modify Colors

Update CSS variables in [src/styles/globals.css](src/styles/globals.css):

```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  --text: #1f2937;
}
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for GCP Cloud Run setup instructions.

## Performance

- Lighthouse Performance: 95+
- Code splitting and lazy loading
- Image optimization with WebP
- Lighthouse CI integration

## Resources

- [Vite](https://vite.dev)
- [React](https://react.dev)
- [GCP Cloud Run](https://cloud.google.com/run/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
