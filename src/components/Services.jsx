import React from 'react';

export default function Services({ servicesData }) {
  const services = Array.isArray(servicesData) ? servicesData : [
    { title: "Web Development", description: "Building modern, responsive, and performance-focused web applications." },
    { title: "C++ & Algorithms", description: "Writing efficient, high-performance logic and data structures." },
    { title: "UI/UX & Frontend", description: "Crafting interactive, smooth, and visually appealing user interfaces." }
  ];

  return (
    <section className="section-padding bg-dark" id="services">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label reveal">What I Do</span>
        </div>
        <div className="section-title reveal">MY SERVICES</div>
        <div className="services-grid" id="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-item reveal hover-target">
              <span className="service-num">0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
