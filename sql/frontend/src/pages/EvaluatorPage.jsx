// src/pages/EvaluatorPage.jsx
// Day 5 — protected evaluator page using real API

import { useState } from 'react'
import { useEvaluator } from '../hooks/useEvaluator'

export default function EvaluatorPage() {
  const [resumeFile, setResumeFile]     = useState(null)
  const [jobDescription, setJobDesc]    = useState('')
  const { result, loading, error, evaluate } = useEvaluator()

  function handleSubmit(e) {
    e.preventDefault()
    evaluate(resumeFile, jobDescription)
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Resume Evaluator</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Upload your resume (PDF only)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              style={styles.fileInput}
            />
            {resumeFile && <p style={styles.fileName}>{resumeFile.name}</p>}
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Job description</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the job description here…"
              style={styles.textarea}
            />
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Evaluating…' : 'Evaluate resume'}
        </button>
      </form>

      {result && (
        <div style={styles.resultCard}>
          <div style={styles.scoreRow}>
            <span style={styles.scoreLabel}>Score</span>
            <span style={styles.scoreValue}>{result.score} / 100</span>
          </div>
          <p style={styles.feedback}>{result.feedback}</p>
          {result.improvements?.length > 0 && (
            <>
              <p style={styles.improvLabel}>Suggested improvements</p>
              <ul style={styles.list}>
                {result.improvements.map((item, i) => (
                  <li key={i} style={styles.listItem}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: {
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '2.5rem 1.25rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1.25rem',
    color: '#0f172a',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#334155',
  },
  textarea: {
    minHeight: '260px',
    padding: '1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '18px',
    fontSize: '0.95rem',
    resize: 'vertical',
    background: '#f8fafc',
    boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.06)',
  },
  error: {
    color: '#b91c1c',
    fontSize: '0.95rem',
  },
  btn: {
    padding: '1rem 1.4rem',
    background: 'linear-gradient(135deg, #4338ca, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: '18px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    minWidth: '180px',
    boxShadow: '0 16px 32px rgba(37,99,235,0.18)',
  },
  resultCard: {
    marginTop: '2rem',
    padding: '2rem',
    borderRadius: '24px',
    background: '#fff',
    border: '1px solid rgba(148,163,184,0.15)',
    boxShadow: '0 24px 80px rgba(15,23,42,0.08)',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  scoreLabel: {
    fontSize: '0.95rem',
    color: '#64748b',
  },
  scoreValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#111827',
  },
  feedback: {
    fontSize: '0.97rem',
    color: '#334155',
    lineHeight: 1.8,
    marginBottom: '1.25rem',
  },
  improvLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#0f172a',
  },
  list: {
    paddingLeft: '1.25rem',
  },
  listItem: {
    fontSize: '0.95rem',
    color: '#334155',
    lineHeight: 1.8,
    marginBottom: '0.65rem',
  },
}
