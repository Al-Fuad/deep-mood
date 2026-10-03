import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

export default function ApiDocsView() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const baseUrl = API_BASE_URL || (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:8000');

  const curlSingle = `curl -X POST "${baseUrl}/api/predict" \\
     -H "Content-Type: application/json" \\
     -d '{
       "text": "I can not believe how overjoyed I feel today!",
       "model_name": "BiGRU"
     }'`;

  const curlBatch = `curl -X POST "${baseUrl}/api/predict/batch" \\
     -H "Content-Type: application/json" \\
     -d '{
       "texts": [
         "This is unbelievable news!",
         "I am terrified of heights."
       ],
       "model_name": "BiGRU"
     }'`;

  const pythonSnippet = `import requests

url = "${baseUrl}/api/predict"
payload = {
    "text": "I cherish every moment spent with you.",
    "model_name": "BiGRU"
}
response = requests.post(url, json=payload)
data = response.json()

print(f"Predicted Emotion: {data['prediction']}")
print(f"Confidence Score: {data['confidence'] * 100:.2f}%")
print("Full Probabilities:", data['probabilities'])`;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Terminal size={22} color="var(--accent-purple)" />
            <span>FastAPI REST Integration</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Integrate DeepMood into your microservices, CLI scripts, or web apps.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="secondary-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}
          >
            <span>Swagger UI (/docs)</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="http://localhost:8000/redoc"
            target="_blank"
            rel="noreferrer"
            className="secondary-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}
          >
            <span>ReDoc (/redoc)</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Code snippet 1: Single Prediction */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            1. Single Inference (cURL)
          </span>
          <button
            onClick={() => copyToClipboard(curlSingle, 1)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.78rem' }}
          >
            {copiedIndex === 1 ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre style={{ background: 'rgba(9, 13, 22, 0.9)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#a78bfa' }}>
          {curlSingle}
        </pre>
      </div>

      {/* Code snippet 2: Batch Inference */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            2. Batch Prediction (cURL)
          </span>
          <button
            onClick={() => copyToClipboard(curlBatch, 2)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.78rem' }}
          >
            {copiedIndex === 2 ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre style={{ background: 'rgba(9, 13, 22, 0.9)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38bdf8' }}>
          {curlBatch}
        </pre>
      </div>

      {/* Code snippet 3: Python Client */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            3. Python Integration (requests)
          </span>
          <button
            onClick={() => copyToClipboard(pythonSnippet, 3)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.78rem' }}
          >
            {copiedIndex === 3 ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copiedIndex === 3 ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre style={{ background: 'rgba(9, 13, 22, 0.9)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#34d399' }}>
          {pythonSnippet}
        </pre>
      </div>
    </div>
  );
}
