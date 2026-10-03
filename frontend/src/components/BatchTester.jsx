import React, { useState } from 'react';
import { Cpu, RefreshCw, Send, BarChart2 } from 'lucide-react';
import { EMOTIONS, API_BASE_URL } from '../utils/constants';

export default function BatchTester({ selectedModel }) {
  const defaultBatch = [
    "I was awarded the scholarship today and I feel on top of the world!",
    "It broke my heart seeing the stray puppy shivering in the cold rain.",
    "You are the most precious person in my life and I will always protect you.",
    "This delayed flight ruined my entire schedule and the support team hung up on me!",
    "Hearing strange scratching noises inside the closet made my spine tingle with terror.",
    "I looked outside and overnight the entire backyard had turned into a winter wonderland!"
  ].join('\n');

  const [batchText, setBatchText] = useState(defaultBatch);
  const [loading, setLoading] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const [error, setError] = useState(null);

  const handleBatchPredict = async () => {
    const lines = batchText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: lines,
          model_name: selectedModel || 'BiGRU',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error ${response.status}`);
      }

      const data = await response.json();
      setBatchResult(data);
    } catch (err) {
      setError(err.message || 'Batch prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={22} color="var(--accent-purple)" />
            <span>Batch Multi-Text Emotion Analyzer</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Analyze multiple sentences simultaneously (one per line) and inspect aggregated emotional patterns.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={handleBatchPredict}
          disabled={loading || !batchText.trim()}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Analyzing Batch...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Run Batch Analysis</span>
            </>
          )}
        </button>
      </div>

      <textarea
        className="batch-textarea"
        value={batchText}
        onChange={(e) => setBatchText(e.target.value)}
        placeholder="Enter sentences to analyze (one per line)..."
      />

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', marginTop: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {batchResult && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="var(--accent-cyan)" />
            <span>Batch Emotion Aggregate ({batchResult.total_samples} samples in {batchResult.total_time_ms} ms)</span>
          </h3>

          <div className="batch-distribution-row">
            {Object.entries(batchResult.emotion_distribution).map(([emo, count]) => {
              const meta = EMOTIONS[emo] || {};
              return (
                <div key={emo} className="dist-pill" style={{ borderColor: count > 0 ? meta.color : 'var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.25rem' }}>{meta.emoji}</div>
                  <div style={{ fontSize: '0.82rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                    {emo}
                  </div>
                  <div className="dist-count" style={{ color: meta.color || '#fff' }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Individual Line Classifications:
            </h4>
            {batchResult.results.map((r, idx) => {
              const emoMeta = EMOTIONS[r.prediction] || {};
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    gap: '1rem',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0', flex: 1 }}>
                    "{r.text}"
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: emoMeta.bgGlow,
                        color: emoMeta.color,
                        border: `1px solid ${emoMeta.color}40`,
                      }}
                    >
                      <span>{emoMeta.emoji}</span>
                      <span style={{ textTransform: 'capitalize' }}>{r.prediction}</span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {(r.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
