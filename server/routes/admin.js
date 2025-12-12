import express from 'express';

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password required' });

  const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!ADMIN_SECRET) {
    return res.status(500).json({ error: 'Admin secret not configured on server' });
  }

  if (password === ADMIN_SECRET) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

export default router;
