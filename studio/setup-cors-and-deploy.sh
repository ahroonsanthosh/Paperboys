#!/usr/bin/env bash
# Run this from inside the studio/ directory after `sanity login` and `sanity init --env`
# Usage:  bash setup-cors-and-deploy.sh [live-domain]
# Example: bash setup-cors-and-deploy.sh https://ahroonsanthosh.github.io

set -e

LIVE_DOMAIN="${1:-}"
LOCAL_URL="http://localhost:5500"
GITHUB_PAGES="https://ahroonsanthosh.github.io"

echo "==> Adding CORS origins to your Sanity project…"
npx sanity cors add "$LOCAL_URL"     --no-credentials
npx sanity cors add "$GITHUB_PAGES"  --no-credentials

if [ -n "$LIVE_DOMAIN" ]; then
  npx sanity cors add "$LIVE_DOMAIN" --no-credentials
  echo "    Added $LIVE_DOMAIN"
fi

echo ""
echo "==> Deploying Sanity Studio…"
npx sanity deploy

echo ""
echo "==> Seeding initial content…"
node seed.js

echo ""
echo "All done! Your Studio URL is shown above (ends in .sanity.studio)."
echo "Open cms.js in the project root and replace REPLACE_WITH_PROJECT_ID"
echo "with the project ID shown in studio/.env"
