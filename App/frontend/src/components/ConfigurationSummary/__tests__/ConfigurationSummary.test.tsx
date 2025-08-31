import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfigurationSummary from '../ConfigurationSummary'
import { ConfigurationForm as ConfigurationFormType } from '../../../types'

const mockConfiguration: ConfigurationFormType = {
  tradingMechanics: {
    initialBalance: 100000,
    dailyProfitTarget: 5000,
    dailyMaxLossLimit: 10000,
    commissions: 2.5,
    marginRequiredPerContract: 1000,
    slippage: 0.5,
    contractValue: 5,
    equityReserve: 5000
  },
  rewardFunction: {
    profitTargetBonus: 2.0,
    bankruptcyPenalty: -1.5,
    consecutiveWinningTradesBonus: 0.1
  },
  ppoHyperParams: {
    learningRate: 0.0003,
    nSteps: 2048,
    batchSize: 64,
    gamma: 0.99,
    gaeLambda: 0.95,
    clipRange: 0.2,
    entCoef: 0.01,
    vfCoef: 0.5
  },
  loggingCheckpointing: {
    experimentName: 'futures_trading_experiment',
    checkpointFrequency: 10000,
    evaluationFrequency: 5000
  },
  dayMastery: {
    minEpisodesToRun: 100,
    requiredSuccessRate: 0.7,
    performancePlateauEpisodes: 50,
    startTime: '09:30',
    endTime: '16:00'
  },
  dataIndicators: {
    observationHistoryLength: 100,
    ema1Period: 20,
    ema2Period: 50,
    bollingerBandsPeriod: 20,
    atrPeriod: 14,
    macdPeriod: 26
  },
  visualization: {
    renderingMode: 'human',
    rateOfSpeed: 1,
    fixedWindow: 100,
    candleWidthFactor: 1,
    trainingSpeed: 1
  }
}

const mockOnBack = jest.fn()
const mockOnConfirm = jest.fn()

const defaultProps = {
  configuration: mockConfiguration,
  onBack: mockOnBack,
  onConfirm: mockOnConfirm
}

describe('ConfigurationSummary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders configuration summary title', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Configuration Summary')).toBeInTheDocument()
  })

  it('displays trading mechanics section', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Trading & Market Mechanics')).toBeInTheDocument()
    expect(screen.getByText('Initial Balance: $100,000')).toBeInTheDocument()
    expect(screen.getByText('Daily Profit Target: $5,000')).toBeInTheDocument()
    expect(screen.getByText('Daily Max Loss Limit: $10,000')).toBeInTheDocument()
  })

  it('displays reward function settings', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Reward Function Settings')).toBeInTheDocument()
    expect(screen.getByText('Profit Target Bonus: 2.0x')).toBeInTheDocument()
    expect(screen.getByText('Bankruptcy Penalty: -1.5x')).toBeInTheDocument()
  })

  it('displays PPO hyperparameters', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('PPO Hyper Parameters')).toBeInTheDocument()
    expect(screen.getByText('Learning Rate: 0.0003')).toBeInTheDocument()
    expect(screen.getByText('Batch Size: 64')).toBeInTheDocument()
  })

  it('displays logging and checkpointing settings', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Logging & Checkpointing')).toBeInTheDocument()
    expect(screen.getByText('Experiment Name: futures_trading_experiment')).toBeInTheDocument()
    expect(screen.getByText('Checkpoint Frequency: 10,000')).toBeInTheDocument()
  })

  it('displays day mastery mechanism', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Day Mastery Mechanism')).toBeInTheDocument()
    expect(screen.getByText('Min Episodes to Run: 100')).toBeInTheDocument()
    expect(screen.getByText('Required Success Rate: 70%')).toBeInTheDocument()
  })

  it('displays data indicator calculations', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Data & Indicator Calculation')).toBeInTheDocument()
    expect(screen.getByText('EMA 1 Period: 20')).toBeInTheDocument()
    expect(screen.getByText('Bollinger Bands Period: 20')).toBeInTheDocument()
  })

  it('displays visualization settings', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Visualization')).toBeInTheDocument()
    expect(screen.getByText('Rendering Mode: Human')).toBeInTheDocument()
    expect(screen.getByText('Training Speed: 1x')).toBeInTheDocument()
  })

  it('handles back navigation', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    const backButton = screen.getByText('Back to Configuration')
    fireEvent.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('handles configuration confirmation', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    const confirmButton = screen.getByText('Confirm Configuration')
    fireEvent.click(confirmButton)
    
    expect(mockOnConfirm).toHaveBeenCalled()
  })

  it('formats currency values correctly', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Initial Balance: $100,000')).toBeInTheDocument()
    expect(screen.getByText('Daily Profit Target: $5,000')).toBeInTheDocument()
    expect(screen.getByText('Commissions: $2.50')).toBeInTheDocument()
  })

  it('formats percentages correctly', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Required Success Rate: 70%')).toBeInTheDocument()
    expect(screen.getByText('Learning Rate: 0.0003')).toBeInTheDocument()
  })

  it('formats time values correctly', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('Start Time: 09:30')).toBeInTheDocument()
    expect(screen.getByText('End Time: 16:00')).toBeInTheDocument()
  })

  it('shows section icons', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    expect(screen.getByText('💰')).toBeInTheDocument() // Trading & Market Mechanics
    expect(screen.getByText('🎯')).toBeInTheDocument() // Reward Function Settings
    expect(screen.getByText('🧠')).toBeInTheDocument() // PPO Hyper Parameters
  })

  it('applies proper CSS classes', () => {
    render(<ConfigurationSummary {...defaultProps} />)
    
    const container = screen.getByTestId('configuration-summary')
    expect(container).toHaveClass('configurationSummary')
  })

  it('handles empty configuration gracefully', () => {
    const emptyConfig = {} as ConfigurationFormType
    
    render(<ConfigurationSummary 
      configuration={emptyConfig}
      onBack={mockOnBack}
      onConfirm={mockOnConfirm}
    />)
    
    expect(screen.getByText('Configuration Summary')).toBeInTheDocument()
    expect(screen.getByText('No configuration data available')).toBeInTheDocument()
  })
})
