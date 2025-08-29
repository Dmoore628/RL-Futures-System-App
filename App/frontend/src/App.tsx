import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navigation from './components/Navigation'
import WelcomePage from './pages/WelcomePage'
import UploadAndSettingsPage from './pages/UploadAndSettingsPage'
import './styles/global.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
  {
    path: '/upload-and-settings',
    element: <UploadAndSettingsPage />,
  },
])

function App() {
  return (
    <ThemeProvider>
      <Navigation />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
