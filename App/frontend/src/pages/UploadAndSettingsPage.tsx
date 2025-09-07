import React, { useState } from 'react'
import { Step, FileData, FileValidationResult, ConfigurationForm as ConfigurationFormType } from '../types'
import StepIndicator from '../components/StepIndicator'
import FileUpload from '../components/FileUpload'
import DataPreview from '../components/DataPreview'
import ConfigurationForm from '../components/ConfigurationForm'
import ConfigurationSummary from '../components/ConfigurationSummary'
import ErrorBoundary from '../components/ErrorBoundary'
import styles from './UploadAndSettingsPage.module.css'

const UploadAndSettingsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedData, setUploadedData] = useState<FileData[]>([])
  const [validation, setValidation] = useState<FileValidationResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [configuration, setConfiguration] = useState<ConfigurationFormType | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showConfigurationForm, setShowConfigurationForm] = useState(true) // Start with configuration form

  const steps: Step[] = [
    {
      id: 1,
      label: 'Configure System',
      isCompleted: !!configuration,
      isActive: currentStep === 1
    },
    {
      id: 2,
      label: 'Upload Data',
      isCompleted: !!(uploadedData.length > 0 && validation?.isValid),
      isActive: currentStep === 2
    }
  ]

  const handleFileProcessed = (data: FileData[], fileValidation: FileValidationResult) => {
    setUploadedData(data)
    setValidation(fileValidation)
    setErrors([])
    // Stay on step 2 (Upload Data) - this is the final step
  }

  const handleValidationError = (validationErrors: string[]) => {
    setErrors(validationErrors)
    setUploadedData([])
    setValidation(null)
  }


  const handleConfigurationSubmit = (configData: ConfigurationFormType) => {
    setConfiguration(configData)
    setShowSummary(true)
    // Stay on step 1 to show summary first
  }

  const handleBackToConfig = () => {
    setCurrentStep(1)
    setUploadedData([])
    setValidation(null)
    setErrors([])
    setConfiguration(null)
    setShowSummary(false)
    setShowConfigurationForm(true)
  }

  const handleBackToConfigForm = () => {
    setShowSummary(false)
    setShowConfigurationForm(true)
  }

  const handleConfirmConfiguration = () => {
    // Move to Upload Data step
    setCurrentStep(2)
  }

  const handleFinalSubmit = () => {
    // Here you would typically send the configuration and data to the backend
    console.log('Configuration confirmed:', configuration)
    console.log('Uploaded data:', uploadedData)
    
    // For now, just show a success message
    alert('Configuration saved successfully! Your futures trading system is ready to start training.')
  }

  return (
    <div className={styles.container}>
      <StepIndicator steps={steps} />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Settings & Data Upload Configuration</h1>
          <p className={styles.subtitle}>
            Configure the system parameters and upload your futures trading data
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
                onClick={handleBackToConfig}
              >
                Try Again
              </button>
            </div>
          )}

          {currentStep === 1 && !showSummary && showConfigurationForm && (
            <ErrorBoundary>
              <ConfigurationForm
                onSubmit={handleConfigurationSubmit}
                onBack={() => {}} // No back button on first step
              />
            </ErrorBoundary>
          )}

          {currentStep === 1 && showSummary && configuration && (
            <ErrorBoundary>
              <ConfigurationSummary
                configuration={configuration}
                onEdit={handleBackToConfigForm}
                onConfirm={() => setCurrentStep(2)} // Move to Upload Data step
              />
            </ErrorBoundary>
          )}

          {currentStep === 2 && (
            <ErrorBoundary>
              <FileUpload
                onFileProcessed={handleFileProcessed}
                onValidationError={handleValidationError}
                configuration={configuration}
              />
            </ErrorBoundary>
          )}

          {currentStep === 2 && validation && (
            <ErrorBoundary>
              <DataPreview
                data={uploadedData}
                validation={validation}
                onContinue={handleFinalSubmit}
              />
              
              <div className={styles.navigationButtons}>
                <button 
                  className={styles.backButton}
                  onClick={handleBackToConfig}
                >
                  ← Back to Configuration
                </button>
              </div>
            </ErrorBoundary>
          )}
        </div>
      </main>
    </div>
  )
}

export default UploadAndSettingsPage
