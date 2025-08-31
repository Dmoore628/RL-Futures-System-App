import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UploadAndSettingsPage from '../UploadAndSettingsPage'
import { FileData, FileValidationResult, ConfigurationForm as ConfigurationFormType } from '../../types'

// Mock the components
jest.mock('../../components/FileUpload', () => {
  return function MockFileUpload({ onFileProcessed, onValidationError }: any) {
    return (
      <div data-testid="file-upload">
        <button onClick={() => onFileProcessed(mockFileData, mockValidation)}>
          Simulate Successful Upload
        </button>
        <button onClick={() => onValidationError(['Test error'])}>
          Simulate Upload Error
        </button>
      </div>
    )
  }
})

jest.mock('../../components/ConfigurationForm', () => {
  return function MockConfigurationForm({ onSubmit, onBack }: any) {
    return (
      <div data-testid="configuration-form">
        <button onClick={() => onSubmit(mockConfiguration)}>
          Submit Configuration
        </button>
        <button onClick={onBack}>Back</button>
      </div>
    )
  }
})

jest.mock('../../components/ConfigurationSummary', () => {
  return function MockConfigurationSummary({ configuration, onBack, onConfirm }: any) {
    return (
      <div data-testid="configuration-summary">
        <h3>Configuration Summary</h3>
        <button onClick={onBack}>Back to Config</button>
        <button onClick={onConfirm}>Confirm Configuration</button>
      </div>
    )
  }
})

const mockFileData: FileData[] = [
  { time: '09:30', open: 100, high: 105, low: 98, close: 103 },
  { time: '09:31', open: 103, high: 107, low: 102, close: 106 }
]

const mockValidation: FileValidationResult = {
  isValid: true,
  errors: [],
  warnings: [],
  rowCount: 2,
  preview: mockFileData
}

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
    experimentName: 'test_experiment',
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

describe('UploadAndSettingsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the page title and description', () => {
    render(<UploadAndSettingsPage />)
    
    expect(screen.getByText('Upload & Settings Configuration')).toBeInTheDocument()
    expect(screen.getByText(/Upload your futures trading data and configure the system parameters/)).toBeInTheDocument()
  })

  it('shows step indicator with correct steps', () => {
    render(<UploadAndSettingsPage />)
    
    expect(screen.getByText('Upload Data')).toBeInTheDocument()
    expect(screen.getByText('Configure System')).toBeInTheDocument()
  })

  it('starts with step 1 (Upload Data) active', () => {
    render(<UploadAndSettingsPage />)
    
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
    expect(screen.queryByTestId('configuration-form')).not.toBeInTheDocument()
  })

  it('transitions to step 2 after successful file upload', async () => {
    render(<UploadAndSettingsPage />)
    
    // Simulate successful file upload
    fireEvent.click(screen.getByText('Simulate Successful Upload'))
    
    await waitFor(() => {
      expect(screen.getByText('Configure System')).toBeInTheDocument()
    })
  })

  it('shows configuration form after file upload', async () => {
    render(<UploadAndSettingsPage />)
    
    // Simulate successful file upload
    fireEvent.click(screen.getByText('Simulate Successful Upload'))
    
    await waitFor(() => {
      expect(screen.getByTestId('configuration-form')).toBeInTheDocument()
    })
  })

  it('handles configuration submission and shows summary', async () => {
    render(<UploadAndSettingsPage />)
    
    // Upload file first
    fireEvent.click(screen.getByText('Simulate Successful Upload'))
    
    // Submit configuration
    await waitFor(() => {
      fireEvent.click(screen.getByText('Submit Configuration'))
    })
    
    // Should show summary
    await waitFor(() => {
      expect(screen.getByTestId('configuration-summary')).toBeInTheDocument()
    })
  })

  it('allows navigation back to configuration from summary', async () => {
    render(<UploadAndSettingsPage />)
    
    // Go through the full flow
    fireEvent.click(screen.getByText('Simulate Successful Upload'))
    await waitFor(() => {
      fireEvent.click(screen.getByText('Submit Configuration'))
    })
    
    // Go back to configuration
    await waitFor(() => {
      fireEvent.click(screen.getByText('Back to Config'))
    })
    
    expect(screen.getByTestId('configuration-form')).toBeInTheDocument()
  })

  it('handles upload errors correctly', async () => {
    render(<UploadAndSettingsPage />)
    
    // Simulate upload error
    fireEvent.click(screen.getByText('Simulate Upload Error'))
    
    await waitFor(() => {
      expect(screen.getByText('Upload Errors')).toBeInTheDocument()
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })
  })

  it('allows resetting to upload step', async () => {
    render(<UploadAndSettingsPage />)
    
    // Upload file
    fireEvent.click(screen.getByText('Simulate Successful Upload'))
    
    // Go back to upload
    await waitFor(() => {
      fireEvent.click(screen.getByText('Back to Upload'))
    })
    
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
  })

  it('confirms configuration successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation()
    
    render(<UploadAndSettingsPage />)
    
    // Complete the full flow
    fireEvent.click(screen.getByText('Simulate Successful Upload'))
    await waitFor(() => {
      fireEvent.click(screen.getByText('Submit Configuration'))
    })
    await waitFor(() => {
      fireEvent.click(screen.getByText('Confirm Configuration'))
    })
    
    expect(consoleSpy).toHaveBeenCalledWith('Configuration confirmed:', mockConfiguration)
    expect(alertSpy).toHaveBeenCalledWith('Configuration saved successfully! Your futures trading system is ready to start training.')
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('maintains state correctly through navigation', async () => {
    render(<UploadAndSettingsPage />)
    
    // Upload file
    fireEvent.click(screen.getByText('Simulate Successful Upload'))
    
    // Navigate to configuration
    await waitFor(() => {
      expect(screen.getByTestId('configuration-form')).toBeInTheDocument()
    })
    
    // Go back to upload
    fireEvent.click(screen.getByText('Back to Upload'))
    
    // Should be back at step 1
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
  })
})
