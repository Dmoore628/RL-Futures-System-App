import React, { forwardRef } from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
  as?: 'button' | 'a'
  href?: string
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  as = 'button',
  href,
  ...props
}, ref) => {
  const baseClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  if (as === 'a' && href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={baseClasses}
        href={href}
        {...props}
      >
        {loading && <span data-testid="loading-spinner" className={styles.spinner} />}
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span data-testid="loading-spinner" className={styles.spinner} />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
