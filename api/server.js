const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'https://snapshot-dashboard.vercel.app' }));
app.use(express.json());

// POST /api/reports
app.post('/api/reports', async (req, res) => {
  const report = req.body;

  if (!report || !report.generatedAt) {
    return res.status(400).json({ message: 'Invalid report format' });
  }

  const { error } = await supabase.from('reports').insert({ data: report });

  if (error) {
    console.error('Insert failed:', error);
    return res.status(500).json({ message: 'Insert failed' });
  }

  res.status(200).json({ message: 'Report stored' });
});

// GET /api/reports/latest
app.get('/api/reports/latest', async (req, res) => {
  const { data, error } = await supabase
    .from('reports')
    .select('data')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: 'No report available' });
  }

  res.json(data.data); // Return only the stored JSON blob
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Listening on http://0.0.0.0:${port}`);
});
