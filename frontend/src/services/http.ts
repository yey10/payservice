import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT_MS } from '../config/api'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
