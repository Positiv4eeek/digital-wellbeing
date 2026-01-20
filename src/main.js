import './style.css'

console.log('Digital Wellbeing Week landing page loaded');

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      // Close mobile menu if open
      closeMobileMenu();
    }
  });
});

// --- Scroll Animations ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');

      // Stop observing once visible (optional, for one-time animation)
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
  observer.observe(element);
});

// --- Mobile Menu Toggle ---
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const overlay = document.querySelector('.mobile-menu-overlay');

function toggleMobileMenu() {
  const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true' || false;
  mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
  mobileMenuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = isExpanded ? '' : 'hidden'; // Prevent scrolling when menu is open
}

function closeMobileMenu() {
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  mobileMenuToggle.classList.remove('active');
  navLinks.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (overlay) {
  overlay.addEventListener('click', closeMobileMenu);
}

// --- Header Scroll Effect ---
const header = document.querySelector('.glass-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// --- Number Counter Animation ---
const statCards = document.querySelectorAll('.stat-card');

function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Easing function (easeOutExpo)
    const value = progress === 1 ? end : end * (1 - Math.pow(2, -10 * progress));

    obj.innerHTML = `${prefix}${Math.floor(value)}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const h3 = entry.target.querySelector('h3');
      if (h3 && !h3.dataset.animated) {
        h3.dataset.animated = 'true';

        const originalText = h3.innerText;
        // Match numbers, prefixes, and suffixes
        // Example: "-40%" -> prefix: "-", number: "40", suffix: "%"
        const match = originalText.match(/^([^\d]*)(-?\d+)([^\d]*)$/);

        if (match) {
          const prefix = match[1] || '';
          const number = parseInt(match[2], 10);
          const suffix = match[3] || '';

          animateValue(h3, 0, Math.abs(number), 2000, prefix, suffix);
        }
      }
    }
  });
}, { threshold: 0.5 });

statCards.forEach(card => statsObserver.observe(card));


// --- Mouse Parallax for Orbs ---
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb');
  const x = (window.innerWidth - e.pageX * 2) / 100;
  const y = (window.innerHeight - e.pageY * 2) / 100;

  orbs.forEach((orb, index) => {
    // Different speed for each orb to create depth
    const speed = (index + 1) * 2;
    const xOffset = x * speed;
    const yOffset = y * speed;

    orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  });
});
