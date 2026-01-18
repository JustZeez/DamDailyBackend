
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const path = require('path');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

// Send welcome email (user or admin)
const sendWelcomeEmail = async (email, name, role = 'user') => {
  let subject, html;

  if (role === 'admin') {
    subject = 'Welcome Admin – Premium Blog Website';
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .logo { 
            max-width: 120px; 
            height: auto;
            margin: 0 auto 20px auto;
            display: block;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            text-align: center;
          }
          ul { 
            line-height: 1.6; 
            text-align: left;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:logo" alt="DamDaily Logo" class="logo"/>
          
          <h2 style="color: #333;">Welcome to DamDaily Admin Panel, ${name}!</h2>
          <p>You've been registered as an <strong>Admin</strong> on DamDaily.</p>
          <p>As an admin, you can:</p>
          <ul>
            <li>Manage users and their subscriptions</li>
            <li>Publish, edit, and remove articles</li>
            <li>Oversee premium content access</li>
            <li>Track platform activities and performance</li>
          </ul>
          <p>If you encounter issues, contact our dev/support team immediately.</p>
          <p><strong>The DamDaily Management</strong></p>
        </div>
      </body>
      </html>
    `;
  } else {
    subject = 'Welcome to DamDaily!';
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .logo { 
            max-width: 120px; 
            height: auto;
            margin: 0 auto 20px auto;
            display: block;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            text-align: center;
          }
          ul { 
            line-height: 1.6; 
            text-align: left;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:logo" alt="DamDaily Logo" class="logo"/>
          
          <h2 style="color: #333;">Welcome to DamDaily, ${name}! 🎉</h2>
          <p>We're excited to have you on board. Here's what you can do with your account:</p>
          <ul>
            <li>Read all general news articles for free</li>
            <li>Subscribe to premium content like weather and sports news</li>
            <li>Customize your news feed based on your interests</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy reading!</p>
          <p><strong>The DamDaily Team</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../assets/images/logo.png'),
      cid: 'logo' 
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${role} welcome email sent to:`, email);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address - DamDaily',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .logo { 
            max-width: 120px; 
            height: auto;
            margin: 0 auto 20px auto;
            display: block;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            text-align: center;
          }
          .otp { 
            font-size: 32px; 
            font-weight: bold; 
            color: #10B981; 
            letter-spacing: 5px; 
            text-align: center; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:logo" alt="DamDaily Logo" class="logo"/>
          
          <h2 style="color: #333;">Email Verification</h2>
          <p>Use this OTP code to verify your email address:</p>
          <div class="otp">${otp}</div>
          <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </body>
      </html>
    `,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../assets/images/logo.png'),
      cid: 'logo'
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.CLIENT_URL}/resetpassword?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password - DamDaily',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .logo { 
            max-width: 120px; 
            height: auto;
            margin: 0 auto 20px auto;
            display: block;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            text-align: center;
          }
          .button { 
            background-color: #10B981; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:logo" alt="DamDaily Logo" class="logo"/>
          
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${name}, you requested to reset your password. Click the button below to create a new password:</p>
          <p>
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>If you didn't request this, please ignore this email.</p>
          <p><strong>This link expires in 1 hour.</strong></p>
        </div>
      </body>
      </html>
    `,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../assets/images/logo.png'),
      cid: 'logo'
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// NEW FUNCTION: Send password reset success email
const sendPasswordResetSuccessEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Successful - DamDaily',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .logo { 
            max-width: 120px; 
            height: auto;
            margin: 0 auto 20px auto;
            display: block;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            text-align: center;
          }
          .success-icon {
            color: #10B981;
            font-size: 48px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:logo" alt="DamDaily Logo" class="logo"/>
          
          <div class="success-icon">✓</div>
          <h2 style="color: #333;">Password Reset Successful!</h2>
          <p>Hi ${name}, your password has been successfully reset.</p>
          <p>You can now log in to your DamDaily account with your new password.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
          <p>Happy reading!</p>
          <p><strong>The DamDaily Team</strong></p>
        </div>
      </body>
      </html>
    `,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../assets/images/logo.png'),
      cid: 'logo'
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail
};