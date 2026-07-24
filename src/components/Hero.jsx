import React, { useEffect, useRef } from 'react';
import myImg from '../assets/myimg.png';
import DOMPurify from 'dompurify';

export default function Hero({ heroData }) {
  const heroNameRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroNameRef.current) {
        const sy = window.scrollY;
        heroNameRef.current.style.transform = `translateY(${sy * 0.18}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tag = heroData?.tag || "Full Stack & C++ Developer";
  const firstName = heroData?.firstName || "JATIN";
  const lastName = heroData?.lastName || "DHIMAN";

  return (
    <section className="hero" id="home">
      <div className="hero-bg-circle"></div>
      <div className="hero-inner">
        <p
          className="hero-tag"
          id="hero-tag"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tag) }}
        ></p>
        <div className="hero-name-wrap hover-target">
          <div className="hero-name" ref={heroNameRef}>
            <span id="hero-firstname">{firstName}&nbsp;</span>
            <span id="hero-lastname">{lastName}</span>
          </div>
          <div className="hero-photo-wrap">
            <img src={myImg} alt={`${firstName} ${lastName}`} />
          </div>
        </div>
      </div>
      <div className="scroll-hint">
        Scroll down
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}
