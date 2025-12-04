# Email Verification Setup Guide

## Current Issue
The system is not sending verification codes via email during registration because the email service is not configured.

## Solution: Configure Gmail SMTP

### Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Scroll down to **App passwords**
4. Click **Select app** → Choose "Mail"
5. Click **Select device** → Choose "Other" and name it "PersonalXpenses"
6. Click **Generate**
7. Copy the 16-character password (remove spaces)

### Step 2: Configure Environment Variables

#### For Railway Deployment:

1. Go to your Railway project dashboard
2. Select your service
3. Go to **Variables** tab
4. Add these variables:

```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
```

#### For Local Development:

Create a `.env` file in the project root:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
JWT_SECRET=your_jwt_secret_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
DATABASE_URL=your_database_url
```

### Step 3: Restart the Application

After setting the environment variables, restart your application:

**Railway:** Automatic restart after saving variables
**Local:** Stop and restart the server

## Temporary Workaround (Current Implementation)

Until email is configured, the system will:
1. ✅ Create user accounts successfully
2. ✅ Generate verification codes
3. ✅ Log verification codes to the server console
4. ✅ Return verification codes in the API response (TEMPORARY - for testing only)

**To verify an account without email:**
1. Check the server logs for the verification code
2. Or check the registration response JSON for `verificationCode` field
3. Use that code in the verification form

## Alternative: Use a Different Email Service

If Gmail doesn't work, you can use other services:

### SendGrid (Recommended for Production)

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

Environment variable needed:
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Mailgun

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
});
```

### AWS SES (Simple Email Service)

Requires AWS credentials and SES configuration.

## Testing Email Configuration

After configuring, test by:

1. Register a new user with a valid email address
2. Check server logs for: `Verification email sent successfully to [email]`
3. Check your email inbox (and spam folder)
4. Verify the account with the received code

## Security Notes

⚠️ **Important for Production:**

1. Remove `verificationCode` from API responses (currently included for testing)
2. Never commit `.env` file to git (already in `.gitignore`)
3. Use app-specific passwords, never your main Gmail password
4. Consider rate limiting registration endpoints
5. Add email validation on the frontend

## Troubleshooting

### "Invalid credentials" error
- Double-check EMAIL_USER is your full Gmail address
- Verify EMAIL_PASS is the app password (not your Gmail password)
- Ensure 2-Step Verification is enabled in Google account

### "Connection timeout" error
- Check if port 587 or 465 is blocked
- Try switching between ports 587 (TLS) and 465 (SSL)
- Verify firewall settings

### Emails going to spam
- Add SPF and DKIM records to your domain
- Use a professional email service (SendGrid, Mailgun)
- Warm up your sending reputation gradually

## Code Changes Made

**File:** `controllers/authController.js`

1. Added environment variable validation
2. Added try-catch blocks around email sending
3. Log verification codes to console as fallback
4. Return codes in response during development (temporary)
5. Added detailed error logging

## Next Steps

1. ✅ Configure EMAIL_USER and EMAIL_PASS environment variables
2. ✅ Test registration with a real email address
3. ✅ Remove `verificationCode` from responses once email works
4. Consider implementing email templates with HTML formatting
5. Add rate limiting to prevent spam/abuse
