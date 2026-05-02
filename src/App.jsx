import { lazy, Suspense } from 'react'
import { useAuthStore } from './store/useAuthStore'
import LoginScreen from './components/LoginScreen'

// Lazy-load the entire desktop shell — this chunk is never downloaded
// by unauthenticated users; the browser only fetches it after login succeeds.
const DesktopApp = lazy(() => import('./components/DesktopApp'))

// Auth gate — must NOT call other hooks here to avoid Rules-of-hooks violation
export default function App() {
  const currentUserId  = useAuthStore(s => s.currentUserId)
  const sessionLoading = useAuthStore(s => s.sessionLoading)
  // Wait for initSession() to attempt restoring the session via refresh cookie
  // before deciding whether to show the login screen.
  if (sessionLoading) return null
  if (!currentUserId) return <LoginScreen />
  return (
    <Suspense fallback={null}>
      <DesktopApp />
    </Suspense>
  )
}
