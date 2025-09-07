/**
 * ModernWelcomePage Component
 * 
 * Complete modern welcome page with scroll-driven animations, interactive elements,
 * and sophisticated visual effects. Features hero section, system diagram, timeline,
 * and enhanced broker carousel.
 * 
 * @component
 * @returns {JSX.Element} The ModernWelcomePage component
 */

import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// Layout components
import { Section, Container, Grid, Flex } from '../components/Layout/ModernLayout'

// Animation components
import ScrollTriggeredAnimation, { AnimationGroup, ParallaxElement } from '../components/Animations/ScrollTriggeredAnimation'

// Feature components
import HeroSection from '../components/Hero/HeroSection'
import SystemDiagram3D from '../components/Visualizations/SystemDiagram3D'
import InteractiveTimeline from '../components/Timeline/InteractiveTimeline'
import EnhancedBrokerCarousel from '../components/Carousel/EnhancedBrokerCarousel'

// Styles
import styles from './ModernWelcomePage.module.css'

interface ModernWelcomePageProps {
  className?: string
}

const ModernWelcomePage: React.FC<ModernWelcomePageProps> = ({
  className = ''
}) => {
  // State management
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)

  // Hooks
  const { content, loading } = useContent()
  const { scrollPosition } = useScrollAnimation()
  const navigate = useNavigate()

  // Refs
  const pageRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement[]>([])

  // Handle content loading
  useEffect(() => {
    if (!loading && content) {
      setIsLoaded(true)
    }
  }, [loading, content])

  // Handle scroll-based section tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionsRef.current.length) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight

      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect()
          const sectionTop = rect.top + scrollTop
          const sectionHeight = rect.height

          if (scrollTop >= sectionTop - windowHeight / 2 && 
              scrollTop < sectionTop + sectionHeight - windowHeight / 2) {
            setCurrentSection(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation handlers
  const handleGetStarted = () => {
    navigate('/upload-and-settings')
  }


  // Timeline steps configuration
  const timelineSteps = [
    {
      id: 'configure-settings',
      title: 'Configure Settings',
      description: 'Set your trading parameters, profit targets, and risk management rules',
      details: [
        'Set initial balance and daily profit targets',
        'Configure risk management parameters',
        'Select trading speed and rendering mode',
        'Set up data indicators and EMA periods'
      ],
      status: 'completed' as const,
      duration: '2-3 minutes',
      icon: '⚙️'
    },
    {
      id: 'upload-data',
      title: 'Upload Data',
      description: 'Import CSV or Excel files with historical price data for NQ E-mini Futures',
      details: [
        'Upload historical futures data',
        'Validate data format and quality',
        'Preview data before processing',
        'Configure data preprocessing settings'
      ],
      status: 'completed' as const,
      duration: '1-2 minutes',
      icon: '📊'
    },
    {
      id: 'start-training',
      title: 'Start Training',
      description: 'Begin training in human or fast rendering mode with real-time monitoring',
      details: [
        'Initialize PPO model training',
        'Monitor training progress in real-time',
        'Adjust parameters as needed',
        'Track performance metrics'
      ],
      status: 'current' as const,
      duration: '30-60 minutes',
      icon: '🚀'
    },
    {
      id: 'monitor-progress',
      title: 'Monitor Progress',
      description: 'Watch the model train completely in the high-fidelity simulator',
      details: [
        'Real-time performance visualization',
        'Success rate tracking',
        'Profit/loss monitoring',
        'Model accuracy metrics'
      ],
      status: 'upcoming' as const,
      duration: 'Ongoing',
      icon: '📈'
    },
    {
      id: 'live-trading',
      title: 'Live Trading',
      description: 'Navigate to the live trading connector to deploy your trained model',
      details: [
        'Connect to broker API',
        'Deploy trained model',
        'Monitor live trading performance',
        'Adjust strategies in real-time'
      ],
      status: 'upcoming' as const,
      duration: '24/7',
      icon: '💹'
    }
  ]

  // Broker logos configuration
  const brokerLogos = [
    {
      id: 'ninjatrader',
      src: '/ninjatraderlogo.png',
      alt: 'NINJATRADER',
      name: 'NinjaTrader',
      status: 'connected' as const,
      description: 'Professional trading platform with advanced charting and analysis tools',
      features: ['Advanced charting', 'Market replay', 'Strategy development', 'Real-time data']
    },
    {
      id: 'interactive-brokers',
      src: '/interactivebrokers-logo-stacked.png',
      alt: 'Interactive Brokers',
      name: 'Interactive Brokers',
      status: 'connected' as const,
      description: 'Global electronic trading platform with access to worldwide markets',
      features: ['Global markets', 'Low commissions', 'Advanced tools', 'Professional support']
    },
    {
      id: 'topstep',
      src: '/topsteplogo.jpg',
      alt: 'TOPSTEPX',
      name: 'TopStep',
      status: 'connected' as const,
      description: 'Futures trading evaluation and funding program',
      features: ['Evaluation program', 'Funding opportunities', 'Risk management', 'Trading education']
    },
    {
      id: 'tradovate',
      src: '/Tradovatelogo.png',
      alt: 'Tradovate',
      name: 'Tradovate',
      status: 'pending' as const,
      description: 'Modern futures trading platform with intuitive interface',
      features: ['Modern interface', 'Mobile trading', 'Advanced analytics', 'Social trading']
    },
    {
      id: 'thinkorswim',
      src: '/TOS_Overview_thinkorswim_TALL.avif',
      alt: 'ThinkOrSwim',
      name: 'ThinkOrSwim',
      status: 'connected' as const,
      description: 'TD Ameritrade\'s advanced trading platform',
      features: ['Advanced charting', 'Paper trading', 'Strategy backtesting', 'Market analysis']
    },
    {
      id: 'tradestation',
      src: '/TradeStation_Logo.png',
      alt: 'TradeStation',
      name: 'TradeStation',
      status: 'disconnected' as const,
      description: 'Professional trading platform for active traders',
      features: ['Professional tools', 'Strategy development', 'Backtesting', 'Real-time data']
    },
    {
      id: 'optimus-futures',
      src: '/optimusfutureslogo.png',
      alt: 'Optimus Futures',
      name: 'Optimus Futures',
      status: 'connected' as const,
      description: 'Futures brokerage with competitive rates and excellent service',
      features: ['Competitive rates', 'Excellent service', 'Futures focus', 'Professional support']
    }
  ]

  if (loading || !isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading RL Trading System...</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className={styles.errorContainer}>
        <h2>Failed to load content</h2>
        <p>Please refresh the page to try again.</p>
      </div>
    )
  }

  return (
    <div
      ref={pageRef}
      className={`
        ${styles.modernWelcomePage}
        ${className}
      `.trim()}
      data-current-section={currentSection}
    >

      {/* Hero Section */}
      <Section
        ref={el => sectionsRef.current[0] = el!}
        height="screen"
        background="dark"
        className={styles.heroSection}
      >
        <HeroSection
          title={content.title}
          subtitle={content.subtitle}
          ctaText="Get Started"
          onCtaClick={handleGetStarted}
          backgroundAnimation={true}
          particleEffects={true}
        />
      </Section>

      {/* System Architecture Section */}
      <Section
        ref={el => sectionsRef.current[1] = el!}
        height="screen"
        background="primary"
        className={styles.systemSection}
      >
        <Container size="2xl">
          <ScrollTriggeredAnimation
            animation="fade"
            delay={200}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>System Architecture</h2>
            <p className={styles.sectionSubtitle}>
              Advanced reinforcement learning system with sophisticated data processing
            </p>
          </ScrollTriggeredAnimation>

          <ScrollTriggeredAnimation
            animation="scale"
            delay={400}
            className={styles.diagramContainer}
          >
            <SystemDiagram3D
              autoRotate={true}
              rotationSpeed={0.3}
              interactive={true}
              showConnections={true}
              animationDelay={600}
            />
          </ScrollTriggeredAnimation>
        </Container>
      </Section>

      {/* Process Timeline Section */}
      <Section
        ref={el => sectionsRef.current[2] = el!}
        height="auto"
        background="secondary"
        className={styles.timelineSection}
      >
        <InteractiveTimeline
          steps={timelineSteps}
          orientation="horizontal"
          showProgress={true}
          interactive={true}
          animationDelay={200}
        />
      </Section>

      {/* Features Grid Section */}
      <Section
        ref={el => sectionsRef.current[3] = el!}
        height="auto"
        background="tertiary"
        className={styles.featuresSection}
      >
        <Container size="2xl">
          <ScrollTriggeredAnimation
            animation="fade"
            delay={200}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <p className={styles.sectionSubtitle}>
              Powerful capabilities that make trading profitable and efficient
            </p>
          </ScrollTriggeredAnimation>

          <AnimationGroup
            staggerDelay={150}
            direction="horizontal"
            className={styles.featuresGrid}
          >
            {content.sections.map((section: any, index: number) => (
              <ScrollTriggeredAnimation
                key={index}
                animation="slide-up"
                delay={index * 200}
                className={styles.featureCard}
              >
                <div className={styles.cardIcon}>
                  <span className={styles.iconText}>
                    {index === 0 ? '🎯' : index === 1 ? '⚙️' : index === 2 ? '🚀' : '📈'}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{section.heading}</h3>
                <div className={styles.cardContent}>
                  {section.paragraph && (
                    <p className={styles.cardText}>{section.paragraph}</p>
                  )}
                  {section.paragraphs && (
                    <ul className={styles.cardList}>
                      {section.paragraphs.map((paragraph: string, pIndex: number) => (
                        <li key={pIndex} className={styles.cardListItem}>
                          {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollTriggeredAnimation>
            ))}
          </AnimationGroup>
        </Container>
      </Section>

      {/* Broker Carousel Section */}
      <Section
        ref={el => sectionsRef.current[4] = el!}
        height="auto"
        background="primary"
        className={styles.brokerSection}
      >
        <EnhancedBrokerCarousel
          logos={brokerLogos}
          autoScroll={true}
          scrollSpeed={0.5}
          interactive={true}
          showStatus={true}
          animationDelay={200}
        />
      </Section>

      {/* CTA Section */}
      <Section
        ref={el => sectionsRef.current[5] = el!}
        height="half"
        background="dark"
        className={styles.ctaSection}
      >
        <Container size="xl">
          <ScrollTriggeredAnimation
            animation="scale"
            delay={200}
            className={styles.ctaContent}
          >
            <h2 className={styles.ctaTitle}>Ready to Start Trading?</h2>
            <p className={styles.ctaSubtitle}>
              Join the future of algorithmic trading with our advanced RL system
            </p>
            <div className={styles.ctaButtons}>
              <button
                className={styles.primaryCtaButton}
                onClick={handleGetStarted}
              >
                Get Started Now
              </button>
              <button
                className={styles.secondaryCtaButton}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Learn More
              </button>
            </div>
          </ScrollTriggeredAnimation>
        </Container>
      </Section>

      {/* Footer */}
      <footer className={styles.pageFooter}>
        <Container size="xl">
          <Flex justify="between" align="center">
            <div className={styles.footerBrand}>
              <span>© {new Date().getFullYear()} RL Futures Trading System</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Support</a>
            </div>
          </Flex>
        </Container>
      </footer>
    </div>
  )
}

export default ModernWelcomePage
