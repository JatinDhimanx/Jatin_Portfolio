const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Port (Render ke liye zaroori)
const PORT = process.env.PORT || 5000;


// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running");
});


// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ✅ Check transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("Email error:", error);
  } else {
    console.log("Server ready to send emails");
  }
});


// ✅ Contact API
app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields.",
    });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Portfolio Contact Form",
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});


// ✅ Listen
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});