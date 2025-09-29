// server.js
const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", // set this in Railway
  credentials: true,
}));

// ✅ Health check route
app.get("/", (req, res) => {
  console.log("✅ Root route '/' was hit");
  res.json({
    status: "OK",
    message: "AI Job Assistant Server is running with Gemini AI!",
    timestamp: new Date().toISOString(),
    apiProvider: "Google Gemini",
  });
});

// ✅ Example API route
app.get("/api/test", (req, res) => {
  console.log("✅ /api/test was hit");
  res.json({ msg: "Test route works!" });
});

// ✅ Example POST route
app.post("/api/query", (req, res) => {
  console.log("✅ /api/query was hit with body:", req.body);
  // Just echo back for now
  res.json({ reply: "Query received!", yourInput: req.body });
});

// ❌ Catch-all for unknown routes
app.use((req, res) => {
  console.log("❌ No matching route for:", req.method, req.url);
  res.status(404).json({ error: "Route not found" });
});

// ✅ Export app (Railway will use this)
module.exports = app;

// If running locally, start server directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

