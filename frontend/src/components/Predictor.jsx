import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, RefreshCw, Layers, Clock } from 'lucide-react';
import { EMOTIONS, DEFAULT_EXAMPLES, API_BASE_URL } from '../utils/constants';

export default function Predictor({ selectedModel = 'BiGRU' }) {
  const [text, setText] = useState(
    "I am so thrilled and grateful for this incredible opportunity!"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (inputText = text) => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          model_name: selectedModel || 'BiGRU',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend inference server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (ex) => {
    setText(ex.text);
    handlePredict(ex.text);
  };

  const dominantEmotion = result ? EMOTIONS[result.prediction] || EMOTIONS.joy : null;

  return (
    <div className="predictor-container">
      {/* Top Model Selector Bar */}
      <div className="model-selector-bar">
        <div className="model-selector-header">
          <Layers size={18} color="var(--accent-purple)" />
          <span className="model-selector-title">Inference Model:</span>
        </div>

        <div className="model-toggle-group">
          <div className="model-choice-btn selected">
            <span className="model-choice-name">Bidirectional GRU (BiGRU)</span>
            <div className="model-badge-group">
              <span className="model-metric-tag">91.70% Test Acc</span>
              <span className="model-metric-tag active-tag">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Card & Results Card */}
      <div className="playground-grid">
        {/* Left Column: Input */}
        <div className="glass-panel input-card">
          <div className="input-header">
            <span className="input-label">
              <Sparkles size={18} color="var(--accent-pink)" />
              <span>Input Text to Analyze</span>
            </span>
            <span className="char-counter">{text.length} / 500 chars</span>
          </div>

          <textarea
            className="text-input-area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type any sentence expressing feelings, thoughts, or reactions..."
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handlePredict();
              }
            }}
          />

          <div className="input-actions">
            <button
              className="secondary-btn"
              onClick={() => {
                setText('');
                setResult(null);
              }}
              disabled={loading || !text}
            >
              Clear
            </button>

            <button
              className="primary-btn"
              onClick={() => handlePredict()}
              disabled={loading || !text.trim()}
              id="analyze-button"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Classifying Emotion...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Analyze Nuance</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="presets-section">
            <span className="presets-title">Quick Test Presets:</span>
            <div className="preset-chips">
              {DEFAULT_EXAMPLES.map((ex, idx) => {
                const emoMeta = EMOTIONS[ex.emotion];
                return (
                  <button
                    key={idx}
                    className="preset-chip"
                    onClick={() => handleSelectExample(ex)}
                  >
                    <span>{emoMeta?.emoji}</span>
                    <span style={{ textTransform: 'capitalize' }}>{ex.emotion}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.85rem',
              }}
            >
              <strong>Connection Note:</strong> {error}
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="glass-panel results-card">
          {!result && !loading && (
            <div className="result-placeholder">
              <div className="result-placeholder-icon">
                <Sparkles size={48} color="#64748b" />
              </div>
              <h3 style={{ marginBottom: '0.5rem', color: '#cbd5e1' }}>
                Awaiting Analysis
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '320px', margin: '0 auto' }}>
                Enter text on the left or select a preset to compute real-time probability vectors.
              </p>
            </div>
          )}

          {loading && (
            <div className="result-placeholder">
              <RefreshCw size={40} className="animate-spin" color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: '#cbd5e1' }}>Running Deep Neural Forward Pass...</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem' }}>
                Tokenizing & passing through {selectedModel} architecture
              </p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Top Banner Card */}
              <div
                className="top-prediction-banner"
                style={{
                  borderLeftColor: dominantEmotion?.color || 'var(--accent-purple)',
                  boxShadow: `0 0 25px ${dominantEmotion?.bgGlow || 'rgba(0,0,0,0)'}`,
                }}
              >
                <div className="top-prediction-left">
                  <span className="emotion-icon-large">{dominantEmotion?.emoji}</span>
                  <div className="top-prediction-info">
                    <span className="top-prediction-subhead">
                      Dominant Mood
                    </span>
                    <h2 className="top-prediction-label" style={{ color: dominantEmotion?.color }}>
                      {dominantEmotion?.label}
                    </h2>
                  </div>
                </div>

                <div className="top-prediction-score">
                  <div className="score-number" style={{ color: dominantEmotion?.color }}>
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="score-caption">Confidence</div>
                </div>
              </div>

              {dominantEmotion?.description && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '-0.5rem 0 0.5rem' }}>
                  "{dominantEmotion.description}"
                </p>
              )}

              {/* Full Probability Distribution */}
              <div className="probabilities-list">
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Full Emotion Spectrum Probabilities
                </span>

                {result.probabilities.map((prob) => {
                  const meta = EMOTIONS[prob.label] || {};
                  return (
                    <div key={prob.label} className="prob-row">
                      <div className="prob-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span>{meta.emoji}</span>
                          <span style={{ textTransform: 'capitalize', color: prob.label === result.prediction ? '#ffffff' : 'var(--text-secondary)' }}>
                            {prob.label}
                          </span>
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {prob.percentage.toFixed(1)}%
                        </span>
                      </div>

                      <div className="prob-bar-track">
                        <div
                          className="prob-bar-fill"
                          style={{
                            width: `${Math.max(prob.percentage, 2)}%`,
                            background: meta.gradient || 'var(--accent-purple)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Token-Level Breakdown */}
              {result.tokens && result.tokens.length > 0 && (
                <div className="token-breakdown-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Token Vocabulary Mapping
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      15,213 Vocab Size
                    </span>
                  </div>

                  <div className="token-chips-wrap">
                    {result.tokens.map((t, i) => (
                      <span
                        key={i}
                        className={`token-chip ${t.in_vocab ? 'in-vocab' : 'oov'}`}
                        title={t.in_vocab ? `ID #${t.token_id}` : 'Out of Vocabulary (OOV)'}
                      >
                        {t.token}
                        {t.in_vocab && (
                          <span style={{ fontSize: '0.65rem', opacity: 0.6, marginLeft: '3px' }}>
                            #{t.token_id}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="latency-footer">
                <span className="latency-item">
                  <Clock size={13} />
                  <span>Inference: {result.inference_time_ms} ms</span>
                </span>
                <span className="latency-item">Architecture: {result.model_name || selectedModel} (maxlen=50)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
