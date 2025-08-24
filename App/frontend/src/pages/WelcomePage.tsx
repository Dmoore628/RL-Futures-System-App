import React from 'react'
import styles from './WelcomePage.module.css'
import welcomeContent from '../../content/welcomeContent.json'

interface Section {
  heading: string
  paragraph?: string
  paragraphs?: string[]
}

const WelcomePage: React.FC = () => {
  const sections = (welcomeContent?.sections ?? []) as Section[]
  
  const renderContent = (content: string) => {
    // Handle markdown-like formatting for bold text
    return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  const renderParagraphs = (paragraphs: string[]) => {
    return (
      <div className={styles.paragraphs}>
        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            dangerouslySetInnerHTML={{ __html: renderContent(paragraph) }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          {welcomeContent?.brand ?? 'RL Futures Trading System'}
        </div>
      </header>
      
      <main className={styles.main}>
        <h1 className={styles.title}>
          {welcomeContent?.title ?? 'Welcome to RL Futures Trading System'}
        </h1>
        
        <p className={styles.subtitle}>
          {welcomeContent?.subtitle ?? 'Advanced AI-powered trading system that trains PPO models for profitable futures trading strategies'}
        </p>
        
        {sections.map((section, idx) => (
          <section className={styles.card} key={idx}>
            <h2>{section.heading}</h2>
            
            {section.paragraph && (
              <p dangerouslySetInnerHTML={{ __html: renderContent(section.paragraph) }} />
            )}
            
            {section.paragraphs && renderParagraphs(section.paragraphs)}
          </section>
        ))}
      </main>
      
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} RL Futures Trading System</span>
      </footer>
    </div>
  )
}

export default WelcomePage


