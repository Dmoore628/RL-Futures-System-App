import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { 
  TradingMechanics, 
  RewardFunctionSettings, 
  PPOHyperParameters,
  LoggingCheckpointing,
  DayMasteryMechanism,
  DataIndicatorCalculations,
  Visualization
} from '../../types'
import styles from './ConfigurationForm.module.css'

interface ConfigurationFormProps {
  onSubmit: (data: FormData) => void
  onBack: () => void
}

interface FormData {
  tradingMechanics: TradingMechanics
  rewardFunction: RewardFunctionSettings
  ppoHyperParams: PPOHyperParameters
  loggingCheckpointing: LoggingCheckpointing
  dayMastery: DayMasteryMechanism
  dataIndicators: DataIndicatorCalculations
  visualization: Visualization
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ onSubmit, onBack }) => {
  const [activeSection, setActiveSection] = useState(0)
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
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
        renderingMode: 'human' as const,
        rateOfSpeed: 1,
        fixedWindow: 100,
        candleWidthFactor: 1,
        trainingSpeed: 1
      }
    }
  })

  const sections = [
    { id: 0, title: 'Trading & Market Mechanics', icon: '💰' },
    { id: 1, title: 'Reward Function Settings', icon: '🎯' },
    { id: 2, title: 'PPO Hyper Parameters', icon: '🧠' },
    { id: 3, title: 'Logging & Checkpointing', icon: '📊' },
    { id: 4, title: 'Day Mastery Mechanism', icon: '⏰' },
    { id: 5, title: 'Data & Indicator Calculation', icon: '📈' },
    { id: 6, title: 'Visualization', icon: '🎨' }
  ]

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data)
  }

  const nextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1)
    }
  }

  const prevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1)
    }
  }

  const renderTradingMechanics = () => (
    <div className={styles.section}>
      <h3>💰 Trading & Market Mechanics</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Initial Balance ($)</label>
          <Controller
            name="tradingMechanics.initialBalance"
            control={control}
            rules={{ required: 'Initial balance is required', min: { value: 1000, message: 'Minimum $1,000' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="100000"
              />
            )}
          />
          {errors.tradingMechanics?.initialBalance && (
            <span className={styles.error}>{errors.tradingMechanics.initialBalance.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Daily Profit Target ($)</label>
          <Controller
            name="tradingMechanics.dailyProfitTarget"
            control={control}
            rules={{ required: 'Daily profit target is required', min: { value: 100, message: 'Minimum $100' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="5000"
              />
            )}
          />
          {errors.tradingMechanics?.dailyProfitTarget && (
            <span className={styles.error}>{errors.tradingMechanics.dailyProfitTarget.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Daily Max Loss Limit ($)</label>
          <Controller
            name="tradingMechanics.dailyMaxLossLimit"
            control={control}
            rules={{ required: 'Daily max loss limit is required', min: { value: 100, message: 'Minimum $100' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="10000"
              />
            )}
          />
          {errors.tradingMechanics?.dailyMaxLossLimit && (
            <span className={styles.error}>{errors.tradingMechanics.dailyMaxLossLimit.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Commissions ($)</label>
          <Controller
            name="tradingMechanics.commissions"
            control={control}
            rules={{ required: 'Commissions are required', min: { value: 0, message: 'Must be non-negative' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="2.5"
              />
            )}
          />
          {errors.tradingMechanics?.commissions && (
            <span className={styles.error}>{errors.tradingMechanics.commissions.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Margin Required Per Contract ($)</label>
          <Controller
            name="tradingMechanics.marginRequiredPerContract"
            control={control}
            rules={{ required: 'Margin required is required', min: { value: 100, message: 'Minimum $100' } }}
            render={({ field }) => (
              <select {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))}>
                <option value={1000}>Mini&apos;s = $1,000</option>
                <option value={100}>Micro&apos;s = $100</option>
              </select>
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Slippage ($)</label>
          <Controller
            name="tradingMechanics.slippage"
            control={control}
            rules={{ required: 'Slippage is required', min: { value: 0, message: 'Must be non-negative' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.5"
              />
            )}
          />
          {errors.tradingMechanics?.slippage && (
            <span className={styles.error}>{errors.tradingMechanics.slippage.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Contract Value ($/tick)</label>
          <Controller
            name="tradingMechanics.contractValue"
            control={control}
            rules={{ required: 'Contract value is required', min: { value: 0.01, message: 'Minimum $0.01' } }}
            render={({ field }) => (
              <select {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))}>
                <option value={5}>Mini&apos;s = $5/tick</option>
                <option value={0.5}>Micro&apos;s = $0.50/tick</option>
              </select>
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Equity Reserve ($)</label>
          <Controller
            name="tradingMechanics.equityReserve"
            control={control}
            rules={{ required: 'Equity reserve is required', min: { value: 100, message: 'Minimum $100' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="5000"
              />
            )}
          />
          {errors.tradingMechanics?.equityReserve && (
            <span className={styles.error}>{errors.tradingMechanics.equityReserve.message}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderRewardFunctionSettings = () => (
    <div className={styles.section}>
      <h3>🎯 Reward Function Settings</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Profit Target Bonus (multiplier)</label>
          <Controller
            name="rewardFunction.profitTargetBonus"
            control={control}
            rules={{ required: 'Profit target bonus is required', min: { value: 0.1, message: 'Minimum 0.1' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.1"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="2.0"
              />
            )}
          />
          {errors.rewardFunction?.profitTargetBonus && (
            <span className={styles.error}>{errors.rewardFunction.profitTargetBonus.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Bankruptcy Penalty (multiplier)</label>
          <Controller
            name="rewardFunction.bankruptcyPenalty"
            control={control}
            rules={{ required: 'Bankruptcy penalty is required', max: { value: 0, message: 'Must be negative' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.1"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="-1.5"
              />
            )}
          />
          {errors.rewardFunction?.bankruptcyPenalty && (
            <span className={styles.error}>{errors.rewardFunction.bankruptcyPenalty.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Consecutive Winning Trades Bonus</label>
          <Controller
            name="rewardFunction.consecutiveWinningTradesBonus"
            control={control}
            rules={{ required: 'Bonus is required', min: { value: 0, message: 'Must be non-negative' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.1"
              />
            )}
          />
          {errors.rewardFunction?.consecutiveWinningTradesBonus && (
            <span className={styles.error}>{errors.rewardFunction.consecutiveWinningTradesBonus.message}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderPPOHyperParameters = () => (
    <div className={styles.section}>
      <h3>🧠 PPO Hyper Parameters</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Learning Rate</label>
          <Controller
            name="ppoHyperParams.learningRate"
            control={control}
            rules={{ required: 'Learning rate is required', min: { value: 0.00001, message: 'Minimum 0.00001' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.00001"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.0003"
              />
            )}
          />
          {errors.ppoHyperParams?.learningRate && (
            <span className={styles.error}>{errors.ppoHyperParams.learningRate.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>n_steps (rollout collection steps)</label>
          <Controller
            name="ppoHyperParams.nSteps"
            control={control}
            rules={{ required: 'n_steps is required', min: { value: 1, message: 'Minimum 1' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="2048"
              />
            )}
          />
          {errors.ppoHyperParams?.nSteps && (
            <span className={styles.error}>{errors.ppoHyperParams.nSteps.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Batch Size</label>
          <Controller
            name="ppoHyperParams.batchSize"
            control={control}
            rules={{ required: 'Batch size is required', min: { value: 1, message: 'Minimum 1' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="64"
              />
            )}
          />
          {errors.ppoHyperParams?.batchSize && (
            <span className={styles.error}>{errors.ppoHyperParams.batchSize.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Gamma (future reward discount)</label>
          <Controller
            name="ppoHyperParams.gamma"
            control={control}
            rules={{ required: 'Gamma is required', min: { value: 0, message: 'Minimum 0' }, max: { value: 1, message: 'Maximum 1' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.99"
              />
            )}
          />
          {errors.ppoHyperParams?.gamma && (
            <span className={styles.error}>{errors.ppoHyperParams.gamma.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>GAE Lambda (advantage estimation)</label>
          <Controller
            name="ppoHyperParams.gaeLambda"
            control={control}
            rules={{ required: 'GAE Lambda is required', min: { value: 0, message: 'Minimum 0' }, max: { value: 1, message: 'Maximum 1' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.95"
              />
            )}
          />
          {errors.ppoHyperParams?.gaeLambda && (
            <span className={styles.error}>{errors.ppoHyperParams.gaeLambda.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Clip Range (PPO objective clipping)</label>
          <Controller
            name="ppoHyperParams.clipRange"
            control={control}
            rules={{ required: 'Clip range is required', min: { value: 0, message: 'Minimum 0' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.2"
              />
            )}
          />
          {errors.ppoHyperParams?.clipRange && (
            <span className={styles.error}>{errors.ppoHyperParams.clipRange.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Ent Coef (exploration encouragement)</label>
          <Controller
            name="ppoHyperParams.entCoef"
            control={control}
            rules={{ required: 'Ent Coef is required' }}
            render={({ field }) => (
              <input
                type="number"
                step="0.001"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.01"
              />
            )}
          />
          {errors.ppoHyperParams?.entCoef && (
            <span className={styles.error}>{errors.ppoHyperParams.entCoef.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>VF Coef (value function importance)</label>
          <Controller
            name="ppoHyperParams.vfCoef"
            control={control}
            rules={{ required: 'VF Coef is required', min: { value: 0, message: 'Minimum 0' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.1"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.5"
              />
            )}
          />
          {errors.ppoHyperParams?.vfCoef && (
            <span className={styles.error}>{errors.ppoHyperParams.vfCoef.message}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderLoggingAndCheckpointing = () => (
    <div className={styles.section}>
      <h3>📊 Logging & Checkpointing</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Experiment Name</label>
          <Controller
            name="loggingCheckpointing.experimentName"
            control={control}
            rules={{ required: 'Experiment name is required' }}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                placeholder="futures_trading_experiment"
              />
            )}
          />
          {errors.loggingCheckpointing?.experimentName && (
            <span className={styles.error}>{errors.loggingCheckpointing.experimentName.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Checkpoint Frequency (episodes)</label>
          <Controller
            name="loggingCheckpointing.checkpointFrequency"
            control={control}
            rules={{ required: 'Checkpoint frequency is required', min: { value: 1, message: 'Minimum 1' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="10000"
              />
            )}
          />
          {errors.loggingCheckpointing?.checkpointFrequency && (
            <span className={styles.error}>{errors.loggingCheckpointing.checkpointFrequency.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Evaluation Frequency (episodes)</label>
          <Controller
            name="loggingCheckpointing.evaluationFrequency"
            control={control}
            rules={{ required: 'Evaluation frequency is required', min: { value: 1, message: 'Minimum 1' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="5000"
              />
            )}
          />
          {errors.loggingCheckpointing?.evaluationFrequency && (
            <span className={styles.error}>{errors.loggingCheckpointing.evaluationFrequency.message}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderDayMasteryMechanism = () => (
    <div className={styles.section}>
      <h3>⏰ Day Mastery Mechanism</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Minimum Episodes to Run</label>
          <Controller
            name="dayMastery.minEpisodesToRun"
            control={control}
            rules={{ required: 'Minimum episodes is required', min: { value: 10, message: 'Minimum 10' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="100"
              />
            )}
          />
          {errors.dayMastery?.minEpisodesToRun && (
            <span className={styles.error}>{errors.dayMastery.minEpisodesToRun.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Required Success Rate (%)</label>
          <Controller
            name="dayMastery.requiredSuccessRate"
            control={control}
            rules={{ required: 'Success rate is required', min: { value: 0.1, message: 'Minimum 10%' }, max: { value: 1, message: 'Maximum 100%' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="0.7"
              />
            )}
          />
          {errors.dayMastery?.requiredSuccessRate && (
            <span className={styles.error}>{errors.dayMastery.requiredSuccessRate.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Performance Plateau Episodes</label>
          <Controller
            name="dayMastery.performancePlateauEpisodes"
            control={control}
            rules={{ required: 'Plateau episodes is required', min: { value: 5, message: 'Minimum 5' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="50"
              />
            )}
          />
          {errors.dayMastery?.performancePlateauEpisodes && (
            <span className={styles.error}>{errors.dayMastery.performancePlateauEpisodes.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Start Time</label>
          <Controller
            name="dayMastery.startTime"
            control={control}
            rules={{ required: 'Start time is required' }}
            render={({ field }) => (
              <input
                type="time"
                {...field}
                placeholder="09:30"
              />
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <label>End Time</label>
          <Controller
            name="dayMastery.endTime"
            control={control}
            rules={{ required: 'End time is required' }}
            render={({ field }) => (
              <input
                type="time"
                {...field}
                placeholder="16:00"
              />
            )}
          />
        </div>
      </div>
    </div>
  )

  const renderDataAndIndicatorCalculation = () => (
    <div className={styles.section}>
      <h3>📈 Data & Indicator Calculation</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Observation History Length</label>
          <Controller
            name="dataIndicators.observationHistoryLength"
            control={control}
            rules={{ required: 'Observation history length is required', min: { value: 10, message: 'Minimum 10' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="100"
              />
            )}
          />
          {errors.dataIndicators?.observationHistoryLength && (
            <span className={styles.error}>{errors.dataIndicators.observationHistoryLength.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>EMA 1 Period</label>
          <Controller
            name="dataIndicators.ema1Period"
            control={control}
            rules={{ required: 'EMA 1 period is required', min: { value: 2, message: 'Minimum 2' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="20"
              />
            )}
          />
          {errors.dataIndicators?.ema1Period && (
            <span className={styles.error}>{errors.dataIndicators.ema1Period.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>EMA 2 Period</label>
          <Controller
            name="dataIndicators.ema2Period"
            control={control}
            rules={{ required: 'EMA 2 period is required', min: { value: 2, message: 'Minimum 2' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="50"
              />
            )}
          />
          {errors.dataIndicators?.ema2Period && (
            <span className={styles.error}>{errors.dataIndicators.ema2Period.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Bollinger Bands Period</label>
          <Controller
            name="dataIndicators.bollingerBandsPeriod"
            control={control}
            rules={{ required: 'Bollinger Bands period is required', min: { value: 2, message: 'Minimum 2' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="20"
              />
            )}
          />
          {errors.dataIndicators?.bollingerBandsPeriod && (
            <span className={styles.error}>{errors.dataIndicators.bollingerBandsPeriod.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>ATR Period</label>
          <Controller
            name="dataIndicators.atrPeriod"
            control={control}
            rules={{ required: 'ATR period is required', min: { value: 2, message: 'Minimum 2' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="14"
              />
            )}
          />
          {errors.dataIndicators?.atrPeriod && (
            <span className={styles.error}>{errors.dataIndicators.atrPeriod.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>MACD Period</label>
          <Controller
            name="dataIndicators.macdPeriod"
            control={control}
            rules={{ required: 'MACD period is required', min: { value: 2, message: 'Minimum 2' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="26"
              />
            )}
          />
          {errors.dataIndicators?.macdPeriod && (
            <span className={styles.error}>{errors.dataIndicators.macdPeriod.message}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderVisualization = () => (
    <div className={styles.section}>
      <h3>🎨 Visualization</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Rendering Mode</label>
          <Controller
            name="visualization.renderingMode"
            control={control}
            rules={{ required: 'Rendering mode is required' }}
            render={({ field }) => (
              <select {...field}>
                <option value="human">Human (Detailed)</option>
                <option value="fast">Fast (Minimal)</option>
              </select>
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Rate of Speed</label>
          <Controller
            name="visualization.rateOfSpeed"
            control={control}
            rules={{ required: 'Rate of speed is required', min: { value: 0.1, message: 'Minimum 0.1' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.1"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="1"
              />
            )}
          />
          {errors.visualization?.rateOfSpeed && (
            <span className={styles.error}>{errors.visualization.rateOfSpeed.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Fixed Window</label>
          <Controller
            name="visualization.fixedWindow"
            control={control}
            rules={{ required: 'Fixed window is required', min: { value: 10, message: 'Minimum 10' } }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                placeholder="100"
              />
            )}
          />
          {errors.visualization?.fixedWindow && (
            <span className={styles.error}>{errors.visualization.fixedWindow.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Candle Width Factor</label>
          <Controller
            name="visualization.candleWidthFactor"
            control={control}
            rules={{ required: 'Candle width factor is required', min: { value: 0.1, message: 'Minimum 0.1' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.1"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="1"
              />
            )}
          />
          {errors.visualization?.candleWidthFactor && (
            <span className={styles.error}>{errors.visualization.candleWidthFactor.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Training Speed</label>
          <Controller
            name="visualization.trainingSpeed"
            control={control}
            rules={{ required: 'Training speed is required', min: { value: 0.1, message: 'Minimum 0.1' } }}
            render={({ field }) => (
              <input
                type="number"
                step="0.1"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                placeholder="1"
              />
            )}
          />
          {errors.visualization?.trainingSpeed && (
            <span className={styles.error}>{errors.visualization.trainingSpeed.message}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return renderTradingMechanics()
      case 1:
        return renderRewardFunctionSettings()
      case 2:
        return renderPPOHyperParameters()
      case 3:
        return renderLoggingAndCheckpointing()
      case 4:
        return renderDayMasteryMechanism()
      case 5:
        return renderDataAndIndicatorCalculation()
      case 6:
        return renderVisualization()
      default:
        return null
    }
  }

  return (
    <div className={styles.configurationForm}>
      <div className={styles.header}>
        <h2>System Configuration</h2>
        <p>Configure all system parameters for your futures trading system</p>
      </div>

      <div className={styles.sectionNavigation}>
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`${styles.sectionTab} ${activeSection === index ? styles.active : ''}`}
            onClick={() => setActiveSection(index)}
          >
            <span className={styles.sectionIcon}>{section.icon}</span>
            <span className={styles.sectionTitle}>{section.title}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        {renderSection()}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
          >
            ← Back to Data Preview
          </button>

          <div className={styles.navigationButtons}>
            {activeSection > 0 && (
              <button
                type="button"
                className={styles.prevButton}
                onClick={prevSection}
              >
                ← Previous
              </button>
            )}

            {activeSection < sections.length - 1 ? (
              <button
                type="button"
                className={styles.nextButton}
                onClick={nextSection}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!isValid}
              >
                Submit Configuration
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ConfigurationForm
