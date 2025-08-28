import React from 'react'
import styles from './WelcomePage.module.css'
import { useContent } from '../hooks/useContent'

interface Section {
  heading: string
  paragraph?: string
  paragraphs?: string[]
}

const WelcomePage: React.FC = () => {
  const { content, loading } = useContent()
  
  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  if (!content) {
    return <div className={styles.container}>Failed to load content</div>
  }

  const sections = content.sections as Section[]
  
  const renderContent = (content: string) => {
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
          {content.brand}
        </div>
      </header>
      
      <main className={styles.main}>
        <h1 className={styles.title}>
          {content.title}
        </h1>
        
        <p className={styles.subtitle}>
          {content.subtitle}
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


