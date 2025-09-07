/**
 * useScrollAnimation Hook
 * 
 * Custom hook for managing scroll-triggered animations and scroll position tracking.
 * Provides smooth scroll detection, intersection observer functionality, and
 * animation state management for the modern welcome page UI.
 * 
 * @returns {Object} Scroll animation utilities and state
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

interface ScrollPosition {
  x: number
  y: number
  direction: 'up' | 'down' | 'left' | 'right'
  velocity: number
  progress: number
}

interface AnimationState {
  isVisible: boolean
  hasAnimated: boolean
  animationDelay: number
  animationProgress: number
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = false,
    delay = 0
  } = options

  // State management
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: 'down',
    velocity: 0,
    progress: 0
  })

  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [scrollVelocity, setScrollVelocity] = useState(0)

  // Refs for performance optimization
  const lastScrollY = useRef(0)
  const lastScrollX = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const animationFrame = useRef<number | null>(null)

  /**
   * Calculate scroll progress as percentage of total scrollable height
   */
  const calculateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    return Math.min(Math.max(scrollTop / scrollHeight, 0), 1)
  }, [])

  /**
   * Calculate scroll velocity for smooth animations
   */
  const calculateScrollVelocity = useCallback((currentY: number, previousY: number) => {
    const deltaY = currentY - previousY
    const deltaTime = 16 // Assuming 60fps
    return Math.abs(deltaY) / deltaTime
  }, [])

  /**
   * Determine scroll direction based on current and previous positions
   */
  const determineScrollDirection = useCallback((currentY: number, previousY: number) => {
    if (currentY > previousY) return 'down'
    if (currentY < previousY) return 'up'
    return scrollDirection
  }, [scrollDirection])

  /**
   * Update scroll position and related state
   */
  const updateScrollPosition = useCallback(() => {
    const currentY = window.pageYOffset || document.documentElement.scrollTop
    const currentX = window.pageXOffset || document.documentElement.scrollLeft
    
    const velocity = calculateScrollVelocity(currentY, lastScrollY.current)
    const direction = determineScrollDirection(currentY, lastScrollY.current)
    const progress = calculateScrollProgress()

    setScrollPosition({
      x: currentX,
      y: currentY,
      direction: direction === 'down' ? 'down' : 'up',
      velocity,
      progress
    })

    setScrollDirection(direction)
    setScrollVelocity(velocity)
    setIsScrolling(true)

    // Update refs
    lastScrollY.current = currentY
    lastScrollX.current = currentX

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    // Set timeout to detect scroll end
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }, [calculateScrollVelocity, determineScrollDirection, calculateScrollProgress])

  /**
   * Throttled scroll handler for performance
   */
  const handleScroll = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
    }

    animationFrame.current = requestAnimationFrame(updateScrollPosition)
  }, [updateScrollPosition])

  /**
   * Set up scroll event listeners
   */
  useEffect(() => {
    // Initial scroll position
    updateScrollPosition()

    // Add scroll event listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateScrollPosition, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollPosition)
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [handleScroll, updateScrollPosition])

  return {
    scrollPosition,
    isScrolling,
    scrollDirection,
    scrollVelocity,
    calculateScrollProgress
  }
}

/**
 * useIntersectionObserver Hook
 * 
 * Custom hook for detecting when elements enter/exit the viewport.
 * Used for triggering animations based on element visibility.
 */
export const useIntersectionObserver = (
  options: ScrollAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = false,
    delay = 0
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const elementRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  /**
   * Intersection observer callback
   */
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    
    if (entry.isIntersecting) {
      setIsVisible(true)
      setAnimationProgress(entry.intersectionRatio)
      
      if (triggerOnce && !hasAnimated) {
        setHasAnimated(true)
      }
    } else {
      if (!triggerOnce) {
        setIsVisible(false)
        setAnimationProgress(0)
      }
    }
  }, [triggerOnce, hasAnimated])

  /**
   * Set up intersection observer
   */
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold, rootMargin])

  /**
   * Trigger animation with delay
   */
  const triggerAnimation = useCallback(() => {
    if (delay > 0) {
      setTimeout(() => {
        setIsVisible(true)
        setHasAnimated(true)
      }, delay)
    } else {
      setIsVisible(true)
      setHasAnimated(true)
    }
  }, [delay])

  return {
    elementRef,
    isVisible,
    hasAnimated,
    animationProgress,
    triggerAnimation
  }
}

/**
 * useParallax Hook
 * 
 * Custom hook for creating parallax scrolling effects.
 * Provides smooth parallax calculations based on scroll position.
 */
export const useParallax = (speed: number = 0.5, offset: number = 0) => {
  const { scrollPosition } = useScrollAnimation()
  const [transform, setTransform] = useState('translateY(0px)')

  useEffect(() => {
    const yPos = -(scrollPosition.y * speed) + offset
    setTransform(`translateY(${yPos}px)`)
  }, [scrollPosition.y, speed, offset])

  return {
    transform,
    scrollPosition
  }
}

/**
 * useStaggeredAnimation Hook
 * 
 * Custom hook for creating staggered animations with delays.
 * Useful for animating multiple elements in sequence.
 */
export const useStaggeredAnimation = (
  itemCount: number,
  staggerDelay: number = 100,
  totalDelay: number = 0
) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  )

  const triggerStaggeredAnimation = useCallback(() => {
    const delays = Array.from({ length: itemCount }, (_, index) => 
      totalDelay + (index * staggerDelay)
    )

    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newVisible = [...prev]
          newVisible[index] = true
          return newVisible
        })
      }, delay)
    })
  }, [itemCount, staggerDelay, totalDelay])

  const resetAnimation = useCallback(() => {
    setVisibleItems(new Array(itemCount).fill(false))
  }, [itemCount])

  return {
    visibleItems,
    triggerStaggeredAnimation,
    resetAnimation
  }
}

/**
 * useScrollProgress Hook
 * 
 * Custom hook for tracking scroll progress through specific sections.
 * Useful for progress bars and section-based animations.
 */
export const useScrollProgress = (sectionRef: React.RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0)
  const { scrollPosition } = useScrollAnimation()

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const elementTop = element.offsetTop
    const elementHeight = element.offsetHeight
    const windowHeight = window.innerHeight
    const scrollTop = scrollPosition.y

    const elementStart = elementTop - windowHeight
    const elementEnd = elementTop + elementHeight
    const elementProgress = Math.min(
      Math.max((scrollTop - elementStart) / (elementEnd - elementStart), 0),
      1
    )

    setProgress(elementProgress)
  }, [scrollPosition.y, sectionRef])

  return {
    progress,
    isInView: progress > 0 && progress < 1,
    isComplete: progress >= 1
  }
}

export default useScrollAnimation
