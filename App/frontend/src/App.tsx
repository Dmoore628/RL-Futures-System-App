import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import WelcomePage from './pages/WelcomePage'
import './styles/global.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
])

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
