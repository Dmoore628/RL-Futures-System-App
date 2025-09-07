import React from 'react'
import { useContent } from '../hooks/useContent'

const ContentTestPage: React.FC = () => {
  const { content, loading, error } = useContent()

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
        <h1>Loading content...</h1>
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
      background: '#0f172a', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Content Test Page</h1>
      <p>Content loaded: {content ? 'Yes' : 'No'}</p>
      {content && (
        <div>
          <h2>Title: {content.title}</h2>
          <p>Subtitle: {content.subtitle}</p>
          <p>Sections: {content.sections.length}</p>
        </div>
      )}
    </div>
  )
}

export default ContentTestPage
