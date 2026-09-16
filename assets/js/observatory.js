/**
 * THE SCIENTIFIC OBSERVATORY :: LIGHTWEIGHT TELEMETRY & MOTION RUNTIME
 * ====================================================================
 */

(function () {
  'use strict';

  // 1. ASTROLABE LOCAL SIDEREAL TIME & TITHI CALCULATION
  // Coordinates for Kutch, Gujarat: 23.2420° N, 69.6669° E (Longitude: 69.6669 deg)
  const LONGITUDE_DEG = 69.6669;

  function calculateLST() {
    const now = new Date();
    // Julian Date calculation
    const jd = (now.getTime() / 86400000) + 2440587.5;
    const d = jd - 2451545.0; // Days since J2000.0
    
    // Greenwich Mean Sidereal Time (GMST) in degrees
    let gmst = 280.46061837 + 360.98564736629 * d;
    gmst = ((gmst % 360) + 360) % 360;

    // Local Sidereal Time (LST) = GMST + Longitude
    let lstDeg = ((gmst + LONGITUDE_DEG) % 360 + 360) % 360;
    
    // Convert degrees to hours, minutes, seconds
    const lstHoursTotal = lstDeg / 15.0;
    const h = Math.floor(lstHoursTotal);
    const m = Math.floor((lstHoursTotal - h) * 60);
    const s = Math.floor(((lstHoursTotal - h) * 60 - m) * 60);

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }

  function updateTelemetryClock() {
    const lstEl = document.getElementById('telemetry-lst');
    if (lstEl) {
      lstEl.textContent = calculateLST();
    }
  }

  // 3. SYSTEM LOADER DISMISSAL (Infinity Screen from Screenshot 163)
  function initLoaderDismiss() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      loader.classList.add('is-dismissed');
      setTimeout(() => {
        loader.remove();
      }, 850);
    };

    // Keep visible for 1.3s to enjoy the infinity loop portal, or dismiss on click/key
    const minTimer = setTimeout(dismiss, 1350);

    window.addEventListener('keydown', () => {
      clearTimeout(minTimer);
      dismiss();
    }, { once: true });

    loader.addEventListener('click', () => {
      clearTimeout(minTimer);
      dismiss();
    }, { once: true });
  }

  // 4. INTERACTIVE FFI CODE SWITCHER (Flagship 01)
  function initCodeSwitchers() {
    const tabs = document.querySelectorAll('[data-code-tab]');
    const views = document.querySelectorAll('[data-code-view]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-code-tab');
        tabs.forEach((t) => t.classList.remove('button--primary'));
        tab.classList.add('button--primary');

        views.forEach((view) => {
          if (view.getAttribute('data-code-view') === target) {
            view.classList.remove('is-hidden');
          } else {
            view.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // 5. STAGGERED SCROLL REVEAL (IntersectionObserver based)
  function initScrollReveals() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    elements.forEach((el) => observer.observe(el));
  }

  // DOM INIT
  
  // 6. CARD STACKING INTERACTIVE SCROLL RUNTIME (Fallback & Enhancement)
  function initCardStack() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if browser already supports native CSS view-timeline
    const supportsCSSViewTimeline = window.CSS && CSS.supports && (
      CSS.supports('animation-timeline: view()') || CSS.supports('view-timeline-name: --stack')
    );
    if (supportsCSSViewTimeline) {
      return; // Handled smoothly by browser CSS engine
    }

    const cards = Array.from(document.querySelectorAll('.stack-card'));
    if (cards.length === 0) return;

    let ticking = false;

    function updateCardStack() {
      const overlaps = [];

      for (let j = 1; j < cards.length; j++) {
        const prevCard = cards[j - 1];
        const currCard = cards[j];

        const prevRect = prevCard.getBoundingClientRect();
        const currRect = currCard.getBoundingClientRect();
        const currStickyTop = parseFloat(window.getComputedStyle(currCard).top);

        const start = prevRect.bottom;
        const end = currStickyTop;
        const totalDistance = start - end;

        let progress = 0;
        if (totalDistance > 0) {
          progress = (start - currRect.top) / totalDistance;
          progress = Math.min(Math.max(progress, 0), 1);
        }

        overlaps.push(progress);
      }

      cards.forEach((card, i) => {
        let totalFactor = 0;
        for (let k = i; k < overlaps.length; k++) {
          totalFactor += overlaps[k];
        }

        const scale = Math.max(0.70, 1 - (totalFactor * 0.035));
        const brightness = Math.max(0.42, 1 - (totalFactor * 0.12));

        const inner = card.querySelector('.card-inner');
        if (inner) {
          inner.style.transform = `scale(${scale})`;
          inner.style.filter = `brightness(${brightness})`;
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateCardStack();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateCardStack();
  }

  function initCardExpand() {
    document.querySelectorAll('.stack-card .card-inner').forEach((inner) => {
      if (inner.querySelector('.stack-card__toggle')) return;

      const card = inner.closest('.stack-card');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stack-card__toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Read more';
      inner.appendChild(btn);

      btn.addEventListener('click', () => {
        const open = !card.classList.contains('is-expanded');
        document.querySelectorAll('.stack-card.is-expanded').forEach((other) => {
          if (other === card) return;
          other.classList.remove('is-expanded');
          const otherBtn = other.querySelector('.stack-card__toggle');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherBtn.textContent = 'Read more';
          }
        });
        card.classList.toggle('is-expanded', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Show less' : 'Read more';
      });
    });
  }

  function initMobileNav() {
    const header = document.querySelector('.observatory-nav');
    const toggle = document.querySelector('.observatory-nav__toggle');
    const nav = document.getElementById('primary-nav');
    if (!header || !toggle || !nav) return;

    const desktopQuery = window.matchMedia('(width >= 768px)');
    const navLinks = nav.querySelectorAll('a');
    const headerHashLinks = header.querySelectorAll('a[href^="#"]');
    const main = document.getElementById('main-content');
    const footer = document.querySelector('.command-footer');

    const headerOffset = () => -(header.getBoundingClientRect().height + 12);

    const focusSection = (target) => {
      const heading = target.matches('h1, h2') ? target : target.querySelector('h1, h2');
      if (!heading) {
        toggle.focus();
        return;
      }
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    };

    const scrollToSection = (target) => {
      requestAnimationFrame(() => {
        const offset = headerOffset();
        if (window.__observatoryLenis) {
          window.__observatoryLenis.scrollTo(target, { offset, duration: 1.15, force: true });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        focusSection(target);
      });
    };

    const setOpen = (open) => {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
      if (main) main.inert = open;
      if (footer) footer.inert = open;
      if (window.__observatoryLenis) {
        if (open) window.__observatoryLenis.stop();
        else window.__observatoryLenis.start();
      }
      if (open) {
        navLinks[0]?.focus();
      }
    };

    toggle.addEventListener('click', () => {
      setOpen(!header.classList.contains('is-open'));
    });

    headerHashLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        setOpen(false);
        scrollToSection(target);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    const onBreakpoint = (event) => {
      if (event.matches) setOpen(false);
    };
    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', onBreakpoint);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(onBreakpoint);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateTelemetryClock();
    setInterval(updateTelemetryClock, 1000);
    initLoaderDismiss();
    initCodeSwitchers();
    initScrollReveals();
    initCardStack();
    initCardExpand();
    initMobileNav();
  });
})();

// 6. TYPEWRITER EFFECT
function initTypewriter() {
  const el = document.getElementById("typewriter-text");
  if (!el) return;

  const roles = [
    "Full-Stack & App Developer",
    "Computer Scientist & Engineer",
    "Astronomical Engine Architect",
    "Rust Compiler & Tooling Developer",
    "Multilingual NLP Specialist",
    "Eternal Systems Learner"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIdx === current.length) {
      speed = 1800; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400; // pause before next
    }

    setTimeout(type, speed);
  }

  type();
}

// 7. LIGHTWEIGHT CANVAS STARFIELD (Subtle Ambient Motion, Zero Library Overhead)
function initCanvasStarfield() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const numStars = Math.min(100, Math.floor(window.innerWidth / 15));
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.dx;
      s.y += s.dy;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(45, 212, 191, " + s.alpha + ")";
      ctx.fill();
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// Attach to DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initTypewriter();
  initCanvasStarfield();
  initMouseSpotlight();
});

// 8. LENIS SMOOTH INERTIAL ACCELERATION SCROLL ENGINE
function initLenis() {
  if (typeof window.Lenis === 'undefined') return;

  const lenis = new window.Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.1,
  });
  window.__observatoryLenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth internal anchor scroll integration
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const nav = document.querySelector('.observatory-nav');
          if (document.body.classList.contains('nav-open')) {
            return;
          }
          const offset = nav ? -(nav.getBoundingClientRect().height + 12) : -80;
          lenis.scrollTo(targetEl, { offset, duration: 1.3, force: true });
        }
      }
    });
  });
}

// 9. INTERACTIVE MOUSE SPOTLIGHT (Dynamic Glassmorphic Sheen)
function initMouseSpotlight() {
  const cards = document.querySelectorAll('.arsenal-card, .archive-card, .career-card, .stack-card, .card-inner');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
