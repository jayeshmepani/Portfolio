(function () {
    "use strict";

    function initLoaderDismiss() {
        const loader = document.getElementById("loader");
        if (!loader) return;

        let dismissed = false;
        const dismiss = () => {
            if (dismissed) return;
            dismissed = true;
            loader.classList.add("is-dismissed");
            setTimeout(() => {
                loader.remove();
            }, 850);
        };

        const minTimer = setTimeout(dismiss, 1350);

        window.addEventListener(
            "keydown",
            () => {
                clearTimeout(minTimer);
                dismiss();
            },
            { once: true }
        );

        loader.addEventListener(
            "click",
            () => {
                clearTimeout(minTimer);
                dismiss();
            },
            { once: true }
        );
    }

    function initScrollReveals() {
        const elements = document.querySelectorAll(".reveal-on-scroll");
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
        );

        elements.forEach((el) => observer.observe(el));
    }

    function initCardStack() {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const supportsCSSViewTimeline =
            window.CSS &&
            CSS.supports &&
            (CSS.supports("animation-timeline: view()") ||
                CSS.supports("view-timeline-name: --stack"));
        if (supportsCSSViewTimeline) {
            return;
        }

        const cards = Array.from(document.querySelectorAll(".stack-card"));
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

                const scale = Math.max(0.7, 1 - totalFactor * 0.035);
                const brightness = Math.max(0.42, 1 - totalFactor * 0.12);

                const inner = card.querySelector(".card-inner");
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

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        updateCardStack();
    }

    function initCardExpand() {
        document.querySelectorAll(".stack-card .card-inner").forEach((inner) => {
            if (inner.querySelector(".stack-card__toggle")) return;

            const card = inner.closest(".stack-card");
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "stack-card__toggle";
            btn.setAttribute("aria-expanded", "false");
            btn.textContent = "READ MORE";
            inner.appendChild(btn);

            btn.addEventListener("click", () => {
                const open = !card.classList.contains("is-expanded");
                document.querySelectorAll(".stack-card.is-expanded").forEach((other) => {
                    if (other === card) return;
                    other.classList.remove("is-expanded");
                    const otherBtn = other.querySelector(".stack-card__toggle");
                    if (otherBtn) {
                        otherBtn.setAttribute("aria-expanded", "false");
                        otherBtn.textContent = "READ MORE";
                    }
                });
                card.classList.toggle("is-expanded", open);
                btn.setAttribute("aria-expanded", String(open));
                btn.textContent = open ? "SHOW LESS" : "READ MORE";

                if (
                    window.__observatoryLenis &&
                    typeof window.__observatoryLenis.resize === "function"
                ) {
                    window.__observatoryLenis.resize();
                }
            });
        });
    }

    function initMobileNav() {
        const header = document.querySelector(".observatory-nav");
        const toggle = document.querySelector(".observatory-nav__toggle");
        const nav = document.getElementById("primary-nav");
        if (!header || !toggle || !nav) return;

        const desktopQuery = window.matchMedia("(width >= 768px)");
        const navLinks = nav.querySelectorAll("a");
        const headerHashLinks = header.querySelectorAll('a[href^="#"]');
        const main = document.getElementById("main-content");
        const footer = document.querySelector(".command-footer");

        const headerOffset = () => -(header.getBoundingClientRect().height + 12);

        const focusSection = (target) => {
            const heading = target.matches("h1, h2") ? target : target.querySelector("h1, h2");
            if (!heading) {
                toggle.focus();
                return;
            }
            if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
        };

        const scrollToSection = (target) => {
            requestAnimationFrame(() => {
                const offset = headerOffset();
                if (window.__observatoryLenis) {
                    window.__observatoryLenis.scrollTo(target, {
                        offset,
                        duration: 1.15,
                        force: true
                    });
                } else {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                focusSection(target);
            });
        };

        const setOpen = (open) => {
            header.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
            document.body.classList.toggle("nav-open", open);
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

        toggle.addEventListener("click", () => {
            setOpen(!header.classList.contains("is-open"));
        });

        headerHashLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href");
                if (!href || href === "#") return;
                const target = document.querySelector(href);
                if (!target) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                setOpen(false);
                scrollToSection(target);
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && header.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });

        const onBreakpoint = (event) => {
            if (event.matches) setOpen(false);
        };
        if (typeof desktopQuery.addEventListener === "function") {
            desktopQuery.addEventListener("change", onBreakpoint);
        } else if (typeof desktopQuery.addListener === "function") {
            desktopQuery.addListener(onBreakpoint);
        }
    }

    function initNavTracker() {
        const sections = document.querySelectorAll("main > section[id]");
        const navLinks = document.querySelectorAll(".observatory-nav__link");
        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            const href = link.getAttribute("href");
                            if (href === `#${id}`) {
                                link.setAttribute("aria-current", "page");
                            } else {
                                link.removeAttribute("aria-current");
                            }
                        });
                    }
                });
            },
            { threshold: 0.3, rootMargin: "-10% 0px -40% 0px" }
        );

        sections.forEach((section) => observer.observe(section));
    }

    document.addEventListener("DOMContentLoaded", () => {
        initLoaderDismiss();
        initScrollReveals();
        initCardStack();
        initCardExpand();
        initMobileNav();
        initNavTracker();
        initLenis();
        initTypewriter();
        initCanvasStarfield();
        initMouseSpotlight();
        const yearEl = document.getElementById("current-year");
        yearEl?.setAttribute("datetime", (yearEl.textContent = new Date().getFullYear()));
    });
})();

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = roles[0];
        return;
    }

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
            speed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

