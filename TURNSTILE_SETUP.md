# Cloudflare Turnstile Setup

Cloudflare Turnstile has been added to your login page for bot protection.

## Setup Steps:

### 1. Get Your Turnstile Keys

1. Go to https://dash.cloudflare.com/
2. Sign in or create a free account
3. Go to **Turnstile** in the sidebar
4. Click **Add Site**
5. Enter your domain (or use `localhost` for testing)
6. Choose **Managed** mode
7. Click **Create**
8. Copy both keys:
   - **Site Key** (public)
   - **Secret Key** (private)

### 2. Configure Your Application

#### Frontend (index.html):

Replace `YOUR_SITE_KEY` on line ~118 with your actual Site Key:

```html
<div class="cf-turnstile" data-sitekey="YOUR_ACTUAL_SITE_KEY" data-callback="onTurnstileSuccess"></div>
```

#### Backend (.env file):

Add your Secret Key to `.env`:

```
TURNSTILE_SECRET_KEY=your_actual_secret_key_here
```

### 3. Restart Your Application

```bash
docker compose down
docker compose up -d
```

### 4. Test

1. Go to your login page
2. You should see the Turnstile widget
3. Complete the verification
4. Try logging in

## How It Works:

- **Frontend**: The Turnstile widget appears on the login form
- **Verification**: User must pass the challenge before the login button is enabled
- **Backend**: Server verifies the token with Cloudflare before processing login
- **Protection**: Bots and automated attacks are blocked

## Testing with Localhost:

For local development, you can use Cloudflare's test keys:

- **Site Key**: `1x00000000000000000000AA`
- **Secret Key**: `1x0000000000000000000000000000000AA`

These always pass verification (for testing only).

## Important Notes:

- Keep your Secret Key secure (never commit to git)
- The Site Key is public and goes in your HTML
- Turnstile is completely free with no limits
- No user interaction needed (unlike reCAPTCHA)
- Privacy-friendly (no tracking)

## Troubleshooting:

If verification fails:
1. Check that both keys are correctly set
2. Verify domain matches in Cloudflare dashboard
3. Check browser console for errors
4. Ensure `TURNSTILE_SECRET_KEY` is in `.env`
5. Restart containers after changing `.env`
