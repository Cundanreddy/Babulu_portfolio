import './Navbar.css'
import { useState } from 'react'

function Navbar({ setActiveView }) {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <nav className="navbar glassy-bg">
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
          {/* <li className="nav-item">
            <a href="#about" className="nav-link" onClick={() => setActiveView('tvfull')}>Featured</a>
          </li> */}
          <li className="nav-item">
            <a href="#projects" className="nav-link" onClick={() => setActiveView('back')}>Gallery</a>
          </li>
          <li className="nav-item contact-dropdown">
            <a 
              href="#contact" 
              className="nav-link"
              onMouseEnter={() => setIsContactOpen(true)}
              onMouseLeave={() => setIsContactOpen(false)}
            >
              Contact
            </a>
            {isContactOpen && (
              <div 
                className="dropdown-menu"
                onMouseEnter={() => setIsContactOpen(true)}
                onMouseLeave={() => setIsContactOpen(false)}
              >
                <a href="mailto:your.email@example.com" className="dropdown-item">
                  <i className="fas fa-envelope"></i> manideepreddy9595@gmail.com
                </a>
                <a href="tel:+1234567890" className="dropdown-item">
                  <i className="fas fa-phone"></i> +91 91211 81521
                </a>
              </div>
            )}
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