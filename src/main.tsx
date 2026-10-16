
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import NetworkStatus from './components/NetworkStatus'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <NetworkStatus />
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
