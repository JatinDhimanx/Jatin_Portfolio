if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
});


app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "forworkm9@gmail.com",
      subject: "New Portfolio Message",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
`,
    });

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});


app.listen(PORT, () => {
  console.log("Server running on", PORT);
});