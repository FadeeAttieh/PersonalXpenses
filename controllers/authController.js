const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '';

async function verifyTurnstileToken(token) {
  if (!TURNSTILE_SECRET) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return false; // Fail if not configured
  }
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token
      })
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res, next) => {
  try {
    const { username, pin, email } = req.body;
    const hashedPin = await bcrypt.hash(pin, 10);
    const code = generateVerificationCode();
    const user = await User.create({
      username,
      pin: hashedPin,
      email,
      email_verified: false,
      email_verification_code: code
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your account',
      text: `Your verification code is: ${code}`
    });

    res.status(201).json({ id: user.id, username: user.username, email });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.email_verified) return res.status(400).json({ error: 'Email already verified' });
    if (user.email_verification_code !== code) return res.status(400).json({ error: 'Invalid code' });

    user.email_verified = true;
    user.email_verification_code = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, pin, turnstileToken } = req.body;
    
    // Verify Turnstile token
    if (!await verifyTurnstileToken(turnstileToken)) {
      return res.status(400).json({ error: 'Verification failed. Please try again.' });
    }
    
    // Try to find by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username }
        ]
      }
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.email_verified) return res.status(403).json({ error: 'Email not verified. Please verify your email before logging in.' });
    const valid = await bcrypt.compare(pin, user.pin);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    // Issue JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.email_verified) return res.status(400).json({ error: 'Email already verified' });

    const code = generateVerificationCode();
    user.email_verification_code = code;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new verification code',
      text: `Your new verification code is: ${code}`
    });

    res.json({ message: 'Verification code resent.' });
  } catch (err) {
    next(err);
  }
};