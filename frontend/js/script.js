// ── Loader dismiss
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

// ── Custom cursor logic
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
});

function animRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animRing);
}
animRing();

// ── Unified hover logic for interactive elements
const interactiveSelectors = 'a, button, input, textarea, .hover-target';
document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cur && ring) {
            cur.style.width = '20px'; cur.style.height = '20px';
            ring.style.width = '54px'; ring.style.height = '54px';
            ring.style.opacity = '0.5';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cur && ring) {
            cur.style.width = '10px'; cur.style.height = '10px';
            ring.style.width = '36px'; ring.style.height = '36px';
            ring.style.opacity = '1';
        }
    });
});

// ── Scroll reveal
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Parallax name on scroll
window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const name = document.querySelector('.hero-name');
    if (name) name.style.transform = `translateY(${sy * 0.18}px)`;
}, { passive: true });

// ── FAQ Accordion Logic
document.querySelectorAll('.faq-q').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('span');

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.textContent = '+';
        } else {
            // Close all other open FAQs
            document.querySelectorAll('.faq-a').forEach(a => a.style.display = 'none');
            document.querySelectorAll('.faq-q span').forEach(i => i.textContent = '+');

            answer.style.display = 'block';
            icon.textContent = '-';
        }
    });
});

// ── Hamburger Menu & Cut Button Logic ──
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const closeMenuBtn = document.getElementById('closeMenuBtn');

if (hamburgerBtn && mobileMenu) {
    // Open/Close menu when 3 lines are clicked
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu automatically when any mobile link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// Close menu when 'X' is clicked
if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
}
document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const statusText = document.getElementById('formStatus');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    submitBtn.innerText = 'Sending...';
    statusText.innerText = '';

    try {
        // Use localhost for local testing. Before deploying, change back to: 'https://jatin-portfolio-api-o5qb.onrender.com/'
        const response = await fetch("https://jatin-portfolio-api-o5qb.onrender.com", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
            statusText.innerText = 'Awesome! Message sent successfully.';
            statusText.style.color = '#ffffff'; // Tailwind's green-400
            document.getElementById('contactForm').reset();
        } else {
            statusText.innerText = 'Oops! Failed to send. Please try again.';
            statusText.style.color = '#ff8585'; // Tailwind's red-400
        }
    } catch (error) {
        console.error('Error:', error);
        statusText.innerText = 'Message failed to send. Please check your connection and try again.';
        statusText.style.color = '#f87171';
    } finally {
        submitBtn.innerText = 'Send Message';
    }
});