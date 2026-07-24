import { useEffect } from 'react';

export function useCustomCursor() {
  useEffect(() => {
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    const curText = document.getElementById('cursor-text');

    if (!cur || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let animId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = `${mx}px`;
      cur.style.top = `${my}px`;
    };

    function animRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      animId = requestAnimationFrame(animRing);
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, .hover-target, .work-item, .project-card, [data-cursor="view"]');
      if (target) {
        const isProject = target.classList.contains('project-card') || 
                          target.classList.contains('work-item') || 
                          target.getAttribute('data-cursor') === 'view';

        if (isProject) {
          cur.style.width = '84px';
          cur.style.height = '84px';
          ring.style.width = '0px';
          ring.style.height = '0px';
          ring.style.opacity = '0';
          if (curText) {
            curText.textContent = 'View →';
            curText.style.opacity = '1';
          }
        } else {
          cur.style.width = '24px';
          cur.style.height = '24px';
          ring.style.width = '54px';
          ring.style.height = '54px';
          ring.style.opacity = '0.5';
          if (curText) {
            curText.style.opacity = '0';
          }
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, input, textarea, .hover-target, .work-item, .project-card, [data-cursor="view"]');
      if (target) {
        cur.style.width = '10px';
        cur.style.height = '10px';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.opacity = '1';
        if (curText) {
          curText.style.opacity = '0';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animRing();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);
}
