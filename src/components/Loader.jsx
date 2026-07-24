import React, { useEffect, useState } from 'react';

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) {
        loader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        loader.style.opacity = '0';
        loader.style.transform = 'translateY(-100%)';
        setTimeout(() => setShow(false), 700);
      } else {
        setShow(false);
      }
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div id="loader">
      <div id="loader-text">JATIN</div>
      <div id="loader-bar"></div>
    </div>
  );
}
