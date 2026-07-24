import React from 'react';

export default function Footer({ contactEmail }) {
  const email = contactEmail || "forworkm9@gmail.com";

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-cta reveal">
          LET'S<br /><span>CODE</span><br />TOGETHER
        </div>
        <a href={`mailto:${email}`} id="footer-email" className="footer-email reveal hover-target">
          {email}
        </a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Jatin Dhiman</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
