import React from 'react';

export default function Experience({ experienceData }) {
  const experiences = Array.isArray(experienceData) ? experienceData : [
    { year: "2024 - PRESENT", role: "Full Stack Developer", company: "Independent / Projects" }
  ];

  return (
    <section className="section-padding bg-gray" id="experience">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label reveal">Involvement</span>
        </div>
        <div className="section-title reveal">EXPERIENCE</div>
        <div className="exp-list" id="experience-list">
          {experiences.map((exp, index) => (
            <div key={index} className="exp-item reveal hover-target">
              <span className="exp-year">{exp.year}</span>
              <span className="exp-role">{exp.role}</span>
              <span className="exp-company">{exp.company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
