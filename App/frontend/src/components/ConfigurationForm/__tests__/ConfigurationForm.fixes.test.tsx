import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ConfigurationForm from '../ConfigurationForm'

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

const mockOnSubmit = jest.fn()
const mockOnBack = jest.fn()

const defaultProps = {
  onSubmit: mockOnSubmit,
  onBack: mockOnBack
}

describe('ConfigurationForm Fixes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Required Success Rate Fix', () => {
    it('should display correct default value (95%)', () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Day Mastery section
      fireEvent.click(screen.getByText('Day Mastery Mechanism'))
      
      // Check that the success rate shows 95 (not 1000000)
      const successRateInput = screen.getByDisplayValue('95')
      expect(successRateInput).toBeInTheDocument()
    })

    it('should convert user input correctly', async () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Day Mastery section
      fireEvent.click(screen.getByText('Day Mastery Mechanism'))
      
      const successRateInput = screen.getByDisplayValue('95')
      
      // Change to 80%
      await userEvent.clear(successRateInput)
      await userEvent.type(successRateInput, '80')
      
      // Should still show 80 in the input
      expect(successRateInput).toHaveValue(80)
    })

    it('should validate success rate range', async () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Day Mastery section
      fireEvent.click(screen.getByText('Day Mastery Mechanism'))
      
      const successRateInput = screen.getByDisplayValue('95')
      
      // Try to enter invalid value (150%)
      await userEvent.clear(successRateInput)
      await userEvent.type(successRateInput, '150')
      
      // Should not accept values over 100
      expect(successRateInput).toHaveValue(95) // Should revert to default
    })
  })

  describe('Form Field Values Fix', () => {
    it('should display correct EMA period values', () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Data & Indicator Calculation section
      fireEvent.click(screen.getByText('Data & Indicator Calculation'))
      
      // Check EMA periods show correct values
      expect(screen.getByDisplayValue('13')).toBeInTheDocument() // EMA 1 Period
      expect(screen.getByDisplayValue('55')).toBeInTheDocument() // EMA 2 Period
      expect(screen.getByDisplayValue('20')).toBeInTheDocument() // Bollinger Bands Period
      expect(screen.getByDisplayValue('14')).toBeInTheDocument() // ATR Period
      expect(screen.getByDisplayValue('26')).toBeInTheDocument() // MACD Period
    })

    it('should display correct visualization values', () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Visualization section
      fireEvent.click(screen.getByText('Visualization'))
      
      // Check visualization values show correct defaults
      expect(screen.getByDisplayValue('100')).toBeInTheDocument() // Fixed Window
      expect(screen.getByDisplayValue('1')).toBeInTheDocument() // Candle Width Factor
    })

    it('should handle numeric input changes correctly', async () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Data & Indicator Calculation section
      fireEvent.click(screen.getByText('Data & Indicator Calculation'))
      
      const ema1Input = screen.getByDisplayValue('13')
      
      // Change EMA 1 Period
      await userEvent.clear(ema1Input)
      await userEvent.type(ema1Input, '21')
      
      // Should accept the new value
      expect(ema1Input).toHaveValue(21)
    })
  })

  describe('Trading Hours Fix', () => {
    it('should display correct trading hours format', () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Day Mastery section
      fireEvent.click(screen.getByText('Day Mastery Mechanism'))
      
      // Check trading hours show correct format
      expect(screen.getByDisplayValue('17:00')).toBeInTheDocument() // Start Time
      expect(screen.getByDisplayValue('16:00')).toBeInTheDocument() // End Time
    })

    it('should handle trading hours input without errors', async () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Day Mastery section
      fireEvent.click(screen.getByText('Day Mastery Mechanism'))
      
      const startTimeInput = screen.getByDisplayValue('17:00')
      const endTimeInput = screen.getByDisplayValue('16:00')
      
      // Change times
      await userEvent.clear(startTimeInput)
      await userEvent.type(startTimeInput, '18:00')
      
      await userEvent.clear(endTimeInput)
      await userEvent.type(endTimeInput, '17:00')
      
      // Should not throw errors
      expect(startTimeInput).toHaveValue('18:00')
      expect(endTimeInput).toHaveValue('17:00')
    })
  })

  describe('Form Navigation Fix', () => {
    it('should navigate through all sections without errors', async () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate through all sections
      const sections = [
        'Reward Function Settings',
        'PPO Hyper Parameters',
        'Logging & Checkpointing',
        'Day Mastery Mechanism',
        'Data & Indicator Calculation',
        'Visualization'
      ]
      
      for (const section of sections) {
        fireEvent.click(screen.getByText(section))
        await waitFor(() => {
          expect(screen.getByText(section)).toBeInTheDocument()
        })
      }
      
      // Should reach the summary without errors
      fireEvent.click(screen.getByText('Configuration Summary'))
      await waitFor(() => {
        expect(screen.getByText('Configuration Summary')).toBeInTheDocument()
      })
    })

    it('should handle form submission without errors', async () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to last section to access submit button
      fireEvent.click(screen.getByText('Reward Function Settings'))
      fireEvent.click(screen.getByText('PPO Hyper Parameters'))
      fireEvent.click(screen.getByText('Logging & Checkpointing'))
      fireEvent.click(screen.getByText('Day Mastery Mechanism'))
      fireEvent.click(screen.getByText('Data & Indicator Calculation'))
      fireEvent.click(screen.getByText('Visualization'))
      
      // Fill in required experiment name
      const experimentNameInput = screen.getByPlaceholderText('Enter experiment name')
      await userEvent.type(experimentNameInput, 'test-experiment')
      
      // Click Configuration Summary
      fireEvent.click(screen.getByText('Configuration Summary'))
      
      // Should show summary without errors
      await waitFor(() => {
        expect(screen.getByText('Configuration Summary')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid input gracefully', async () => {
      render(
        <TestWrapper>
          <ConfigurationForm {...defaultProps} />
        </TestWrapper>
      )
      
      // Navigate to Trading & Market Mechanics section
      const initialBalanceInput = screen.getByDisplayValue('1000')
      
      // Try to enter invalid value
      await userEvent.clear(initialBalanceInput)
      await userEvent.type(initialBalanceInput, 'abc')
      
      // Should handle gracefully (either prevent or show validation)
      expect(initialBalanceInput).toHaveValue(1000) // Should revert to default
    })
  })
})
