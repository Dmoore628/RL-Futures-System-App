import React, { useState } from 'react'
import { Step, FileData, FileValidationResult, ConfigurationForm as ConfigurationFormType } from '../types'
import StepIndicator from '../components/StepIndicator'
import FileUpload from '../components/FileUpload'
import DataPreview from '../components/DataPreview'
import ConfigurationForm from '../components/ConfigurationForm'
import ConfigurationSummary from '../components/ConfigurationSummary'
import styles from './UploadAndSettingsPage.module.css'

const UploadAndSettingsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedData, setUploadedData] = useState<FileData[]>([])
  const [validation, setValidation] = useState<FileValidationResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [configuration, setConfiguration] = useState<ConfigurationFormType | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showConfigurationForm, setShowConfigurationForm] = useState(false)

  const steps: Step[] = [
    {
      id: 1,
      label: 'Upload Data',
      isCompleted: !!(uploadedData.length > 0 && validation?.isValid),
      isActive: currentStep === 1
    },
    {
      id: 2,
      label: 'Configure System',
      isCompleted: !!configuration,
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
    // This will show the configuration form
    setShowSummary(false)
    setShowConfigurationForm(true)
  }

  const handleConfigurationSubmit = (configData: ConfigurationFormType) => {
    setConfiguration(configData)
    setShowSummary(true)
  }

  const handleBackToUpload = () => {
    setCurrentStep(1)
    setUploadedData([])
    setValidation(null)
    setErrors([])
    setConfiguration(null)
    setShowSummary(false)
    setShowConfigurationForm(false)
  }

  const handleBackToConfig = () => {
    setShowSummary(false)
  }

  const handleConfirmConfiguration = () => {
    // Here you would typically send the configuration to the backend
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

          {currentStep === 2 && validation && !showSummary && !showConfigurationForm && (
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

          {currentStep === 2 && !showSummary && showConfigurationForm && (
            <ConfigurationForm
              onSubmit={handleConfigurationSubmit}
              onBack={handleBackToUpload}
            />
          )}

          {currentStep === 2 && showSummary && configuration && (
            <ConfigurationSummary
              configuration={configuration}
              onEdit={handleBackToConfig}
              onConfirm={handleConfirmConfiguration}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default UploadAndSettingsPage
