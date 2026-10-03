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
    <div className="glass-panel api-panel">
      <div className="api-docs-header">
        <div className="api-docs-header-text">
          <h2 className="api-docs-title">
            <Terminal size={22} color="var(--accent-purple)" />
            <span>FastAPI REST Integration</span>
          </h2>
          <p className="api-docs-subtitle">
            Integrate DeepMood into your microservices, CLI scripts, or web apps.
          </p>
        </div>

        <div className="api-docs-actions">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="secondary-btn api-doc-btn"
          >
            <span>Swagger UI (/docs)</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="http://localhost:8000/redoc"
            target="_blank"
            rel="noreferrer"
            className="secondary-btn api-doc-btn"
          >
            <span>ReDoc (/redoc)</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Code snippet 1: Single Prediction */}
      <div className="code-block-section">
        <div className="code-block-header">
          <span className="code-block-title">
            1. Single Inference (cURL)
          </span>
          <button
            onClick={() => copyToClipboard(curlSingle, 1)}
            className="copy-code-btn"
            aria-label="Copy cURL single inference code"
          >
            {copiedIndex === 1 ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="code-snippet-pre single-curl">
          {curlSingle}
        </pre>
      </div>

      {/* Code snippet 2: Batch Inference */}
      <div className="code-block-section">
        <div className="code-block-header">
          <span className="code-block-title">
            2. Batch Prediction (cURL)
          </span>
          <button
            onClick={() => copyToClipboard(curlBatch, 2)}
            className="copy-code-btn"
            aria-label="Copy cURL batch prediction code"
          >
            {copiedIndex === 2 ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="code-snippet-pre batch-curl">
          {curlBatch}
        </pre>
      </div>

      {/* Code snippet 3: Python Client */}
      <div className="code-block-section">
        <div className="code-block-header">
          <span className="code-block-title">
            3. Python Integration (requests)
          </span>
          <button
            onClick={() => copyToClipboard(pythonSnippet, 3)}
            className="copy-code-btn"
            aria-label="Copy Python integration code"
          >
            {copiedIndex === 3 ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copiedIndex === 3 ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="code-snippet-pre python-code">
          {pythonSnippet}
        </pre>
      </div>
    </div>
  );
}
