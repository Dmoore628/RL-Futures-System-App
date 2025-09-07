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

describe('ConfigurationForm Data Flow', () => {
  let submittedData: ConfigurationFormType | null = null
  const mockOnSubmit = jest.fn((data: ConfigurationFormType) => {
    submittedData = data
  })
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    submittedData = null
  })

  it('should submit correct default values when form is submitted', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Navigate to the last section to trigger submission
    const sections = [
      'Trading & Market Mechanics',
      'Reward Function Settings', 
      'PPO Hyper Parameters',
      'Logging & Checkpointing',
      'Day Mastery Mechanism',
      'Data & Indicator Calculation',
      'Visualization'
    ]

    // Navigate through all sections
    for (const section of sections) {
      fireEvent.click(screen.getByText(section))
      await waitFor(() => {
        expect(screen.getByText(section)).toBeInTheDocument()
      })
    }

    // Fill in required experiment name
    const experimentNameInput = screen.getByPlaceholderText('Enter experiment name')
    await userEvent.type(experimentNameInput, 'test-experiment')

    // Click the submit button
    const submitButton = screen.getByText('Submit Configuration')
    fireEvent.click(submitButton)

    // Wait for submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    // Check the submitted data structure
    expect(submittedData).not.toBeNull()
    expect(submittedData!.tradingMechanics).toBeDefined()
    expect(submittedData!.rewardFunction).toBeDefined()
    expect(submittedData!.ppoHyperParams).toBeDefined()
    expect(submittedData!.loggingCheckpointing).toBeDefined()
    expect(submittedData!.dayMastery).toBeDefined()
    expect(submittedData!.dataIndicators).toBeDefined()
    expect(submittedData!.visualization).toBeDefined()

    // Check specific default values
    expect(submittedData!.tradingMechanics.initialBalance).toBe(1000)
    expect(submittedData!.tradingMechanics.dailyProfitTarget).toBe(500)
    expect(submittedData!.tradingMechanics.dailyMaxLossLimit).toBe(500)
    expect(submittedData!.tradingMechanics.commissions).toBe(2.5)
    expect(submittedData!.tradingMechanics.marginRequiredPerContract).toBe(1000)
    expect(submittedData!.tradingMechanics.slippage).toBe(0.5)
    expect(submittedData!.tradingMechanics.contractValue).toBe(5)

    expect(submittedData!.rewardFunction.profitTargetBonus).toBe(2.0)
    expect(submittedData!.rewardFunction.bankruptcyPenalty).toBe(-1.5)
    expect(submittedData!.rewardFunction.consecutiveWinningTradesBonus).toBe(0.1)

    expect(submittedData!.ppoHyperParams.learningRate).toBe(0.0003)
    expect(submittedData!.ppoHyperParams.nSteps).toBe(2048)
    expect(submittedData!.ppoHyperParams.batchSize).toBe(64)
    expect(submittedData!.ppoHyperParams.gamma).toBe(0.99)
    expect(submittedData!.ppoHyperParams.gaeLambda).toBe(0.95)
    expect(submittedData!.ppoHyperParams.clipRange).toBe(0.2)
    expect(submittedData!.ppoHyperParams.entCoef).toBe(0.01)
    expect(submittedData!.ppoHyperParams.vfCoef).toBe(0.5)

    expect(submittedData!.loggingCheckpointing.experimentName).toBe('test-experiment')
    expect(submittedData!.loggingCheckpointing.checkpointFrequency).toBe(10000)
    expect(submittedData!.loggingCheckpointing.evaluationFrequency).toBe(5000)

    expect(submittedData!.dayMastery.minEpisodesToRun).toBe(100)
    expect(submittedData!.dayMastery.requiredSuccessRate).toBe(0.95)
    expect(submittedData!.dayMastery.performancePlateauEpisodes).toBe(50)
    expect(submittedData!.dayMastery.startTime).toBe('17:00')
    expect(submittedData!.dayMastery.endTime).toBe('16:00+1')

    expect(submittedData!.dataIndicators.observationHistoryLength).toBe(1440)
    expect(submittedData!.dataIndicators.ema1Period).toBe(13)
    expect(submittedData!.dataIndicators.ema2Period).toBe(55)
    expect(submittedData!.dataIndicators.bollingerBandsPeriod).toBe(20)
    expect(submittedData!.dataIndicators.atrPeriod).toBe(14)
    expect(submittedData!.dataIndicators.macdPeriod).toBe(26)

    expect(submittedData!.visualization.renderingMode).toBe('human')
    expect(submittedData!.visualization.fixedWindow).toBe(100)
    expect(submittedData!.visualization.candleWidthFactor).toBe(1)
    expect(submittedData!.visualization.trainingSpeed).toBe(1)
  })

  it('should maintain form values when navigating between sections', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Navigate to Trading & Market Mechanics
    fireEvent.click(screen.getByText('Trading & Market Mechanics'))
    
    // Change initial balance
    const initialBalanceInput = screen.getByDisplayValue('1000')
    await userEvent.clear(initialBalanceInput)
    await userEvent.type(initialBalanceInput, '2000')

    // Navigate to next section
    fireEvent.click(screen.getByText('Reward Function Settings'))
    
    // Navigate back to Trading & Market Mechanics
    fireEvent.click(screen.getByText('Trading & Market Mechanics'))
    
    // Check that the value is still there
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument()
  })

  it('should handle form validation correctly', async () => {
    render(
      <TestWrapper>
        <ConfigurationForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      </TestWrapper>
    )

    // Navigate to Trading & Market Mechanics
    fireEvent.click(screen.getByText('Trading & Market Mechanics'))
    
    // Try to set invalid initial balance
    const initialBalanceInput = screen.getByDisplayValue('1000')
    await userEvent.clear(initialBalanceInput)
    await userEvent.type(initialBalanceInput, '500') // Below minimum

    // Navigate to next section - should show validation error
    fireEvent.click(screen.getByText('Reward Function Settings'))
    
    // Navigate back to see the error
    fireEvent.click(screen.getByText('Trading & Market Mechanics'))
    
    // Should show validation error
    expect(screen.getByText('Minimum $1,000')).toBeInTheDocument()
  })
})
