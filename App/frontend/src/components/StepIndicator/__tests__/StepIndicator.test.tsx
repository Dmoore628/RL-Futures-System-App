import React from 'react'
import { render, screen } from '@testing-library/react'
import StepIndicator from '../StepIndicator'
import { Step } from '../../../types'

const mockSteps: Step[] = [
  {
    id: 1,
    label: 'Step One',
    isCompleted: false,
    isActive: true
  },
  {
    id: 2,
    label: 'Step Two',
    isCompleted: false,
    isActive: false
  },
  {
    id: 3,
    label: 'Step Three',
    isCompleted: false,
    isActive: false
  }
]

describe('StepIndicator Component', () => {
  it('renders all steps', () => {
    render(<StepIndicator steps={mockSteps} />)
    
    expect(screen.getByText('Step One')).toBeInTheDocument()
    expect(screen.getByText('Step Two')).toBeInTheDocument()
    expect(screen.getByText('Step Three')).toBeInTheDocument()
  })

  it('shows correct step numbers', () => {
    render(<StepIndicator steps={mockSteps} />)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('applies active state to current step', () => {
    render(<StepIndicator steps={mockSteps} />)
    
    const stepOne = screen.getByText('Step One').closest('div')
    expect(stepOne).toHaveClass('active')
  })

  it('applies completed state to finished steps', () => {
    const completedSteps: Step[] = [
      { ...mockSteps[0], isCompleted: true, isActive: false },
      { ...mockSteps[1], isCompleted: true, isActive: true },
      { ...mockSteps[2], isCompleted: false, isActive: false }
    ]
    
    render(<StepIndicator steps={completedSteps} />)
    
    const stepOne = screen.getByText('Step One').closest('div')
    const stepTwo = screen.getByText('Step Two').closest('div')
    
    expect(stepOne).toHaveClass('completed')
    expect(stepTwo).toHaveClass('active')
  })

  it('shows progress indicator', () => {
    render(<StepIndicator steps={mockSteps} />)
    
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('handles empty steps array', () => {
    render(<StepIndicator steps={[]} />)
    
    expect(screen.getByText('0 of 0')).toBeInTheDocument()
  })

  it('handles single step', () => {
    const singleStep: Step[] = [
      { id: 1, label: 'Single Step', isCompleted: false, isActive: true }
    ]
    
    render(<StepIndicator steps={singleStep} />)
    
    expect(screen.getByText('Single Step')).toBeInTheDocument()
    expect(screen.getByText('1 of 1')).toBeInTheDocument()
  })

  it('applies proper CSS classes for different states', () => {
    const mixedSteps: Step[] = [
      { id: 1, label: 'Completed', isCompleted: true, isActive: false },
      { id: 2, label: 'Active', isCompleted: false, isActive: true },
      { id: 3, label: 'Pending', isCompleted: false, isActive: false }
    ]
    
    render(<StepIndicator steps={mixedSteps} />)
    
    const completedStep = screen.getByText('Completed').closest('div')
    const activeStep = screen.getByText('Active').closest('div')
    const pendingStep = screen.getByText('Pending').closest('div')
    
    expect(completedStep).toHaveClass('completed')
    expect(activeStep).toHaveClass('active')
    expect(pendingStep).not.toHaveClass('active', 'completed')
  })
})
