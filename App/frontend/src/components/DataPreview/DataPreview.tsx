import React from 'react'
import { FileData, FileValidationResult } from '../../types'
import styles from './DataPreview.module.css'

interface DataPreviewProps {
  data: FileData[]
  validation: FileValidationResult
  onContinue: () => void
}

const DataPreview: React.FC<DataPreviewProps> = ({ validation, onContinue }) => {
  const formatNumber = (num: number): string => {
    return num.toFixed(4)
  }

  const formatTime = (time: string): string => {
    if (!time) return 'N/A'
    // Try to parse and format the time string
    try {
      const date = new Date(time)
      if (!isNaN(date.getTime())) {
        return date.toLocaleString()
      }
    } catch {
      // If parsing fails, return as is
    }
    return time
  }

  return (
    <div className={styles.dataPreview} data-testid="data-preview">
      <div className={styles.header}>
        <h3>Data Preview</h3>
        <div className={styles.summary}>
          <span className={styles.rowCount}>
            📊 {validation.rowCount.toLocaleString()} rows loaded
          </span>
          {validation.warnings.length > 0 && (
            <span className={styles.warningCount}>
              ⚠️ {validation.warnings.length} warnings
            </span>
          )}
        </div>
      </div>

      {validation.warnings.length > 0 && (
        <div className={styles.warnings}>
          <h4>Warnings</h4>
          <ul>
            {validation.warnings.map((warning, index) => (
              <li key={index} className={styles.warning}>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.previewTable}>
          <thead>
            <tr>
              <th>Row</th>
              <th>Time</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody>
            {validation.preview.map((row, index) => (
              <tr key={index} className={styles.dataRow}>
                <td className={styles.rowNumber}>{index + 1}</td>
                <td className={styles.timeCell}>{formatTime(row.time)}</td>
                <td className={styles.priceCell}>{formatNumber(row.open)}</td>
                <td className={styles.priceCell}>{formatNumber(row.high)}</td>
                <td className={styles.priceCell}>{formatNumber(row.low)}</td>
                <td className={styles.priceCell}>{formatNumber(row.close)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p className={styles.note}>
          Showing first 10 rows of {validation.rowCount.toLocaleString()} total rows
        </p>
        <button 
          className={styles.continueButton}
          onClick={onContinue}
        >
          Continue to Configuration
        </button>
      </div>
    </div>
  )
}

export default DataPreview
