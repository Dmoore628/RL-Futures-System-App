/**
 * HeroSection Component
 * 
 * Modern, desktop-optimized hero section with scroll-driven animations,
 * interactive elements, and sophisticated visual effects. Features
 * animated background, typewriter effects, and magnetic CTA button.
 * 
 * @component
 * @returns {JSX.Element} The HeroSection component
 */

import React, { useState, useEffect, useRef } from 'react'
import { useScrollAnimation, useParallax } from '../../hooks/useScrollAnimation'
import { Section, Container, Flex } from '../Layout/ModernLayout'
import styles from './HeroSection.module.css'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  onCtaClick: () => void
  backgroundAnimation?: boolean
  particleEffects?: boolean
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  onCtaClick,
  backgroundAnimation = true,
  particleEffects = true
}) => {
  // State management
  const [isTyping, setIsTyping] = useState(false)
  const [typedTitle, setTypedTitle] = useState('')
  const [typedSubtitle, setTypedSubtitle] = useState('')
  const [showCta, setShowCta] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Refs
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { scrollPosition } = useScrollAnimation()
  const { transform: parallaxTransform } = useParallax(0.5, 0)

  /**
   * Typewriter effect for title
   */
  useEffect(() => {
    if (!isTyping) return

    let titleIndex = 0
    let subtitleIndex = 0
    const titleSpeed = 100
    const subtitleSpeed = 50
    const subtitleDelay = 1000

    const typeTitle = () => {
      if (titleIndex < title.length) {
        setTypedTitle(title.slice(0, titleIndex + 1))
        titleIndex++
        setTimeout(typeTitle, titleSpeed)
      } else {
        // Start typing subtitle after delay
        setTimeout(() => {
          const typeSubtitle = () => {
            if (subtitleIndex < subtitle.length) {
              setTypedSubtitle(subtitle.slice(0, subtitleIndex + 1))
              subtitleIndex++
              setTimeout(typeSubtitle, subtitleSpeed)
            } else {
              // Show CTA after subtitle is complete
              setTimeout(() => setShowCta(true), 500)
            }
          }
          typeSubtitle()
        }, subtitleDelay)
      }
    }

    typeTitle()
  }, [isTyping, title, subtitle])

  /**
   * Start typing animation on mount
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  /**
   * Mouse movement tracking for interactive effects
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const rect = heroRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  /**
   * CTA button click handler with animation
   */
  const handleCtaClick = () => {
    if (ctaRef.current) {
      ctaRef.current.style.transform = 'scale(0.95)'
      setTimeout(() => {
        if (ctaRef.current) {
          ctaRef.current.style.transform = 'scale(1)'
        }
      }, 150)
    }
    onCtaClick()
  }

  /**
   * Magnetic hover effect for CTA button
   */
  const handleCtaMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current) return

    const rect = ctaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = 100
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance
      const moveX = x * strength * 0.3
      const moveY = y * strength * 0.3
      
      ctaRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`
    } else {
      ctaRef.current.style.transform = 'translate(0, 0) scale(1)'
    }
  }

  const handleCtaMouseLeave = () => {
    if (ctaRef.current) {
      ctaRef.current.style.transform = 'translate(0, 0) scale(1)'
    }
  }

  return (
    <Section
      ref={heroRef}
      height="screen"
      background="dark"
      className={styles.heroSection}
      animation="fade"
    >
      {/* Animated Background */}
      {backgroundAnimation && (
        <div className={styles.animatedBackground}>
          <div 
            className={styles.backgroundElement}
            style={{ transform: parallaxTransform }}
          />
          <div className={styles.gradientOverlay} />
        </div>
      )}

      {/* Particle Effects */}
      {particleEffects && (
        <div className={styles.particleContainer}>
          {Array.from({ length: 50 }).map((_, index) => (
            <div
              key={index}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <Container size="2xl" className={styles.heroContent}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          className={styles.heroInner}
        >
          {/* Title */}
          <h1
            ref={titleRef}
            className={styles.heroTitle}
            style={{
              '--mouse-x': `${mousePosition.x}px`,
              '--mouse-y': `${mousePosition.y}px`
            } as React.CSSProperties}
          >
            <span className={styles.titleText}>
              {typedTitle}
              <span className={styles.cursor}>|</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className={styles.heroSubtitle}
          >
            {typedSubtitle}
          </p>

          {/* CTA Button */}
          {showCta && (
            <button
              ref={ctaRef}
              className={styles.ctaButton}
              onClick={handleCtaClick}
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`
              } as React.CSSProperties}
            >
              <span className={styles.ctaText}>{ctaText}</span>
              <div className={styles.ctaGlow} />
            </button>
          )}

          {/* Scroll Indicator */}
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollArrow} />
            <span className={styles.scrollText}>Scroll to explore</span>
          </div>
        </Flex>
      </Container>

      {/* Interactive Elements */}
      <div className={styles.interactiveElements}>
        {/* Floating Stats */}
        <div className={styles.floatingStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>95%</span>
            <span className={styles.statLabel}>Success Rate</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>$500</span>
            <span className={styles.statLabel}>Daily Target</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>24/7</span>
            <span className={styles.statLabel}>Trading</span>
          </div>
        </div>

        {/* Animated Chart Preview */}
        <div className={styles.chartPreview}>
          <div className={styles.chartContainer}>
            <div className={styles.chartLine} />
            <div className={styles.chartPoint} />
          </div>
        </div>
      </div>
    </Section>
  )
}

export default HeroSection
