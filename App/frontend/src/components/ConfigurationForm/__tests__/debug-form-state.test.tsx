import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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

// Debug component to inspect form state
const DebugFormState: React.FC = () => {
  const { getValues, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      tradingMechanics: {
        initialBalance: 1000,
        dailyProfitTarget: 500,
        dailyMaxLossLimit: 500,
        commissions: 2.5,
        marginRequiredPerContract: 1000,
        slippage: 0.5,
        contractValue: 5
      },
      dataIndicators: {
        observationHistoryLength: 1440,
        ema1Period: 13,
        ema2Period: 55,
        bollingerBandsPeriod: 20,
        atrPeriod: 14,
        macdPeriod: 26
      }
    }
  })

  const formValues = getValues()
  const watchedValues = watch()

  console.log('=== FORM STATE DEBUG ===')
  console.log('getValues():', formValues)
  console.log('watch():', watchedValues)
  console.log('dataIndicators from getValues:', formValues.dataIndicators)
  console.log('dataIndicators from watch:', watchedValues.dataIndicators)

  return (
    <div>
      <h1>Form State Debug</h1>
      <div>
        <h2>getValues() result:</h2>
        <pre>{JSON.stringify(formValues, null, 2)}</pre>
      </div>
      <div>
        <h2>watch() result:</h2>
        <pre>{JSON.stringify(watchedValues, null, 2)}</pre>
      </div>
    </div>
  )
}

describe('DEBUG: Form State Investigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('DEBUG: Inspect form state immediately after initialization', () => {
    render(
      <TestWrapper>
        <DebugFormState />
      </TestWrapper>
    )
    
    // This test will always pass - it's just for debugging
    expect(true).toBe(true)
  })

  it('DEBUG: Inspect ConfigurationForm internal state', () => {
    render(
      <TestWrapper>
        <ConfigurationForm {...defaultProps} />
      </TestWrapper>
    )
    
    // Navigate to Data & Indicator Calculation section
    fireEvent.click(screen.getByText('Data & Indicator Calculation'))
    
    // This test will always pass - it's just for debugging
    expect(true).toBe(true)
  })
})


