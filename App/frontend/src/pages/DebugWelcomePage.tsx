import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import styles from './ModernWelcomePage.module.css'

const DebugWelcomePage: React.FC = () => {
  const navigate = useNavigate()
  const { content, loading, error } = useContent()

  const handleGetStarted = () => {
    navigate('/upload-and-settings')
  }

  console.log('DebugWelcomePage rendering:', { content, loading, error })

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f172a', 
        color: 'white', 
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1>Loading RL Trading System...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f172a', 
        color: 'white', 
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1>Error: {error}</h1>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        {content?.title || 'Welcome to RL Futures Trading System'}
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        {content?.subtitle || 'Advanced reinforcement learning for futures trading'}
      </p>
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleGetStarted}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontSize: '1.125rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default DebugWelcomePage
