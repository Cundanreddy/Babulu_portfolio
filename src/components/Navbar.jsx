import { useState, useEffect } from 'react'
import './Navbar.css'

function Navbar({ setActiveView }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="#home">Portfolio</a>
        </div>
        <ul className="nav-menu">
        <li className="nav-item">
            <a href="#about" className="nav-link" onClick={() => setActiveView('front')}>About</a>
          </li>
          <li className="nav-item">
            <a href="#home" className="nav-link" onClick={() => setActiveView('left')}>Projects</a>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link" onClick={() => setActiveView('tvfull')}>Featured</a>
          </li>
          <li className="nav-item">
            <a href="#projects" className="nav-link" onClick={() => setActiveView('back')}>Gallery</a>
          </li>
          <li className="nav-item">
            <a href="#contact" className="nav-link" onClick={() => setActiveView('right')}>Contact</a>
          </li>
          {/* <li className="nav-item">
            <button 
              className={`nav-link orbit-toggle ${orbitControlsEnabled ? 'active' : ''}`}
              onClick={() => setOrbitControlsEnabled(!orbitControlsEnabled)}
            >
              {orbitControlsEnabled ? 'Single Side' : 'Look Around'}
            </button>
          </li> */}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar 