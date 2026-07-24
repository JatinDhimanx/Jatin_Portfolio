import React from 'react';

export default function Projects({ projectsData }) {
  const projects = Array.isArray(projectsData) ? projectsData : [
    { name: "Portfolio Website", type: "Web App", url: "https://github.com/JatinDhimanx" }
  ];

  const handleProjectClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="section-padding bg-white" id="works">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label reveal">Selected Works</span>
        </div>
        <div className="section-title reveal">PROJECTS</div>
        <div id="projects-list">
          {projects.map((project, index) => (
            <div
              key={index}
              className="work-item reveal hover-target project-card"
              onClick={() => handleProjectClick(project.url)}
            >
              <span className="work-name">{project.name}</span>
              <span className="work-type">{project.type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
