import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant by default', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('primary')
  })

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('secondary')
  })

  it('applies outline variant when specified', () => {
    render(<Button variant="outline">Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('outline')
  })

  it('applies size classes correctly', () => {
    render(<Button size="large">Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('large')
  })

  it('applies disabled state', () => {
    render(<Button disabled>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not trigger click when disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('applies full width when specified', () => {
    render(<Button fullWidth>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('fullWidth')
  })

  it('renders as different HTML elements', () => {
    render(<Button as="a" href="/test">Link Button</Button>)
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toHaveAttribute('href', '/test')
  })

  it('applies loading state', () => {
    render(<Button loading>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('loading')
    expect(button).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading>Click me</Button>)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('combines multiple props correctly', () => {
    render(
      <Button 
        variant="secondary" 
        size="small" 
        fullWidth 
        className="custom-class"
      >
        Click me
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('secondary', 'small', 'fullWidth', 'custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Click me</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
