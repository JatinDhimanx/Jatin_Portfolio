import { useEffect } from 'react';

export function useCustomCursor() {
  useEffect(() => {
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    const curText = document.getElementById('cursor-text');

    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let animId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = `${mx}px`;
      cur.style.top = `${my}px`;
    };

    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      animId = requestAnimationFrame(animRing);
    }

    document.addEventListener('mousemove', handleMouseMove);
    animRing();

    const interactiveSelectors = 'a, button, input, textarea, .hover-target';
    const elements = document.querySelectorAll(interactiveSelectors);

    elements.forEach((el) => {
      el.onmouseenter = () => {
        if (el.classList.contains('project-card')) {
          cur.style.width = '80px';
          cur.style.height = '80px';
          ring.style.width = '0px';
          ring.style.height = '0px';
          ring.style.opacity = '0';
          if (curText) {
            curText.textContent = 'View →';
            curText.style.opacity = '1';
          }
        } else {
          cur.style.width = '20px';
          cur.style.height = '20px';
          ring.style.width = '54px';
          ring.style.height = '54px';
          ring.style.opacity = '0.5';
        }
      };

      el.onmouseleave = () => {
        cur.style.width = '10px';
        cur.style.height = '10px';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.opacity = '1';
        if (curText) {
          curText.style.opacity = '0';
        }
      };
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);
}
