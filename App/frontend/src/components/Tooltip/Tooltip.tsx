import React, { useState } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  maxWidth?: string
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  maxWidth = '300px'
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`${styles.tooltip} ${styles[position]}`}
          style={{ maxWidth }}
        >
          {content}
          <div className={`${styles.arrow} ${styles[`arrow-${position}`]}`} />
        </div>
      )}
    </div>
  )
}

export default Tooltip
