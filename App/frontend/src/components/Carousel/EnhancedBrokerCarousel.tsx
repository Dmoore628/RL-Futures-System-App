/**
 * EnhancedBrokerCarousel Component
 * 
 * Enhanced 3D broker carousel with sophisticated animations, hover effects,
 * and interactive elements. Features smooth momentum scrolling, tilt effects,
 * and connection status indicators.
 * 
 * @component
 * @returns {JSX.Element} The EnhancedBrokerCarousel component
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useScrollAnimation, useIntersectionObserver } from '../../hooks/useScrollAnimation'
import { Section, Container } from '../Layout/ModernLayout'
import styles from './EnhancedBrokerCarousel.module.css'

interface BrokerLogo {
  id: string
  src: string
  alt: string
  name: string
  status: 'connected' | 'disconnected' | 'pending'
  description?: string
  features?: string[]
}

interface EnhancedBrokerCarouselProps {
  logos: BrokerLogo[]
  className?: string
  autoScroll?: boolean
  scrollSpeed?: number
  interactive?: boolean
  showStatus?: boolean
  animationDelay?: number
}

const EnhancedBrokerCarousel: React.FC<EnhancedBrokerCarouselProps> = ({
  logos,
  className = '',
  autoScroll = true,
  scrollSpeed = 1,
  interactive = true,
  showStatus = true,
  animationDelay = 0
}) => {
  // State management
  const [isVisible, setIsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartScrollX, setDragStartScrollX] = useState(0)
  const [currentScrollX, setCurrentScrollX] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animationProgress, setAnimationProgress] = useState(0)

  // Refs
  const carouselRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastFrameTime = useRef<number>(0)

  // Hooks
  const { scrollPosition } = useScrollAnimation()
  const { elementRef, isVisible: intersectionVisible } = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px',
    triggerOnce: true,
    delay: animationDelay
  })

  // Combine refs
  useEffect(() => {
    if (carouselRef.current) {
      elementRef.current = carouselRef.current
    }
  }, [elementRef])

  // Handle intersection visibility
  useEffect(() => {
    if (intersectionVisible) {
      setIsVisible(true)
    }
  }, [intersectionVisible])

  // Auto-scroll animation
  useEffect(() => {
    if (!autoScroll || !isVisible || isDragging) return

    const animate = (timestamp: number) => {
      if (lastFrameTime.current === 0) {
        lastFrameTime.current = timestamp
      }

      const deltaTime = timestamp - lastFrameTime.current
      const deltaX = scrollSpeed * (deltaTime / 16.67) // 60fps baseline

      setCurrentScrollX(prev => {
        const newScrollX = prev - deltaX
        const totalWidth = logos.length * 300 // 220px logo + 80px gap
        return newScrollX <= -totalWidth ? newScrollX + totalWidth : newScrollX
      })

      lastFrameTime.current = timestamp
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [autoScroll, isVisible, isDragging, scrollSpeed, logos.length])

  // Animation progress calculation
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

  // Mouse interaction handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const mouseX = e.clientX - rect.left - centerX
    const mouseY = e.clientY - rect.top - centerY
    
    setMousePosition({ x: mouseX, y: mouseY })
  }, [interactive])

  const handleMouseEnter = useCallback(() => {
    if (interactive) {
      setIsHovered(true)
    }
  }, [interactive])

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setIsHovered(false)
      setHoveredLogo(null)
    }
  }, [interactive])

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!interactive) return

    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragStartScrollX(currentScrollX)
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [interactive, currentScrollX])

  const handleMouseMoveDrag = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !interactive) return

    e.preventDefault()
    const deltaX = e.clientX - dragStartX
    const newScrollX = dragStartScrollX + deltaX
    setCurrentScrollX(newScrollX)
  }, [isDragging, interactive, dragStartX, dragStartScrollX])

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !interactive) return

    setIsDragging(false)
    
    // Resume auto-scroll after drag
    if (autoScroll && isVisible) {
      lastFrameTime.current = 0
      const animate = (timestamp: number) => {
        if (lastFrameTime.current === 0) {
          lastFrameTime.current = timestamp
        }

        const deltaTime = timestamp - lastFrameTime.current
        const deltaX = scrollSpeed * (deltaTime / 16.67)

        setCurrentScrollX(prev => {
          const newScrollX = prev - deltaX
          const totalWidth = logos.length * 300
          return newScrollX <= -totalWidth ? newScrollX + totalWidth : newScrollX
        })

        lastFrameTime.current = timestamp
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [isDragging, interactive, autoScroll, isVisible, scrollSpeed, logos.length])

  // Logo hover handlers
  const handleLogoHover = useCallback((logoId: string) => {
    if (interactive) {
      setHoveredLogo(logoId)
    }
  }, [interactive])

  const handleLogoLeave = useCallback(() => {
    if (interactive) {
      setHoveredLogo(null)
    }
  }, [interactive])

  // Calculate 3D transform based on mouse position
  const get3DTransform = (index: number) => {
    if (!isHovered) return 'translateZ(0) rotateX(0) rotateY(0)'
    
    const mouseInfluence = 0.1
    const tiltX = (mousePosition.y * mouseInfluence) * (index % 2 === 0 ? 1 : -1)
    const tiltY = (mousePosition.x * mouseInfluence) * (index % 2 === 0 ? 1 : -1)
    
    return `translateZ(${index * 10}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'var(--color-accent-green)'
      case 'disconnected':
        return 'var(--color-accent-red)'
      case 'pending':
        return 'var(--color-accent-gold)'
      default:
        return 'var(--color-neutral-400)'
    }
  }

  // Render broker logo
  const renderBrokerLogo = (logo: BrokerLogo, index: number) => {
    const isLogoHovered = hoveredLogo === logo.id
    const logoTransform = get3DTransform(index)
    const statusColor = getStatusColor(logo.status)

    return (
      <div
        key={logo.id}
        className={`
          ${styles.brokerLogo}
          ${isLogoHovered ? styles.logoHovered : ''}
          ${styles[`logo-${logo.status}`]}
        `.trim()}
        style={{
          '--logo-transform': logoTransform,
          '--status-color': statusColor,
          '--logo-index': index,
          '--animation-progress': animationProgress
        } as React.CSSProperties}
        onMouseEnter={() => handleLogoHover(logo.id)}
        onMouseLeave={handleLogoLeave}
        data-logo-id={logo.id}
        data-status={logo.status}
      >
        {/* Logo image */}
        <div className={styles.logoImage}>
          <img
            src={logo.src}
            alt={logo.alt}
            className={styles.logoImg}
          />
        </div>

        {/* Logo info */}
        <div className={styles.logoInfo}>
          <h3 className={styles.logoName}>{logo.name}</h3>
          {showStatus && (
            <div className={styles.logoStatus}>
              <div
                className={styles.statusIndicator}
                style={{ backgroundColor: statusColor }}
              />
              <span className={styles.statusText}>
                {logo.status.charAt(0).toUpperCase() + logo.status.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Hover tooltip */}
        {isLogoHovered && logo.description && (
          <div className={styles.logoTooltip}>
            <div className={styles.tooltipContent}>
              <h4 className={styles.tooltipTitle}>{logo.name}</h4>
              <p className={styles.tooltipDescription}>{logo.description}</p>
              {logo.features && logo.features.length > 0 && (
                <ul className={styles.tooltipFeatures}>
                  {logo.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={styles.tooltipFeature}>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Section
      ref={carouselRef}
      height="auto"
      background="tertiary"
      padding="xl"
      className={`
        ${styles.enhancedBrokerCarousel}
        ${className}
      `.trim()}
      data-visible={isVisible}
      data-hovered={isHovered}
      data-dragging={isDragging}
    >
      <Container size="2xl">
        {/* Carousel header */}
        <div className={styles.carouselHeader}>
          <h2 className={styles.carouselTitle}>Supported Broker Connections</h2>
          <p className={styles.carouselSubtitle}>
            Seamlessly integrate with leading futures brokers
          </p>
        </div>

        {/* 3D Carousel container */}
        <div
          ref={containerRef}
          className={styles.carouselContainer}
          onMouseMove={isDragging ? handleMouseMoveDrag : handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            '--scroll-x': `${currentScrollX}px`
          } as React.CSSProperties}
        >
          {/* Carousel track */}
          <div className={styles.carouselTrack}>
            {/* Render logos multiple times for seamless loop */}
            {Array.from({ length: 3 }).map((_, setIndex) =>
              logos.map((logo, index) => 
                renderBrokerLogo(logo, setIndex * logos.length + index)
              )
            )}
          </div>

          {/* 3D perspective overlay */}
          <div className={styles.perspectiveOverlay} />
        </div>

        {/* Carousel controls */}
        <div className={styles.carouselControls}>
          <div className={styles.controlInfo}>
            <span className={styles.controlText}>
              {interactive ? 'Drag to explore • Hover for details' : 'Scroll to explore'}
            </span>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default EnhancedBrokerCarousel
