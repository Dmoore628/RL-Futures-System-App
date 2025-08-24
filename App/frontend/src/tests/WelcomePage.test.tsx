import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import WelcomePage from '../pages/WelcomePage'
import '@testing-library/jest-dom'

describe('WelcomePage', () => {
  it('renders welcome page with title', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Welcome to the Reinforcement Learning System for Futures Trading/i)).toBeInTheDocument()
  })

  it('renders the brand name in header', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    )
    
    const header = screen.getByRole('banner')
    expect(within(header).getByText('RL Futures Trading System')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Advanced AI-powered trading system that trains PPO models for profitable futures trading strategies/i)).toBeInTheDocument()
  })

  it('renders the app description section', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('What This Application Does')).toBeInTheDocument()
    expect(screen.getByText(/This application houses and orchestrates a reinforcement learning environment/)).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('How It Works')).toBeInTheDocument()
    expect(screen.getByText(/Configure Settings/)).toBeInTheDocument()
  })

  it('renders the key features section', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Key Features')).toBeInTheDocument()
    expect(screen.getByText(/PPO Algorithm/)).toBeInTheDocument()
  })

  it('renders the getting started section', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
    expect(screen.getByText(/Review the system requirements/)).toBeInTheDocument()
  })
})
