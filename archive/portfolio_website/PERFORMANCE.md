# Performance Guide

Strategies to achieve 95+ Lighthouse scores.

## Build Optimization

### Code Splitting

Manual chunks in `vite.config.ts`:

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'router': ['react-router-dom'],
}
```

### Minification & Compression

- Vite: Tree-shaking, dead code elimination
- Terser: JavaScript minification
- Gzip: Automatic HTTP compression

### Bundle Analysis

```bash
npm run analyze
```

## Runtime Optimization

### Image Optimization

1. **Use WebP Format**
   ```tsx
   <img src="/images/project.webp" alt="Project" />
   ```

2. **Lazy Loading**
   ```tsx
   <img src="/images/project.webp" loading="lazy" />
   ```

3. **Responsive Images**
   ```tsx
   <img 
     srcSet="/images/project-small.webp 640w, /images/project.webp 1280w"
     sizes="(max-width: 768px) 100vw, 50vw"
     src="/images/project.webp"
   />
   ```

### CSS Optimization

- Scoped styles: Component-level CSS
- Critical CSS: Inline above-fold styles
- Minimize unused CSS: Tree-shake styles

### JavaScript Optimization

- Dynamic imports for routes
- React.lazy() for component splitting
- Defer non-critical scripts

## Lighthouse Metrics

### Core Web Vitals

| Metric | Target | How to Improve |
|--------|--------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Optimize images, reduce JavaScript |
| FID (First Input Delay) | < 100ms | Reduce main thread work |
| CLS (Cumulative Layout Shift) | < 0.1 | Fixed layout dimensions |

### Performance Audit Checks

- Eliminate render-blocking resources
- Minimize main-thread work
- Reduce JavaScript execution time
- Optimize images and fonts
- Remove unused CSS and JavaScript

## Caching Strategy

### Browser Caching

Set in `vite.config.ts`:

```typescript
server: {
  headers: {
    'Cache-Control': 'public, max-age=3600',
  },
}
```

### GCP Cloud Run Response Headers

In Dockerfile or middleware:

```
Cache-Control: public, max-age=3600, s-maxage=86400
```

## Monitoring

### Lighthouse CI

Runs on every PR with `.lighthouse.config.json`:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

### Real User Monitoring

- Integrate Google Analytics
- Track Web Vitals with `web-vitals` library
- Monitor in GCP Console

```bash
npm install web-vitals
```

## Development Tips

### Local Testing

```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

### Browser DevTools

- Throttle network/CPU: Network tab → Slow 3G
- Profile runtime: Performance tab
- Audit: Lighthouse tab

### Pagespeed Insights

- Production URL: https://pagespeed.web.dev
- Mobile & desktop scores
- Opportunities and diagnostics

## Production Checklist

- [ ] Build output < 200KB (gzipped)
- [ ] Lighthouse Performance > 95
- [ ] LCP < 2.5s
- [ ] No console errors/warnings
- [ ] Images optimized (WebP)
- [ ] Critical path minimized
- [ ] Service Worker for offline (optional)

## Advanced Techniques

### Service Worker (PWA)

Use `vite-plugin-pwa`:

```bash
npm install -D vite-plugin-pwa
```

### Preload Critical Resources

```html
<link rel="preload" as="image" href="/images/hero.webp" />
```

### DNS Prefetch

```html
<link rel="dns-prefetch" href="//cdn.example.com" />
```

### HTTP/2 Push (Cloud Run)

Configured automatically via CDN.

## Troubleshooting

### High LCP

- Reduce main bundle size
- Optimize hero image
- Defer non-critical scripts

### High CLS

- Set image dimensions
- Avoid dynamic content shifts
- Use CSS containment

### High JavaScript Execution

- Profile with DevTools
- Reduce third-party scripts
- Lazy load non-essential code
