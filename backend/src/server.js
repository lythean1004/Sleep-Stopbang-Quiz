import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import db from './db.js';
import { decryptPII, encryptPII, maskPhone } from './security.js';
import { sanitizeInput, validateLeadPayload } from './validation.js';

const app = express();
const port = process.env.PORT || 4000;

if (!process.env.ENCRYPTION_SECRET || process.env.ENCRYPTION_SECRET.length < 16) {
  throw new Error('ENCRYPTION_SECRET must be set and at least 16 chars long');
}

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '200kb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/leads', (req, res) => {
  const errors = validateLeadPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const payload = {
    name: sanitizeInput(req.body.name),
    phone: sanitizeInput(req.body.phone),
    city: sanitizeInput(req.body.city),
    score: req.body.score,
    riskLevel: req.body.riskLevel,
    requiredConsent: req.body.requiredConsent,
    marketingConsent: Boolean(req.body.marketingConsent)
  };

  const now = new Date().toISOString();

  const insertLead = db.prepare(`
    INSERT INTO leads (encrypted_name, encrypted_phone, encrypted_city, score, risk_level, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertConsent = db.prepare(`
    INSERT INTO consent_logs (lead_id, required_consent, marketing_consent, consent_text_version, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const leadResult = insertLead.run(
      encryptPII(payload.name),
      encryptPII(payload.phone),
      encryptPII(payload.city),
      payload.score,
      payload.riskLevel,
      now
    );

    insertConsent.run(
      leadResult.lastInsertRowid,
      payload.requiredConsent ? 1 : 0,
      payload.marketingConsent ? 1 : 0,
      'v1.0-ko',
      now
    );

    return leadResult.lastInsertRowid;
  });

  const leadId = transaction();
  return res.status(201).json({ leadId, message: 'saved' });
});

function checkAdminAuth(req) {
  const adminToken = process.env.ADMIN_TOKEN;
  const auth = req.headers.authorization || '';
  if (!adminToken) return false;
  return auth === `Bearer ${adminToken}`;
}

app.get('/api/admin/leads', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  const rows = db.prepare(`SELECT l.id, l.encrypted_name, l.encrypted_phone, l.encrypted_city, l.score, l.risk_level, l.created_at,
    c.required_consent, c.marketing_consent
    FROM leads l
    LEFT JOIN consent_logs c ON c.lead_id = l.id
    ORDER BY l.id DESC`).all();

  const results = rows.map((row) => {
    const phone = decryptPII(row.encrypted_phone);
    return {
      id: row.id,
      name: decryptPII(row.encrypted_name),
      phoneMasked: maskPhone(phone),
      city: decryptPII(row.encrypted_city),
      score: row.score,
      riskLevel: row.risk_level,
      requiredConsent: Boolean(row.required_consent),
      marketingConsent: Boolean(row.marketing_consent),
      createdAt: row.created_at
    };
  });

  return res.json({ results });
});

app.get('/api/admin/export.csv', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ message: 'unauthorized' });
  }
  const rows = db.prepare('SELECT id, score, risk_level, created_at FROM leads ORDER BY id DESC').all();
  const header = 'id,score,risk_level,created_at';
  const lines = rows.map((r) => `${r.id},${r.score},${r.risk_level},${r.created_at}`);
  const csv = [header, ...lines].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="high-risk-leads.csv"');
  res.send(csv);
});

app.listen(port, () => {
  console.log(`STOP-BANG backend listening on ${port}`);
});
