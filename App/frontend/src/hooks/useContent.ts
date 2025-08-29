import { useState, useEffect } from 'react'

interface Section {
  heading: string
  paragraph?: string
  paragraphs?: string[]
}

interface WelcomeContent {
  brand: string
  title: string
  subtitle: string
  sections: Section[]
}

export const useContent = () => {
  const [content, setContent] = useState<WelcomeContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Use fetch from the content directory (not public)
        const response = await fetch('/content/welcomeContent.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setContent(data)
      } catch (error) {
        console.error('Failed to load content:', error)
        // Fallback to default content
        setContent({
          brand: 'Moore Tech',
          title: 'Welcome to the Reinforcement Learning System for Futures Trading',
          subtitle: 'Advanced AI-powered trading system that trains PPO models for profitable futures trading strategies',
          sections: [
            {
              heading: 'System Loading...',
              paragraph: 'Please wait while the system initializes.'
            }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  return { content, loading }
}