window.__scrollVelocity = 0;

function initCanvasStarfield() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

    const numStars = Math.min(110, Math.floor(window.innerWidth / 14));
    const stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.3 + 0.3,
            alpha: Math.random() * 0.7 + 0.25,
            dx: (Math.random() - 0.5) * 0.15,
            dy: (Math.random() - 0.5) * 0.15,
            speedFactor: Math.random() * 0.45 + 0.15
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        const vel = window.__scrollVelocity || 0;
        const accelY = vel * 0.08;

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.x += s.dx;
            s.y += s.dy + accelY * s.speedFactor;

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

function initLenis() {
    if (typeof window.Lenis === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const lenis = new window.Lenis({
        duration: isMobile ? 0.95 : 1.35,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.08,
        touchMultiplier: 1.0
    });
    window.__observatoryLenis = lenis;

    const progressBar = document.getElementById("scroll-progress");
    const supportsCSSScrollTimeline =
        typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        CSS.supports("animation-timeline: scroll()");

    lenis.on("scroll", (e) => {
        window.__scrollVelocity = e.velocity || 0;
        if (!supportsCSSScrollTimeline && progressBar && typeof e.progress === "number") {
            progressBar.style.transform = `scaleX(${e.progress})`;
        }
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId && targetId !== "#") {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const nav = document.querySelector(".observatory-nav");
                    if (document.body.classList.contains("nav-open")) {
                        return;
                    }
                    const offset = nav ? -(nav.getBoundingClientRect().height + 12) : -80;
                    lenis.scrollTo(targetEl, {
                        offset,
                        duration: 1.6,
                        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
                        force: true
                    });
                }
            }
        });
    });
}

function initMouseSpotlight() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = document.querySelectorAll(
        ".arsenal-card, .archive-card, .career-card, .stack-card, .card-inner"
    );
    if (!cards.length) return;

    cards.forEach((card) => {
        let rect = null;
        let rafId = null;
        let mouseX = 0;
        let mouseY = 0;

        const updatePosition = () => {
            if (!rect) return;
            const x = mouseX - rect.left;
            const y = mouseY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
            rafId = null;
        };

        const updateRect = () => {
            rect = card.getBoundingClientRect();
        };

        card.addEventListener("mouseenter", updateRect, { passive: true });

        card.addEventListener(
            "mousemove",
            (e) => {
                if (!rect) updateRect();
                mouseX = e.clientX;
                mouseY = e.clientY;
                if (!rafId) {
                    rafId = requestAnimationFrame(updatePosition);
                }
            },
            { passive: true }
        );

        card.addEventListener(
            "mouseleave",
            () => {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                rect = null;
            },
            { passive: true }
        );
    });
}
