if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "MISSING");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(cors());
app.use(express.json());



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.error("Transport error:", error);
  } else {
    console.log("Mailer ready");
  }
});


app.get("/", (req, res) => {
  res.render("index");
});
app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Message from ${name}`,
      replyTo: email,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});