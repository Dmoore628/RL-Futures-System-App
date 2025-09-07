/**
 * ModernLayout Component
 * 
 * Modern, desktop-optimized layout component for the welcome page.
 * Provides a sophisticated grid-based layout system with scroll-driven
 * animations and responsive design patterns.
 * 
 * @component
 * @returns {JSX.Element} The ModernLayout component
 */

import React, { useRef, useEffect } from 'react'
import { useScrollAnimation, useIntersectionObserver } from '../../hooks/useScrollAnimation'
import styles from './ModernLayout.module.css'

interface ModernLayoutProps {
  children: React.ReactNode
  className?: string
  variant?: 'hero' | 'content' | 'fullscreen' | 'grid'
  animationDelay?: number
}

const ModernLayout: React.FC<ModernLayoutProps> = ({
  children,
  className = '',
  variant = 'content',
  animationDelay = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollPosition, isScrolling } = useScrollAnimation()
  const { elementRef, isVisible, hasAnimated } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    triggerOnce: true,
    delay: animationDelay
  })

  // Combine refs for intersection observer
  useEffect(() => {
    if (containerRef.current) {
      elementRef.current = containerRef.current
    }
  }, [elementRef])

  // Dynamic class names based on variant and state
  const getVariantClass = () => {
    switch (variant) {
      case 'hero':
        return styles.heroLayout
      case 'content':
        return styles.contentLayout
      case 'fullscreen':
        return styles.fullscreenLayout
      case 'grid':
        return styles.gridLayout
      default:
        return styles.contentLayout
    }
  }

  const getAnimationClass = () => {
    if (!isVisible) return styles.hidden
    if (hasAnimated) return styles.animated
    return styles.entering
  }

  const getScrollClass = () => {
    if (isScrolling) return styles.scrolling
    return styles.static
  }

  return (
    <div
      ref={containerRef}
      className={`
        ${styles.modernLayout}
        ${getVariantClass()}
        ${getAnimationClass()}
        ${getScrollClass()}
        ${className}
      `.trim()}
      data-scroll-position={scrollPosition.progress}
      data-is-visible={isVisible}
      data-has-animated={hasAnimated}
    >
      {children}
    </div>
  )
}

/**
 * Section Component
 * 
 * Individual section wrapper with scroll-triggered animations.
 * Provides consistent spacing and animation patterns.
 */
interface SectionProps {
  children: React.ReactNode
  className?: string
  height?: 'auto' | 'screen' | 'half' | 'quarter'
  background?: 'primary' | 'secondary' | 'tertiary' | 'dark' | 'transparent'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale'
  delay?: number
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  height = 'auto',
  background = 'primary',
  padding = 'lg',
  animation = 'fade',
  delay = 0
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const { elementRef, isVisible, hasAnimated } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    triggerOnce: true,
    delay
  })

  useEffect(() => {
    if (sectionRef.current) {
      elementRef.current = sectionRef.current
    }
  }, [elementRef])

  const getHeightClass = () => {
    switch (height) {
      case 'screen':
        return styles.heightScreen
      case 'half':
        return styles.heightHalf
      case 'quarter':
        return styles.heightQuarter
      default:
        return styles.heightAuto
    }
  }

  const getBackgroundClass = () => {
    switch (background) {
      case 'secondary':
        return styles.bgSecondary
      case 'tertiary':
        return styles.bgTertiary
      case 'dark':
        return styles.bgDark
      case 'transparent':
        return styles.bgTransparent
      default:
        return styles.bgPrimary
    }
  }

  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return styles.paddingNone
      case 'sm':
        return styles.paddingSm
      case 'md':
        return styles.paddingMd
      case 'lg':
        return styles.paddingLg
      case 'xl':
        return styles.paddingXl
      default:
        return styles.paddingLg
    }
  }

  const getAnimationClass = () => {
    if (!isVisible) return styles.hidden
    if (hasAnimated) return styles.animated
    return styles.entering
  }

  return (
    <section
      ref={sectionRef}
      className={`
        ${styles.section}
        ${getHeightClass()}
        ${getBackgroundClass()}
        ${getPaddingClass()}
        ${getAnimationClass()}
        ${styles[`animation-${animation}`]}
        ${className}
      `.trim()}
      data-animation={animation}
      data-delay={delay}
    >
      {children}
    </section>
  )
}

/**
 * Container Component
 * 
 * Responsive container with max-width constraints and centering.
 * Provides consistent content width across different screen sizes.
 */
interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  centered?: boolean
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'xl',
  centered = true
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles.containerSm
      case 'md':
        return styles.containerMd
      case 'lg':
        return styles.containerLg
      case 'xl':
        return styles.containerXl
      case '2xl':
        return styles.container2xl
      case 'full':
        return styles.containerFull
      default:
        return styles.containerXl
    }
  }

  return (
    <div
      className={`
        ${styles.container}
        ${getSizeClass()}
        ${centered ? styles.centered : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}

/**
 * Grid Component
 * 
 * CSS Grid layout component with responsive columns.
 * Provides flexible grid system for complex layouts.
 */
interface GridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

export const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  columns = 3,
  gap = 'md',
  responsive = true
}) => {
  const getColumnsClass = () => {
    return styles[`grid-${columns}`]
  }

  const getGapClass = () => {
    switch (gap) {
      case 'none':
        return styles.gapNone
      case 'sm':
        return styles.gapSm
      case 'md':
        return styles.gapMd
      case 'lg':
        return styles.gapLg
      case 'xl':
        return styles.gapXl
      default:
        return styles.gapMd
    }
  }

  return (
    <div
      className={`
        ${styles.grid}
        ${getColumnsClass()}
        ${getGapClass()}
        ${responsive ? styles.responsive : ''}
        ${className}
      `.trim()}
      style={{ '--grid-columns': columns } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

/**
 * Flex Component
 * 
 * Flexbox layout component with common flex patterns.
 * Provides quick flex layouts for simple arrangements.
 */
interface FlexProps {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  wrap?: boolean
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className = '',
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'md'
}) => {
  const getDirectionClass = () => {
    return styles[`flex-${direction}`]
  }

  const getJustifyClass = () => {
    return styles[`justify-${justify}`]
  }

  const getAlignClass = () => {
    return styles[`align-${align}`]
  }

  const getGapClass = () => {
    switch (gap) {
      case 'none':
        return styles.gapNone
      case 'sm':
        return styles.gapSm
      case 'md':
        return styles.gapMd
      case 'lg':
        return styles.gapLg
      case 'xl':
        return styles.gapXl
      default:
        return styles.gapMd
    }
  }

  return (
    <div
      className={`
        ${styles.flex}
        ${getDirectionClass()}
        ${getJustifyClass()}
        ${getAlignClass()}
        ${wrap ? styles.flexWrap : ''}
        ${getGapClass()}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}

export default ModernLayout
