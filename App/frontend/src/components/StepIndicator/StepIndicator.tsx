import React from 'react'
import { Step } from '../../types'
import styles from './StepIndicator.module.css'

interface StepIndicatorProps {
  steps: Step[]
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className={styles.stepIndicator}>
      <div className={styles.container}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.stepWrapper}>
            <div className={styles.step}>
              <div
                className={`${styles.stepNumber} ${
                  step.isCompleted ? styles.completed : ''
                } ${step.isActive ? styles.active : ''}`}
              >
                {step.isCompleted ? '✓' : step.id}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`${styles.connector} ${
                  step.isCompleted ? styles.completed : ''
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepIndicator
