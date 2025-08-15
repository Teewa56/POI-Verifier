import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './error/ErrorBoundary';
import { Web3Provider } from './context/Web3Context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Web3Provider>
          <ThemeProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
              <App />
            </GoogleOAuthProvider>
          </ThemeProvider>
        </Web3Provider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
