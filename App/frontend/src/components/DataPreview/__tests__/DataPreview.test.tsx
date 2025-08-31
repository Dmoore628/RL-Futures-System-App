import React from 'react'
import { render, screen } from '@testing-library/react'
import DataPreview from '../DataPreview'
import { FileData } from '../../../types'

const mockData: FileData[] = [
  { time: '09:30', open: 100.50, high: 105.25, low: 98.75, close: 103.00 },
  { time: '09:31', open: 103.00, high: 107.50, low: 102.25, close: 106.75 },
  { time: '09:32', open: 106.75, high: 108.00, low: 104.50, close: 107.25 },
  { time: '09:33', open: 107.25, high: 109.75, low: 106.00, close: 108.50 },
  { time: '09:34', open: 108.50, high: 110.25, low: 107.75, close: 109.00 }
]

const mockValidation = {
  isValid: true,
  errors: [],
  warnings: ['Row 3: High value (108.00) is close to low value (104.50)'],
  rowCount: 5,
  preview: mockData
}

describe('DataPreview Component', () => {
  it('renders data preview title', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    expect(screen.getByText('Data Preview')).toBeInTheDocument()
  })

  it('shows total row count', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    expect(screen.getByText(/Total Rows: 5/)).toBeInTheDocument()
  })

  it('displays data table with headers', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('shows preview data rows', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    expect(screen.getByText('09:30')).toBeInTheDocument()
    expect(screen.getByText('100.50')).toBeInTheDocument()
    expect(screen.getByText('105.25')).toBeInTheDocument()
    expect(screen.getByText('98.75')).toBeInTheDocument()
    expect(screen.getByText('103.00')).toBeInTheDocument()
  })

  it('displays validation status', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    expect(screen.getByText('✅ Data is valid')).toBeInTheDocument()
  })

  it('shows warnings when present', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    expect(screen.getByText('⚠️ Warnings')).toBeInTheDocument()
    expect(screen.getByText(/Row 3: High value \(108.00\) is close to low value \(104.50\)/)).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    const emptyData: FileData[] = []
    const emptyValidation = {
      isValid: false,
      errors: ['No data provided'],
      warnings: [],
      rowCount: 0,
      preview: []
    }
    
    render(<DataPreview data={emptyData} validation={emptyValidation} />)
    
    expect(screen.getByText('❌ Data validation failed')).toBeInTheDocument()
    expect(screen.getByText('No data provided')).toBeInTheDocument()
  })

  it('shows validation errors when present', () => {
    const invalidValidation = {
      isValid: false,
      errors: ['Missing required columns: time, open, high, low, close'],
      warnings: [],
      rowCount: 0,
      preview: []
    }
    
    render(<DataPreview data={mockData} validation={invalidValidation} />)
    
    expect(screen.getByText('❌ Data validation failed')).toBeInTheDocument()
    expect(screen.getByText('Missing required columns: time, open, high, low, close')).toBeInTheDocument()
  })

  it('formats numbers correctly', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    // Check that decimal numbers are displayed properly
    expect(screen.getByText('100.50')).toBeInTheDocument()
    expect(screen.getByText('105.25')).toBeInTheDocument()
  })

  it('limits preview to first 10 rows', () => {
    const largeData: FileData[] = Array.from({ length: 15 }, (_, i) => ({
      time: `09:${30 + i}`,
      open: 100 + i,
      high: 105 + i,
      low: 98 + i,
      close: 103 + i
    }))
    
    const largeValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      rowCount: 15,
      preview: largeData.slice(0, 10)
    }
    
    render(<DataPreview data={largeData} validation={largeValidation} />)
    
    expect(screen.getByText(/Total Rows: 15/)).toBeInTheDocument()
    expect(screen.getByText('09:39')).toBeInTheDocument() // 10th row
    expect(screen.queryByText('09:44')).not.toBeInTheDocument() // 15th row (should not show)
  })

  it('applies proper CSS classes for validation states', () => {
    render(<DataPreview data={mockData} validation={mockValidation} />)
    
    const container = screen.getByTestId('data-preview')
    expect(container).toHaveClass('dataPreview')
  })
})
