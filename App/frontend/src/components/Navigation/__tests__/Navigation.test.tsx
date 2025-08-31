import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from '../Navigation'

// Wrap component with router for testing
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Navigation Component', () => {
  it('renders navigation with Moore Tech branding', () => {
    renderWithRouter(<Navigation />)
    
    expect(screen.getByText('🚀 Moore Tech')).toBeInTheDocument()
    expect(screen.getByText('RL Futures Trading System')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderWithRouter(<Navigation />)
    
    expect(screen.getByText('Welcome')).toBeInTheDocument()
    expect(screen.getByText('Upload & Settings')).toBeInTheDocument()
  })

  it('navigates to welcome page when clicked', () => {
    renderWithRouter(<Navigation />)
    
    const welcomeLink = screen.getByText('Welcome')
    fireEvent.click(welcomeLink)
    
    // Should navigate to welcome page
    expect(window.location.pathname).toBe('/')
  })

  it('navigates to upload and settings page when clicked', () => {
    renderWithRouter(<Navigation />)
    
    const uploadLink = screen.getByText('Upload & Settings')
    fireEvent.click(uploadLink)
    
    // Should navigate to upload page
    expect(window.location.pathname).toBe('/upload-and-settings')
  })

  it('applies active state to current route', () => {
    // Set current location to upload page
    window.history.pushState({}, '', '/upload-and-settings')
    
    renderWithRouter(<Navigation />)
    
    const uploadLink = screen.getByText('Upload & Settings')
    expect(uploadLink.closest('a')).toHaveClass('active')
  })

  it('has proper accessibility attributes', () => {
    renderWithRouter(<Navigation />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('maintains responsive design classes', () => {
    renderWithRouter(<Navigation />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('navigation')
  })
})
