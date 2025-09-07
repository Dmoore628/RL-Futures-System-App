import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ConfigurationForm from '../ConfigurationForm'

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('ConfigurationForm Debug', () => {
  it('should render form with correct default values', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnBack = jest.fn()

    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Wait for form to render
    await waitFor(() => {
      expect(screen.getByText('System Configuration')).toBeInTheDocument()
    })

    // Log all input values to see what's actually being rendered
    const inputs = screen.getAllByRole('spinbutton')
    console.log('All input values:')
    inputs.forEach((input, index) => {
      console.log(`${index}: ${input.getAttribute('name')} = ${input.getAttribute('value')}`)
    })

    // Navigate to Day Mastery section
    const dayMasteryButton = screen.getByText('Day Mastery Mechanism')
    dayMasteryButton.click()

    // Wait for section to load
    await waitFor(() => {
      expect(screen.getByText('⏰ Day Mastery Mechanism')).toBeInTheDocument()
    })

    // Log Day Mastery values
    const dayMasteryInputs = screen.getAllByRole('spinbutton')
    console.log('Day Mastery input values:')
    dayMasteryInputs.forEach((input, index) => {
      console.log(`${index}: ${input.getAttribute('name')} = ${input.getAttribute('value')}`)
    })

    // Check if the form is rendering at all
    expect(screen.getByText('System Configuration')).toBeInTheDocument()
  })
})
