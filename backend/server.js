const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 

app.use(express.json()); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Server is ready to send emails.');
  }
});

app.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all fields.' });
  }

  try {

    const mailOptions = {
      from: email, 
      to: process.env.EMAIL_USER, 
      subject: `mail from ${name} with ${email}`, 
      replyTo: email, 
      text: message,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});