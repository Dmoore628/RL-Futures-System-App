import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUpload from '../FileUpload'
import { FileData, FileValidationResult } from '../../../types'

// Mock the file parsing libraries
jest.mock('papaparse', () => ({
  parse: jest.fn()
}))

jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}))

const mockOnFileProcessed = jest.fn()
const mockOnValidationError = jest.fn()

const defaultProps = {
  onFileProcessed: mockOnFileProcessed,
  onValidationError: mockOnValidationError
}

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders file upload area', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
    expect(screen.getByText(/or click to select/i)).toBeInTheDocument()
  })

  it('accepts CSV and Excel files', () => {
    render(<FileUpload {...defaultProps} />)
    
    const fileInput = screen.getByTestId('file-input')
    expect(fileInput).toHaveAttribute('accept', '.csv,.xlsx,.xls')
  })

  it('shows upload progress when processing', async () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.csv', { type: 'text/csv' })
    const fileInput = screen.getByTestId('file-input')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument()
    })
  })

  it('handles CSV file upload successfully', async () => {
    const mockCsvData = [
      { time: '09:30', open: 100, high: 105, low: 98, close: 103 },
      { time: '09:31', open: 103, high: 107, low: 102, close: 106 }
    ]
    
    const mockValidation: FileValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      rowCount: 2,
      preview: mockCsvData as FileData[]
    }
    
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.csv', { type: 'text/csv' })
    const fileInput = screen.getByTestId('file-input')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(mockOnFileProcessed).toHaveBeenCalledWith(mockCsvData, mockValidation)
    })
  })

  it('handles validation errors', async () => {
    const mockErrors = ['Missing required columns: time, open, high, low, close']
    
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['invalid'], 'invalid.csv', { type: 'text/csv' })
    const fileInput = screen.getByTestId('file-input')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(mockOnValidationError).toHaveBeenCalledWith(mockErrors)
    })
  })

  it('validates OHLC data logic', async () => {
    const mockInvalidData = [
      { time: '09:30', open: 100, high: 95, low: 98, close: 103 } // high < low
    ]
    
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['invalid'], 'invalid.csv', { type: 'text/csv' })
    const fileInput = screen.getByTestId('file-input')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(mockOnValidationError).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining('High value (95) is less than low value (98)')
        ])
      )
    })
  })

  it('handles empty file upload', async () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File([''], 'empty.csv', { type: 'text/csv' })
    const fileInput = screen.getByTestId('file-input')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(mockOnValidationError).toHaveBeenCalledWith(
        expect.arrayContaining(['File contains no data'])
      )
    })
  })

  it('supports drag and drop functionality', async () => {
    render(<FileUpload {...defaultProps} />)
    
    const dropZone = screen.getByTestId('dropzone')
    const file = new File(['test'], 'test.csv', { type: 'text/csv' })
    
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file]
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument()
    })
  })

  it('shows file type validation', async () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByTestId('file-input')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(mockOnValidationError).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining('Invalid file type')
        ])
      )
    })
  })
})
