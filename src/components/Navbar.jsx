import React, { useState } from 'react';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">
          <div className="nav-logo-box">JD</div>JATIN
        </div>

        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><span className="nav-sep">/</span></li>
          <li><a href="#works">Work</a></li>
          <li><span className="nav-sep">/</span></li>
          <li><a href="#experience">Experience</a></li>
          <li><span className="nav-sep">/</span></li>
          <li><a href="#about">About</a></li>
        </ul>

        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#contact" style={{ textDecoration: 'none' }} className="desktop-btn">
            <button className="btn-hire hover-target">
              <span>Hire Me</span>
            </button>
          </a>

          <div
            className={`hamburger hover-target ${isMobileOpen ? 'active' : ''}`}
            id="hamburgerBtn"
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${isMobileOpen ? 'active' : ''}`} id="mobileMenu">
        <div className="close-menu hover-target" id="closeMenuBtn" onClick={closeMobileMenu}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <ul className="mobile-menu-links">
          <li><a href="#home" className="mobile-link hover-target" onClick={closeMobileMenu}>Home</a></li>
          <li><a href="#about" className="mobile-link hover-target" onClick={closeMobileMenu}>About</a></li>
          <li><a href="#services" className="mobile-link hover-target" onClick={closeMobileMenu}>Services</a></li>
          <li><a href="#works" className="mobile-link hover-target" onClick={closeMobileMenu}>Works</a></li>
          <li><a href="#experience" className="mobile-link hover-target" onClick={closeMobileMenu}>Experience</a></li>
          <li><a href="#contact" className="mobile-link hover-target" onClick={closeMobileMenu}>Contact</a></li>
        </ul>
      </div>
    </>
  );
}
