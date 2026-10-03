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
    <div className="glass-panel batch-panel">
      <div className="batch-header">
        <div className="batch-header-text">
          <h2 className="batch-title">
            <Cpu size={22} color="var(--accent-purple)" />
            <span>Batch Multi-Text Emotion Analyzer</span>
          </h2>
          <p className="batch-desc">
            Analyze multiple sentences simultaneously (one per line) and inspect aggregated emotional patterns.
          </p>
        </div>

        <button
          className="primary-btn batch-submit-btn"
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
        <div className="batch-error-banner">
          {error}
        </div>
      )}

      {batchResult && (
        <div className="batch-aggregate-section">
          <h3 className="batch-aggregate-title">
            <BarChart2 size={18} color="var(--accent-cyan)" />
            <span>Batch Emotion Aggregate ({batchResult.total_samples} samples in {batchResult.total_time_ms} ms)</span>
          </h3>

          <div className="batch-distribution-row">
            {Object.entries(batchResult.emotion_distribution).map(([emo, count]) => {
              const meta = EMOTIONS[emo] || {};
              return (
                <div key={emo} className="dist-pill" style={{ borderColor: count > 0 ? meta.color : 'var(--border-subtle)' }}>
                  <div className="dist-emoji">{meta.emoji}</div>
                  <div className="dist-label">
                    {emo}
                  </div>
                  <div className="dist-count" style={{ color: meta.color || '#fff' }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="batch-items-section">
            <h4 className="batch-items-title">
              Individual Line Classifications:
            </h4>
            <div className="batch-items-list">
              {batchResult.results.map((r, idx) => {
                const emoMeta = EMOTIONS[r.prediction] || {};
                return (
                  <div key={idx} className="batch-item-card">
                    <span className="batch-item-text">
                      "{r.text}"
                    </span>
                    <div className="batch-item-meta">
                      <span
                        className="batch-emotion-tag"
                        style={{
                          background: emoMeta.bgGlow,
                          color: emoMeta.color,
                          borderColor: `${emoMeta.color}40`,
                        }}
                      >
                        <span>{emoMeta.emoji}</span>
                        <span style={{ textTransform: 'capitalize' }}>{r.prediction}</span>
                      </span>
                      <span className="batch-item-conf">
                        {(r.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
