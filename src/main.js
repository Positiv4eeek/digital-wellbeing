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

// --- Header Scroll Effect & Smart Hide ---
const header = document.querySelector('.glass-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Glass effect
  if (currentScrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


// --- Active Link Highlighter ---
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navLi.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href').includes(current) && current !== '') {
      a.classList.add('active');
    }
  });
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

// --- FAQ Accordion ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all other items (optional - if we want one open at a time)
    faqItems.forEach(otherItem => {
      otherItem.classList.remove('active');
      otherItem.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// --- Floating CTA (Mobile) ---
const floatingCTA = document.querySelector('.floating-cta');
const heroSection = document.querySelector('.hero-section');

window.addEventListener('scroll', () => {
  if (floatingCTA && heroSection) {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > heroBottom) {
      floatingCTA.classList.add('visible');
    } else {
      floatingCTA.classList.remove('visible');
    }
  }
});


// --- Quiz Modal Logic ---
const quizModal = document.querySelector('#quiz-modal');
const closeBtn = document.querySelector('.modal-close');
let quizScore = 0;

// Expose 'openQuiz' to global scope (for HTML onclick)
window.openQuiz = function () {
  quizModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeQuiz = function () {
  quizModal.classList.remove('active');
  document.body.style.overflow = '';
  // Optional: reset quiz logic here if needed
};

// Close on overlay click
quizModal.addEventListener('click', (e) => {
  if (e.target === quizModal) window.closeQuiz();
});

closeBtn.addEventListener('click', window.closeQuiz);


// Quiz Navigation
window.startQuiz = function () {
  document.querySelector('[data-step="start"]').classList.add('hidden');
  document.querySelector('[data-step="1"]').classList.remove('hidden');
};

window.nextQuestion = function (points) {
  quizScore += points;
  const currentStep = event.target.closest('.quiz-step');
  const nextStepNum = parseInt(currentStep.dataset.step) + 1;

  currentStep.classList.add('hidden');
  document.querySelector(`[data-step="${nextStepNum}"]`).classList.remove('hidden');
};

window.finishQuiz = function (points) {
  quizScore += points;
  const currentStep = event.target.closest('.quiz-step');
  currentStep.classList.add('hidden');

  const resultStep = document.querySelector('[data-step="result"]');
  resultStep.classList.remove('hidden');

  // Calculate percentage (max score 30)
  const percentage = Math.round((quizScore / 30) * 100);
  document.getElementById('quiz-score').textContent = percentage;

  const msgElement = document.getElementById('quiz-msg');
  if (percentage < 30) {
    msgElement.textContent = "У вас отличный контроль! Программа поможет закрепить результат.";
  } else if (percentage < 70) {
    msgElement.textContent = "Уровень стресса повышен. Пора взять паузу.";
  } else {
    msgElement.textContent = "Критический уровень! Вам срочно нужен цифровой детокс.";
  }
};
// --- Form Handling ---
const form = document.getElementById('lead-form');
const formContainer = document.querySelector('.cta-form');
const successMessage = document.querySelector('.form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simulate API call
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';

    setTimeout(() => {
      form.classList.add('hidden');
      successMessage.classList.remove('hidden');
      btn.textContent = originalText;
      form.reset();
    }, 1000);
  });
}

window.resetForm = function () {
  form.classList.remove('hidden');
  successMessage.classList.add('hidden');
};
