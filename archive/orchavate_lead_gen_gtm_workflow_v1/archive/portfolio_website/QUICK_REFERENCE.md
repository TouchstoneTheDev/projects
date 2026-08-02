<!-- Quick Reference Card -->

# 🎯 PORTFOLIO WEBSITE - QUICK REFERENCE

## 📦 WHAT YOU GET

✨ React 19 + TypeScript + Vite
🎨 Responsive CSS (Mobile-first)
⚡ 95+ Lighthouse Performance
🚀 GitHub Actions CI/CD
🐳 Docker + GCP Cloud Run
📱 Full Portfolio Sections

## ⚡ QUICK COMMANDS

```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build
npm run lint             # Check code style
npm run analyze          # Analyze bundle
npm run start            # Same as dev
```

## 🏗️ PROJECT STRUCTURE

```
portfolio_website/
├── src/
│   ├── components/      # 6 React components
│   ├── styles/          # 7 CSS files
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app
├── public/
│   └── images/          # Your images
├── .github/
│   └── workflows/       # CI/CD pipeline
├── Dockerfile           # Production build
└── [Config files]
```

## 🎨 COMPONENTS

| Component | Purpose | File |
|-----------|---------|------|
| Header | Navigation | `src/components/Header.tsx` |
| Hero | Hero section | `src/components/Hero.tsx` |
| Projects | Project showcase | `src/components/Projects.tsx` |
| Resume | Experience/skills | `src/components/Resume.tsx` |
| Contact | Contact form | `src/components/Contact.tsx` |
| Footer | Footer | `src/components/Footer.tsx` |

## 🎨 CUSTOMIZE

### Change Colors
`src/styles/globals.css` → Update CSS variables

### Add Projects
`src/components/Projects.tsx` → Edit PROJECTS array

### Update Resume
`src/components/Resume.tsx` → Edit SKILLS & EXPERIENCE

### Add Images
1. Save to `public/images/`
2. Reference: `<img src="/images/name.webp" />`

### Update Social Links
`src/components/Contact.tsx` & `src/components/Footer.tsx`

## 🚀 DEPLOYMENT

### GitHub Actions (Auto)
```bash
git push origin main    # Automatic deployment
```

### Manual Docker
```bash
docker build -t portfolio .
docker run -p 8080:8080 portfolio
```

## 📊 FILES REFERENCE

### Core
- `src/App.tsx` - Main app component
- `src/main.tsx` - React root entry
- `package.json` - Dependencies
- `vite.config.ts` - Build config

### Docs
- `README.md` - Overview
- `SETUP_GUIDE.md` - Setup steps
- `DEPLOYMENT.md` - GCP deployment
- `PERFORMANCE.md` - Performance tips
- `BUILD_SUMMARY.md` - This summary

### Config
- `.env.example` - Environment variables
- `.github/workflows/deploy.yml` - CI/CD
- `Dockerfile` - Production build
- `lighthouse.config.json` - Performance

## 🔗 IMPORTANT LINKS

- [Vite](https://vite.dev)
- [React](https://react.dev)
- [GCP Cloud Run](https://cloud.google.com/run/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## ✅ CUSTOMIZATION CHECKLIST

- [ ] Update Hero text & title
- [ ] Add your projects
- [ ] Update experience
- [ ] Add social links
- [ ] Change colors
- [ ] Add images
- [ ] Setup GCP project
- [ ] Setup GitHub secrets
- [ ] Deploy!

## 🆘 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Port in use | `npm run dev -- --port 3001` |
| Build errors | `npm run lint` then fix |
| Module not found | `npm install` again |
| Images not loading | Check `public/images/` path |
| Lighthouse low | See `PERFORMANCE.md` |

## 📱 KEY METRICS

- Bundle Size: < 200KB (gzipped)
- Lighthouse: 95+
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## 🎯 NEXT STEPS

1. ✅ Install: `npm install`
2. ✅ Customize components
3. ✅ Test: `npm run dev`
4. ✅ Build: `npm run build`
5. ✅ Setup GCP (see DEPLOYMENT.md)
6. ✅ Deploy: `git push origin main`

---

**Built with ❤️ using React, Vite, and TypeScript**

See `README.md` for full documentation.
