import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import styles from './ModernWelcomePage.module.css'

const MinimalWelcomePage: React.FC = () => {
  const navigate = useNavigate()
  const { content, loading, error } = useContent()

  const handleGetStarted = () => {
    navigate('/upload-and-settings')
  }

  if (loading) {
    return (
      <div className={styles.modernWelcomePage}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          Loading RL Trading System...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.modernWelcomePage}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.modernWelcomePage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {content?.title || 'Welcome to RL Futures Trading System'}
          </h1>
          <p className={styles.heroSubtitle}>
            {content?.subtitle || 'Advanced reinforcement learning for futures trading'}
          </p>
          <button 
            className={styles.ctaButton}
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default MinimalWelcomePage
