import { Router } from 'express';
import { loadNews, getAll } from './newsLoader';
import { normalizeToTokens, simpleScore } from './text';

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

  const queryTokens = normalizeToTokens(q);
  if (queryTokens.length === 0) {
    return res.json({ query: q, tokens: [], count: 0, items: [] });
  }

  const ranked = getAll()
    .map(a => {
      const content = `${a.title} ${a.full_text}`;
      const score = simpleScore(content, queryTokens);
      return { score, article: a };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.article.title.localeCompare(b.article.title);
    })
    .slice(0, 10)
    .map(r => r.article);

  res.json({
    query: q,
    count: ranked.length,
    items: ranked
  });
});

export default router;
