import React, { useState } from 'react';
import { NewsArticle } from '../types/news';

type Role = 'user' | 'assistant';

interface ChatMessage {
  role: Role;
  text: string;
  tokens?: string[];
  items?: NewsArticle[];
}

interface SearchResponse {
  query: string;
  tokens: string[];
  count: number;
  items: NewsArticle[];
}

function snippet(text: string, len = 180): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > len ? clean.slice(0, len - 1) + '…' : clean;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: query };
    setHistory(h => [...h, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const resp = await fetch(`/api/search?q=${encodeURIComponent(userMessage.text)}`);
      if (!resp.ok) {
        throw new Error(`Server returned ${resp.status}`);
      }
      const body: SearchResponse = await resp.json();

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        text: body.count === 0
          ? 'No matching articles.'
          : `Showing top ${Math.min(10, body.items.length)} matching articles.`,
        items: body.items
      };

      setHistory(h => [...h, assistantMsg]);
    } catch (err: any) {
      setHistory(h => [...h, { role: 'assistant', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'system-ui, Arial' }}>
      <h2>News Chat App</h2>

      <div style={{ border: '1px solid #ddd', padding: 16, minHeight: 320, borderRadius: 8 }}>
        {history.length === 0 && (
          <div style={{ color: '#666' }}>
            Ask something like: <em>What&apos;s new with Apple?</em>
          </div>
        )}

        {history.map((m, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {m.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>

            {/* Debug tokens */}
            {m.tokens && m.tokens.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <small style={{ color: '#666' }}>
                  tokens: {m.tokens.join(', ')}
                </small>
              </div>
            )}

            {/* Results list */}
            {m.items && m.items.length > 0 && (
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {m.items.map((it, idx) => (
                  <li key={idx} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 600 }}>
                      {it.title}{' '}
                      <span style={{ color: '#555', fontWeight: 400 }}>
                        ({it.ticker})
                      </span>
                    </div>
                    <div style={{ color: '#444', margin: '2px 0 4px' }}>
                      {snippet(it.full_text)}
                    </div>
                    <div>
                      <a href={it.link} target="_blank" rel="noreferrer">Open source</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {loading && <div style={{ color: '#666' }}>Searching…</div>}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask a question about financial news..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #ccc', background: '#fafafa' }}
        >
          {loading ? 'Searching...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
