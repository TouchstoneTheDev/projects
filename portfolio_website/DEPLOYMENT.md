# Deployment Guide

Guide to deploy portfolio to GCP Cloud Run with GitHub Actions CI/CD.

## Prerequisites

- GCP Project with billing enabled
- GitHub repository
- `gcloud` CLI installed locally
- Docker installed (for local testing)

## GCP Setup

### 1. Create GCP Project

```bash
gcloud projects create portfolio-website
gcloud config set project portfolio-website
```

### 2. Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  container.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

### 3. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployment"

# Get project number
PROJECT_NUMBER=$(gcloud projects describe portfolio-website --format='value(projectNumber)')

# Grant permissions
gcloud projects add-iam-policy-binding portfolio-website \
  --member="serviceAccount:github-actions@portfolio-website.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding portfolio-website \
  --member="serviceAccount:github-actions@portfolio-website.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding portfolio-website \
  --member="serviceAccount:github-actions@portfolio-website.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding portfolio-website \
  --member="serviceAccount:github-actions@portfolio-website.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"
```

### 4. Create Service Account Key

```bash
gcloud iam service-accounts keys create ~/portfolio-sa-key.json \
  --iam-account=github-actions@portfolio-website.iam.gserviceaccount.com
```

## GitHub Setup

### Add Repository Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Create these secrets:

| Secret | Value |
|--------|-------|
| `GCP_PROJECT_ID` | `portfolio-website` |
| `GCP_SA_KEY` | Contents of `~/portfolio-sa-key.json` |

## Deploy

### Automatic Deployment

Push to `main` branch triggers workflow:

```bash
git push origin main
```

Workflow automatically:
1. Installs dependencies
2. Runs linter
3. Builds project
4. Tests performance
5. Builds Docker image
6. Pushes to Container Registry
7. Deploys to Cloud Run

### Manual Deployment (Local)

```bash
# Build Docker image
docker build -t portfolio-website:latest .

# Test locally
docker run -p 8080:8080 portfolio-website:latest

# Tag for GCR
docker tag portfolio-website gcr.io/portfolio-website/portfolio:latest

# Push to GCR
docker push gcr.io/portfolio-website/portfolio:latest

# Deploy to Cloud Run
gcloud run deploy portfolio \
  --image gcr.io/portfolio-website/portfolio:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Monitoring

### View Deployment Status

```bash
# Get service details
gcloud run services describe portfolio \
  --platform managed \
  --region us-central1

# View logs
gcloud run services logs read portfolio \
  --platform managed \
  --region us-central1 \
  --limit 50
```

### Cloud Run Metrics

Access metrics in Cloud Console:
- **Cloud Run** → **Services** → Select **portfolio**
- View requests, latency, errors, memory usage

## Custom Domain

```bash
# Map custom domain
gcloud run services update-traffic portfolio \
  --to-revisions LATEST=100

# Configure DNS
# Add CNAME record pointing to Cloud Run service URL
```

## Environment Variables

Set in Cloud Run deploy command:

```bash
gcloud run deploy portfolio \
  --image gcr.io/portfolio-website/portfolio:latest \
  --set-env-vars \
    NODE_ENV=production,\
    VITE_GA_ID=your-ga-id
```

## Troubleshooting

### Deployment fails

```bash
# Check GitHub Actions logs in repository
# View Cloud Build logs
gcloud builds log --region=us-central1
```

### Service won't start

```bash
# Check Cloud Run logs
gcloud run services logs read portfolio --region us-central1 --limit 100

# Verify Docker image locally
docker run -it portfolio-website:latest
```

### Performance issues

- Check Cloud Run metrics
- Run Lighthouse CI: `npm run build` then check results
- Optimize images in `public/images/`

## Cost Management

- Cloud Run: Pay per request
- Container Registry: ~$0.10 per GB/month
- Set memory limit: `--memory 512Mi`
- Scale to 0 during off-hours

## Security

- Use service accounts with minimal permissions
- Never commit secrets to Git
- Rotate service account keys periodically
- Use private GCR repositories
- Enable VPC Service Controls

## Cleanup

```bash
# Delete Cloud Run service
gcloud run services delete portfolio --region us-central1

# Delete service account
gcloud iam service-accounts delete github-actions@portfolio-website.iam.gserviceaccount.com

# Delete GCP project
gcloud projects delete portfolio-website
```
