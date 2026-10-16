/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Flask API, e.g. https://nathan-portfolio-api.onrender.com */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
