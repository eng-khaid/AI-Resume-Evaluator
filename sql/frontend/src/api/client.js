// src/api/client.js
// Day 5 — single axios instance for all API calls
//
// Why a shared instance?
//   Instead of writing the base URL and auth header in every
//   component, we configure them once here. Every import of
//   `client` automatically gets both.

import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8000',
})

// -------------------------------------------------------
// Request interceptor — runs before EVERY outgoing request
// -------------------------------------------------------
// Reads the JWT from localStorage and attaches it as a
// Bearer token. If there's no token (logged-out user),
// the header is simply not added — the server returns 401.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
