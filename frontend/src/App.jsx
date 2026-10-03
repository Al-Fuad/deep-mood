import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Predictor from './components/Predictor';
import ProjectDetails from './components/ProjectDetails';
import BatchTester from './components/BatchTester';
import ApiDocsView from './components/ApiDocsView';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('playground');
  const [selectedModel, setSelectedModel] = useState('BiLSTM');
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/info');
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (err) {
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
            Bidirectional LSTMs & GRUs trained on the benchmark <em>dair-ai/emotion</em> dataset.
          </p>
        </section>

        {/* Tab Content */}
        {activeTab === 'playground' && (
          <Predictor
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        )}

        {activeTab === 'details' && <ProjectDetails />}

        {activeTab === 'batch' && (
          <BatchTester selectedModel={selectedModel} />
        )}

        {activeTab === 'api' && <ApiDocsView />}

        {/* Application Footer */}
        <footer className="app-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span>Built for the DeepMood Project</span>
            <span>•</span>
            <span>FastAPI & React Architecture</span>
            <span>•</span>
            <span>MIT Licensed</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Bidirectional LSTM: 91.90% Accuracy | Bidirectional GRU: 91.70% Accuracy | 15,213 Vocabulary Tokens
          </p>
        </footer>
      </main>
    </div>
  );
}
