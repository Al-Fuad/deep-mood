import React from 'react';
import { Brain, Cpu, Layers, Terminal, Sparkles } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, apiStatus }) {
  return (
    <header className="app-header">
      <div className="header-top-bar">
        <div className="brand-wrapper">
          <div className="brand-logo-icon">
            <Brain size={24} color="#ffffff" />
          </div>
          <div className="brand-info">
            <div className="brand-title-row">
              <span className="brand-title">DeepMood</span>
              <span className="brand-badge">BiGRU v1.0</span>
            </div>
            <p className="brand-subtitle">
              Deep Learning Emotion Intelligence
            </p>
          </div>
        </div>

        <div className="header-meta">
          <div
            className="api-status-pill"
            title={
              apiStatus === 'online'
                ? 'FastAPI inference backend is healthy'
                : 'Render free instances spin down after inactivity and may take ~40s to wake up on the first request.'
            }
          >
            <span
              className="api-status-dot"
              style={{
                backgroundColor:
                  apiStatus === 'online'
                    ? '#10b981'
                    : apiStatus === 'checking'
                    ? '#f59e0b'
                    : '#ef4444',
                boxShadow:
                  apiStatus === 'online'
                    ? '0 0 8px #10b981'
                    : apiStatus === 'checking'
                    ? '0 0 8px #f59e0b'
                    : '0 0 8px #ef4444',
              }}
            />
            <span className="api-status-label">
              <span className="api-prefix">FastAPI: </span>
              {apiStatus === 'online'
                ? 'Connected'
                : apiStatus === 'checking'
                ? 'Waking...'
                : 'Offline / Standby'}
            </span>
          </div>
        </div>
      </div>

      <div className="nav-tabs-container">
        <nav className="nav-tabs" role="tablist" aria-label="Main Navigation">
          <button
            className={`nav-tab-btn ${activeTab === 'playground' ? 'active' : ''}`}
            onClick={() => setActiveTab('playground')}
            role="tab"
            id="tab-playground"
            aria-selected={activeTab === 'playground'}
          >
            <Sparkles size={16} />
            <span>Playground</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
            role="tab"
            id="tab-details"
            aria-selected={activeTab === 'details'}
          >
            <Layers size={16} />
            <span>Project Details</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
            role="tab"
            id="tab-batch"
            aria-selected={activeTab === 'batch'}
          >
            <Cpu size={16} />
            <span>Batch Analyzer</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
            role="tab"
            id="tab-api"
            aria-selected={activeTab === 'api'}
          >
            <Terminal size={16} />
            <span>API &amp; Docs</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
