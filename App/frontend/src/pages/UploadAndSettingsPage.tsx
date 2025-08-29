import React, { useState } from 'react'
import { Step, FileData, FileValidationResult } from '../types'
import StepIndicator from '../components/StepIndicator'
import FileUpload from '../components/FileUpload'
import DataPreview from '../components/DataPreview'
import styles from './UploadAndSettingsPage.module.css'

const UploadAndSettingsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedData, setUploadedData] = useState<FileData[]>([])
  const [validation, setValidation] = useState<FileValidationResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const steps: Step[] = [
    {
      id: 1,
      label: 'Upload Data',
      isCompleted: uploadedData.length > 0 && validation?.isValid,
      isActive: currentStep === 1
    },
    {
      id: 2,
      label: 'Configure System',
      isCompleted: false,
      isActive: currentStep === 2
    }
  ]

  const handleFileProcessed = (data: FileData[], fileValidation: FileValidationResult) => {
    setUploadedData(data)
    setValidation(fileValidation)
    setErrors([])
    setCurrentStep(2)
  }

  const handleValidationError = (validationErrors: string[]) => {
    setErrors(validationErrors)
    setUploadedData([])
    setValidation(null)
  }

  const handleContinueToConfig = () => {
    // This will be implemented in Phase 3
    console.log('Moving to configuration step...')
  }

  const handleBackToUpload = () => {
    setCurrentStep(1)
    setUploadedData([])
    setValidation(null)
    setErrors([])
  }

  return (
    <div className={styles.container}>
      <StepIndicator steps={steps} />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Upload & Settings Configuration</h1>
          <p className={styles.subtitle}>
            Upload your futures trading data and configure the system parameters
          </p>
          
          {errors.length > 0 && (
            <div className={styles.errorContainer}>
              <h3>Upload Errors</h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index} className={styles.errorItem}>
                    {error}
                  </li>
                ))}
              </ul>
              <button 
                className={styles.retryButton}
                onClick={handleBackToUpload}
              >
                Try Again
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <FileUpload
              onFileProcessed={handleFileProcessed}
              onValidationError={handleValidationError}
            />
          )}

          {currentStep === 2 && validation && (
            <>
              <DataPreview
                data={uploadedData}
                validation={validation}
                onContinue={handleContinueToConfig}
              />
              
              <div className={styles.navigationButtons}>
                <button 
                  className={styles.backButton}
                  onClick={handleBackToUpload}
                >
                  ← Back to Upload
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && !validation && (
            <div className={styles.placeholder}>
              <h2>Configuration Coming Soon</h2>
              <p>System configuration form will be implemented in the next phase.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default UploadAndSettingsPage
