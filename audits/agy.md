  Here is the complete, line-by-line in-depth architectural and design audit of your portfolio repository, analyzing index.html, style.min.css,
  custom.min.css, script.min.js, and icons.css.
  ──────
   🔍 Complete Forensic Audit & Deep Architectural Review
  ──────
  ## 1. Typography Overkill & Identity Crisis

  Your assessment that the typography is "overcooked" is accurate. The codebase loads and mixes 8 distinct font families plus icon glyph fonts:
  1. Google Fonts Request (index.html:154-156):
    fonts.googleapis.com/css2?family=Oswald:wght@700&family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,
  400;1,400&family=Manrope:wght@400;600&family=Press+Start+2P&family=Homemade+Apple&display=swap

      • Oswald (font-brutalist): Condensed heavy sans-serif. Used for brutalist headers and loading status text.
      • Syne (font-syne): Avant-garde geometric display. Used on project titles, nav links, CTA buttons.
      • JetBrains Mono (font-technical): Monospace terminal style. Used for metadata tags, status labels, dates.
      • Playfair Display (font-formal): High-contrast serif. Used in story paragraphs/quotes.
      • Manrope (font-geometric): Clean UI sans-serif. Used for body text, paragraphs, nav items.
      • Press Start 2P: 8-bit retro gaming pixel font. Downloaded in the Google Fonts bundle even though it is barely referenced or completely orphaned.
      • Homemade Apple (font-decorative): Loose cursive handwriting font. Used solely for the footer signature.
  2. Hidden Injected Fonts:
      • Orbitron: In custom.min.css at rule [data-title]:hover::after { font-family: 'Orbitron', sans-serif; }. It is not even loaded in the Google Fonts
      <link>, so the browser falls back to system generic sans-serif.
      • Technical: Hardcoded in .timeline-date { font-family: 'Technical', monospace; } while everywhere else uses var(--font-technical).

  ### Impact:
  • Readers encounter 3–4 contrasting typographic personalities in a single viewport: a brutalist industrial uppercase word, next to a monospace terminal
  badge, surrounded by geometric sans body copy, transitioning into high-contrast editorial serif, ending in a cursive signature.
  ──────
  ## 2. Competing Aesthetic Paradigms ("Kitchen Sink" Syndrome)

  Instead of a unified visual language, the site implements 5–6 conflicting design trends simultaneously:

   Trend / Style              | Where It Appears in Code                                   | Conflict / Friction
  ----------------------------|------------------------------------------------------------|-------------------------------------------------------------
   Brutalism / Cyberpunk      | Massive block uppercase headings (.font-brutalist), raw    | Clashes with soft, friendly rounded UI cards and luxury
                              | code brackets <code><Jayesh> [SYSTEM ONLINE]</code>, high- | gradients.
                              | voltage neon glows, crosshair cursor (cursor: crosshair).  |
   Glassmorphism              | .glass-card (custom.min.css:103) with backdrop-filter:     | Glass requires subtle depth; it gets washed out when placed
                              | blur(24px) saturate(180%), semi-transparent borders        | directly over heavy 3D canvases and twinkling stars.
                              | oklch(71% .11 180 / .25), and drop shadows.                |
   Metallic / Skeuomorphic UI | .project-card-compact (custom.min.css:395): linear-        | Looks like an brushed metal audio amplifier knob sitting
                              | gradient(135deg, #2a2a2c 0%, #5a5a5d 25%, #404042 50%,     | directly inside a futuristic purple deep-space theme.
                              | #6a6a6d 75%, #1f1f21 100%) with deep inset bevel shadows.  |
   Space / Nebula Sci-Fi      | Three.js particle starfield, orbiting icosahedron crystal  | Overpowers the content; the user is forced into a space
                              | mesh, rotating torus ring, CSS radial star layers with CSS | simulator when trying to read about your skills.
                              | twinkle animations, and repeating radial SVG noise         |
                              | overlays.                                                  |
   Playful / Cartoon Lottie   | 8 separate Lottie animations: astronaut, looping           | Clashes with the dark, serious cyber/developer aesthetic.
                              | background, rocket launcher, coding character, computer    |
                              | setup, design pen, graduation cap, and loading spinner.    |
  ──────
  ## 3. Detailed File-by-File Analysis

  ### A. index.html (371.5 KB)
  • Inline SVG bloat:
      • Lines 362–392 contain an enormous vector path for the hero title (#expanded and #compact) taking up 265,580 bytes (~265 KB) of raw SVG
      coordinates right in the middle of the document! That accounts for >70% of the entire HTML document weight.
  • Filter Defs Overhead:
      • Lines 265–276 define SVG liquid turbulence filters (#liquid and #liquid-active) that are GPU-heavy and not consistently tied to main interactions.
  • Inline <style> tag (index.html:49-152):
      • Contains 103 lines of CSS that duplicate rules already present in custom.min.css or Tailwind utilities (e.g. repeated .project-card-violet:hover,
      .social-pill-pink:hover, .will-change-* overrides, content-visibility: auto).
  • Content Accessibility & Structure:
      • Section #home has aria-labelledby="hero-title", but inside #hero-title is an SVG path without an accessible label or inner <title>/aria-label,
      creating screen reader ambiguity.
  • Duplicate CSS Anchors:
      • Experimental CSS anchor positioning (anchor-name: --jayesh, anchor-name: --title-anchor, position-anchor, position-area) is mixed with fallback
      classes.

  ──────
  ### B. custom.min.css (15.4 KB) & style.min.css (55.4 KB)

  • Global Cursor Hijack:
      • custom.min.css:36: cursor: crosshair; is applied to html, body. This makes regular text selection feel awkward and unintuitive.
  • Color Space Fragmentation:
      • Mixes modern oklch(...), legacy rgba(...), hsl(...), hex codes (#030014), and named colors (white, black) indiscriminately.
      • Example: oklch(from var(--teal) l c h / .3) mixed with rgba(45, 212, 191, .5) and #00d2ff. These are 3 different ways of expressing almost the
      same teal accent color.
  • CSS Starfield Redundancy:
      • The site renders a Three.js 3D starfield (2,400 points across 3 buffer geometries) and at the same time renders a multi-stop CSS radial-gradient
      star layer with 30 gradient stops and @keyframes twinkle on .stars-layer::before and .stars-layer::after. Both run simultaneously behind the UI.
  • Button Shine Animations:
      • .button::before has an infinite @keyframes shine loop, while section#work article::before also runs an infinite shine loop on hover. Constant
      infinite animations cause continuous repaints.

  ──────
  ### C. script.min.js (11.5 KB)

  • Concurrent Animation Engine Conflict:
      • Uses Lenis Smooth Scroll + GSAP Ticker + ScrollTrigger + Three.js render loop + CSS 3D perspective transforms.
      • At lines 36–39, gsap.ticker.add((e => { this.lenis.raf(1e3 * e); })) ties Lenis to GSAP, while line 185 adds another ticker gsap.ticker.add((()
      => this.render())) for Three.js.
      • This creates unnecessary RAF overhead on lower-end laptops and mobile devices.
  • Card 3D Tilt Event Listeners:
      • UI.initTiltCards() attaches mousemove listeners calculating getBoundingClientRect() on every event tick with requestAnimationFrame. When combined
      with glassmorphic backdrop-filter: blur(), this triggers expensive repaint operations.
  • Anchor Click Timing Mismatch:
      • Line 46 scrolls smoothly via Lenis with a hardcoded duration: 2 and easing curve, which can feel sluggish when jumping between nearby sections.

  ──────
  ### D. Icons & Font Asset Weight ()

  The repository includes three separate massive icon suites:

  1. Devicon: devicon.ttf (1.5 MB) + devicon.woff (1.5 MB)
  2. Font Awesome 6:
      • fa-solid-900.ttf (420 KB) / .woff2 (156 KB)
      • fa-brands-400.ttf (208 KB) / .woff2 (117 KB)
      • fa-regular-400.ttf (68 KB) / .woff2 (25 KB)
  3. RemixIcon: remixicon.ttf (504 KB) / .woff (215 KB) / .woff2 (156 KB)

  #### Actual Icon Usage Reality:

  • FontAwesome: Only 2 icons are used in the entire site (fa-heart and fa-mug-hot in the footer)!
  • RemixIcon: Only ~20 icons are used.
  • Devicon: Used for tech stack badges, but the entire 1.5 MB unsubsetted font is shipped.
  • Total icon fonts loaded or bundled: ~4.7 MB of icon assets sitting in vendor folders.
  ──────
  ### E. Vendor JS Libraries Weight

  • three.min.js: 670 KB (used just to render a background particle starfield and an wireframe icosahedron)
  • lottie-player.js: 380 KB + 8 JSON files totaling ~1.7 MB (e.g. Background looping animation.json is 688 KB alone)
  • gsap.min.js + ScrollTrigger.min.js + lenis.min.js: ~128 KB
  ──────
  ## 4. Key Takeaways & Opportunities for the Redesign

  1. Typography Simplification:
      • Consolidate from 8 fonts down to 2 complementary families:
          • One refined display/heading font (e.g., Syne or Manrope in bold weights).
          • One clean, legible body font (e.g., Inter or Manrope).
          • Optionally keep JetBrains Mono strictly for code snippets and technical tags.

  2. Unified Visual Language:
      • Drop the metallic gradients, brutalist/retro clashes, and redundant starfield backgrounds.
      • Commit to a clean, cohesive design direction (e.g. Modern Minimalist Dark or Sleek Futuristic Neo-Brutalist with controlled contrast and calm
      surface elevations).
  3. Lightweight Icon Strategy:
      • Replace the multi-megabyte icon font files (Devicon + FontAwesome + RemixIcon) with clean, inline SVGs or lightweight SVG icon sprites for the
      exact icons you need.
  4. Performance & Asset Diet:
      • Eliminate the 265 KB SVG coordinates string embedded in the HTML.
      • Evaluate whether Three.js + 8 Lottie files are adding real value or just noise and load latency. A subtle Canvas effect or refined CSS touches
      often feel much smoother and more professional.
  5. Code Consolidation:
      • Merge the split CSS files, remove the duplicate inline <style> rules from index.html, and adopt a single source of truth for color tokens and
      utility classes.

  ──────
  The codebase has great raw material and technical ambition (custom shaders/Three.js, GSAP orchestration, bento layouts, rich project showcases), but it
  is currently bogged down by competing styles and asset weight.