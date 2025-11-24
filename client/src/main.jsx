import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function renderApp() {
  const root = createRoot(document.getElementById('root'))

  if (PUBLISHABLE_KEY) {
    root.render(
      <ErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <BrowserRouter>
            <AppProvider>
              <App />
            </AppProvider>
          </BrowserRouter>
        </ClerkProvider>
      </ErrorBoundary>,
    )
    return
  }

  // If Clerk publishable key is missing, render app without ClerkProvider
  // This prevents a hard crash/blank page during local development.
  // Authentication-related features will be disabled until the key is provided.
  // Log a clear warning so the developer can add the key if needed.
  // eslint-disable-next-line no-console
  console.warn('VITE_CLERK_PUBLISHABLE_KEY not found. Rendering app without ClerkProvider.')

  root.render(
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>,
  )
}

renderApp()
