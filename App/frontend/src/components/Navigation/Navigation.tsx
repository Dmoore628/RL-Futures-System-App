import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navigation.module.css'

const Navigation: React.FC = () => {
  const location = useLocation()

  const navigationItems = [
    { path: '/welcome', label: 'Welcome' },
    { path: '/upload-and-settings', label: 'Upload & Settings' }
  ]

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.rocket}>🚀</span>
          <span className={styles.companyName}>Moore Tech</span>
        </div>
        
        <div className={styles.navLinks}>
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${
                location.pathname === item.path ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.systemStatus}>
          <span className={styles.statusIndicator}></span>
          <span className={styles.statusText}>System Online</span>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
