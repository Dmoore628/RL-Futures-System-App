import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { FileData, FileValidationResult, ConfigurationForm } from '../../types'
import styles from './FileUpload.module.css'

interface FileUploadProps {
  onFileProcessed: (data: FileData[], validation: FileValidationResult) => void
  onValidationError: (errors: string[]) => void
  configuration?: ConfigurationForm | null
}

interface ParsedRow {
  time?: string
  Time?: string
  date?: string
  Date?: string
  open?: string | number
  Open?: string | number
  open_price?: string | number
  openPrice?: string | number
  high?: string | number
  High?: string | number
  high_price?: string | number
  highPrice?: string | number
  low?: string | number
  Low?: string | number
  low_price?: string | number
  lowPrice?: string | number
  close?: string | number
  Close?: string | number
  close_price?: string | number
  closePrice?: string | number
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onValidationError, configuration }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  // Function to parse data into individual trading days using configuration
  const parseTradingDays = (data: FileData[]): { days: FileData[][], insights: any } => {
    if (!configuration?.dayMastery) {
      return { days: [data], insights: { totalDays: 1, partialDaysDeleted: 0, totalRows: data.length } }
    }

    const { startTime, endTime } = configuration.dayMastery
    const days: FileData[][] = []
    let currentDay: FileData[] = []
    let partialDaysDeleted = 0
    let lastDate = ''

    // Parse time strings to extract date and time
    const parseDateTime = (timeStr: string) => {
      const date = new Date(timeStr)
      return {
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(' ')[0].substring(0, 5)
      }
    }

    // Check if time is within trading hours
    const isWithinTradingHours = (time: string) => {
      return time >= startTime && time <= endTime
    }

    data.forEach((row, index) => {
      const { date, time } = parseDateTime(row.time)
      
      // If this is a new day
      if (date !== lastDate) {
        // Save previous day if it has data
        if (currentDay.length > 0) {
          // Check if previous day is complete (has data within trading hours)
          const hasTradingHoursData = currentDay.some(row => {
            const { time } = parseDateTime(row.time)
            return isWithinTradingHours(time)
          })
          
          if (hasTradingHoursData) {
            days.push([...currentDay])
          } else {
            partialDaysDeleted++
          }
        }
        
        // Start new day
        currentDay = []
        lastDate = date
      }
      
      // Add row to current day
      currentDay.push(row)
    })

    // Handle the last day
    if (currentDay.length > 0) {
      const hasTradingHoursData = currentDay.some(row => {
        const { time } = parseDateTime(row.time)
        return isWithinTradingHours(time)
      })
      
      if (hasTradingHoursData) {
        days.push([...currentDay])
      } else {
        partialDaysDeleted++
      }
    }

    return {
      days,
      insights: {
        totalDays: days.length,
        partialDaysDeleted,
        totalRows: data.length,
        tradingHours: `${startTime} - ${endTime}`
      }
    }
  }

  const validateFileData = (data: ParsedRow[]): FileValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []
    let isValid = true

    if (data.length === 0) {
      errors.push('File contains no data')
      isValid = false
      return { isValid, errors, warnings, rowCount: 0, preview: [] }
    }

    // Check required columns
    const requiredColumns = ['time', 'open', 'high', 'low', 'close']
    const firstRow = data[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`)
      isValid = false
    }

    // Validate data types and OHLC logic
    data.forEach((row, index) => {
      const open = parseFloat(String(row.open || row.Open || row.open_price || row.openPrice || 0))
      const high = parseFloat(String(row.high || row.High || row.high_price || row.highPrice || 0))
      const low = parseFloat(String(row.low || row.Low || row.low_price || row.lowPrice || 0))
      const close = parseFloat(String(row.close || row.Close || row.close_price || row.closePrice || 0))
      
      // Check if values are numeric
      if (isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
        errors.push(`Row ${index + 1}: Non-numeric values found in OHLC data`)
        isValid = false
      }

      // Check OHLC logic
      if (high < low) {
        errors.push(`Row ${index + 1}: High value (${high}) is less than low value (${low})`)
        isValid = false
      }

      if (open < 0 || high < 0 || low < 0 || close < 0) {
        warnings.push(`Row ${index + 1}: Negative values found in OHLC data`)
      }
    })

    const preview = data.slice(0, 10).map(row => ({
      time: row.time || row.Time || row.date || row.Date || '',
      open: parseFloat(String(row.open || row.Open || row.open_price || row.openPrice || 0)),
      high: parseFloat(String(row.high || row.High || row.high_price || row.highPrice || 0)),
      low: parseFloat(String(row.low || row.Low || row.low_price || row.lowPrice || 0)),
      close: parseFloat(String(row.close || row.Close || row.close_price || row.closePrice || 0))
    }))

    return {
      isValid,
      errors,
      warnings,
      rowCount: data.length,
      preview
    }
  }

  const processCSV = async (file: File): Promise<FileData[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
            return
          }
          
          const data = results.data as ParsedRow[]
          resolve(data.map((row: ParsedRow) => ({
            time: row.time || row.Time || row.date || row.Date || '',
            open: parseFloat(String(row.open || row.Open || row.open_price || row.openPrice || 0)),
            high: parseFloat(String(row.high || row.High || row.high_price || row.highPrice || 0)),
            low: parseFloat(String(row.low || row.Low || row.low_price || row.lowPrice || 0)),
            close: parseFloat(String(row.close || row.Close || row.close_price || row.closePrice || 0))
          })))
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`))
        }
      })
    })
  }

  const processExcel = async (file: File): Promise<FileData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ParsedRow[]
          
          const processedData = jsonData.map((row: ParsedRow) => ({
            time: row.time || row.Time || row.date || row.Date || '',
            open: parseFloat(String(row.open || row.Open || row.open_price || row.openPrice || 0)),
            high: parseFloat(String(row.high || row.High || row.high_price || row.highPrice || 0)),
            low: parseFloat(String(row.low || row.Low || row.low_price || row.lowPrice || 0)),
            close: parseFloat(String(row.close || row.Close || row.close_price || row.closePrice || 0))
          }))
          
          resolve(processedData)
        } catch (error) {
          reject(new Error(`Excel parsing failed: ${error}`))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read Excel file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setCurrentFile(file)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      let data: FileData[]
      
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        data = await processCSV(file)
      } else if (file.type.includes('spreadsheet') || file.name.match(/\.(xlsx|xls)$/)) {
        data = await processExcel(file)
      } else {
        throw new Error('Unsupported file type. Please upload a CSV or Excel file.')
      }

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Parse data into trading days using configuration
      const { days, insights } = parseTradingDays(data)
      
      // Validate the data
      const validation = validateFileData(data as unknown as ParsedRow[])
      
      // Add insights to validation result
      const validationWithInsights = {
        ...validation,
        insights
      }
      
      if (validation.isValid) {
        onFileProcessed(data, validationWithInsights)
      } else {
        onValidationError(validation.errors)
      }

    } catch (error) {
      onValidationError([error instanceof Error ? error.message : 'Unknown error occurred'])
    } finally {
      setIsProcessing(false)
      setUploadProgress(0)
      setCurrentFile(null)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    const file = acceptedFiles[0]
    
    // Check file size (1GB limit)
    const maxSize = 1024 * 1024 * 1024 // 1GB
    if (file.size > maxSize) {
      onValidationError(['File size exceeds 1GB limit'])
      return
    }

    processFile(file)
  }, [onValidationError])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: isProcessing
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={styles.fileUpload}>
      <div className={styles.header}>
        <h2>Upload Trading Data</h2>
        <p>Drag and drop your CSV or Excel file here, or click to browse</p>
      </div>

      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${
          isDragActive ? styles.dragActive : ''
        } ${isDragReject ? styles.dragReject : ''} ${
          isProcessing ? styles.processing : ''
        }`}
        data-testid="dropzone"
      >
        <input {...getInputProps()} data-testid="file-input" />
        
        {isProcessing ? (
          <div className={styles.processingContent}>
            <div className={styles.spinner}></div>
            <p>Processing {currentFile?.name}...</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{uploadProgress}%</span>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <div className={styles.uploadIcon}>📁</div>
            <p className={styles.dropText}>
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop a file here, or click to select'}
            </p>
            <p className={styles.fileTypes}>
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
            <p className={styles.fileSize}>
              Maximum file size: 1GB
            </p>
          </div>
        )}
      </div>

      {currentFile && (
        <div className={styles.fileInfo}>
          <h3>File Information</h3>
          <div className={styles.fileDetails}>
            <p><strong>Name:</strong> {currentFile.name}</p>
            <p><strong>Size:</strong> {formatFileSize(currentFile.size)}</p>
            <p><strong>Type:</strong> {currentFile.type || 'Unknown'}</p>
            <p><strong>Last Modified:</strong> {new Date(currentFile.lastModified).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
