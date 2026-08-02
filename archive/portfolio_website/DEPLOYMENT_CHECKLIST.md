# DEPLOYMENT CHECKLIST

Complete checklist for deploying portfolio to GCP Cloud Run.

## Pre-Deployment

- [ ] Code review completed
- [ ] All tests pass: `npm run build`
- [ ] No linting errors: `npm run lint`
- [ ] Build artifacts verified: `npm run build && npm run preview`
- [ ] Lighthouse performance tested locally
- [ ] All personal info updated
- [ ] Images added and optimized
- [ ] Social links working
- [ ] Contact form functional
- [ ] Git commits are clean and descriptive

## GCP Setup (One-Time)

- [ ] GCP project created
- [ ] Billing enabled
- [ ] APIs enabled:
  - [ ] Cloud Run
  - [ ] Container Registry
  - [ ] Cloud Build
  - [ ] Artifact Registry
- [ ] Service account created: `github-actions`
- [ ] Service account key downloaded
- [ ] Service account has permissions:
  - [ ] roles/run.admin
  - [ ] roles/storage.admin
  - [ ] roles/iam.serviceAccountUser
  - [ ] roles/artifactregistry.admin

## GitHub Setup (One-Time)

- [ ] GitHub repository created
- [ ] Repository secrets configured:
  - [ ] `GCP_PROJECT_ID` - Set to your GCP project ID
  - [ ] `GCP_SA_KEY` - Set to service account key JSON

## Pre-Deployment Verification

```bash
# Verify build
npm run build
npm run preview

# Check GitHub Actions workflow
cat .github/workflows/deploy.yml

# Verify Dockerfile
cat Dockerfile

# Check environment
cat .env.example
```

## Deployment

### Option 1: Automatic (Recommended)

```bash
git push origin main
# GitHub Actions automatically deploys
# Monitor: GitHub Actions tab
```

### Option 2: Manual

```bash
gcloud run deploy portfolio \
  --image gcr.io/portfolio-website/portfolio:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

## Post-Deployment

### Verify Deployment

- [ ] GitHub Actions workflow succeeded
- [ ] Cloud Run service created and running
- [ ] Service is publicly accessible
- [ ] No errors in Cloud Run logs
- [ ] Website loads without errors

### Test Live Site

```bash
# Get service URL
gcloud run services describe portfolio --region us-central1 --format='value(status.url)'

# Test in browser
# Should load without errors
```

### Performance Testing

- [ ] Run Lighthouse on production URL
- [ ] Score is 95+ (Performance)
- [ ] Mobile responsive
- [ ] All images load
- [ ] Navigation works
- [ ] Contact form works

### Monitor

```bash
# Check logs
gcloud run services logs read portfolio --region us-central1 --limit 50

# Check metrics
# Cloud Console > Cloud Run > Services > portfolio > Metrics
```

## Custom Domain (Optional)

- [ ] Domain registered
- [ ] DNS configured with CNAME to Cloud Run URL
- [ ] SSL certificate auto-provisioned
- [ ] Domain verified in Cloud Run

## Ongoing Maintenance

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review logs weekly
- [ ] Update content as needed
- [ ] Keep dependencies updated
- [ ] Monitor costs

## Troubleshooting

### Deployment Failed

```bash
# Check GitHub Actions
GitHub → Actions → Failed run → View logs

# Check Cloud Build
gcloud builds log --region=us-central1

# Check Cloud Run
gcloud run services logs read portfolio
```

### Site Not Loading

```bash
# Check service status
gcloud run services describe portfolio

# Check logs
gcloud run services logs read portfolio --limit 100

# Restart service
gcloud run deploy portfolio --update-env-vars NODE_ENV=production
```

### Performance Issues

- Check Lighthouse report
- Monitor memory usage: Cloud Console > Metrics
- Check image sizes
- Profile with DevTools
- See PERFORMANCE.md

## Rollback

```bash
# Deploy previous version
gcloud run deploy portfolio \
  --image gcr.io/portfolio-website/portfolio:previous-sha
```

## Cleanup

If deleting:

```bash
# Delete service
gcloud run services delete portfolio --region us-central1

# Delete images
gcloud container images delete gcr.io/portfolio-website/portfolio

# Delete service account
gcloud iam service-accounts delete github-actions@portfolio-website.iam.gserviceaccount.com

# Delete GCP project
gcloud projects delete portfolio-website
```

## Resources

- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Troubleshooting](DEPLOYMENT.md)
- [Performance Guide](PERFORMANCE.md)

## Support

- Check deployment logs
- Review GitHub Actions output
- Read error messages carefully
- Check GCP documentation
- Create GitHub issue if stuck

---

✅ Ready to deploy!

Push to main: `git push origin main`
