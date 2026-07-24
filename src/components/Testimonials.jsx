import React from 'react';

export default function Testimonials() {
  return (
    <section className="section-padding bg-white" id="testimonials">
      <div className="section-inner testimonial-wrap">
        <div className="quote-mark reveal">"</div>
        <p className="testimonial-text reveal reveal-delay-1">
          Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you
          believe is great work. And the only way to do great work is to love what you do.
        </p>
        <p className="testimonial-author reveal reveal-delay-2">
          Steve Jobs <span>Co-founder, Apple Inc.</span>
        </p>
      </div>
    </section>
  );
}
