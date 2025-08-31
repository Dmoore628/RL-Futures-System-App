import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './BrokerLogosBanner.module.css'

/**
 * BrokerLogosBanner Component
 * Professional infinite horizontal scrolling carousel with user-controlled drag navigation.
 * Features continuous right-to-left scrolling animation that can be overridden by user drag interaction,
 * and a separate momentum animation system with proper physics.
 *
 * @component
 * @returns {JSX.Element} The BrokerLogosBanner component.
 */
const BrokerLogosBanner: React.FC = () => {
  // Core state
  const [isDragging, setIsDragging] = useState(false)
  const [currentScrollX, setCurrentScrollX] = useState(0)
  const [isMomentumActive, setIsMomentumActive] = useState(false)
  
  // Drag state
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartScrollX, setDragStartScrollX] = useState(0)
  
  // Animation state
  const [animationId, setAnimationId] = useState<number | null>(null)
  const [momentumVelocity, setMomentumVelocity] = useState(0)
  
  // Refs for performance and state management
  const logosWrapperRef = useRef<HTMLDivElement>(null)
  const lastFrameTime = useRef<number>(0)
  const scrollSpeed = useRef<number>(1.5) // pixels per frame for continuous movement
  const lastDragTime = useRef<number>(0)
  const lastDragX = useRef<number>(0)
  const momentumStartTime = useRef<number>(0)

  // Logo data - using public folder for best practices
  const logos = [
    { src: '/ninjatraderlogo.png', alt: 'NINJATRADER' },
    { src: '/interactivebrokers-logo-stacked.png', alt: 'Interactive Brokers' },
    { src: '/topsteplogo.jpg', alt: 'TOPSTEPX' },
    { src: '/Tradovatelogo.png', alt: 'Tradovate' },
    { src: '/TOS_Overview_thinkorswim_TALL.avif', alt: 'ThinkOrSwim' },
    { src: '/TradeStation_Logo.png', alt: 'TradeStation' },
    { src: '/optimusfutureslogo.png', alt: 'Optimus Futures' }
  ]

  /**
   * Main continuous scrolling animation - only runs when not dragging and not in momentum
   */
  const animateScroll = useCallback((timestamp: number) => {
    if (!logosWrapperRef.current || isDragging) {
      // Schedule next frame even when not animating
      const nextFrameId = requestAnimationFrame(animateScroll)
      setAnimationId(nextFrameId)
      return
    }

    // If momentum is active, don't run main animation but keep scheduling frames
    if (isMomentumActive) {
      const nextFrameId = requestAnimationFrame(animateScroll)
      setAnimationId(nextFrameId)
      return
    }

    if (lastFrameTime.current === 0) {
      lastFrameTime.current = timestamp
    }

    const deltaTime = timestamp - lastFrameTime.current
    const deltaX = scrollSpeed.current * (deltaTime / 16.67) // 60fps baseline
    
    setCurrentScrollX(prev => {
      const newScrollX = prev - deltaX
      
      // Reset position for infinite loop
      const totalWidth = logos.length * 300 // 220px logo + 80px gap
      if (newScrollX <= -totalWidth) {
        return newScrollX + totalWidth
      }
      
      return newScrollX
    })

    lastFrameTime.current = timestamp
    
    // Schedule next frame
    const nextFrameId = requestAnimationFrame(animateScroll)
    setAnimationId(nextFrameId)
  }, [logos.length, isDragging, isMomentumActive])

  /**
   * Stop the continuous scrolling animation
   */
  const stopAnimation = useCallback(() => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      setAnimationId(null)
    }
    lastFrameTime.current = 0
  }, [animationId])

  /**
   * Momentum animation system - runs independently of main animation
   * Uses time-based physics for predictable 3-second duration
   */
  const startMomentumAnimation = useCallback(() => {
    const startTime = Date.now()
    const initialVelocity = momentumVelocity
    const momentumDuration = 3000 // 3 seconds
    
    const animateMomentum = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / momentumDuration
      
      if (progress >= 1) {
        // Momentum finished, resume normal scrolling
        setIsMomentumActive(false)
        setMomentumVelocity(0)
        
        // Start main animation directly with proper timing
        if (logosWrapperRef.current) {
          lastFrameTime.current = 0
          // Force immediate start of main animation
          const nextFrameId = requestAnimationFrame(animateScroll)
          setAnimationId(nextFrameId)
        }
        return
      }
      
      // Calculate current velocity with smooth deceleration
      const easeOut = 1 - Math.pow(progress, 2) // Quadratic ease-out
      const currentVelocity = initialVelocity * easeOut
      setMomentumVelocity(currentVelocity)
      
      // Update position based on current velocity
      setCurrentScrollX(prev => {
        const newScrollX = prev + currentVelocity
        
        // Handle infinite loop wrapping
        const totalWidth = logos.length * 300
        if (newScrollX <= -totalWidth) {
          return newScrollX + totalWidth
        }
        if (newScrollX > 0) {
          return newScrollX - totalWidth
        }
        
        return newScrollX
      })
      
      // Continue momentum animation
      requestAnimationFrame(animateMomentum)
    }
    
    // Start momentum animation
    requestAnimationFrame(animateMomentum)
  }, [momentumVelocity, logos.length, animateScroll])

  /**
   * Handles the start of drag interaction
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragStartScrollX(currentScrollX)
    
    // Stop the main animation during drag
    stopAnimation()
    
    // Clear any existing momentum
    setIsMomentumActive(false)
    setMomentumVelocity(0)
    
    // Initialize drag tracking
    lastDragTime.current = Date.now()
    lastDragX.current = e.clientX
  }

  /**
   * Handles mouse movement during drag
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    e.preventDefault()
    e.stopPropagation()
    
    const deltaX = e.clientX - dragStartX
    const newScrollX = dragStartScrollX + deltaX
    
    // Calculate velocity based on overall drag direction and speed
    const currentTime = Date.now()
    const timeDelta = currentTime - lastDragTime.current
    if (timeDelta > 0) {
      // Calculate velocity based on overall drag movement (not just last frame)
      const totalDragDelta = e.clientX - dragStartX
      const totalTimeDelta = currentTime - lastDragTime.current
      
      // Velocity should be in the direction of the drag
      const velocity = (totalDragDelta / totalTimeDelta) * 0.6
      const cappedVelocity = Math.max(-5, Math.min(5, velocity))
      console.log('Drag velocity calculation:', { 
        totalDragDelta, 
        totalTimeDelta, 
        velocity, 
        cappedVelocity,
        dragDirection: totalDragDelta > 0 ? 'right' : 'left'
      })
      setMomentumVelocity(cappedVelocity)
    }
    
    lastDragTime.current = currentTime
    lastDragX.current = e.clientX
    
    // Update position immediately during drag
    setCurrentScrollX(newScrollX)
  }

  /**
   * Handles the end of drag interaction
   */
  const handleMouseUp = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Activate momentum if there's sufficient velocity
    console.log('Mouse up - momentumVelocity:', momentumVelocity, 'threshold:', 0.2)
    if (Math.abs(momentumVelocity) > 0.2) {
      console.log('Activating momentum with velocity:', momentumVelocity)
      setIsMomentumActive(true)
      momentumStartTime.current = Date.now()
      startMomentumAnimation()
    } else {
      console.log('No momentum - resuming normal animation')
      // No momentum, resume normal animation immediately
      if (logosWrapperRef.current) {
        lastFrameTime.current = 0
        const nextFrameId = requestAnimationFrame(animateScroll)
        setAnimationId(nextFrameId)
      }
    }
  }

  // Start animation on mount
  useEffect(() => {
    // Start animation immediately on mount
    if (logosWrapperRef.current) {
      lastFrameTime.current = 0
      const nextFrameId = requestAnimationFrame(animateScroll)
      setAnimationId(nextFrameId)
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, []) // Empty dependency array - only run on mount

  // Update transform when currentScrollX changes
  useEffect(() => {
    if (logosWrapperRef.current) {
      logosWrapperRef.current.style.transform = `translateX(${currentScrollX}px)`
    }
  }, [currentScrollX])

  // Global event listeners for robust drag handling
  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        handleMouseUp()
      }
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        // Convert DOM MouseEvent to React MouseEvent
        const reactEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          nativeEvent: e,
          isDefaultPrevented: () => e.defaultPrevented,
          isPropagationStopped: () => false,
          persist: () => {},
          target: e.target,
          currentTarget: e.currentTarget,
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          defaultPrevented: e.defaultPrevented,
          eventPhase: e.eventPhase,
          isTrusted: e.isTrusted,
          timeStamp: e.timeStamp,
          type: e.type
        } as React.MouseEvent<HTMLDivElement, MouseEvent>
        handleMouseMove(reactEvent)
      }
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('mousemove', handleGlobalMouseMove)

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className={styles.bannerContainer} data-testid="broker-logos-banner">
      <div className={styles.bannerTitle}>Supported Broker Connections</div>
      <div
        ref={logosWrapperRef}
        className={styles.logosWrapper}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `translateX(${currentScrollX}px)`
        }}
      >
        {/* Render 3 complete sets of logos for seamless infinite scrolling */}
        {/* Set 1 */}
        {logos.map((logo, index) => (
          <div key={`set1-${index}`} className={styles.logoItem}>
            <img
              src={logo.src}
              alt={logo.alt}
              className={`${styles.logo} ${logo.alt === 'ThinkOrSwim' ? styles.tosLogo : ''}`}
            />
          </div>
        ))}

        {/* Set 2 - Exact duplicate for seamless loop */}
        {logos.map((logo, index) => (
          <div key={`set2-${index}`} className={styles.logoItem}>
            <img
              src={logo.src}
              alt={logo.alt}
              className={`${styles.logo} ${logo.alt === 'ThinkOrSwim' ? styles.tosLogo : ''}`}
            />
          </div>
        ))}

        {/* Set 3 - Exact duplicate for seamless loop */}
        {logos.map((logo, index) => (
          <div key={`set3-${index}`} className={styles.logoItem}>
            <img
              src={logo.src}
              alt={logo.alt}
              className={`${styles.logo} ${logo.alt === 'ThinkOrSwim' ? styles.tosLogo : ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrokerLogosBanner
