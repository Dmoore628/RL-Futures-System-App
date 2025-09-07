import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Section, Container, Grid, Flex } from '../components/Layout/ModernLayout'
import HeroSection from '../components/Hero/HeroSection'
import styles from './ModernWelcomePage.module.css'

const TestModernWelcomePage: React.FC = () => {
  const navigate = useNavigate()
  const { content: welcomeContent, loading: contentLoading, error: contentError } = useContent()

  const handleGetStarted = () => {
    navigate('/upload-and-settings')
  }

  if (contentLoading) {
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

  if (contentError) {
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
          Error: {contentError}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.modernWelcomePage}>
      {/* Hero Section */}
      <Section
        height="screen"
        background="dark"
        className={styles.heroSection}
      >
        <HeroSection
          title={welcomeContent?.title || 'Welcome to RL Futures Trading System'}
          subtitle={welcomeContent?.subtitle || 'Advanced reinforcement learning for futures trading'}
          ctaText="Get Started"
          onCtaClick={handleGetStarted}
          backgroundAnimation={true}
          particleEffects={true}
        />
      </Section>
    </div>
  )
}

export default TestModernWelcomePage
