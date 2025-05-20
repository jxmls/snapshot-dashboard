const db = require('./lib/db');
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for the Vercel frontend only
app.use(cors({ origin: 'https://snapshot-dashboard.vercel.app' }));
app.use(express.json()); // Required to parse JSON request body

// ... rest of your routes ...


app.post("/api/reports", (req, res) => {
  console.log("📥 Incoming POST request");

  const report = req.body;
  if (!report || !report.generatedAt) {
    return res.status(400).json({ message: "Invalid report format" });
  }

  const stmt = db.prepare("INSERT INTO reports (data) VALUES (?)");
  stmt.run(JSON.stringify(report));

  res.status(200).json({ message: "Report stored" });
});

app.get("/api/reports/latest", (req, res) => {
  console.log("✅ API test route hit");
  res.json({
    generatedAt: new Date().toISOString(),
    failedBackups: [{ job: "Test", error: "Timeout" }],
    snapshots: [{ name: "VM1", sizeGB: 40, ageHours: 27 }]
  });
});


app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`✅ Listening on http://0.0.0.0:${port}`);
});


