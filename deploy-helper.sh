#!/bin/bash
set -e

echo "==========================================="
echo "   Salon CRM Demo Deployment Helper"
echo "==========================================="
echo ""
echo "This script will help you push your code to GitHub so Vercel and Railway can deploy it."
echo ""

# Check for gh cli
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) could not be found."
    echo "Please install it: sudo apt install gh (Linux) or brew install gh (Mac)"
    exit 1
fi

echo "Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "You are not logged into GitHub CLI."
    echo "Please log in now (select 'HTTPS' and 'Login with a web browser' for easiest setup):"
    gh auth login
else
    echo "✅ Authenticated with GitHub."
fi

echo ""
echo "Let's create a new public GitHub repository for the CRM project."
read -p "Enter repository name (default: salon-crm-demo): " REPO_NAME
REPO_NAME=${REPO_NAME:-salon-crm-demo}

echo "Creating public repository '$REPO_NAME'..."
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push

echo ""
echo "✅ Code successfully pushed to GitHub!"
echo "https://github.com/$(gh api user -q .login)/$REPO_NAME"
echo ""
echo "==========================================="
echo "               NEXT STEPS                  "
echo "==========================================="
echo "1. Go to https://railway.app/new"
echo "   - Select 'Deploy from GitHub repo'"
echo "   - Connect the '$REPO_NAME' repository"
echo "   - Click 'Add Variables' and paste your DATABASE_URL, NEXTAUTH_SECRET, and ALLOWED_ORIGIN"
echo "   - Railway will detect railway.toml and deploy the Backend API automatically!"
echo ""
echo "2. Go to https://vercel.com/new"
echo "   - Import the '$REPO_NAME' repository"
echo "   - Set Framework Preset to Next.js"
echo "   - Set Root Directory to 'client'"
echo "   - Add Environment Variables (from client/.env.example)"
echo "   - Click Deploy!"
echo "==========================================="
