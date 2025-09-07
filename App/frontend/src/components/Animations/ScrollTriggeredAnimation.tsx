/**
 * ScrollTriggeredAnimation Component
 * 
 * Advanced scroll-triggered animation component with sophisticated
 * intersection observer integration and smooth animation transitions.
 * Supports multiple animation types and timing configurations.
 * 
 * @component
 * @returns {JSX.Element} The ScrollTriggeredAnimation component
 */

import React, { useRef, useEffect, useState } from 'react'
import { useIntersectionObserver, useStaggeredAnimation } from '../../hooks/useScrollAnimation'
import styles from './ScrollTriggeredAnimation.module.css'

interface ScrollTriggeredAnimationProps {
  children: React.ReactNode
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' | 'flip'
  delay?: number
  duration?: number
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  stagger?: boolean
  staggerDelay?: number
  className?: string
  style?: React.CSSProperties
}

const ScrollTriggeredAnimation: React.FC<ScrollTriggeredAnimationProps> = ({
  children,
  animation = 'fade',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  rootMargin = '0px 0px -10% 0px',
  triggerOnce = true,
  stagger = false,
  staggerDelay = 100,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)

  const { elementRef, isVisible: intersectionVisible, hasAnimated: intersectionAnimated } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
    delay
  })

  // Staggered animation for multiple children
  const childrenArray = React.Children.toArray(children)
  const { visibleItems, triggerStaggeredAnimation, resetAnimation } = useStaggeredAnimation(
    childrenArray.length,
    staggerDelay,
    delay
  )

  // Combine refs
  useEffect(() => {
    if (containerRef.current) {
      elementRef.current = containerRef.current
    }
  }, [elementRef])

  // Handle intersection changes
  useEffect(() => {
    if (intersectionVisible) {
      setIsVisible(true)
      if (stagger) {
        triggerStaggeredAnimation()
      }
    } else if (!triggerOnce) {
      setIsVisible(false)
      if (stagger) {
        resetAnimation()
      }
    }
  }, [intersectionVisible, stagger, triggerStaggeredAnimation, resetAnimation, triggerOnce])

  // Update animation state
  useEffect(() => {
    if (intersectionAnimated) {
      setHasAnimated(true)
    }
  }, [intersectionAnimated])

  // Calculate animation progress
  useEffect(() => {
    if (isVisible && !hasAnimated) {
      const startTime = Date.now()
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
  }, [isVisible, hasAnimated, duration])

  // Get animation class based on state
  const getAnimationClass = () => {
    if (!isVisible) return styles.hidden
    if (hasAnimated) return styles.animated
    return styles.entering
  }

  // Get specific animation class
  const getSpecificAnimationClass = () => {
    return styles[`animation-${animation}`]
  }

  // Render children with staggered animation
  const renderChildren = () => {
    if (!stagger) {
      return children
    }

    return childrenArray.map((child, index) => {
      const isItemVisible = visibleItems[index] || false
      return (
        <div
          key={index}
          className={`
            ${styles.staggerItem}
            ${isItemVisible ? styles.staggerVisible : styles.staggerHidden}
          `.trim()}
          style={{
            '--stagger-delay': `${index * staggerDelay}ms`,
            '--animation-duration': `${duration}ms`
          } as React.CSSProperties}
        >
          {child}
        </div>
      )
    })
  }

  return (
    <div
      ref={containerRef}
      className={`
        ${styles.scrollTriggeredAnimation}
        ${getAnimationClass()}
        ${getSpecificAnimationClass()}
        ${className}
      `.trim()}
      style={{
        '--animation-delay': `${delay}ms`,
        '--animation-duration': `${duration}ms`,
        '--animation-progress': animationProgress,
        ...style
      } as React.CSSProperties}
      data-animation={animation}
      data-visible={isVisible}
      data-animated={hasAnimated}
      data-progress={animationProgress}
    >
      {renderChildren()}
    </div>
  )
}

/**
 * AnimationGroup Component
 * 
 * Container for multiple animated elements with coordinated timing.
 * Useful for animating related content together.
 */
interface AnimationGroupProps {
  children: React.ReactNode
  staggerDelay?: number
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export const AnimationGroup: React.FC<AnimationGroupProps> = ({
  children,
  staggerDelay = 150,
  direction = 'vertical',
  className = ''
}) => {
  const childrenArray = React.Children.toArray(children)
  const { visibleItems, triggerStaggeredAnimation, resetAnimation } = useStaggeredAnimation(
    childrenArray.length,
    staggerDelay,
    0
  )

  useEffect(() => {
    // Trigger staggered animation on mount
    const timer = setTimeout(() => {
      triggerStaggeredAnimation()
    }, 100)

    return () => clearTimeout(timer)
  }, [triggerStaggeredAnimation])

  return (
    <div
      className={`
        ${styles.animationGroup}
        ${styles[`group-${direction}`]}
        ${className}
      `.trim()}
    >
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className={`
            ${styles.groupItem}
            ${visibleItems[index] ? styles.groupItemVisible : styles.groupItemHidden}
          `.trim()}
          style={{
            '--item-delay': `${index * staggerDelay}ms`
          } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

/**
 * ParallaxElement Component
 * 
 * Element with parallax scrolling effect based on scroll position.
 * Provides smooth parallax movement with customizable speed and offset.
 */
interface ParallaxElementProps {
  children: React.ReactNode
  speed?: number
  offset?: number
  direction?: 'vertical' | 'horizontal' | 'both'
  className?: string
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  speed = 0.5,
  offset = 0,
  direction = 'vertical',
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('translateY(0px)')

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const elementTop = rect.top + scrollTop
      const windowHeight = window.innerHeight
      
      const yPos = -(scrollTop - elementTop + windowHeight) * speed + offset
      const xPos = direction === 'horizontal' || direction === 'both' ? yPos * 0.3 : 0
      
      if (direction === 'vertical') {
        setTransform(`translateY(${yPos}px)`)
      } else if (direction === 'horizontal') {
        setTransform(`translateX(${xPos}px)`)
      } else {
        setTransform(`translate(${xPos}px, ${yPos}px)`)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, offset, direction])

  return (
    <div
      ref={elementRef}
      className={`
        ${styles.parallaxElement}
        ${className}
      `.trim()}
      style={{ transform }}
    >
      {children}
    </div>
  )
}

export default ScrollTriggeredAnimation
