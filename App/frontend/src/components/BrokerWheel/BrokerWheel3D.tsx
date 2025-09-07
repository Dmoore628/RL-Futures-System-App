import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import styles from './BrokerWheel3D.module.css'

interface Broker {
  id: string
  name: string
  logo: string
  brandColor: string
  accentColor: string
  description: string
}

const brokers: Broker[] = [
  {
    id: 'interactive-brokers',
    name: 'Interactive Brokers',
    logo: '/interactivebrokers-logo-stacked.png',
    brandColor: '#1e40af',
    accentColor: '#3b82f6',
    description: 'Professional Trading Platform'
  },
  {
    id: 'ninjatrader',
    name: 'NinjaTrader',
    logo: '/ninjatraderlogo.png',
    brandColor: '#dc2626',
    accentColor: '#ef4444',
    description: 'Advanced Charting & Analysis'
  },
  {
    id: 'optimus-futures',
    name: 'Optimus Futures',
    logo: '/optimusfutureslogo.png',
    brandColor: '#059669',
    accentColor: '#10b981',
    description: 'Futures Trading Specialists'
  },
  {
    id: 'topstep',
    name: 'TopStep',
    logo: '/topsteplogo.jpg',
    brandColor: '#7c3aed',
    accentColor: '#8b5cf6',
    description: 'Trading Challenge Platform'
  },
  {
    id: 'thinkorswim',
    name: 'ThinkOrSwim',
    logo: '/TOS_Overview_thinkorswim_TALL.avif',
    brandColor: '#ea580c',
    accentColor: '#f97316',
    description: 'TD Ameritrade Platform'
  },
  {
    id: 'tradestation',
    name: 'TradeStation',
    logo: '/TradeStation_Logo.png',
    brandColor: '#0891b2',
    accentColor: '#06b6d4',
    description: 'Professional Trading Tools'
  },
  {
    id: 'tradovate',
    name: 'Tradovate',
    logo: '/Tradovatelogo.png',
    brandColor: '#be185d',
    accentColor: '#ec4899',
    description: 'Modern Futures Trading'
  }
]

const BrokerWheel3D: React.FC = () => {
  const wheelRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 })
  const [hoveredBroker, setHoveredBroker] = useState<string | null>(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const { scrollPosition } = useScrollAnimation()

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return

    const interval = setInterval(() => {
      setRotation(prev => prev + 0.3)
    }, 16) // 60fps

    return () => clearInterval(interval)
  }, [isAutoRotating, isDragging])

  // Pause auto-rotation on hover
  const handleMouseEnter = useCallback(() => {
    setIsAutoRotating(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsAutoRotating(true)
  }, [])

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setIsAutoRotating(false)
    setDragStart({
      x: e.clientX,
      rotation: rotation
    })
  }, [rotation])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const newRotation = dragStart.rotation + deltaX * 0.8
    setRotation(newRotation)
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsAutoRotating(true)
  }, [])

  // Global mouse event listeners for smooth dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    setIsAutoRotating(false)
    setDragStart({
      x: e.touches[0].clientX,
      rotation: rotation
    })
  }, [rotation])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return

    const deltaX = e.touches[0].clientX - dragStart.x
    const newRotation = dragStart.rotation + deltaX * 0.8
    setRotation(newRotation)
  }, [isDragging, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setIsAutoRotating(true)
  }, [])

  // Subtle scroll-based rotation
  useEffect(() => {
    const scrollFactor = scrollPosition * 0.02
    if (!isDragging && Math.abs(scrollFactor) > 0.1) {
      setRotation(prev => prev + scrollFactor)
    }
  }, [scrollPosition, isDragging])

  return (
    <div className={styles.brokerWheelContainer}>
      <div className={styles.wheelWrapper}>
        <div
          ref={wheelRef}
          className={styles.brokerWheel}
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {brokers.map((broker, index) => {
            const angle = (360 / brokers.length) * index
            const isHovered = hoveredBroker === broker.id
            
            return (
              <div
                key={broker.id}
                className={`${styles.brokerCard} ${isHovered ? styles.hovered : ''}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(280px)`,
                  '--broker-brand-color': broker.brandColor,
                  '--broker-accent-color': broker.accentColor
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredBroker(broker.id)}
                onMouseLeave={() => setHoveredBroker(null)}
              >
                <div className={styles.brokerCardInner}>
                  <div className={styles.brokerLogoContainer}>
                    <img 
                      src={broker.logo} 
                      alt={broker.name}
                      className={styles.brokerLogo}
                    />
                  </div>
                  <div className={styles.brokerInfo}>
                    <h3 className={styles.brokerName}>{broker.name}</h3>
                    <p className={styles.brokerDescription}>{broker.description}</p>
                  </div>
                  <div className={styles.brokerGlow} />
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Central hub */}
        <div className={styles.centralHub}>
          <div className={styles.hubInner}>
            <div className={styles.hubIcon}>⚡</div>
            <span className={styles.hubText}>RL Trading</span>
          </div>
        </div>

        {/* Orbital rings */}
        <div className={styles.orbitalRing1} />
        <div className={styles.orbitalRing2} />
        <div className={styles.orbitalRing3} />
      </div>

    </div>
  )
}

export default BrokerWheel3D
