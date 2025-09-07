import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navigation from './components/Navigation'
import CompleteModernWelcomePage from './pages/CompleteModernWelcomePage'
import UploadAndSettingsPage from './pages/UploadAndSettingsPage'
import './styles/global.css'

// Layout component that includes Navigation and renders the current route
const Layout = () => (
  <>
    <Navigation />
    <Outlet />
  </>
)

// Layout without navigation for debugging
const LayoutNoNav = () => (
  <>
    <Outlet />
  </>
)

// Layout without navigation for pages that have their own navigation
const LayoutWithoutNav = () => (
  <>
    <Outlet />
  </>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CompleteModernWelcomePage />,
      },
      {
        path: 'welcome',
        element: <CompleteModernWelcomePage />,
      },
      {
        path: 'upload-and-settings',
        element: <UploadAndSettingsPage />,
      },
    ],
  },
])

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
