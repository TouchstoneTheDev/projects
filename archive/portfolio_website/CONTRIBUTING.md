# Contributing

Guide for contributing to portfolio website.

## Development Workflow

1. **Fork** repository
2. **Clone** locally: `git clone ...`
3. **Create branch**: `git checkout -b feature/name`
4. **Make changes** and test locally
5. **Commit**: `git commit -m 'Descriptive message'`
6. **Push**: `git push origin feature/name`
7. **Create PR** on GitHub

## Local Setup

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio

npm install
npm run dev
```

## Code Style

- Use TypeScript for type safety
- Follow component naming: PascalCase
- CSS: Use CSS variables for consistency
- Comments: Document complex logic

### Formatting

```bash
npm run lint
npm run format  # if prettier installed
```

## Making Changes

### Adding Components

1. Create component in `src/components/ComponentName.tsx`
2. Create styles in `src/styles/component-name.css`
3. Export from component file
4. Import in [App.tsx](src/App.tsx)

Example:

```tsx
// src/components/Gallery.tsx
export function Gallery() {
  return <section className="gallery">...</section>;
}
```

### Updating Projects

Edit project data in [src/components/Projects.tsx](src/components/Projects.tsx):

```typescript
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Project Name',
    description: 'Brief description',
    image: '/images/project.webp',
    technologies: ['React', 'TypeScript'],
    github: 'https://github.com/...',
    demo: 'https://demo.com',
    featured: true,
  },
  // ...
];
```

### Styling

Follow CSS structure in `src/styles/globals.css`:

```css
/* Use CSS variables */
.element {
  color: var(--text);
  background: var(--bg);
  transition: var(--transition);
}

/* Mobile-first responsive */
@media (max-width: 768px) {
  .element {
    font-size: smaller;
  }
}
```

## Testing

### Local Build

```bash
npm run build
npm run preview
```

### Lighthouse Check

```bash
npm run dev
# Open http://localhost:5173 in Chrome
# Run Lighthouse audit in DevTools
```

### Linting

```bash
npm run lint
```

## Git Conventions

- Commit messages: Present tense ("Add feature" not "Added feature")
- Branch names: `feature/`, `fix/`, `docs/`, `style/`
- Keep commits atomic and logical

## Pull Request Guidelines

- Clear PR title describing changes
- Detailed description of what changed and why
- Link related issues: `Closes #123`
- Update docs if needed
- Ensure CI/CD passes
- Respond to review comments

## Performance Considerations

- Minimize bundle size
- Lazy load images
- Code-split routes
- Monitor Lighthouse scores
- Check Performance tab in DevTools

## Documentation

Update docs if changing:

- Project structure → Update [README.md](README.md)
- Build process → Update [DEPLOYMENT.md](DEPLOYMENT.md)
- Performance tips → Update [PERFORMANCE.md](PERFORMANCE.md)

## Questions?

- Create an issue for bugs
- Start discussion for features
- Check existing issues first

Thank you for contributing!
