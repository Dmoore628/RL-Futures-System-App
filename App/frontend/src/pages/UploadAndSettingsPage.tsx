import React, { useState } from 'react'
import { Step } from '../types'
import StepIndicator from '../components/StepIndicator'
import styles from './UploadAndSettingsPage.module.css'

const UploadAndSettingsPage: React.FC = () => {
  const [currentStep] = useState(1)

  const steps: Step[] = [
    {
      id: 1,
      label: 'Upload Data',
      isCompleted: false,
      isActive: currentStep === 1
    },
    {
      id: 2,
      label: 'Configure System',
      isCompleted: false,
      isActive: currentStep === 2
    }
  ]

  return (
    <div className={styles.container}>
      <StepIndicator steps={steps} />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Upload & Settings Configuration</h1>
          <p className={styles.subtitle}>
            Upload your futures trading data and configure the system parameters
          </p>
          
          {/* Placeholder for FileUpload and SettingsForm components */}
          <div className={styles.placeholder}>
            <h2>Components Coming Soon</h2>
            <p>File Upload and Settings Form components will be implemented in the next phase.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UploadAndSettingsPage
