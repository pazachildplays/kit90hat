# Deploy to Vercel

## Prerequisites
1. Have a Vercel account (https://vercel.com)
2. Have your project on GitHub/GitLab/Bitbucket

## Deployment Steps

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the project**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set project name (e.g., `kitkat-universe`)
   - Select framework: Choose "Other" or just press Enter
   - Confirm deployment location

### Option 2: Using Git Integration (Recommended for Future Updates)

1. **Push your project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect to Vercel via GitHub**
   - Go to https://vercel.com/new
   - Select "GitHub" import
   - Find and select your repository
   - Accept default settings
   - Click "Deploy"

## Environment Variables Setup

After deploying, you need to set up Vercel KV (for persistent storage):

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Storage tab → Create KV Database**
4. **Link the KV database to your project**

The environment variables will be automatically set up.

## Important Configuration Files

- `vercel.json` - Deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `api/` - API endpoints (Node.js serverless functions)
- `public/` - Static files (HTML, CSS, JS)

## Data Persistence

Your app uses Vercel KV for:
- Config (title, colors, links, contacts)
- Game leaderboards

All data is automatically persisted in the cloud.

## API Endpoints (After Deployment)

- `GET /` - Main page
- `GET /games` - Games page
- `GET /admin` - Admin panel
- `POST /api/admin/login` - Login
- `GET /api/config` - Get configuration
- `POST /api/admin/update` - Update config
- `POST /api/admin/links` - Manage links
- `POST /api/admin/leaderboard` - Save scores
- `GET /api/leaderboard?game=uno` - Get leaderboard

## Troubleshooting

**Issue: KV Database not working**
- Solution: Check that KV database is properly linked in Vercel project settings

**Issue: 404 errors on static files**
- Solution: Make sure all files in `public/` folder are present

**Issue: Admin panel not saving**
- Solution: Check KV connection and verify API routes are accessible

## Local Testing Before Deployment

```bash
npm install
npm start
```

Visit http://localhost:3000

## After Deployment

Your site will be live at: `https://YOUR_PROJECT_NAME.vercel.app`

Share this link with your users!
