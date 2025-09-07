import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

describe('DEBUG: EMA Values Investigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('DEBUG: Inspect actual DOM values for EMA fields', () => {
    render(
      <TestWrapper>
        <ConfigurationForm {...defaultProps} />
      </TestWrapper>
    )
    
    // Navigate to Data & Indicator Calculation section
    fireEvent.click(screen.getByText('Data & Indicator Calculation'))
    
    // Get all input fields in the data indicators section
    const allInputs = screen.getAllByRole('spinbutton')
    console.log('=== ALL SPINBUTTON INPUTS ===')
    allInputs.forEach((input, index) => {
      console.log(`Input ${index}:`, {
        name: input.getAttribute('name'),
        value: input.getAttribute('value'),
        ariaLabel: input.getAttribute('aria-label'),
        placeholder: input.getAttribute('placeholder'),
        element: input
      })
    })
    
    // Specifically look for EMA fields
    const ema1Field = screen.getByLabelText('EMA 1 Period')
    const ema2Field = screen.getByLabelText('EMA 2 Period')
    
    console.log('=== EMA FIELDS SPECIFIC ===')
    console.log('EMA 1 Field:', {
      name: ema1Field.getAttribute('name'),
      value: ema1Field.getAttribute('value'),
      ariaLabel: ema1Field.getAttribute('aria-label'),
      placeholder: ema1Field.getAttribute('placeholder'),
      element: ema1Field
    })
    console.log('EMA 2 Field:', {
      name: ema2Field.getAttribute('name'),
      value: ema2Field.getAttribute('value'),
      ariaLabel: ema2Field.getAttribute('aria-label'),
      placeholder: ema2Field.getAttribute('placeholder'),
      element: ema2Field
    })
    
    // Check if there are any other inputs with value 500
    const inputsWithValue500 = screen.getAllByDisplayValue('500')
    console.log('=== INPUTS WITH VALUE 500 ===')
    inputsWithValue500.forEach((input, index) => {
      console.log(`Input with value 500 (${index}):`, {
        name: input.getAttribute('name'),
        value: input.getAttribute('value'),
        ariaLabel: input.getAttribute('aria-label'),
        element: input
      })
    })
    
    // Check if there are any inputs with value 13
    const inputsWithValue13 = screen.queryAllByDisplayValue('13')
    console.log('=== INPUTS WITH VALUE 13 ===')
    inputsWithValue13.forEach((input, index) => {
      console.log(`Input with value 13 (${index}):`, {
        name: input.getAttribute('name'),
        value: input.getAttribute('value'),
        ariaLabel: input.getAttribute('aria-label'),
        element: input
      })
    })
    
    // Check if there are any inputs with value 55
    const inputsWithValue55 = screen.queryAllByDisplayValue('55')
    console.log('=== INPUTS WITH VALUE 55 ===')
    inputsWithValue55.forEach((input, index) => {
      console.log(`Input with value 55 (${index}):`, {
        name: input.getAttribute('name'),
        value: input.getAttribute('value'),
        ariaLabel: input.getAttribute('aria-label'),
        element: input
      })
    })
    
    // This test will always pass - it's just for debugging
    expect(true).toBe(true)
  })
})

