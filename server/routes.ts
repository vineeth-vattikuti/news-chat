import { Router } from 'express';
import { loadNews, getAll } from './newsLoader';

const router = Router();

// load once on startup
try {
  loadNews();
} catch (err) {
  console.warn('Warning: News JSON not found.');
}

router.get('/articles', (req, res) => {
  try {
    const all = getAll();
    res.json({ count: all.length, items: all.slice(0, 20) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', (req, res) => {
  const q = (req.query.q as string) || '';
  if (!q) {
    return res.status(400).json({ error: 'Missing query param q' });
  }

  res.json({response: q});
});

export default router;
