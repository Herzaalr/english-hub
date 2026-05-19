#!/bin/bash
# EnglishHub — Deploy Script
# Usage: ./deploy.sh <github-token> [repo-name]

set -e

TOKEN="${1:-}"
REPO="${2:-english-hub}"
OWNER="Whoo9"

if [ -z "$TOKEN" ]; then
  echo "Usage: ./deploy.sh <github-token> [repo-name]"
  echo ""
  echo "Get a token at: https://github.com/settings/tokens"
  echo "Scopes needed: repo"
  exit 1
fi

cd /root/english-hub

# Configure git
git config user.name "Whoo9"
git config user.email "whoo9@users.noreply.github.com"

# Create GitHub repo
echo ">>> Creating GitHub repo: $OWNER/$REPO"
curl -s -H "Authorization: token $TOKEN" \
  -d "{\"name\":\"$REPO\",\"description\":\"EnglishHub — Learn English, Have Fun\",\"private\":false}" \
  https://api.github.com/user/repos | grep -E '"full_name"|"html_url"|"message"'

# Set remote with token
git remote remove origin 2>/dev/null || true
git remote add origin "https://$OWNER:$TOKEN@github.com/$OWNER/$REPO.git"

# Push
echo ">>> Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "============================================"
echo "  GitHub: https://github.com/$OWNER/$REPO"
echo "============================================"
echo ""
echo ">>> Next: Deploy to Vercel"
echo "  1. Go to https://vercel.com/new"
echo "  2. Import: $OWNER/$REPO"
echo "  3. Framework: Vite"
echo "  4. Deploy!"
echo ""
echo "Or install Vercel CLI:"
echo "  npm i -g vercel && vercel --prod"
