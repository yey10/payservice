/**
 * Configuración central de la API.
 * Para cambiar el backend sin tocar el código, define VITE_API_URL en un archivo .env
 * (por ejemplo: VITE_API_URL=http://127.0.0.1:8000/api/).
 */
const DEFAULT_API_URL = 'http://127.0.0.1:8000/api/'

const rawUrl: string = import.meta.env.VITE_API_URL || DEFAULT_API_URL

export const API_BASE_URL: string = rawUrl.replace(/\/*$/, '/')
export const API_TIMEOUT_MS = 15000
