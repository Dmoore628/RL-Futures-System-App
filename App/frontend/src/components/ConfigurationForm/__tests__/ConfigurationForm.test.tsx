import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfigurationForm from '../ConfigurationForm'
import { ConfigurationForm as ConfigurationFormType } from '../../../types'

const mockOnSubmit = jest.fn()
const mockOnBack = jest.fn()

const defaultProps = {
  onSubmit: mockOnSubmit,
  onBack: mockOnBack
}

describe('ConfigurationForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all configuration sections', () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    expect(screen.getByText('Trading & Market Mechanics')).toBeInTheDocument()
    expect(screen.getByText('Reward Function Settings')).toBeInTheDocument()
    expect(screen.getByText('PPO Hyper Parameters')).toBeInTheDocument()
    expect(screen.getByText('Logging & Checkpointing')).toBeInTheDocument()
    expect(screen.getByText('Day Mastery Mechanism')).toBeInTheDocument()
    expect(screen.getByText('Data & Indicator Calculation')).toBeInTheDocument()
    expect(screen.getByText('Visualization')).toBeInTheDocument()
  })

  it('starts with Trading & Market Mechanics section active', () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    expect(screen.getByText('Initial Balance')).toBeInTheDocument()
    expect(screen.getByText('Daily Profit Target')).toBeInTheDocument()
    expect(screen.getByText('Daily Max Loss Limit')).toBeInTheDocument()
  })

  it('navigates between sections correctly', async () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    // Click on Reward Function Settings
    fireEvent.click(screen.getByText('Reward Function Settings'))
    
    await waitFor(() => {
      expect(screen.getByText('Profit Target Bonus')).toBeInTheDocument()
      expect(screen.getByText('Bankruptcy Penalty')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    // Clear required fields
    const initialBalanceInput = screen.getByLabelText(/initial balance/i)
    fireEvent.change(initialBalanceInput, { target: { value: '' } })
    
    // Try to submit
    fireEvent.click(screen.getByText('Submit Configuration'))
    
    await waitFor(() => {
      expect(screen.getByText(/initial balance is required/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    // Fill in some values
    const initialBalanceInput = screen.getByLabelText(/initial balance/i)
    fireEvent.change(initialBalanceInput, { target: { value: '200000' } })
    
    const dailyProfitTargetInput = screen.getByLabelText(/daily profit target/i)
    fireEvent.change(dailyProfitTargetInput, { target: { value: '10000' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Submit Configuration'))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tradingMechanics: expect.objectContaining({
            initialBalance: 200000,
            dailyProfitTarget: 10000
          })
        })
      )
    })
  })

  it('handles back navigation', () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Back'))
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('shows section navigation with icons', () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    expect(screen.getByText('💰')).toBeInTheDocument() // Trading & Market Mechanics
    expect(screen.getByText('🎯')).toBeInTheDocument() // Reward Function Settings
    expect(screen.getByText('🧠')).toBeInTheDocument() // PPO Hyper Parameters
  })

  it('validates numeric input ranges', async () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    // Try negative values
    const initialBalanceInput = screen.getByLabelText(/initial balance/i)
    fireEvent.change(initialBalanceInput, { target: { value: '-1000' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Submit Configuration'))
    
    await waitFor(() => {
      expect(screen.getByText(/initial balance must be positive/i)).toBeInTheDocument()
    })
  })

  it('shows progress indicator', () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    expect(screen.getByText('1 of 7')).toBeInTheDocument()
  })

  it('handles form state persistence', async () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    // Fill in values
    const initialBalanceInput = screen.getByLabelText(/initial balance/i)
    fireEvent.change(initialBalanceInput, { target: { value: '150000' } })
    
    // Navigate to another section and back
    fireEvent.click(screen.getByText('Reward Function Settings'))
    fireEvent.click(screen.getByText('Trading & Market Mechanics'))
    
    // Value should persist
    expect(initialBalanceInput).toHaveValue(150000)
  })

  it('validates time format in Day Mastery section', async () => {
    render(<ConfigurationForm {...defaultProps} />)
    
    // Navigate to Day Mastery section
    fireEvent.click(screen.getByText('Day Mastery Mechanism'))
    
    // Try invalid time format
    const startTimeInput = screen.getByLabelText(/start time/i)
    fireEvent.change(startTimeInput, { target: { value: '25:00' } })
    
    // Submit form
    fireEvent.click(screen.getByText('Submit Configuration'))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid time format/i)).toBeInTheDocument()
    })
  })
})
