import React from 'react'
import { ConfigurationForm } from '../../types'
import styles from './ConfigurationSummary.module.css'

interface ConfigurationSummaryProps {
  configuration: ConfigurationForm
  onEdit: () => void
  onConfirm: () => void
}

const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = ({ 
  configuration, 
  onEdit, 
  onConfirm 
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`
  }

  const formatTime = (time: string): string => {
    return time
  }

  return (
    <div className={styles.configurationSummary}>
      <div className={styles.header}>
        <h2>Configuration Summary</h2>
        <p>Review your system configuration before proceeding</p>
      </div>

      <div className={styles.summaryGrid}>
        {/* Trading & Market Mechanics */}
        <div className={styles.summarySection}>
          <h3>💰 Trading & Market Mechanics</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Initial Balance:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.initialBalance)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Daily Profit Target:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.dailyProfitTarget)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Daily Max Loss Limit:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.dailyMaxLossLimit)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Commissions:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.commissions)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Margin Required Per Contract:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.marginRequiredPerContract)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Slippage:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.slippage)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Contract Value:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.contractValue)}/tick</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Equity Reserve:</span>
              <span className={styles.value}>{formatCurrency(configuration.tradingMechanics.equityReserve)}</span>
            </div>
          </div>
        </div>

        {/* Reward Function Settings */}
        <div className={styles.summarySection}>
          <h3>🎯 Reward Function Settings</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Profit Target Bonus:</span>
              <span className={styles.value}>{configuration.rewardFunction.profitTargetBonus}x</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Bankruptcy Penalty:</span>
              <span className={styles.value}>{configuration.rewardFunction.bankruptcyPenalty}x</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Consecutive Winning Trades Bonus:</span>
              <span className={styles.value}>+{configuration.rewardFunction.consecutiveWinningTradesBonus}</span>
            </div>
          </div>
        </div>

        {/* PPO Hyper Parameters */}
        <div className={styles.summarySection}>
          <h3>🧠 PPO Hyper Parameters</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Learning Rate:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.learningRate}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>n_steps:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.nSteps.toLocaleString()}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Batch Size:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.batchSize}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Gamma:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.gamma}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>GAE Lambda:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.gaeLambda}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Clip Range:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.clipRange}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Ent Coef:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.entCoef}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>VF Coef:</span>
              <span className={styles.value}>{configuration.ppoHyperParams.vfCoef}</span>
            </div>
          </div>
        </div>

        {/* Logging & Checkpointing */}
        <div className={styles.summarySection}>
          <h3>📊 Logging & Checkpointing</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Experiment Name:</span>
              <span className={styles.value}>{configuration.loggingCheckpointing.experimentName}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Checkpoint Frequency:</span>
              <span className={styles.value}>{configuration.loggingCheckpointing.checkpointFrequency.toLocaleString()} episodes</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Evaluation Frequency:</span>
              <span className={styles.value}>{configuration.loggingCheckpointing.evaluationFrequency.toLocaleString()} episodes</span>
            </div>
          </div>
        </div>

        {/* Day Mastery Mechanism */}
        <div className={styles.summarySection}>
          <h3>⏰ Day Mastery Mechanism</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Minimum Episodes to Run:</span>
              <span className={styles.value}>{configuration.dayMastery.minEpisodesToRun.toLocaleString()}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Required Success Rate:</span>
              <span className={styles.value}>{formatPercentage(configuration.dayMastery.requiredSuccessRate)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Performance Plateau Episodes:</span>
              <span className={styles.value}>{configuration.dayMastery.performancePlateauEpisodes.toLocaleString()}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Trading Hours:</span>
              <span className={styles.value}>{formatTime(configuration.dayMastery.startTime)} - {formatTime(configuration.dayMastery.endTime)}</span>
            </div>
          </div>
        </div>

        {/* Data & Indicator Calculation */}
        <div className={styles.summarySection}>
          <h3>📈 Data & Indicator Calculation</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Observation History Length:</span>
              <span className={styles.value}>{configuration.dataIndicators.observationHistoryLength}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>EMA 1 Period:</span>
              <span className={styles.value}>{configuration.dataIndicators.ema1Period}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>EMA 2 Period:</span>
              <span className={styles.value}>{configuration.dataIndicators.ema2Period}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Bollinger Bands Period:</span>
              <span className={styles.value}>{configuration.dataIndicators.bollingerBandsPeriod}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>ATR Period:</span>
              <span className={styles.value}>{configuration.dataIndicators.atrPeriod}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>MACD Period:</span>
              <span className={styles.value}>{configuration.dataIndicators.macdPeriod}</span>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className={styles.summarySection}>
          <h3>🎨 Visualization</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Rendering Mode:</span>
              <span className={styles.value}>{configuration.visualization.renderingMode}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Rate of Speed:</span>
              <span className={styles.value}>{configuration.visualization.rateOfSpeed}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Fixed Window:</span>
              <span className={styles.value}>{configuration.visualization.fixedWindow}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Candle Width Factor:</span>
              <span className={styles.value}>{configuration.visualization.candleWidthFactor}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Training Speed:</span>
              <span className={styles.value}>{configuration.visualization.trainingSpeed}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          type="button"
          className={styles.editButton}
          onClick={onEdit}
        >
          Edit Configuration
        </button>
        
        <button 
          type="button"
          className={styles.confirmButton}
          onClick={onConfirm}
        >
          Confirm & Start Training
        </button>
      </div>
    </div>
  )
}

export default ConfigurationSummary
