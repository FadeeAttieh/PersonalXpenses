# Railway Deployment Guide

## Pre-Deployment Checklist

✅ All critical fixes have been applied:
- Session secret now uses environment variable
- Database migrations run automatically on deploy
- .sequelizerc created for Sequelize CLI configuration
- Production-ready session cookies with secure flag
- .env.example created for reference

## Required Environment Variables

Set these in your Railway project settings:

### Essential Variables:
```
NODE_ENV=production
JWT_SECRET=<generate-a-strong-random-secret>
SESSION_SECRET=<generate-a-strong-random-secret>
```

### Database (Auto-configured by Railway):
Railway automatically provides `DATABASE_PRIVATE_URL` when you add a PostgreSQL service.

## Deployment Steps

### 1. Connect Repository to Railway
```bash
# Login to Railway CLI (optional)
railway login

# Link your project
railway link
```

### 2. Add PostgreSQL Database
- In Railway dashboard, click "New" → "Database" → "PostgreSQL"
- Railway automatically sets `DATABASE_PRIVATE_URL` environment variable

### 3. Set Environment Variables
In Railway dashboard → Variables tab, add:
- `NODE_ENV` = `production`
- `JWT_SECRET` = (generate strong random string)
- `SESSION_SECRET` = (generate strong random string)

### 4. Deploy
- Push to your connected branch (main)
- Railway auto-deploys on push
- Migrations run automatically before app starts

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

### Migration Fails
If migrations fail on first deploy:
```bash
railway run npm run migrate
```

### Database Connection Issues
- Ensure PostgreSQL service is running
- Check that `DATABASE_PRIVATE_URL` is set (Railway does this automatically)
- Verify your app is using the private URL (no egress fees)

### Port Issues
Railway automatically sets the PORT environment variable - your app already handles this correctly.

## Cost Optimization

✅ Your app is already configured to use Railway's private network (`DATABASE_PRIVATE_URL`), which avoids egress fees.

## Additional Notes

- The app uses Nixpacks builder (faster than Docker for Node.js)
- Auto-restart on failure (max 10 retries)
- Sessions persist for 24 hours
- CSRF protection enabled for all non-static routes
