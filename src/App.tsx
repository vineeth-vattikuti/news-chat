import React, { useState } from 'react';
import { NewsArticle } from '../types/news';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  items?: NewsArticle[];
}

export default function App() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);

  async function handleSend() {
    if (!query.trim()) return;
    const userMessage: ChatMessage = { role: 'user', text: query };
    setHistory(h => [...h, userMessage]);
    setQuery('');

    try {
      const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const body = await resp.json();
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        text: `Your query: ${body.response}`
      };
      setHistory(h => [...h, assistantMsg]);
    } catch (err: any) {
      setHistory(h => [
        ...h,
        { role: 'assistant', text: 'Error: ' + err.message }
      ]);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>News Chat MVP (TS)</h2>
      <div style={{ border: '1px solid #ddd', padding: 16, minHeight: 300 }}>
        {history.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{m.role}:</strong> {m.text}
            {m.items && (
              <ul>
                {m.items.map((it, idx) => (
                  <li key={idx}>
                    <strong>{it.title}</strong> ({it.ticker}) -{' '}
                    <a href={it.link} target="_blank" rel="noreferrer">
                      link
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input
          style={{ flex: 1, padding: 8 }}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask a question about financial news..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
