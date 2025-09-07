/**
 * SystemDiagram3D Component
 * 
 * Interactive 3D system diagram visualization for the RL trading system.
 * Features rotating 3D elements, hover interactions, and smooth animations
 * that showcase the system architecture and data flow.
 * 
 * @component
 * @returns {JSX.Element} The SystemDiagram3D component
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useScrollAnimation, useIntersectionObserver } from '../../hooks/useScrollAnimation'
import styles from './SystemDiagram3D.module.css'

interface SystemNode {
  id: string
  title: string
  description: string
  position: { x: number; y: number; z: number }
  color: string
  size: number
  connections: string[]
  icon?: string
}

interface SystemDiagram3DProps {
  className?: string
  autoRotate?: boolean
  rotationSpeed?: number
  interactive?: boolean
  showConnections?: boolean
  animationDelay?: number
}

const SystemDiagram3D: React.FC<SystemDiagram3DProps> = ({
  className = '',
  autoRotate = true,
  rotationSpeed = 0.5,
  interactive = true,
  showConnections = true,
  animationDelay = 0
}) => {
  // State management
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animationProgress, setAnimationProgress] = useState(0)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Hooks
  const { scrollPosition } = useScrollAnimation()
  const { elementRef, isVisible: intersectionVisible } = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px',
    triggerOnce: true,
    delay: animationDelay
  })

  // System nodes configuration
  const systemNodes: SystemNode[] = [
    {
      id: 'data-input',
      title: 'Data Input',
      description: 'Historical futures data ingestion and preprocessing',
      position: { x: -200, y: 100, z: 0 },
      color: 'var(--color-primary-blue)',
      size: 80,
      connections: ['preprocessing', 'feature-engineering'],
      icon: '📊'
    },
    {
      id: 'preprocessing',
      title: 'Preprocessing',
      description: 'Data cleaning, normalization, and validation',
      position: { x: -100, y: 200, z: 50 },
      color: 'var(--color-accent-cyan)',
      size: 70,
      connections: ['feature-engineering', 'data-input'],
      icon: '🔧'
    },
    {
      id: 'feature-engineering',
      title: 'Feature Engineering',
      description: 'Technical indicators and market features extraction',
      position: { x: 0, y: 250, z: 100 },
      color: 'var(--color-accent-purple)',
      size: 90,
      connections: ['ppo-model', 'preprocessing'],
      icon: '⚙️'
    },
    {
      id: 'ppo-model',
      title: 'PPO Model',
      description: 'Reinforcement learning agent training and optimization',
      position: { x: 0, y: 0, z: 0 },
      color: 'var(--color-accent-gold)',
      size: 120,
      connections: ['simulator', 'feature-engineering', 'risk-management'],
      icon: '🧠'
    },
    {
      id: 'simulator',
      title: 'High-Fidelity Simulator',
      description: 'Realistic market environment for model training',
      position: { x: 200, y: 100, z: 0 },
      color: 'var(--color-accent-green)',
      size: 85,
      connections: ['ppo-model', 'risk-management'],
      icon: '🎯'
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Position sizing, stop-loss, and risk controls',
      position: { x: 100, y: -100, z: 50 },
      color: 'var(--color-accent-red)',
      size: 75,
      connections: ['ppo-model', 'live-trading'],
      icon: '🛡️'
    },
    {
      id: 'live-trading',
      title: 'Live Trading',
      description: 'Real-time execution and broker integration',
      position: { x: 200, y: -200, z: 0 },
      color: 'var(--color-primary-indigo)',
      size: 95,
      connections: ['risk-management', 'monitoring'],
      icon: '🚀'
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      description: 'Performance tracking and system health monitoring',
      position: { x: 0, y: -250, z: -50 },
      color: 'var(--color-neutral-600)',
      size: 65,
      connections: ['live-trading', 'ppo-model'],
      icon: '📈'
    }
  ]

  // Combine refs
  useEffect(() => {
    if (containerRef.current) {
      elementRef.current = containerRef.current
    }
  }, [elementRef])

  // Handle intersection visibility
  useEffect(() => {
    if (intersectionVisible) {
      setIsVisible(true)
    }
  }, [intersectionVisible])

  // Animation progress calculation
  useEffect(() => {
    if (isVisible) {
      const startTime = Date.now()
      const duration = 2000 // 2 seconds
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        setAnimationProgress(progress)
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [isVisible])

  // Auto-rotation animation
  useEffect(() => {
    if (!autoRotate || !isVisible) return

    const animate = () => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + rotationSpeed,
        z: prev.z
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [autoRotate, isVisible, rotationSpeed])

  // Mouse interaction handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const mouseX = e.clientX - rect.left - centerX
    const mouseY = e.clientY - rect.top - centerY
    
    setMousePosition({ x: mouseX, y: mouseY })
    
    if (!isHovered) {
      setRotation(prev => ({
        x: prev.x + mouseY * 0.1,
        y: prev.y + mouseX * 0.1,
        z: prev.z
      }))
    }
  }, [interactive, isHovered])

  const handleMouseEnter = useCallback(() => {
    if (interactive) {
      setIsHovered(true)
    }
  }, [interactive])

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setIsHovered(false)
      setHoveredNode(null)
    }
  }, [interactive])

  const handleNodeHover = useCallback((nodeId: string) => {
    if (interactive) {
      setHoveredNode(nodeId)
    }
  }, [interactive])

  const handleNodeLeave = useCallback(() => {
    if (interactive) {
      setHoveredNode(null)
    }
  }, [interactive])

  // Calculate node position with animation
  const getNodePosition = (node: SystemNode) => {
    const progress = animationProgress
    const basePosition = node.position
    
    return {
      x: basePosition.x * progress,
      y: basePosition.y * progress,
      z: basePosition.z * progress
    }
  }

  // Calculate connection path
  const getConnectionPath = (fromNode: SystemNode, toNode: SystemNode) => {
    const fromPos = getNodePosition(fromNode)
    const toPos = getNodePosition(toNode)
    
    const midX = (fromPos.x + toPos.x) / 2
    const midY = (fromPos.y + toPos.y) / 2
    const midZ = (fromPos.z + toPos.z) / 2
    
    return {
      from: fromPos,
      to: toPos,
      mid: { x: midX, y: midY, z: midZ }
    }
  }

  // Render system node
  const renderNode = (node: SystemNode) => {
    const position = getNodePosition(node)
    const isNodeHovered = hoveredNode === node.id
    const scale = isNodeHovered ? 1.2 : 1
    const opacity = animationProgress

    return (
      <div
        key={node.id}
        className={`
          ${styles.systemNode}
          ${isNodeHovered ? styles.nodeHovered : ''}
        `.trim()}
        style={{
          '--node-x': `${position.x}px`,
          '--node-y': `${position.y}px`,
          '--node-z': `${position.z}px`,
          '--node-color': node.color,
          '--node-size': `${node.size}px`,
          '--node-scale': scale,
          '--node-opacity': opacity,
          transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${scale})`,
          opacity
        } as React.CSSProperties}
        onMouseEnter={() => handleNodeHover(node.id)}
        onMouseLeave={handleNodeLeave}
        data-node-id={node.id}
      >
        <div className={styles.nodeIcon}>
          {node.icon}
        </div>
        <div className={styles.nodeTitle}>
          {node.title}
        </div>
        {isNodeHovered && (
          <div className={styles.nodeTooltip}>
            <div className={styles.tooltipTitle}>{node.title}</div>
            <div className={styles.tooltipDescription}>{node.description}</div>
          </div>
        )}
      </div>
    )
  }

  // Render connection line
  const renderConnection = (fromNode: SystemNode, toNode: SystemNode) => {
    const path = getConnectionPath(fromNode, toNode)
    const opacity = animationProgress * 0.6

    return (
      <div
        key={`${fromNode.id}-${toNode.id}`}
        className={styles.connectionLine}
        style={{
          '--from-x': `${path.from.x}px`,
          '--from-y': `${path.from.y}px`,
          '--from-z': `${path.from.z}px`,
          '--to-x': `${path.to.x}px`,
          '--to-y': `${path.to.y}px`,
          '--to-z': `${path.to.z}px`,
          '--mid-x': `${path.mid.x}px`,
          '--mid-y': `${path.mid.y}px`,
          '--mid-z': `${path.mid.z}px`,
          '--connection-opacity': opacity,
          opacity
        } as React.CSSProperties}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={`
        ${styles.systemDiagram3D}
        ${className}
      `.trim()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-visible={isVisible}
      data-hovered={isHovered}
    >
      <div
        ref={sceneRef}
        className={styles.scene3D}
        style={{
          '--rotation-x': `${rotation.x}deg`,
          '--rotation-y': `${rotation.y}deg`,
          '--rotation-z': `${rotation.z}deg`,
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`
        } as React.CSSProperties}
      >
        {/* System nodes */}
        {systemNodes.map(renderNode)}
        
        {/* Connection lines */}
        {showConnections && systemNodes.map(node =>
          node.connections.map(connectionId => {
            const targetNode = systemNodes.find(n => n.id === connectionId)
            return targetNode ? renderConnection(node, targetNode) : null
          })
        )}
        
        {/* Central focus point */}
        <div className={styles.centerFocus} />
      </div>
      
      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>System Architecture</div>
        <div className={styles.legendItems}>
          {systemNodes.map(node => (
            <div
              key={node.id}
              className={styles.legendItem}
              onMouseEnter={() => handleNodeHover(node.id)}
              onMouseLeave={handleNodeLeave}
            >
              <div
                className={styles.legendColor}
                style={{ backgroundColor: node.color }}
              />
              <span className={styles.legendLabel}>{node.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemDiagram3D
