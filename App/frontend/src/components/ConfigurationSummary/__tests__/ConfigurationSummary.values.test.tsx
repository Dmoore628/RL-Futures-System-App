import React from 'react'
import { render, screen } from '@testing-library/react'
import ConfigurationSummary from '../ConfigurationSummary'
import { ConfigurationForm as ConfigurationFormType } from '../../../types'

describe('ConfigurationSummary Values Accuracy', () => {
  const mockConfiguration: ConfigurationFormType = {
    tradingMechanics: {
      initialBalance: 1000,
      dailyProfitTarget: 500,
      dailyMaxLossLimit: 500,
      commissions: 3,
      marginRequiredPerContract: 1000,
      slippage: 1,
      contractValue: 5
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
      experimentName: 'test-experiment',
      checkpointFrequency: 10000,
      evaluationFrequency: 5000
    },
    dayMastery: {
      minEpisodesToRun: 100,
      requiredSuccessRate: 0.95,
      performancePlateauEpisodes: 50,
      startTime: '17:00',
      endTime: '16:00+1'
    },
    dataIndicators: {
      observationHistoryLength: 1440,
      ema1Period: 12,
      ema2Period: 26,
      bollingerBandsPeriod: 20,
      atrPeriod: 14,
      macdPeriod: 26
    },
    visualization: {
      renderingMode: 'human' as const,
      fixedWindow: 100,
      candleWidthFactor: 1,
      trainingSpeed: 1
    }
  }

  const mockProps = {
    configuration: mockConfiguration,
    onEdit: jest.fn(),
    onConfirm: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Trading & Market Mechanics Values', () => {
    it('should display correct initial balance', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('$1,000')).toBeInTheDocument()
    })

    it('should display correct daily profit target', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const profitTargetElement = screen.getByText('Daily Profit Target:').closest('.summaryItem')
      expect(profitTargetElement).toHaveTextContent('$500')
    })

    it('should display correct daily max loss limit', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const maxLossElement = screen.getByText('Daily Max Loss Limit:').closest('.summaryItem')
      expect(maxLossElement).toHaveTextContent('$500')
    })

    it('should display correct commissions', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('$3')).toBeInTheDocument()
    })

    it('should display correct margin required per contract', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('$1,000')).toBeInTheDocument()
    })

    it('should display correct slippage', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('$1')).toBeInTheDocument()
    })

    it('should display correct contract value', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('$5/Tick (Mini\'s)')).toBeInTheDocument()
    })
  })

  describe('Reward Function Settings Values', () => {
    it('should display correct profit target bonus', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('2x')).toBeInTheDocument()
    })

    it('should display correct bankruptcy penalty', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('-1.5x')).toBeInTheDocument()
    })

    it('should display correct consecutive winning trades bonus', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('+0.1')).toBeInTheDocument()
    })
  })

  describe('PPO Hyper Parameters Values', () => {
    it('should display correct learning rate', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('0.0003')).toBeInTheDocument()
    })

    it('should display correct n_steps', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('2,048')).toBeInTheDocument()
    })

    it('should display correct batch size', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('64')).toBeInTheDocument()
    })

    it('should display correct gamma', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('0.99')).toBeInTheDocument()
    })

    it('should display correct GAE lambda', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('0.95')).toBeInTheDocument()
    })

    it('should display correct clip range', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('0.2')).toBeInTheDocument()
    })

    it('should display correct ent coef', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('0.01')).toBeInTheDocument()
    })

    it('should display correct VF coef', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('0.5')).toBeInTheDocument()
    })
  })

  describe('Logging & Checkpointing Values', () => {
    it('should display correct experiment name', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('test-experiment')).toBeInTheDocument()
    })

    it('should display correct checkpoint frequency', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('10,000 episodes')).toBeInTheDocument()
    })

    it('should display correct evaluation frequency', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('5,000 episodes')).toBeInTheDocument()
    })
  })

  describe('Day Mastery Mechanism Values', () => {
    it('should display correct minimum episodes to run', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const minEpisodesElement = screen.getByText('Minimum Episodes to Run:').closest('.summaryItem')
      expect(minEpisodesElement).toHaveTextContent('100')
    })

    it('should display correct required success rate', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('95%')).toBeInTheDocument()
    })

    it('should display correct performance plateau episodes', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('50')).toBeInTheDocument()
    })

    it('should display correct trading hours', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('17:00 - 16:00+1')).toBeInTheDocument()
    })
  })

  describe('Data & Indicator Calculation Values', () => {
    it('should display correct observation history length', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('1440')).toBeInTheDocument()
    })

    it('should display correct EMA 1 period', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('12')).toBeInTheDocument()
    })

    it('should display correct EMA 2 period', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const ema2Element = screen.getByText('EMA 2 Period:').closest('.summaryItem')
      expect(ema2Element).toHaveTextContent('26')
    })

    it('should display correct Bollinger Bands period', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const bbElement = screen.getByText('Bollinger Bands Period:').closest('.summaryItem')
      expect(bbElement).toHaveTextContent('20')
    })

    it('should display correct ATR period', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const atrElement = screen.getByText('ATR Period:').closest('.summaryItem')
      expect(atrElement).toHaveTextContent('14')
    })

    it('should display correct MACD period', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const macdElement = screen.getByText('MACD Period:').closest('.summaryItem')
      expect(macdElement).toHaveTextContent('26')
    })
  })

  describe('Visualization Values', () => {
    it('should display correct rendering mode', () => {
      render(<ConfigurationSummary {...mockProps} />)
      expect(screen.getByText('human')).toBeInTheDocument()
    })

    it('should display correct fixed window', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const fixedWindowElement = screen.getByText('Fixed Window:').closest('.summaryItem')
      expect(fixedWindowElement).toHaveTextContent('100')
    })

    it('should display correct candle width factor', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const candleWidthElement = screen.getByText('Candle Width Factor:').closest('.summaryItem')
      expect(candleWidthElement).toHaveTextContent('1')
    })

    it('should display correct training speed', () => {
      render(<ConfigurationSummary {...mockProps} />)
      const trainingSpeedElement = screen.getByText('Training Speed:').closest('.summaryItem')
      expect(trainingSpeedElement).toHaveTextContent('1')
    })
  })
})
