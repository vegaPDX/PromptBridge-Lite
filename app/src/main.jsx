import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Frame-buster: CSP frame-ancestors doesn't work in <meta> tags,
// so prevent clickjacking via JavaScript instead.
if (window.self !== window.top) {
  document.body.innerHTML = '<p>PromptBridge cannot be loaded in a frame.</p>';
  throw new Error('Refused to load in frame');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
