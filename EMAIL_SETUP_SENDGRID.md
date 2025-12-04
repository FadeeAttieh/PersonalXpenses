# Email Setup Guide - SendGrid

This application uses **SendGrid** for sending verification emails. SendGrid is reliable, cloud-friendly, and offers 100 free emails per day.

## SendGrid Setup

### 1. Create SendGrid Account
1. Go to [https://signup.sendgrid.com/](https://signup.sendgrid.com/)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### 2. Create an API Key
1. Log in to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it (e.g., "PersonalXpenses Production")
5. Select **Full Access** or **Restricted Access** with "Mail Send" permission
6. Click **Create & View**
7. **⚠️ Copy the API key immediately** (you won't be able to see it again!)

Example API key format: `SG.xxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

### 3. Verify Sender Identity
SendGrid requires sender verification to prevent spam:

#### Option A: Single Sender Verification (easiest for personal apps)
1. Go to **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Click **Create New Sender**
3. Fill in your details:
   - **From Name**: PersonalXpenses
   - **From Email Address**: your-email@example.com (must be real)
   - **Reply To**: same email or different
   - Fill in address fields (required)
4. Click **Create**
5. Check your email and click the verification link
6. Use this email as your `FROM_EMAIL` variable

#### Option B: Domain Authentication (for production/custom domains)
1. Go to **Settings** → **Sender Authentication** → **Authenticate Your Domain**
2. Follow DNS configuration steps for your domain
3. Once verified, use any email from your domain as `FROM_EMAIL`

### 4. Configure Railway Environment Variables

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the **Variables** tab
4. Add these two variables:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
FROM_EMAIL=your-verified-email@example.com
```

**Important:**
- `SENDGRID_API_KEY`: The full API key you copied in step 2
- `FROM_EMAIL`: Must match the email you verified in step 3

5. Click **Deploy** (or wait for auto-deploy)

### 5. Test Email Delivery

1. Go to your app: https://personalxpenses-production.up.railway.app
2. Click **Register**
3. Fill in the form and submit
4. You should see "Registration successful! Check your email for verification code."
5. Check your email inbox (and spam folder)
6. Enter the 6-digit code to verify your account

### Troubleshooting

#### "Email configuration missing" message
- Verify both `SENDGRID_API_KEY` and `FROM_EMAIL` are set in Railway
- Check for typos in variable names (case-sensitive)
- Redeploy after adding variables

#### "Failed to send verification email"
- Check SendGrid dashboard → Activity for errors
- Verify your sender email is verified (step 3)
- Check API key has "Mail Send" permission
- API key might be expired - create a new one

#### Emails not arriving
- Check spam/junk folder
- Verify sender email in SendGrid dashboard
- Check SendGrid Activity Feed for delivery status
- Some email providers block SendGrid - try different email

#### "403 Forbidden" error
- Sender email not verified - complete step 3
- API key doesn't have Mail Send permission - recreate with proper permissions

---

## SendGrid Benefits Over Gmail

✅ **100 emails/day free** (vs Gmail's strict limits)  
✅ **No connection timeouts** on cloud platforms  
✅ **Better deliverability** - emails less likely to be marked as spam  
✅ **Real-time analytics** - track opens, clicks, bounces  
✅ **API-based** - no SMTP ports to configure  
✅ **Production-ready** - used by major companies  

---

## Need Help?

- SendGrid Documentation: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- Check server logs in Railway: Click service → **Deployments** → **View Logs**

---

## Security Notes

- Never commit `SENDGRID_API_KEY` to git
- Rotate API keys every 90 days
- Use restricted API keys with only Mail Send permission
- Keep `FROM_EMAIL` professional and recognizable
