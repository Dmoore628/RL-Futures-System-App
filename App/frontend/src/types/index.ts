export interface User {
  id: string
  name: string
  email: string
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// File Upload Types
export interface FileData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  rowCount: number
  preview: FileData[]
}

// Configuration Types
export interface TradingMechanics {
  initialBalance: number
  dailyProfitTarget: number
  dailyMaxLossLimit: number
  commissions: number
  marginRequiredPerContract: number
  slippage: number
  contractValue: number
  equityReserve: number
}

export interface RewardFunctionSettings {
  profitTargetBonus: number
  bankruptcyPenalty: number
  consecutiveWinningTradesBonus: number
}

export interface PPOHyperParameters {
  learningRate: number
  nSteps: number
  batchSize: number
  gamma: number
  gaeLambda: number
  clipRange: number
  entCoef: number
  vfCoef: number
}

export interface LoggingCheckpointing {
  experimentName: string
  checkpointFrequency: number
  evaluationFrequency: number
}

export interface DayMasteryMechanism {
  minEpisodesToRun: number
  requiredSuccessRate: number
  performancePlateauEpisodes: number
  startTime: string
  endTime: string
}

export interface DataIndicatorCalculations {
  observationHistoryLength: number
  ema1Period: number
  ema2Period: number
  bollingerBandsPeriod: number
  atrPeriod: number
  macdPeriod: number
}

export interface Visualization {
  renderingMode: 'human' | 'fast'
  rateOfSpeed: number
  fixedWindow: number
  candleWidthFactor: number
  trainingSpeed: number
}

export interface ConfigurationForm {
  tradingMechanics: TradingMechanics
  rewardFunction: RewardFunctionSettings
  ppoHyperParams: PPOHyperParameters
  loggingCheckpointing: LoggingCheckpointing
  dayMastery: DayMasteryMechanism
  dataIndicators: DataIndicatorCalculations
  visualization: Visualization
}

export interface FormValidationState {
  isValid: boolean
  errors: Record<string, string[]>
  warnings: Record<string, string[]>
  readyToTrain: boolean
}

// Navigation Types
export interface NavigationItem {
  path: string
  label: string
  isActive: boolean
}

// Step Indicator Types
export interface Step {
  id: number
  label: string
  isCompleted: boolean
  isActive: boolean
}
