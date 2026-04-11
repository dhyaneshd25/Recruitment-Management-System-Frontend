import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store, persistor } from './store/index.js'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

// Apply theme from persisted state before first paint
const applyTheme = () => {
  try {
    const raw = localStorage.getItem('persist:recruitEdge-root')
    if (raw) {
      const root = JSON.parse(raw)
      const theme = JSON.parse(root.theme || '{}')
      document.documentElement.setAttribute('data-theme', theme.mode || 'dark')
    }
  } catch {}
}
applyTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
