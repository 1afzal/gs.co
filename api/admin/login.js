import dotenv from 'dotenv';

// Load local .env for local development
dotenv.config();

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

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
  } catch (err) {
    console.error('Admin login error', err);
    return res.status(500).json({ error: err.message });
  }
}
