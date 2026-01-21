const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // 1. Save to Database
    const newMessage = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // 2. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // 3. Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email, 
      subject: `New Support Message: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <p>This message has been saved to your database (ID: ${newMessage._id})</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      success: true, 
      message: "Message sent and recorded successfully!" 
    });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ success: false, message: "Server error, please try again." });
  }
};

module.exports = { sendContactMessage };