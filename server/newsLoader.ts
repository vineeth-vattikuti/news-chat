import fs from 'fs';
import path from 'path';
import { NewsArticle } from '../types/news';

let articles: NewsArticle[] = [];

export function loadNews(jsonPath?: string): NewsArticle[] {
  const resolved =
    jsonPath || path.join(__dirname, '..', 'data', 'stock_news.json');
  if (!fs.existsSync(resolved)) {
    throw new Error(`News JSON not found at ${resolved}`);
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  const parsed = JSON.parse(raw);

  const flat: NewsArticle[] = [];
  for (const [ticker, items] of Object.entries(parsed)) {
    for (const item of items as any[]) {
      flat.push({
        ticker,
        title: item.title,
        full_text: item.full_text,
        link: item.link
      });
    }
  }

  articles = flat;
  return articles;
}

export function getAll(): NewsArticle[] {
  if (!articles.length) {
    throw new Error('News not loaded yet');
  }
  return articles;
}
