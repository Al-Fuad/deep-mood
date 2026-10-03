import React from 'react';
import { Brain, Cpu, BookOpen, Layers, Terminal, Sparkles } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, apiStatus }) {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-logo-icon">
          <Brain size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="brand-title">DeepMood</span>
            <span className="brand-badge">BiRNN v1.0</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Deep Learning Emotion Intelligence
          </p>
        </div>
      </div>

      <nav className="nav-tabs" role="tablist">
        <button
          className={`nav-tab-btn ${activeTab === 'playground' ? 'active' : ''}`}
          onClick={() => setActiveTab('playground')}
          role="tab"
          id="tab-playground"
        >
          <Sparkles size={16} />
          <span>Playground</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
          role="tab"
          id="tab-details"
        >
          <Layers size={16} />
          <span>Project Details</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
          onClick={() => setActiveTab('batch')}
          role="tab"
          id="tab-batch"
        >
          <Cpu size={16} />
          <span>Batch Analyzer</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
          role="tab"
          id="tab-api"
        >
          <Terminal size={16} />
          <span>API & Docs</span>
        </button>
      </nav>

      <div className="header-meta">
        <div className="api-status-pill">
          <span
            className="api-status-dot"
            style={{
              backgroundColor: apiStatus === 'online' ? '#10b981' : '#ef4444',
              boxShadow: apiStatus === 'online' ? '0 0 8px #10b981' : '0 0 8px #ef4444',
            }}
          />
          <span>FastAPI: {apiStatus === 'online' ? 'Connected' : 'Offline / Standby'}</span>
        </div>
      </div>
    </header>
  );
}
