# Technology Stack Overview

Complete technical specifications for portfolio website.

## Frontend Stack

### Core Framework
- **React** 19.2.6 - UI library
- **TypeScript** 6.0.2 - Type safety
- **React Router DOM** 6.20.0 - Client-side routing

### Build & Bundling
- **Vite** 8.0.12 - Next-gen build tool
  - Instant HMR (Hot Module Replacement)
  - Optimized production builds
  - Code-splitting by default
  - CSS minification

### Styling
- **CSS3** - Native styling
  - CSS Variables for theming
  - Flexbox & Grid layouts
  - Media queries (responsive)
  - Animations & transitions

## Development Tools

### Code Quality
- **ESLint** 10.3.0 - Linting
  - React Hooks plugin
  - TypeScript support
- **TypeScript** - Type checking

### Build Configuration
- **TypeScript Compiler** - Type compilation
- **Rollup** - Module bundler (via Vite)
- **esbuild** - JavaScript minifier

## Deployment Stack

### Containerization
- **Docker** - Container runtime
  - Alpine Linux (lightweight)
  - Multi-stage build
  - Optimized for production

### Cloud Platform
- **Google Cloud Platform (GCP)**
  - Cloud Run - Serverless containers
  - Container Registry - Image storage
  - Cloud Build - CI/CD

### CI/CD
- **GitHub Actions** - Automation
  - Build job
  - Performance testing
  - Deployment job

## Performance Optimization

### Build Optimization
- Code splitting
  - React vendor chunk
  - Router chunk
  - App code chunk
- Tree-shaking
- Dead code elimination
- CSS minification
- JavaScript minification

### Runtime Optimization
- Lazy loading images
- Component-level CSS
- Responsive images
- Efficient React rendering

## Architecture

### Component Structure
```
App
├── Header (Navigation)
├── Hero (Hero Section)
├── Projects (Project Showcase)
├── Resume (Experience & Skills)
├── Contact (Contact Form)
└── Footer (Footer)
```

### CSS Architecture
- Base styles in `globals.css`
- CSS variables for consistency
- Component-scoped styles
- Mobile-first responsive design

### TypeScript Types
- Project interface
- Skill interface
- Experience interface
- ContactForm interface

## Performance Targets

| Metric | Target | Method |
|--------|--------|--------|
| Lighthouse Performance | 95+ | Code-splitting, optimization |
| LCP (Largest Contentful Paint) | < 2.5s | Image optimization |
| FID (First Input Delay) | < 100ms | Reduce JavaScript |
| CLS (Cumulative Layout Shift) | < 0.1 | Fixed dimensions |
| Bundle Size | < 200KB | Code-splitting |

## Build Output

### Production Bundle
- **Total Size**: ~252KB
- **React Vendor**: ~186KB (gzipped: ~60KB)
- **App Code**: ~9.3KB (gzipped: ~3KB)
- **Styles**: ~9.6KB (gzipped: ~2KB)
- **Runtime**: ~86 bytes

### Chunk Strategy
1. **react-vendor.js** - React & React DOM
2. **router.js** - React Router (future splitting)
3. **index.js** - Application code
4. **index.css** - Styles

## Environment

### Supported Environments
- **Development**: Node.js with HMR
- **Production**: Cloud Run (Node.js 20-alpine)

### Environment Variables
- `NODE_ENV` - Environment mode
- `VITE_API_URL` - API endpoint
- `VITE_GA_ID` - Google Analytics (optional)
- `VITE_CONTACT_EMAIL` - Contact email
- Social media URLs

## Security Features

### Best Practices
- Type-safe TypeScript
- ESLint for code quality
- Environment variables for secrets
- Service account for GCP auth
- No secrets in git (.env ignored)

### Deployment Security
- Docker image scanning
- Service account with minimal permissions
- Unauthenticated Cloud Run (public)
- HTTPS by default (Cloud Run)

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile

### Target JavaScript
- ES2020+ (esnext)
- Native async/await
- Native Promises
- Native Fetch API

## File Structure

### Source Code
```
src/
├── components/      # React components (6 files)
├── styles/          # CSS stylesheets (7 files)
├── types/           # TypeScript types
├── App.tsx          # Main component
└── main.tsx         # React root
```

### Configuration
```
./
├── vite.config.ts       # Build configuration
├── tsconfig.json        # TypeScript config
├── eslint.config.js     # Linting rules
├── package.json         # Dependencies
├── Dockerfile           # Container definition
└── lighthouse.config.json # Performance testing
```

### Documentation
```
./
├── README.md                 # Overview
├── SETUP_GUIDE.md           # Setup instructions
├── DEPLOYMENT.md            # Deployment guide
├── DEPLOYMENT_CHECKLIST.md  # Deployment steps
├── PERFORMANCE.md           # Performance tips
├── QUICK_REFERENCE.md       # Quick reference
├── BUILD_SUMMARY.md         # Build summary
└── CONTRIBUTING.md          # Contributing guide
```

## Scalability

### For Adding Features
- Add new React components
- Add new routes (with React Router setup)
- Add new API integrations
- Add new styles as needed

### Performance Optimization Options
- Add service worker (PWA)
- Add code-splitting by route
- Add lazy loading components
- Integrate CDN for images
- Add caching strategies

## Maintenance

### Updates
- Dependencies: `npm update`
- Security patches: Dependabot
- Type definitions: `npm update @types/*`

### Monitoring
- Lighthouse CI for performance
- Cloud Run metrics
- Error tracking
- Analytics

## Cost Analysis

### Estimated Monthly Cost
- **Cloud Run**: $0.40/month (free tier) + overage
- **Container Registry**: ~$0.10/GB stored
- **Cloud Build**: Included in free tier
- **DNS**: Domain cost only

### Optimization
- Cold start < 1 second
- Scales to 0
- Pay per request
- No minimum charges

## Dependencies Summary

### Production (3)
- react
- react-dom
- react-router-dom

### Development (10+)
- TypeScript
- ESLint
- Vite plugins
- Type definitions

### Total Packages
- 181 packages (with transitive deps)
- 0 vulnerabilities
- Actively maintained

---

**Built with modern best practices for performance and scalability.**
