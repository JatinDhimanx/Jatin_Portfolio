// Wait for the DOM to fully load before attaching most event listeners
document.addEventListener('DOMContentLoaded', () => {

    // ── Custom Cursor Logic ──
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    if (cur && ring) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX; 
            my = e.clientY;
            cur.style.left = mx + 'px'; 
            cur.style.top = my + 'px';
        });

        function animRing() {
            rx += (mx - rx) * 0.12; 
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px'; 
            ring.style.top = ry + 'px';
            requestAnimationFrame(animRing);
        }
        animRing();

        // Unified hover logic for interactive elements
        const interactiveSelectors = 'a, button, input, textarea, .hover-target';
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cur.style.width = '20px'; cur.style.height = '20px';
                ring.style.width = '54px'; ring.style.height = '54px';
                ring.style.opacity = '0.5';
            });
            el.addEventListener('mouseleave', () => {
                cur.style.width = '10px'; cur.style.height = '10px';
                ring.style.width = '36px'; ring.style.height = '36px';
                ring.style.opacity = '1';
            });
        });
    }

    // ── Scroll Reveal ──
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // ── Parallax Name on Scroll ──
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            heroName.style.transform = `translateY(${sy * 0.18}px)`;
        }, { passive: true });
    }

    // ── FAQ Accordion Logic ──
    document.querySelectorAll('.faq-q').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('span');

            const isCurrentlyOpen = window.getComputedStyle(answer).display === 'block';

            if (isCurrentlyOpen) {
                answer.style.display = 'none';
                if (icon) icon.textContent = '+';
            } else {
                // Close all other open FAQs
                document.querySelectorAll('.faq-a').forEach(a => a.style.display = 'none');
                document.querySelectorAll('.faq-q span').forEach(i => i.textContent = '+');

                answer.style.display = 'block';
                if (icon) icon.textContent = '-';
            }
        });
    });

    // ── Hamburger Menu Logic ──
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    if (closeMenuBtn && hamburgerBtn && mobileMenu) {
        closeMenuBtn.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    }

    // ── Contact Form Logic ──
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const statusText = document.getElementById('formStatus');
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (submitBtn) submitBtn.innerText = 'Sending...';
            if (statusText) statusText.innerText = '';

            try {
                // UPDATED: Now points to the same origin relative path
                const response = await fetch("/", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (statusText) {
                    if (response.ok) {
                        statusText.innerText = 'Awesome! Message sent successfully.';
                        statusText.style.color = '#4ade80'; 
                        contactForm.reset();
                    } else {
                        statusText.innerText = 'Oops! Failed to send. Please try again.';
                        statusText.style.color = '#f87171'; 
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (statusText) {
                    statusText.innerText = 'Message failed to send. Please check your connection and try again.';
                    statusText.style.color = '#f87171';
                }
            } finally {
                if (submitBtn) submitBtn.innerText = 'Send Message';
            }
        });
    }
});

// ── Loader Dismiss ──
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            loader.style.opacity = '0';
            loader.style.transform = 'translateY(-100%)';
            setTimeout(() => loader.remove(), 700);
        }
    }, 1300);
});