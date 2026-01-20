import './style.css'

console.log('Digital Wellbeing Week landing page loaded');

// --- Preloader ---
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Add a small delay for smoother UX or ensuring fonts load
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 500);
  }
});

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
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
  document.body.style.overflow = isExpanded ? '' : 'hidden';
}

function closeMobileMenu() {
  if (!mobileMenuToggle) return;
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

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
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

// --- Back to Top Button ---
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


// --- Number Counter Animation ---
const statCards = document.querySelectorAll('.stat-card');

function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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


// --- Background Parallax (Scroll Driven) ---
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('.orb').forEach((orb, index) => {
    const speed = (index + 1) * 0.1;
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// --- Mouse Parallax for Orbs (Subtle additional effect) ---
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb');
  const x = (window.innerWidth - e.pageX * 2) / 100;
  const y = (window.innerHeight - e.pageY * 2) / 100;

  orbs.forEach((orb, index) => {
    // We add this to the scroll transform, requiring a more complex approach 
    // or just keeping it subtle. For simplicity, let's skip mixing both transforms 
    // in this clean-up to avoid conflicts, or use CSS variables.
    // Let's stick to just scroll parallax for now as it's cleaner.
  });
});


// --- FAQ Accordion ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
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


// --- Quiz Modal Logic (Refactored) ---
const quizModal = document.querySelector('#quiz-modal');
const closeBtn = document.querySelector('.modal-close');
const openQuizBtn = document.getElementById('open-quiz-btn');
const startQuizBtn = document.getElementById('start-quiz-btn');
const closeQuizResultBtn = document.getElementById('close-quiz-btn'); // Link in result
let quizScore = 0;

function openQuiz() {
  quizModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuiz() {
  quizModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Event Listeners for Quiz
if (openQuizBtn) openQuizBtn.addEventListener('click', openQuiz);
if (closeBtn) closeBtn.addEventListener('click', closeQuiz);
if (closeQuizResultBtn) closeQuizResultBtn.addEventListener('click', closeQuiz);

if (quizModal) {
  quizModal.addEventListener('click', (e) => {
    if (e.target === quizModal) closeQuiz();
  });
}

if (startQuizBtn) {
  startQuizBtn.addEventListener('click', () => {
    document.querySelector('[data-step="start"]').classList.add('hidden');
    document.querySelector('[data-step="1"]').classList.remove('hidden');
  });
}

// Option Buttons
document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const points = parseInt(e.target.dataset.points);
    const isFinal = e.target.dataset.final === 'true';

    quizScore += points;
    const currentStep = e.target.closest('.quiz-step');

    currentStep.classList.add('hidden');

    if (isFinal) {
      finishQuiz();
    } else {
      const nextStepNum = parseInt(currentStep.dataset.step) + 1;
      const nextStep = document.querySelector(`[data-step="${nextStepNum}"]`);
      if (nextStep) nextStep.classList.remove('hidden');
    }
  });
});

function finishQuiz() {
  const resultStep = document.querySelector('[data-step="result"]');
  resultStep.classList.remove('hidden');

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
}


// --- Form Handling ---
const form = document.querySelector('.cta-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';

    setTimeout(() => {
      alert('Спасибо за заявку! Мы свяжемся с вами.');
      btn.textContent = originalText;
      form.reset();
    }, 1000);
  });
}


// --- 3D Tilt Effect (Optimized) ---
const glassCards = document.querySelectorAll('.glass-card');
glassCards.forEach(card => {
  let ticking = false;

  card.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        ticking = false;
      });
      ticking = true;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
});

