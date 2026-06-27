// src/hooks/useEvaluator.js
// Day 5 — replaces the old setTimeout with a real API call
//
// Returns: { result, loading, error, evaluate }
// Usage:
//   const { result, loading, error, evaluate } = useEvaluator()
//   await evaluate(resumeFile, jobDescription)

import { useState } from 'react'
import client from '../api/client'

export function useEvaluator() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function evaluate(resumeFile, jobDescription) {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload your resume PDF and enter a job description')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('job_description', jobDescription)
      formData.append('prompt', 'Evaluate this resume against the job description and provide a match score, feedback, and improvement suggestions.')

      const response = await client.post('/evaluate', formData)
      setResult(response.data)
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired — please log in again')
      } else {
        setError(err.response?.data?.detail || 'Evaluation failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, error, evaluate }
}
