import React from 'react';
import DOMPurify from 'dompurify';

export default function About({ aboutData }) {
  const title = aboutData?.title || "CRAFTSMAN OF DIGITAL EXPERIENCES";
  const description = aboutData?.description || "Passionate developer focused on building scalable web applications and high-performance algorithms.";

  return (
    <section className="about" id="about">
      <div className="about-big">ABOUT</div>
      <div className="about-inner">
        <div className="about-arrow reveal">↗</div>
        <div className="about-text">
          <h2
            className="reveal"
            id="about-title"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
          ></h2>
          <p className="reveal reveal-delay-1" id="about-description">
            {description}
          </p>
          <a href="#services" style={{ textDecoration: 'none' }}>
            <span className="about-tag hover-target reveal reveal-delay-2">What I Do ↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
