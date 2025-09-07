import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { BrokerWheel3D } from '../components/BrokerWheel'
import styles from './CompleteModernWelcomePage.module.css'

const CompleteModernWelcomePage: React.FC = () => {
  const navigate = useNavigate()
  const { content, loading, error } = useContent()
  const { scrollPosition, isScrolling } = useScrollAnimation()
  const pageRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)

  // Navigation handlers
  const handleGetStarted = () => {
    navigate('/upload-and-settings')
  }

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (pageRef.current) {
        const sections = pageRef.current.querySelectorAll('[data-section]')
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        
        sections.forEach((section, index) => {
          const element = section as HTMLElement
          const rect = element.getBoundingClientRect()
          
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setCurrentSection(index)
          }
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return (
      <div className={styles.modernWelcomePage}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Loading RL Trading System...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.modernWelcomePage}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorText}>Error: {error}</h2>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={pageRef}
      className={styles.modernWelcomePage}
      data-current-section={currentSection}
    >
      {/* Hero Section */}
      <section 
        className={styles.heroSection}
        data-section="hero"
      >
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <div className={styles.heroParticles}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              {content?.title || 'Welcome to RL Futures Trading System'}
            </h1>
            <p className={styles.heroSubtitle}>
              {content?.subtitle || 'Advanced reinforcement learning for futures trading'}
            </p>
            <div className={styles.heroButtons}>
              <button 
                className={styles.primaryCtaButton}
                onClick={handleGetStarted}
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section 
        className={styles.problemSection}
        data-section="problem"
      >
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>The Challenge</h2>
          <p className={styles.sectionDescription}>
            Traditional trading strategies often fail to adapt to market volatility and changing conditions. 
            Manual analysis is time-consuming and prone to human error, while static algorithms can't learn 
            from new market patterns.
          </p>
          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>📊</div>
              <h3>Market Volatility</h3>
              <p>Rapid price changes make traditional strategies ineffective</p>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>⏰</div>
              <h3>Time Constraints</h3>
              <p>Manual analysis can't keep up with real-time market data</p>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>🤖</div>
              <h3>Static Algorithms</h3>
              <p>Fixed rules can't adapt to new market patterns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section 
        className={styles.solutionSection}
        data-section="solution"
      >
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Our Solution</h2>
          <p className={styles.sectionDescription}>
            Our reinforcement learning system continuously learns and adapts to market conditions, 
            using advanced PPO algorithms to optimize trading strategies in real-time.
          </p>
          <div className={styles.solutionFeatures}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧠</div>
              <h3>AI-Powered Learning</h3>
              <p>Advanced PPO algorithms that learn from market data</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Real-Time Adaptation</h3>
              <p>Strategies that adapt to changing market conditions</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Profit Optimization</h3>
              <p>Continuous optimization for maximum returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        className={styles.processSection}
        data-section="process"
      >
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.processTimeline}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Configure Settings</h3>
                <p>Set your trading parameters, profit targets, and risk management rules</p>
              </div>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Upload Data</h3>
                <p>Import CSV or Excel files with historical price data for NQ E-mini Futures</p>
              </div>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Start Training</h3>
                <p>Begin training in human or fast rendering mode</p>
              </div>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Monitor Progress</h3>
                <p>Watch the model train completely in the high-fidelity simulator</p>
              </div>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepContent}>
                <h3>Live Trading</h3>
                <p>Navigate to the live trading connector to deploy your trained model</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Broker Wheel Section */}
      <section 
        className={styles.brokerSection}
        data-section="brokers"
      >
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Supported Brokers</h2>
          <p className={styles.sectionDescription}>
            Seamlessly integrate with leading futures brokers for live trading
          </p>
          <BrokerWheel3D />
        </div>
      </section>

      {/* Features Section */}
      <section 
        className={styles.featuresSection}
        data-section="features"
      >
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Key Features</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Precision Trading</h3>
              <p>Advanced algorithms for precise entry and exit points</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3>Risk Management</h3>
              <p>Built-in risk controls and position sizing</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Real-Time Analytics</h3>
              <p>Live performance monitoring and analysis</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🔄</div>
              <h3>Continuous Learning</h3>
              <p>Models that improve with every trade</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className={styles.ctaSection}
        data-section="cta"
      >
        <div className={styles.sectionContainer}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Trading?</h2>
          <p className={styles.ctaDescription}>
            Join the future of algorithmic trading with our advanced reinforcement learning system
          </p>
          <div className={styles.ctaButtons}>
            <button 
              className={styles.primaryCtaButton}
              onClick={handleGetStarted}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.pageFooter}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <span>© {new Date().getFullYear()} Moore Tech</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CompleteModernWelcomePage
