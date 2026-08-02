.PHONY: help install dev build lint preview clean deploy

help:
	@echo "Portfolio Website - Available Commands"
	@echo ""
	@echo "  make install       - Install dependencies"
	@echo "  make dev           - Start development server"
	@echo "  make build         - Build for production"
	@echo "  make lint          - Run linter"
	@echo "  make preview       - Preview production build"
	@echo "  make test-perf     - Analyze performance"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-run    - Run Docker image locally"
	@echo "  make clean         - Remove build artifacts"
	@echo "  make deploy        - Deploy to GCP Cloud Run"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

preview:
	npm run preview

test-perf:
	npm run analyze

docker-build:
	docker build -t portfolio-website:latest .

docker-run:
	docker run -p 8080:8080 portfolio-website:latest

clean:
	rm -rf node_modules
	rm -rf dist
	rm -f package-lock.json

deploy:
	@echo "Ensure GitHub Actions secrets are set:"
	@echo "  - GCP_PROJECT_ID"
	@echo "  - GCP_SA_KEY"
	@echo ""
	@echo "Then push to main branch:"
	@echo "  git push origin main"
