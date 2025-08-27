import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
// Legacy sqlite import removed

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, max: 60 }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/lead', async (req, res) => {
  const { firstName='', lastName='', email='', phone='' } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  // Legacy database operations removed - this file is not used
  console.log('Legacy endpoint called:', { firstName, lastName, email, phone });
  // Email functionality removed - data saved to Airtable only
  res.json({ ok: true });
});

app.post('/api/host-application', async (req, res) => {
  const d = req.body || {};
  if (!d.email) return res.status(400).json({ error: 'email required' });
  // Legacy database operations removed - this file is not used
  console.log('Legacy host endpoint called:', d);
  // Email functionality removed - data saved to Airtable only
  res.json({ ok: true });
});

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`[server] listening on ${port}`));