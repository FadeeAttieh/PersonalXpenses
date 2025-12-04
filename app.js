require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
//const incomeRoutes = require('./routes/income');
//const expenseRoutes = require('./routes/expenses');
const typeRoutes = require('./routes/types');
const savingsRoutes = require('./routes/savings');
const transferRoutes = require('./routes/transfers');
const reportRoutes = require('./routes/report');
const balanceRoutes = require('./routes/balances');
const dashboardRoutes = require('./routes/dashboard');
const errorHandler = require('./middleware/errorHandler'); // You should create this file
const path = require('path');
const balancesRouter = require('./routes/balances');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const authJwt = require('./middleware/authJwt');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup (for demonstration, use a secure store in production)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files (CSS, images, etc.) - NO CSRF protection here
app.use(express.static(path.join(__dirname, 'Public')));

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// CSRF protection setup
const csrfProtection = csurf({ cookie: true });

// Endpoint to get CSRF token (no CSRF validation needed for getting the token)
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Auth routes (register/login do not require auth but need CSRF)
app.use('/auth', csrfProtection, authRoutes);

// Register user routes (require CSRF and JWT auth)
const userRoutes = require('./routes/user');
app.use('/user', csrfProtection, authJwt, userRoutes);

// Protect routes (except /auth)
app.use('/entries', csrfProtection, authJwt, require('./routes/entries'));
app.use('/savings', csrfProtection, authJwt, require('./routes/savings'));
app.use('/balances', csrfProtection, authJwt, require('./routes/balances'));
app.use('/types', csrfProtection, authJwt, typeRoutes);
app.use('/transfers', csrfProtection, authJwt, transferRoutes);
app.use('/report', csrfProtection, authJwt, reportRoutes);
app.use('/api/dashboard', authJwt, dashboardRoutes);

// Error handler (should be last)
app.use(errorHandler);

// Sync DB and start server
const PORT = process.env.PORT || 3000;

// Run migrations then seed currencies
const { exec } = require('child_process');
exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
  if (error) {
    console.error('Migration error:', error);
  }
  console.log('Migration output:', stdout);
  
  // Seed currencies after migration
  exec('npx sequelize-cli db:seed --seed 20250814-currencies.js', (seedError, seedStdout, seedStderr) => {
    if (seedError) {
      console.log('Currency seed info:', seedStdout);
    } else {
      console.log('Currencies seeded:', seedStdout);
    }
    
    sequelize.sync()
      .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`Server running on port ${PORT}`);
          
          // Check email configuration
          if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
            console.warn('⚠️  EMAIL CONFIGURATION MISSING');
            console.warn('   Set SENDGRID_API_KEY and FROM_EMAIL environment variables');
            console.warn('   Verification codes will be logged to console instead');
            console.warn('   See EMAIL_SETUP.md for configuration instructions');
          } else {
            console.log('✓ Email service configured (SendGrid)');
          }
        });
      })
      .catch(err => {
        console.error('Sequelize sync error:', err);
        process.exit(1);
      });
  });
});