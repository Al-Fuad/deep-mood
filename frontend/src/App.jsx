import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Predictor from './components/Predictor';
import ProjectDetails from './components/ProjectDetails';
import BatchTester from './components/BatchTester';
import ApiDocsView from './components/ApiDocsView';
import { Sparkles } from 'lucide-react';
import { API_BASE_URL } from './utils/constants';

export default function App() {
  const [activeTab, setActiveTab] = useState('playground');
  const selectedModel = 'BiGRU';
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/info`);
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch {
        setApiStatus('offline');
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="deepmood-app">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
      />

      <main className="app-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>State-of-the-Art Deep Emotion Intelligence</span>
          </div>

          <h1 className="hero-title">
            Decode Emotion with <span>Deep Neural Nuance</span>
          </h1>

          <p className="hero-subtitle">
            Classifying human emotion into <strong>Joy, Sadness, Love, Anger, Fear,</strong> and <strong>Surprise</strong> using
            Bidirectional GRU (BiGRU) trained on the benchmark <em>dair-ai/emotion</em> dataset.
          </p>
        </section>

        {/* Tab Content */}
        {activeTab === 'playground' && (
          <Predictor selectedModel={selectedModel} />
        )}

        {activeTab === 'details' && <ProjectDetails />}

        {activeTab === 'batch' && (
          <BatchTester selectedModel={selectedModel} />
        )}

        {activeTab === 'api' && <ApiDocsView />}

        {/* Application Footer */}
        <footer className="app-footer">
          <div className="footer-meta-row">
            <span>Built for the DeepMood Project</span>
            <span className="footer-dot">•</span>
            <span>FastAPI &amp; React Architecture</span>
            <span className="footer-dot">•</span>
            <span>MIT Licensed</span>
          </div>
          <p className="footer-accuracy-notes">
            Bidirectional LSTM: 91.90% Accuracy | Bidirectional GRU: 91.70% Accuracy | 15,213 Vocabulary Tokens
          </p>
        </footer>
      </main>
    </div>
  );
}
