/**
 * InteractiveTimeline Component
 * 
 * Interactive timeline component for showcasing the RL trading system workflow.
 * Features horizontal timeline with step-by-step progression, hover interactions,
 * and smooth animations that guide users through the complete process.
 * 
 * @component
 * @returns {JSX.Element} The InteractiveTimeline component
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useScrollAnimation, useScrollProgress, useIntersectionObserver } from '../../hooks/useScrollAnimation'
import { Section, Container } from '../Layout/ModernLayout'
import styles from './InteractiveTimeline.module.css'

interface TimelineStep {
  id: string
  title: string
  description: string
  details: string[]
  icon: string
  status: 'completed' | 'current' | 'upcoming'
  duration?: string
  prerequisites?: string[]
}

interface InteractiveTimelineProps {
  steps: TimelineStep[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
  showProgress?: boolean
  interactive?: boolean
  animationDelay?: number
}

const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  steps,
  className = '',
  orientation = 'horizontal',
  showProgress = true,
  interactive = true,
  animationDelay = 0
}) => {
  // State management
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [stepStates, setStepStates] = useState<Record<string, boolean>>({})

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Hooks
  const { scrollPosition } = useScrollAnimation()
  const { progress: scrollProgress } = useScrollProgress(timelineRef)
  const { elementRef, isVisible: intersectionVisible } = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px',
    triggerOnce: true,
    delay: animationDelay
  })

  // Combine refs
  useEffect(() => {
    if (timelineRef.current) {
      elementRef.current = timelineRef.current
    }
  }, [elementRef])

  // Handle intersection visibility
  useEffect(() => {
    if (intersectionVisible) {
      setIsVisible(true)
    }
  }, [intersectionVisible])

  // Animate steps on visibility
  useEffect(() => {
    if (isVisible) {
      const animateSteps = () => {
        steps.forEach((step, index) => {
          setTimeout(() => {
            setStepStates(prev => ({
              ...prev,
              [step.id]: true
            }))
          }, index * 200)
        })
      }

      const timer = setTimeout(animateSteps, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, steps])

  // Update animation progress
  useEffect(() => {
    if (isVisible) {
      const startTime = Date.now()
      const duration = 2000
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        setAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [isVisible])

  // Handle step click
  const handleStepClick = useCallback((stepId: string) => {
    if (!interactive) return
    
    setActiveStep(prev => prev === stepId ? null : stepId)
  }, [interactive])

  // Handle step hover
  const handleStepHover = useCallback((stepId: string) => {
    if (!interactive) return
    
    setHoveredStep(stepId)
  }, [interactive])

  // Handle step leave
  const handleStepLeave = useCallback(() => {
    if (!interactive) return
    
    setHoveredStep(null)
  }, [interactive])

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!isVisible) return 0
    return Math.min(animationProgress * 100, 100)
  }

  // Get step status
  const getStepStatus = (step: TimelineStep, index: number) => {
    if (step.status === 'completed') return 'completed'
    if (step.status === 'current') return 'current'
    if (index < Math.floor(animationProgress * steps.length)) return 'completed'
    if (index === Math.floor(animationProgress * steps.length)) return 'current'
    return 'upcoming'
  }

  // Render timeline step
  const renderStep = (step: TimelineStep, index: number) => {
    const isActive = activeStep === step.id
    const isHovered = hoveredStep === step.id
    const isVisible = stepStates[step.id] || false
    const status = getStepStatus(step, index)
    const isInteractive = interactive && status !== 'upcoming'

    return (
      <div
        key={step.id}
        ref={el => stepRefs.current[step.id] = el}
        className={`
          ${styles.timelineStep}
          ${styles[`step-${status}`]}
          ${isActive ? styles.stepActive : ''}
          ${isHovered ? styles.stepHovered : ''}
          ${isVisible ? styles.stepVisible : styles.stepHidden}
          ${isInteractive ? styles.stepInteractive : ''}
        `.trim()}
        onClick={() => handleStepClick(step.id)}
        onMouseEnter={() => handleStepHover(step.id)}
        onMouseLeave={handleStepLeave}
        data-step-id={step.id}
        data-status={status}
        data-index={index}
        style={{
          '--step-delay': `${index * 200}ms`,
          '--step-progress': animationProgress
        } as React.CSSProperties}
      >
        {/* Step connector */}
        {index < steps.length - 1 && (
          <div className={styles.stepConnector} />
        )}

        {/* Step content */}
        <div className={styles.stepContent}>
          {/* Step icon */}
          <div className={styles.stepIcon}>
            <div className={styles.iconContainer}>
              <span className={styles.iconText}>{step.icon}</span>
              {status === 'completed' && (
                <div className={styles.completedCheckmark}>✓</div>
              )}
            </div>
          </div>

          {/* Step information */}
          <div className={styles.stepInfo}>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
            {step.duration && (
              <span className={styles.stepDuration}>{step.duration}</span>
            )}
          </div>

          {/* Step details (expandable) */}
          {isActive && (
            <div className={styles.stepDetails}>
              <div className={styles.detailsContent}>
                <h4 className={styles.detailsTitle}>Process Details</h4>
                <ul className={styles.detailsList}>
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className={styles.detailItem}>
                      {detail}
                    </li>
                  ))}
                </ul>
                {step.prerequisites && step.prerequisites.length > 0 && (
                  <div className={styles.prerequisites}>
                    <h5 className={styles.prerequisitesTitle}>Prerequisites</h5>
                    <ul className={styles.prerequisitesList}>
                      {step.prerequisites.map((prereq, prereqIndex) => (
                        <li key={prereqIndex} className={styles.prerequisiteItem}>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Section
      ref={timelineRef}
      height="auto"
      background="secondary"
      padding="xl"
      className={`
        ${styles.interactiveTimeline}
        ${styles[`timeline-${orientation}`]}
        ${className}
      `.trim()}
      data-visible={isVisible}
      data-progress={scrollProgress}
    >
      <Container size="2xl">
        {/* Timeline header */}
        <div className={styles.timelineHeader}>
          <h2 className={styles.timelineTitle}>System Workflow</h2>
          <p className={styles.timelineSubtitle}>
            Follow the complete process from data input to live trading
          </p>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                ref={progressRef}
                className={styles.progressFill}
                style={{
                  width: `${getProgressPercentage()}%`,
                  '--progress-percentage': `${getProgressPercentage()}%`
                } as React.CSSProperties}
              />
            </div>
            <div className={styles.progressLabel}>
              {Math.round(getProgressPercentage())}% Complete
            </div>
          </div>
        )}

        {/* Timeline steps */}
        <div className={styles.timelineSteps}>
          {steps.map((step, index) => renderStep(step, index))}
        </div>

        {/* Timeline summary */}
        <div className={styles.timelineSummary}>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{steps.length}</span>
              <span className={styles.statLabel}>Total Steps</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {steps.filter(step => step.status === 'completed').length}
              </span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {steps.filter(step => step.status === 'current').length}
              </span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default InteractiveTimeline
