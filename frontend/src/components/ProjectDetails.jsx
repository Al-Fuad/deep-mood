import React from 'react';
import { 
  Database, 
  Layers, 
  Award, 
  Sliders, 
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { EMOTIONS } from '../utils/constants';

export default function ProjectDetails() {
  const benchmarks = [
    {
      rank: '🥇 Rank 1',
      name: 'Bidirectional LSTM (BiLSTM)',
      acc: '91.90%',
      loss: '0.2099',
      status: 'Active (Production)',
      isTop: true,
      color: '#10b981',
      notes: 'Captures past and future emotional nuance; optimal memory cell gating.',
    },
    {
      rank: '🥈 Rank 2',
      name: 'Bidirectional GRU (BiGRU)',
      acc: '91.70%',
      loss: '0.2188',
      status: 'Active (Production)',
      isTop: true,
      color: '#3b82f6',
      notes: 'Near-identical accuracy to BiLSTM with faster step computation & fewer parameters.',
    },
    {
      rank: '🥉 Rank 3',
      name: 'Simple RNN',
      acc: '26.95%',
      loss: '1.7635',
      status: 'Baseline Benchmark',
      isTop: false,
      color: '#64748b',
      notes: 'Suffers severely from vanishing gradients over sequences longer than 10-15 tokens.',
    },
    {
      rank: '4',
      name: 'Unidirectional GRU',
      acc: '26.55%',
      loss: '1.7754',
      status: 'Baseline Benchmark',
      isTop: false,
      color: '#64748b',
      notes: 'Without backward sequence visibility, emotion-altering trailing clauses are missed.',
    },
    {
      rank: '5',
      name: 'Unidirectional LSTM',
      acc: '11.35%',
      loss: '1.7853',
      status: 'Baseline Benchmark',
      isTop: false,
      color: '#64748b',
      notes: 'Failed to converge well under unidirectional sequential flow on short informal tweets.',
    },
  ];

  const datasetStats = [
    { label: 'Total Samples', value: '20,000' },
    { label: 'Train Split', value: '16,000 (80%)' },
    { label: 'Validation Split', value: '2,000 (10%)' },
    { label: 'Test Split', value: '2,000 (10%)' },
    { label: 'Max Token Cutoff', value: '50 Tokens' },
    { label: 'Vocabulary Size', value: '15,213 Words' },
  ];

  const pipelineSteps = [
    {
      num: 1,
      title: 'Raw Text Normalization & Tokenization',
      desc: 'Tokenized with Keras Tokenizer into lowercased token indices using an empirical vocabulary of 15,213 tokens.',
    },
    {
      num: 2,
      title: 'Sequence Padding & Post-Truncation',
      desc: 'Standardized to uniform fixed-size sequences of length 50 with post-padding and post-truncating.',
    },
    {
      num: 3,
      title: 'Dense Word Embedding Layer',
      desc: 'Transforms discrete integer indices into continuous 100-dimensional semantic vectors.',
    },
    {
      num: 4,
      title: 'Bidirectional Recurrent Layer (BiLSTM / BiGRU)',
      desc: 'Processes sequences forward and backward simultaneously (64 units each = 128 concatenated hidden state output).',
    },
    {
      num: 5,
      title: 'Dropout Regularization (Rate = 0.5)',
      desc: 'Prevents neuron co-adaptation and mitigates overfitting on subtle emotional cues.',
    },
    {
      num: 6,
      title: 'Dense Non-Linear Projection (64 units, ReLU)',
      desc: 'Consolidates temporal representations into high-level emotional feature representations.',
    },
    {
      num: 7,
      title: 'Softmax Output Classification (6 classes)',
      desc: 'Generates normalized probability distribution across Sadness, Joy, Love, Anger, Fear, and Surprise.',
    },
  ];

  return (
    <div className="project-details-view">
      {/* Top Banner Overview */}
      <div className="glass-panel project-overview-card">
        <div className="project-overview-header">
          <BookOpen size={24} color="var(--accent-purple)" />
          <h2 className="project-overview-title">
            DeepMood Architecture &amp; Research Details
          </h2>
        </div>
        <p className="project-overview-text">
          <strong>DeepMood</strong> is an end-to-end sentiment and emotional intelligence system designed to classify
          nuanced affective expressions in natural language. By benchmarking unidirectional versus bidirectional
          recurrent architectures on the <strong>dair-ai/emotion</strong> corpus, the project proves how bidirectional
          context awareness elevates emotional text classification from ~27% baseline to <strong>91.90% accuracy</strong>.
        </p>
      </div>

      {/* Dataset & Architecture Spec Grid */}
      <div className="details-grid">
        {/* Dataset Card */}
        <div className="glass-panel detail-card">
          <h3 className="detail-card-title">
            <Database size={20} color="var(--accent-blue)" />
            <span>Dataset Specification</span>
          </h3>
          <p className="detail-card-desc">
            Trained and validated on the internationally recognized <strong>dair-ai/emotion</strong> dataset
            consisting of English Twitter messages curated with human emotion annotations.
          </p>

          <div className="spec-list">
            {datasetStats.map((st, i) => (
              <div key={i} className="spec-item">
                <span className="spec-key">{st.label}</span>
                <span className="spec-val">{st.value}</span>
              </div>
            ))}
          </div>

          <div className="class-distribution-wrapper">
            <span className="class-distribution-label">
              Class Distribution Breakdown:
            </span>
            <div className="class-distribution-chips">
              {Object.entries(EMOTIONS).map(([key, item]) => (
                <span
                  key={key}
                  className="class-chip"
                  style={{
                    background: item.bgGlow,
                    border: `1px solid ${item.color}40`,
                    color: item.color,
                  }}
                >
                  <span>{item.emoji}</span>
                  <span style={{ textTransform: 'capitalize' }}>{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hyperparameters Card */}
        <div className="glass-panel detail-card">
          <h3 className="detail-card-title">
            <Sliders size={20} color="var(--accent-pink)" />
            <span>Hyperparameters &amp; Setup</span>
          </h3>
          <p className="detail-card-desc">
            Standardized training parameters configured for regularized recurrent training without overfitting.
          </p>

          <div className="spec-list">
            <div className="spec-item">
              <span className="spec-key">Embedding Dimension</span>
              <span className="spec-val">100 dimensions</span>
            </div>
            <div className="spec-item">
              <span className="spec-key">Recurrent Units</span>
              <span className="spec-val">64 units (Bi = 128)</span>
            </div>
            <div className="spec-item">
              <span className="spec-key">Dense Hidden Units</span>
              <span className="spec-val">64 units (ReLU)</span>
            </div>
            <div className="spec-item">
              <span className="spec-key">Dropout Rate</span>
              <span className="spec-val">0.50 (2x Layers)</span>
            </div>
            <div className="spec-item">
              <span className="spec-key">Optimization Algorithm</span>
              <span className="spec-val">Adam</span>
            </div>
            <div className="spec-item">
              <span className="spec-key">Loss Function</span>
              <span className="spec-val">Sparse Categorical CE</span>
            </div>
            <div className="spec-item">
              <span className="spec-key">Evaluation Metric</span>
              <span className="spec-val">Categorical Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="glass-panel project-card">
        <div className="benchmark-header">
          <div className="benchmark-title-wrap">
            <Award size={22} color="var(--accent-purple)" />
            <h3 className="benchmark-title">
              Empirical Model Evaluation &amp; Benchmarks
            </h3>
          </div>
          <span className="benchmark-badge">
            2,000 Unseen Test Samples
          </span>
        </div>

        <p className="benchmark-desc">
          Quantitative results measured during testing across all five explored model architectures:
        </p>

        <div className="table-scroll-hint">
          <span>⇄ Swipe horizontally to inspect full benchmark table</span>
        </div>

        <div className="benchmark-table-wrapper">
          <table className="benchmark-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Rank</th>
                <th>Test Accuracy</th>
                <th>Test Loss</th>
                <th>Status</th>
                <th>Architectural Notes</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b, i) => (
                <tr key={i} className={b.isTop ? 'highlight-row' : ''}>
                  <td className="table-model-name" style={{ color: b.isTop ? '#ffffff' : 'var(--text-secondary)' }}>
                    {b.name}
                  </td>
                  <td className="table-rank">
                    {b.rank}
                  </td>
                  <td className="table-acc" style={{ color: b.color }}>
                    {b.acc}
                  </td>
                  <td className="table-loss">
                    {b.loss}
                  </td>
                  <td>
                    <span
                      className={`benchmark-status-badge ${b.isTop ? 'top-status' : 'baseline-status'}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="table-notes">
                    {b.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="benchmark-findings-card">
          <TrendingUp size={22} color="#c084fc" className="findings-icon" />
          <p className="findings-text">
            <strong>Key Machine Learning Finding:</strong> Bidirectional modeling yielded a dramatic jump in classification
            performance from <strong>26.95%</strong> (Simple RNN) and <strong>11.35%</strong> (Unidirectional LSTM) to
            <strong>91.90%</strong> (BiLSTM) and <strong>91.70%</strong> (BiGRU). Natural language sentiment and emotion
            heavily depend on backward reference resolution, contrastive conjunctions (e.g., <em>"despite...", "even though..."</em>),
            and trailing punctuation which unidirectional models fail to retain across longer token sequences.
          </p>
        </div>
      </div>

      {/* Layer-by-Layer Pipeline Card */}
      <div className="glass-panel project-card">
        <div className="pipeline-header">
          <Layers size={22} color="var(--accent-cyan)" />
          <h3 className="pipeline-title">
            End-to-End Neural Processing Pipeline
          </h3>
        </div>

        <div className="pipeline-steps-container">
          {pipelineSteps.map((step) => (
            <div key={step.num} className="pipeline-step-card">
              <div className="step-num">{step.num}</div>
              <div className="step-content">
                <h4 className="step-title">
                  {step.title}
                </h4>
                <p className="step-desc">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
