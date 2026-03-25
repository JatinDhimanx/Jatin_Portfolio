if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;


// ===== DEBUG =====
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "MISSING");


// ===== VIEW ENGINE =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===== SMTP TRANSPORTER (BEST FOR RENDER) =====

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,
});


// ===== VERIFY =====

transporter.verify((err, success) => {
  if (err) {
    console.log("MAIL ERROR:", err);
  } else {
    console.log("MAIL READY");
  }
});


// ===== ROUTES =====

app.get("/", (req, res) => {
  res.render("index");
});


app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({
      success: false,
      message: "All fields required",
    });
  }

  try {

    const mailOptions = {
      from: `"Portfolio Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Awesome! Message sent successfully.",
    });

  } catch (error) {

    console.log("SEND ERROR:", error);

    res.json({
      success: false,
      message: "Oops! Failed to send.",
    });
  }
});


// ===== START =====

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});