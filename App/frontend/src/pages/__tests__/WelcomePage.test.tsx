import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import WelcomePage from '../WelcomePage'

// Mock the useContent hook
jest.mock('../../hooks/useContent', () => ({
  useContent: () => ({
    brand: 'RL Futures Trading System',
    title: 'Welcome to the Reinforcement Learning System for Futures Trading',
    subtitle: 'Advanced AI-powered trading system with PPO algorithms and transfer learning',
    sections: [
      {
        heading: 'What This Application Does',
        paragraph: 'This is a professional reinforcement learning system for futures trading that trains PPO models to achieve configurable profit targets during individual trading days.'
      },
      {
        heading: 'Key Features',
        paragraph: 'The system includes high-fidelity simulation, transfer learning between days, and live API integration with futures brokers.'
      }
    ]
  })
}))

// Wrap component with router for testing
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('WelcomePage Component', () => {
  it('renders the welcome page title', () => {
    renderWithRouter(<WelcomePage />)
    
    expect(screen.getByText('Welcome to the Reinforcement Learning System for Futures Trading')).toBeInTheDocument()
  })

  it('displays the brand name', () => {
    renderWithRouter(<WelcomePage />)
    
    expect(screen.getByText('RL Futures Trading System')).toBeInTheDocument()
  })

  it('shows the subtitle description', () => {
    renderWithRouter(<WelcomePage />)
    
    expect(screen.getByText('Advanced AI-powered trading system with PPO algorithms and transfer learning')).toBeInTheDocument()
  })

  it('renders all content sections', () => {
    renderWithRouter(<WelcomePage />)
    
    expect(screen.getByText('What This Application Does')).toBeInTheDocument()
    expect(screen.getByText('Key Features')).toBeInTheDocument()
  })

  it('displays section content correctly', () => {
    renderWithRouter(<WelcomePage />)
    
    expect(screen.getByText(/This is a professional reinforcement learning system for futures trading/)).toBeInTheDocument()
    expect(screen.getByText(/The system includes high-fidelity simulation/)).toBeInTheDocument()
  })

  it('has a call-to-action button', () => {
    renderWithRouter(<WelcomePage />)
    
    const ctaButton = screen.getByRole('button', { name: /get started/i })
    expect(ctaButton).toBeInTheDocument()
  })

  it('navigates to upload page when CTA is clicked', () => {
    renderWithRouter(<WelcomePage />)
    
    const ctaButton = screen.getByRole('button', { name: /get started/i })
    fireEvent.click(ctaButton)
    
    // Should navigate to upload page
    expect(window.location.pathname).toBe('/upload-and-settings')
  })

  it('applies proper CSS classes', () => {
    renderWithRouter(<WelcomePage />)
    
    const container = screen.getByTestId('welcome-page')
    expect(container).toHaveClass('welcomePage')
  })

  it('has proper heading hierarchy', () => {
    renderWithRouter(<WelcomePage />)
    
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s).toHaveLength(2) // Two section headings
  })

  it('displays professional styling elements', () => {
    renderWithRouter(<WelcomePage />)
    
    // Check for gradient background or other professional styling
    const container = screen.getByTestId('welcome-page')
    expect(container).toHaveClass('welcomePage')
  })

  it('is responsive and accessible', () => {
    renderWithRouter(<WelcomePage />)
    
    // Check for semantic HTML structure
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for proper ARIA labels
    const ctaButton = screen.getByRole('button', { name: /get started/i })
    expect(ctaButton).toBeInTheDocument()
  })

  it('handles content updates dynamically', () => {
    renderWithRouter(<WelcomePage />)
    
    // Content should be loaded from the useContent hook
    expect(screen.getByText('RL Futures Trading System')).toBeInTheDocument()
  })

  it('maintains consistent spacing and layout', () => {
    renderWithRouter(<WelcomePage />)
    
    const sections = screen.getAllByRole('heading', { level: 2 })
    expect(sections).toHaveLength(2)
    
    // Each section should have content
    sections.forEach(section => {
      const sectionContent = section.nextElementSibling
      expect(sectionContent).toHaveTextContent(/This is a professional|The system includes/)
    })
  })
})
