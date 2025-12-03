# Railway Deployment Guide - Complete Setup

## Pre-Deployment Checklist

✅ All critical fixes have been applied:
- Session secret now uses environment variable
- Database migrations run automatically on deploy
- .sequelizerc created for Sequelize CLI configuration
- Production-ready session cookies with secure flag
- .env.example created for reference

## Step-by-Step Deployment

### Step 1: Install Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Verify installation
railway --version
```

### Step 2: Login to Railway

```bash
railway login
```

This will open a browser for authentication.

### Step 3: Initialize New Project

```bash
# Create new project
railway init

# When prompted:
# - Select "Create a new project"
# - Name it "PersonalXpenses"
# - Select "production" environment
```

### Step 4: Deploy Your Application

```bash
# Deploy the app
railway up
```

Wait for the build and deployment to complete.

### Step 5: Add PostgreSQL Database

```bash
# Add PostgreSQL to your project
railway add
```

Select "PostgreSQL" from the list. Railway will automatically create `DATABASE_URL` and other database variables.

### Step 6: Link Database to App Service

Go to Railway Dashboard (https://railway.app/dashboard):
1. Open your PersonalXpenses project
2. Click on your **app service** (PersonalXpenses)
3. Go to **"Variables"** tab
4. Click **"+ New Variable"** → **"Add Reference"**
5. Select the Postgres service
6. Add reference to `DATABASE_URL`

This shares the database connection with your app.

### Step 7: Set Environment Variables

Generate secrets first:
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate SESSION_SECRET (run again for different value)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Set the variables:
```bash
# Make sure you're linked to the app service
railway service

# Select your app service (PersonalXpenses, not Postgres)

# Set variables
railway variables --set NODE_ENV=production
railway variables --set JWT_SECRET=<paste-your-generated-jwt-secret>
railway variables --set SESSION_SECRET=<paste-your-generated-session-secret>
```

### Step 8: Redeploy with All Variables

```bash
# Trigger redeploy
railway up
```

Railway will now:
- Build your app
- Run database migrations automatically
- Start your server

### Step 9: Get Your App URL

```bash
# Get the public URL
railway domain
```

### Step 10: Verify Deployment

```bash
# Check logs
railway logs

# Look for:
# - "Sequelize CLI" migration messages
# - "Server running on http://localhost:3000" (or assigned PORT)
# - No ERROR messages
```

Visit your app URL and test:
- `https://your-app.railway.app/` - Should show login page
- `https://your-app.railway.app/csrf-token` - Should return CSRF token JSON

## Quick Reference Commands

```bash
# Check current service
railway status

# Switch between services
railway service

# View variables
railway variables

# View logs
railway logs

# Redeploy
railway up

# Open dashboard
railway open
```

## Generate Secure Secrets

Use these commands to generate strong secrets:
```bash
# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# For SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Post-Deployment

### Check Logs
```bash
railway logs
```

### Verify Database Connection
Your app logs should show successful database connection using DATABASE_PRIVATE_URL.

### Test Endpoints
- `https://your-app.railway.app/` - Should serve index.html
- `https://your-app.railway.app/csrf-token` - Should return CSRF token

## Troubleshooting

### "No service linked" Error
```bash
railway service
# Select the correct service (your app, not Postgres)
```

### Migration Fails
Check if DATABASE_URL is set:
```bash
railway variables
```

If missing, link the database in Railway dashboard (Step 6).

### Database Connection Issues
- Ensure PostgreSQL service is running in Railway dashboard
- Verify `DATABASE_URL` is referenced in app service variables
- Your app automatically uses Railway's private network (no egress fees)

### Build Fails
Check logs:
```bash
railway logs
```

Common issues:
- Missing dependencies in `package.json`
- Syntax errors in code
- Wrong Node.js version

### Port Issues
Railway automatically sets PORT environment variable. Your app already handles this in `app.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

## Alternative: Deploy via GitHub (Recommended for Auto-Deploy)

Instead of `railway up`, you can connect GitHub:

1. Push your code to GitHub
2. Go to Railway Dashboard
3. Click **"+ New"** → **"GitHub Repo"**
4. Select **PersonalXpenses**
5. Railway auto-deploys on every push to main

Then follow Steps 5-7 above to add database and variables.

## Environment Variables Reference

| Variable | Required | Source | Description |
|----------|----------|--------|-------------|
| `NODE_ENV` | Yes | Manual | Set to `production` |
| `JWT_SECRET` | Yes | Manual | Random 64-byte hex string |
| `SESSION_SECRET` | Yes | Manual | Random 64-byte hex string |
| `DATABASE_URL` | Yes | Auto (Postgres) | Database connection string |
| `PORT` | No | Auto (Railway) | Server port (Railway sets this) |

## Cost Optimization

✅ Your app is configured to use `DATABASE_URL` which uses Railway's private network, avoiding egress fees.

## Security Notes

- Never commit `.env` files (already in `.gitignore`)
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- DATABASE_URL uses Railway's internal network for security and performance
- CSRF protection enabled for all non-static routes
- Session cookies use secure flag in production

## Additional Resources

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Railway CLI Docs: https://docs.railway.app/develop/cli
