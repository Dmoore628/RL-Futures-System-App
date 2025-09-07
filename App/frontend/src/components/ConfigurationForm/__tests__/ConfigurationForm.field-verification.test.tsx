import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ConfigurationForm from '../ConfigurationForm'
import { ConfigurationForm as ConfigurationFormType } from '../../../types'

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('ConfigurationForm Field Verification', () => {
  let submittedData: ConfigurationFormType | null = null
  const mockOnSubmit = jest.fn((data: ConfigurationFormType) => {
    submittedData = data
  })
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    submittedData = null
  })

  it('should display correct default values in Trading & Market Mechanics section', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Wait for form initialization
    await waitFor(() => {
      expect(screen.getByText('System Configuration')).toBeInTheDocument()
    })

    // Check Trading & Market Mechanics section (default active)
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument() // Initial Balance
    expect(screen.getAllByDisplayValue('500')).toHaveLength(2)   // Daily Profit Target & Max Loss Limit
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()    // Commissions
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()    // Slippage
    expect(screen.getByRole('option', { name: /5 \(Mini's\)/ })).toBeInTheDocument() // Contract Value
  })

  it('should display correct default values in Day Mastery Mechanism section', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Wait for form initialization
    await waitFor(() => {
      expect(screen.getByText('System Configuration')).toBeInTheDocument()
    })

    // Navigate to Day Mastery section
    fireEvent.click(screen.getByText('Day Mastery Mechanism'))

    // Check Day Mastery values
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()  // Min Episodes
    expect(screen.getByDisplayValue('95')).toBeInTheDocument()   // Success Rate (95% displayed as whole number)
    expect(screen.getByDisplayValue('50')).toBeInTheDocument()   // Plateau Episodes
    expect(screen.getByDisplayValue('17:00')).toBeInTheDocument() // Start Time
    expect(screen.getByDisplayValue('16:00')).toBeInTheDocument() // End Time
  })

  it('should display correct default values in Logging & Checkpointing section', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Wait for form initialization
    await waitFor(() => {
      expect(screen.getByText('System Configuration')).toBeInTheDocument()
    })

    // Navigate to Logging & Checkpointing section
    fireEvent.click(screen.getByText('Logging & Checkpointing'))

    // Check Logging & Checkpointing values
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument() // Checkpoint Frequency
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument()  // Evaluation Frequency
    expect(screen.getByPlaceholderText('futures_trading_experiment')).toBeInTheDocument() // Experiment Name
  })

  it('should display correct default values in Data & Indicator Calculation section', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Wait for form initialization
    await waitFor(() => {
      expect(screen.getByText('System Configuration')).toBeInTheDocument()
    })

    // Navigate to Data & Indicator Calculation section
    fireEvent.click(screen.getByText('Data & Indicator Calculation'))

    // Check Data & Indicator Calculation values
    expect(screen.getByDisplayValue('1440')).toBeInTheDocument() // Observation History Length
    expect(screen.getByDisplayValue('13')).toBeInTheDocument()   // EMA 1 Period
    expect(screen.getByDisplayValue('55')).toBeInTheDocument()   // EMA 2 Period
    expect(screen.getByDisplayValue('20')).toBeInTheDocument()   // Bollinger Bands Period
    expect(screen.getByDisplayValue('14')).toBeInTheDocument()   // ATR Period
    expect(screen.getByDisplayValue('26')).toBeInTheDocument()   // MACD Period
  })

  it('should display correct default values in Visualization section', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Wait for form initialization
    await waitFor(() => {
      expect(screen.getByText('System Configuration')).toBeInTheDocument()
    })

    // Navigate to Visualization section
    fireEvent.click(screen.getByText('Visualization'))

    // Check Visualization values
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()  // Update Frequency
    expect(screen.getAllByDisplayValue('1')).toHaveLength(2)     // Candle Width Factor & Training Speed
  })

  it('should submit correct values when form is submitted', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Wait for form initialization
    await waitFor(() => {
      expect(screen.getByText('System Configuration')).toBeInTheDocument()
    })

    // Navigate to Logging & Checkpointing section to fill experiment name
    fireEvent.click(screen.getByText('Logging & Checkpointing'))
    
    // Fill in required experiment name
    const experimentNameInput = screen.getByPlaceholderText('futures_trading_experiment')
    await userEvent.type(experimentNameInput, 'test-experiment')

    // Navigate to Visualization section (last section)
    fireEvent.click(screen.getByText('Visualization'))

    // Click submit button
    const submitButton = screen.getByText('Submit Configuration')
    fireEvent.click(submitButton)

    // Wait for submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    // Verify submitted data has correct values
    expect(submittedData).not.toBeNull()
    expect(submittedData!.tradingMechanics.initialBalance).toBe(1000)
    expect(submittedData!.tradingMechanics.dailyProfitTarget).toBe(500)
    expect(submittedData!.tradingMechanics.dailyMaxLossLimit).toBe(500)
    expect(submittedData!.tradingMechanics.commissions).toBe(3)
    expect(submittedData!.tradingMechanics.marginRequiredPerContract).toBe(1000)
    expect(submittedData!.tradingMechanics.slippage).toBe(1)
    expect(submittedData!.tradingMechanics.contractValue).toBe(5)

    expect(submittedData!.dayMastery.minEpisodesToRun).toBe(100)
    expect(submittedData!.dayMastery.requiredSuccessRate).toBe(0.95)
    expect(submittedData!.dayMastery.performancePlateauEpisodes).toBe(50)
    expect(submittedData!.dayMastery.startTime).toBe('17:00')
    expect(submittedData!.dayMastery.endTime).toBe('16:00')

    expect(submittedData!.loggingCheckpointing.checkpointFrequency).toBe(10000)
    expect(submittedData!.loggingCheckpointing.evaluationFrequency).toBe(5000)
    expect(submittedData!.loggingCheckpointing.experimentName).toBe('test-experiment')

    expect(submittedData!.dataIndicators.observationHistoryLength).toBe(1440)
    expect(submittedData!.dataIndicators.ema1Period).toBe(13)
    expect(submittedData!.dataIndicators.ema2Period).toBe(55)

    expect(submittedData!.visualization.fixedWindow).toBe(100)
    expect(submittedData!.visualization.candleWidthFactor).toBe(1)
    expect(submittedData!.visualization.trainingSpeed).toBe(1)
  })
})
