const express = require("express");
const cors = require("cors");
const path = require("path");
const { Resend } = require("resend");
const { createClient } = require("@supabase/supabase-js");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize clients
const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "placeholder_key";
const supabase = createClient(supabaseUrl, supabaseKey);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminAuth = async (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
  }

  const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  const { data, error } = await supabase.from('site_settings').select('admin_user, admin_pass').single();
  
  // Fallback if DB not fully set up
  const validUser = data?.admin_user || 'admin';
  const validPass = data?.admin_pass || process.env.ADMIN_PASSWORD || 'admin123';

  if (user === validUser && pass === validPass) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
  }
};

app.get("/", async (req, res) => {
  const { data, error } = await supabase.from('site_settings').select('*').single();
  
  if (error || !data) {
    return res.status(500).send("Database not configured. Please complete setup.");
  }

  if (data.under_construction) {
    return res.render("maintenance");
  }

  res.render("index", { portfolioData: data.portfolio_data });
});

app.get("/admin", adminAuth, async (req, res) => {
  const { data, error } = await supabase.from('site_settings').select('*').single();
  
  let portfolioData = {};
  let underConstruction = false;

  if (data) {
    portfolioData = data.portfolio_data;
    underConstruction = data.under_construction;
  }

  res.render("admin", { portfolioData, underConstruction });
});

app.post("/admin/update", adminAuth, async (req, res) => {
  const updatedData = req.body;
  const { error } = await supabase.from('site_settings').update({ portfolio_data: updatedData }).eq('id', 1);
  
  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true });
});

app.post("/admin/toggle-construction", adminAuth, async (req, res) => {
  const { under_construction } = req.body;
  const { error } = await supabase.from('site_settings').update({ under_construction }).eq('id', 1);
  if (error) return res.status(500).json({ success: false });
  res.json({ success: true });
});

app.post("/admin/reset-credentials", adminAuth, async (req, res) => {
  const { username, password } = req.body;
  const { error } = await supabase.from('site_settings').update({ admin_user: username, admin_pass: password }).eq('id', 1);
  if (error) return res.status(500).json({ success: false });
  res.json({ success: true });
});

app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Save message as unverified
    const { error: insertError } = await supabase.from('messages').insert([
      { name, email, message, is_verified: false }
    ]);
    if (insertError) throw insertError;

    // 2. Send Supabase Magic Link
    const { error: authError } = await supabase.auth.signInWithOtp({ 
      email,
      options: { shouldCreateUser: true } 
    });
    if (authError) throw authError;

    res.json({ success: true, message: "Verification link sent" });
  } catch (err) {
    console.error("Error sending message:", err);
    res.json({ success: false });
  }
});

app.post("/confirm-message", async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ success: false });

  try {
    // 1. Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);
    if (authError || !user) throw new Error("Invalid token");

    // 2. Find unverified messages for this user
    const { data: messages, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('email', user.email)
      .eq('is_verified', false);
    
    if (fetchError) throw fetchError;
    if (!messages || messages.length === 0) {
      return res.json({ success: true, message: "No unverified messages found." });
    }

    // 3. Mark as verified
    await supabase.from('messages').update({ is_verified: true }).eq('email', user.email);

    // 4. Send emails to Admin via Resend
    for (const msg of messages) {
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: process.env.EMAIL_USER || "forworkm9@gmail.com",
        subject: "New Verified Portfolio Message",
        text: `Name: ${msg.name}\nEmail: ${msg.email}\n\nMessage:\n${msg.message}`,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error confirming message:", err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});