import React from 'react';

export default function Process() {
  return (
    <section className="section-padding bg-dark" id="process">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label reveal">How I Work</span>
        </div>
        <div className="section-title reveal">MY PROCESS</div>

        <div className="process-grid">
          <div className="process-step reveal hover-target">
            <span className="process-num">01</span>
            <h3>Ideation</h3>
            <p>
              Understanding the problem statement, brainstorming logical approaches, and planning the project architecture.
            </p>
          </div>
          <div className="process-step reveal reveal-delay-1 hover-target">
            <span className="process-num">02</span>
            <h3>Design</h3>
            <p>
              Structuring the user interface with HTML/CSS and planning the core C++ algorithms for optimal performance.
            </p>
          </div>
          <div className="process-step reveal reveal-delay-2 hover-target">
            <span className="process-num">03</span>
            <h3>Development</h3>
            <p>
              Writing clean, efficient code and integrating front-end systems with logical back-end structures.
            </p>
          </div>
          <div className="process-step reveal reveal-delay-3 hover-target">
            <span className="process-num">04</span>
            <h3>Testing</h3>
            <p>
              Hunting for bugs, securing vulnerabilities, and ensuring the final product works flawlessly before launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
