# rogolabs.net Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign rogolabs.net from a hobbyist-feeling page into a world-class showcase for the RogoLabs toolkit and speaking/research work.

**Architecture:** Single-page HTML/CSS/JS rewrite. The `<head>` (structured data, meta, analytics) is preserved intact. Only the `<body>`, `styles.css`, and `script.js` change. No build pipeline — GitHub Pages serves static files directly.

**Tech Stack:** HTML5, CSS3 (custom properties, CSS grid), vanilla JS (ES6 classes, already in place), Inter font (already loaded), Font Awesome (already loaded).

**Reference:** Approved design mockup at `Web/.superpowers/brainstorm/*/content/full-page-flow-v2.html` — open it in a browser for visual reference throughout.

---

## Files

| File | Action | Notes |
|---|---|---|
| `Web/styles.css` | **Rewrite** | Complete replacement — carousel CSS removed, new layout system |
| `Web/index.html` | **Modify body only** | Keep entire `<head>` intact; rewrite `<body>` |
| `Web/script.js` | **Modify** | Remove `BaseCarousel`, `ProjectsCarousel`, `SpeakingCarousel`, shuffle logic; keep everything else |

---

## Task 1: Rewrite styles.css

**Files:**
- Modify: `Web/styles.css` (full replacement)

- [ ] **Step 1: Open the file and verify current line count for reference**

```bash
wc -l Web/styles.css
```

- [ ] **Step 2: Replace the entire contents of `Web/styles.css` with the new stylesheet**

Write the following complete content to `Web/styles.css`:

```css
/* ============================================================
   CSS CUSTOM PROPERTIES
   ============================================================ */
:root {
    --primary: #2563eb;
    --primary-dark: #1d4ed8;

    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --border-color: #e2e8f0;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
    --primary: #60a5fa;
    --primary-dark: #3b82f6;

    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --border-color: #334155;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
}

/* ============================================================
   RESET & BASE
   ============================================================ */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

/* Accessibility */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    background: var(--primary);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0 0 4px 4px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    z-index: 9999;
}

.skip-link:focus {
    top: 0;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
header {
    background-color: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 100;
}

header nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
}

.logo {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-decoration: none;
}

.logo-rogo { color: var(--text-primary); }
.logo-labs { color: var(--primary); }

.nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-links a {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.15s;
}

.nav-links a:hover {
    color: var(--text-primary);
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.theme-toggle {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.4rem 0.6rem;
    font-size: 0.875rem;
    transition: color 0.15s, border-color 0.15s;
}

.theme-toggle:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
}

.mobile-menu-btn {
    display: none;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.4rem 0.6rem;
    font-size: 0.875rem;
}

/* ============================================================
   HERO
   ============================================================ */
.hero {
    padding: 8rem 0 5rem;
    border-bottom: 1px solid var(--border-color);
}

.hero-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--primary);
    font-weight: 600;
    margin-bottom: 1.25rem;
}

.hero h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin-bottom: 1.25rem;
    max-width: 640px;
}

.hero h1 .accent {
    color: var(--primary);
}

.hero-sub {
    font-size: 1.05rem;
    color: var(--text-secondary);
    max-width: 520px;
    line-height: 1.65;
    margin-bottom: 2.25rem;
}

.hero-actions {
    display: flex;
    gap: 0.875rem;
    flex-wrap: wrap;
}

.btn {
    display: inline-block;
    background: var(--primary);
    color: #ffffff;
    padding: 0.65rem 1.35rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.15s, opacity 0.15s;
    cursor: pointer;
    border: none;
}

.btn:hover {
    background: var(--primary-dark);
}

.btn-ghost {
    display: inline-block;
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.65rem 1.35rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: border-color 0.15s, color 0.15s;
}

.btn-ghost:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
}

/* ============================================================
   SECTIONS (shared)
   ============================================================ */
.section {
    padding: 4rem 0;
    border-bottom: 1px solid var(--border-color);
}

.section-label {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--primary);
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.section-title {
    font-size: clamp(1.35rem, 3vw, 1.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 0.4rem;
}

.section-sub {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 2.5rem;
    max-width: 560px;
}

/* ============================================================
   ABOUT
   ============================================================ */
.about-text {
    max-width: 660px;
}

.about-text p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.75;
    margin-bottom: 1.1rem;
}

.about-text p:last-of-type {
    margin-bottom: 0;
}

.about-text strong {
    color: var(--text-primary);
    font-weight: 600;
}

.about-text em {
    color: var(--primary);
    font-style: normal;
    font-weight: 500;
}

.about-sig {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-top: 1.5rem;
}

/* ============================================================
   TOOLKIT GRID
   ============================================================ */
.toolkit-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.tool-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.25rem;
    transition: box-shadow 0.15s, border-color 0.15s;
}

.tool-card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--primary);
}

.tool-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.35rem;
}

.tool-desc {
    font-size: 0.78rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 0.75rem;
}

.tool-tag {
    display: inline-block;
    background: #eff6ff;
    color: var(--primary);
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
    margin-bottom: 0.75rem;
}

[data-theme="dark"] .tool-tag {
    background: #1e3a5f;
}

.tool-links {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.tool-link {
    font-size: 0.78rem;
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.15s;
}

.tool-link:hover {
    opacity: 0.75;
}

.tool-link-gh {
    font-size: 0.78rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;
}

.tool-link-gh:hover {
    color: var(--text-secondary);
}

/* ============================================================
   TALKS TIMELINE
   ============================================================ */
.timeline {
    position: relative;
    padding-left: 1.75rem;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0.4rem;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
    border-radius: 2px;
}

.talk-item {
    position: relative;
    margin-bottom: 2.25rem;
}

.talk-item:last-child {
    margin-bottom: 0;
}

.talk-item::before {
    content: '';
    position: absolute;
    left: -1.3rem;
    top: 0.35rem;
    width: 10px;
    height: 10px;
    background: var(--primary);
    border-radius: 50%;
    border: 2px solid var(--bg-primary);
    box-shadow: 0 0 0 2px var(--primary);
}

.talk-meta {
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
}

.talk-venue {
    color: var(--primary);
    font-weight: 600;
}

.talk-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.35;
    margin-bottom: 0.4rem;
}

.talk-abstract {
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0.6rem;
    max-width: 680px;
}

.talk-links {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.talk-link {
    display: inline-block;
    background: #eff6ff;
    color: var(--primary);
    font-size: 0.72rem;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.15s;
}

.talk-link:hover {
    opacity: 0.75;
}

.talk-link-video {
    display: inline-block;
    background: #fef3c7;
    color: #92400e;
    font-size: 0.72rem;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.15s;
}

[data-theme="dark"] .talk-link {
    background: #1e3a5f;
}

[data-theme="dark"] .talk-link-video {
    background: #451a03;
    color: #fcd34d;
}

.talk-link-video:hover {
    opacity: 0.75;
}

/* ============================================================
   FOOTER
   ============================================================ */
footer {
    background: var(--bg-secondary);
    padding: 1.75rem 0;
}

.footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-copy {
    font-size: 0.78rem;
    color: var(--text-muted);
}

.footer-links {
    display: flex;
    gap: 1.25rem;
}

.footer-links a {
    font-size: 0.78rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.15s;
}

.footer-links a:hover {
    color: var(--text-primary);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 900px) {
    .toolkit-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .hero {
        padding: 6rem 0 3.5rem;
    }

    .toolkit-grid {
        grid-template-columns: 1fr;
    }

    .nav-links {
        display: none;
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        border-bottom: 1px solid var(--border-color);
        flex-direction: column;
        gap: 0;
        padding: 0.5rem 0;
    }

    .nav-links.active {
        display: flex;
    }

    .nav-links a {
        padding: 0.75rem 1.5rem;
        width: 100%;
    }

    .mobile-menu-btn {
        display: block;
    }

    .footer-inner {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
}
```

- [ ] **Step 3: Open the file in a browser to verify it loads without errors (the body is unchanged, just CSS)**

```bash
open Web/index.html
```

Expected: page loads, may look broken (CSS no longer matches old HTML) — that's fine. No browser console CSS parse errors.

- [ ] **Step 4: Commit**

```bash
git add Web/styles.css
git commit -m "feat: replace stylesheet with new design system"
```

---

## Task 2: Rewrite HTML body — nav, hero

**Files:**
- Modify: `Web/index.html` (body section only — lines 516 onward)

The `<head>` (lines 1–515) is untouched. Only replace `<body>` content.

- [ ] **Step 1: Replace the entire `<body>` tag and everything inside it with the following**

The new body starts immediately after line 515 (`</head>`). Replace from `<body>` through `</html>` with:

```html
<body>
    <!-- Skip to content link for accessibility -->
    <a href="#main" class="skip-link sr-only">Skip to main content</a>

    <!-- Header / Nav -->
    <header>
        <div class="container">
            <nav aria-label="Main navigation">
                <a href="#" class="logo">
                    <span class="logo-rogo">Rogo</span><span class="logo-labs">Labs</span>
                </a>
                <div class="nav-links" id="navLinks">
                    <a href="#about">About</a>
                    <a href="#toolkit">Toolkit</a>
                    <a href="#talks">Talks</a>
                    <a href="https://jerrygamblin.com" target="_blank" rel="noopener noreferrer">Blog ↗</a>
                </div>
                <div class="header-controls">
                    <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
                        <i class="fas fa-moon" id="themeIcon"></i>
                    </button>
                    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle mobile menu" aria-expanded="false">
                        <i class="fas fa-bars" aria-hidden="true"></i>
                    </button>
                </div>
            </nav>
        </div>
    </header>

    <main id="main">

        <!-- Hero -->
        <section class="hero" aria-labelledby="hero-heading">
            <div class="container">
                <div class="hero-eyebrow">Jerry Gamblin / RogoLabs</div>
                <h1 id="hero-heading">
                    The vulnerability intelligence<br>
                    system is broken.<br>
                    <span class="accent">Here's how to fix it.</span>
                </h1>
                <p class="hero-sub">Open-source tools and research for security teams who need signal, not noise.</p>
                <div class="hero-actions">
                    <a href="#toolkit" class="btn">Explore the Toolkit</a>
                    <a href="#talks" class="btn-ghost">View Talks →</a>
                </div>
            </div>
        </section>

        <!-- About -->
        <section id="about" class="section" aria-labelledby="about-heading">
            <div class="container">
                <div class="section-label">About</div>
                <h2 class="section-title" id="about-heading">RogoLabs</h2>
                <div class="about-text">
                    <p>RogoLabs builds open-source tools that make vulnerability intelligence <strong>actionable</strong>. The name comes from the Latin <em>rogo</em> — "I ask" — the root of "interrogate." The mission is to relentlessly question vulnerability data to reveal what actually requires attention.</p>
                    <p>The problem isn't a shortage of CVE data. It's that most security teams are drowning in it — CVSS scores without context, feeds without signal, patch lists without priority. Every tool in the RogoLabs toolkit is designed to cut through that noise: visualize what's happening, predict what's coming, and prioritize what matters.</p>
                    <p>All tools are free and open-source. No vendor lock-in, no hidden costs — because better security tooling should be available to everyone, not just organizations that can afford enterprise contracts.</p>
                    <p class="about-sig">— Jerry Gamblin</p>
                </div>
            </div>
        </section>

        <!-- Toolkit -->
        <section id="toolkit" class="section" aria-labelledby="toolkit-heading">
            <div class="container">
                <div class="section-label">Open Source Toolkit</div>
                <h2 class="section-title" id="toolkit-heading">The RogoLabs Toolkit</h2>
                <p class="section-sub">One mission — make vulnerability intelligence actionable.</p>

                <div class="toolkit-grid">

                    <div class="tool-card">
                        <div class="tool-name">CVE.ICU</div>
                        <div class="tool-desc">Real-time CVE visualization dashboard updated every 4 hours from the NVD, with interactive charts revealing vulnerability patterns and trends.</div>
                        <span class="tool-tag">Dashboard</span>
                        <div class="tool-links">
                            <a href="https://cve.icu" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
                            <a href="https://github.com/jgamblin/cve.icu" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                    <div class="tool-card">
                        <div class="tool-name">PatchThis.app</div>
                        <div class="tool-desc">Risk-based patch prioritization that ranks patches by actual exploitability and exposure, not just CVSS scores.</div>
                        <span class="tool-tag">Prioritization</span>
                        <div class="tool-links">
                            <a href="https://patchthis.app" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
                            <a href="https://github.com/jgamblin/patchthisapp" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                    <div class="tool-card">
                        <div class="tool-name">CVEforecast</div>
                        <div class="tool-desc">ML-powered CVE volume forecasting using an ensemble of statistical, machine learning, and deep learning models to predict what's coming next.</div>
                        <span class="tool-tag">Predictive</span>
                        <div class="tool-links">
                            <a href="https://cveforecast.org" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
                            <a href="https://github.com/rogolabs/CVEforecast" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                    <div class="tool-card">
                        <div class="tool-name">CNA Scorecard</div>
                        <div class="tool-desc">Data-driven quality ratings for all 512 CVE Numbering Authorities, based on completeness, accuracy, and timeliness of their CVE records.</div>
                        <span class="tool-tag">Quality</span>
                        <div class="tool-links">
                            <a href="https://cnascorecard.org" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
                            <a href="https://github.com/jgamblin/CNAScoreCard" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                    <div class="tool-card">
                        <div class="tool-name">CNAPulse</div>
                        <div class="tool-desc">Monitors all 512 CNAs, tracking publishing activity and comparing 30-day output against 12-month baselines. Updated every 3 hours.</div>
                        <span class="tool-tag">Monitoring</span>
                        <div class="tool-links">
                            <a href="https://cnapulse.org" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
                            <a href="https://github.com/RogoLabs/CNAPulse" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                    <div class="tool-card">
                        <div class="tool-name">VulnRadar</div>
                        <div class="tool-desc">GitHub-native CVE monitoring for your stack. Matches CVEs against a watchlist, enriches with KEV, EPSS, NVD, and PatchThis, and posts issues. Runs on GitHub Actions.</div>
                        <span class="tool-tag">GitHub Action</span>
                        <div class="tool-links">
                            <a href="https://github.com/RogoLabs/VulnRadar" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
                            <a href="https://github.com/RogoLabs/VulnRadar" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                    <div class="tool-card">
                        <div class="tool-name">CVE Updates</div>
                        <div class="tool-desc">Automated analysis of 300K+ CVE records revealing update frequencies, historical trends, and the most actively maintained vulnerabilities. Updated every 4 hours.</div>
                        <span class="tool-tag">Analytics</span>
                        <div class="tool-links">
                            <a href="https://rogolabs.github.io/CVE-Updates/" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
                            <a href="https://github.com/RogoLabs/CVE-Updates" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                    <div class="tool-card">
                        <div class="tool-name">CVE.ICU Splunk TA</div>
                        <div class="tool-desc">High-performance Splunk Technology Add-on ingesting the full CVE List V5 with hourly delta updates and EPSS and KEV enrichment for enterprise vulnerability management.</div>
                        <span class="tool-tag">Splunk</span>
                        <div class="tool-links">
                            <a href="https://splunkbase.splunk.com/app/8395" target="_blank" rel="noopener noreferrer" class="tool-link">Splunkbase →</a>
                            <a href="https://github.com/RogoLabs/CVE.icu-Splunk" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Talks -->
        <section id="talks" class="section" aria-labelledby="talks-heading">
            <div class="container">
                <div class="section-label">Speaking &amp; Research</div>
                <h2 class="section-title" id="talks-heading">Talks</h2>
                <p class="section-sub">Conference presentations on vulnerability intelligence, CVE ecosystem health, and data-driven security.</p>

                <div class="timeline">

                    <div class="talk-item">
                        <div class="talk-meta">Feb 2026 · <span class="talk-venue">BSides Galway</span> · Galway, IE</div>
                        <div class="talk-title">Open Source Intelligence on a Budget: Building Your Own Vulnerability Radar</div>
                        <p class="talk-abstract">A builder session showing how to create a self-sustaining vulnerability radar using open-source tooling and the architecture patterns behind the RogoLabs toolkit.</p>
                        <div class="talk-links">
                            <a href="Talks/BSides-Galway-Open-Source-Intelligence.pdf" target="_blank" rel="noopener noreferrer" class="talk-link">📄 Slides</a>
                        </div>
                    </div>

                    <div class="talk-item">
                        <div class="talk-meta">Dec 2025 · <span class="talk-venue">Black Hat EU</span> · London, UK</div>
                        <div class="talk-title">The Post-NVD Era: A Call for Global CVE Decentralization</div>
                        <p class="talk-abstract">Examining the critical need for CVE ecosystem decentralization in response to NVD challenges, exploring global alternatives and pathways toward a more resilient, distributed vulnerability intelligence infrastructure.</p>
                        <div class="talk-links">
                            <a href="Talks/eu-25-Gamblin-ThePostNVDEra.pdf" target="_blank" rel="noopener noreferrer" class="talk-link">📄 Slides</a>
                        </div>
                    </div>

                    <div class="talk-item">
                        <div class="talk-meta">Nov 2025 · <span class="talk-venue">BSides Munich</span> · Munich, DE</div>
                        <div class="talk-title">Navigating the Volatile Vulnerability Landscape</div>
                        <p class="talk-abstract">Analysis of strain in global vulnerability disclosure — CVE funding challenges and NVD backlog — and strategies for resilient, diversified vulnerability intelligence using emerging alternative sources.</p>
                        <div class="talk-links">
                            <a href="Talks/Navigating the Volatile Vulnerability Landscape - BSides Munich.pdf" target="_blank" rel="noopener noreferrer" class="talk-link">📄 Slides</a>
                        </div>
                    </div>

                    <div class="talk-item">
                        <div class="talk-meta">Sep 2025 · <span class="talk-venue">Vuln4cast</span> · Darwin College, Cambridge, UK</div>
                        <div class="talk-title">A Time Series Approach to Predicting CVE Volume</div>
                        <p class="talk-abstract">Introduces CVEforecast.org and an ensemble approach — statistical, ML, deep learning, and CNA-specific forecasting — to shift vulnerability management from reactive response to predictive planning.</p>
                        <div class="talk-links">
                            <a href="Talks/A-Time-Series-Approach-to-Predicting-CVE-Volume.pdf" target="_blank" rel="noopener noreferrer" class="talk-link">📄 Slides</a>
                        </div>
                    </div>

                    <div class="talk-item">
                        <div class="talk-meta">Aug 2025 · <span class="talk-venue">AppSec Village @ DEF CON 33</span> · Las Vegas, NV</div>
                        <div class="talk-title">CVE Crisis: State of the Vulnerability Disclosure Landscape</div>
                        <p class="talk-abstract">State-of-the-landscape analysis covering NVD backlog dynamics, CVE program funding stress, assignment consistency, and the emergence of alternative global vulnerability data sources and their operational impact.</p>
                        <div class="talk-links">
                            <a href="Talks/The CVE Crisis_ Navigating the Post-NVD Monolith Era.pdf" target="_blank" rel="noopener noreferrer" class="talk-link">📄 Slides</a>
                        </div>
                    </div>

                    <div class="talk-item">
                        <div class="talk-meta">Aug 2025 · <span class="talk-venue">BSidesLV</span> · Las Vegas, NV</div>
                        <div class="talk-title">The Art of Concealment: CVE's Challenge with Transparency</div>
                        <p class="talk-abstract">Exploration of transparency gaps in CVE processes and their impact on vulnerability ecosystem trust and efficiency.</p>
                        <div class="talk-links">
                            <a href="Talks/The Art of Concealment.pdf" target="_blank" rel="noopener noreferrer" class="talk-link">📄 Slides</a>
                        </div>
                    </div>

                    <div class="talk-item">
                        <div class="talk-meta">Apr 2025 · <span class="talk-venue">VulnCon</span> · Raleigh, NC</div>
                        <div class="talk-title">The Quality Imperative for CVEs</div>
                        <p class="talk-abstract">Empirical analysis of CNA performance gaps and methods to raise vulnerability reporting quality across the ecosystem.</p>
                        <div class="talk-links"></div>
                    </div>

                    <div class="talk-item">
                        <div class="talk-meta">Aug 2024 · <span class="talk-venue">AppSec Village @ DEF CON 32</span> · Las Vegas, NV</div>
                        <div class="talk-title">Using EPSS for Better Vulnerability Management</div>
                        <p class="talk-abstract">Case studies on operationalizing EPSS to reduce patch workload while preserving risk coverage.</p>
                        <div class="talk-links">
                            <a href="https://www.youtube.com/watch?v=Lgv11FoNa3w" target="_blank" rel="noopener noreferrer" class="talk-link-video">▶ Recording</a>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-inner">
                <span class="footer-copy">© 2026 RogoLabs · Jerry Gamblin</span>
                <nav class="footer-links" aria-label="Social links">
                    <a href="https://github.com/jgamblin" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://twitter.com/jgamblin" target="_blank" rel="noopener noreferrer">Twitter / X</a>
                    <a href="https://linkedin.com/in/jerrygamblin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://jerrygamblin.com" target="_blank" rel="noopener noreferrer">Blog ↗</a>
                </nav>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify the layout**

```bash
open Web/index.html
```

Expected: Hero section visible with headline, About section below it, Toolkit grid with 8 cards, Timeline with 8 talks, footer. Dark mode toggle present in nav. No console errors.

- [ ] **Step 3: Commit**

```bash
git add Web/index.html
git commit -m "feat: rewrite page body with new layout — hero, about, toolkit grid, talks timeline, footer"
```

---

## Task 3: Clean up script.js

Remove the carousel classes and shuffle logic. Keep `ThemeManager`, `NavigationManager`, `IntersectionObserverManager`, `LinkManager`, `DevModeHelper`, and `App`.

**Files:**
- Modify: `Web/script.js`

- [ ] **Step 1: Delete the carousel classes (lines 388–617)**

Remove the following blocks entirely from `Web/script.js`:
- The `BaseCarousel` class (lines 388–561)
- The `ProjectsCarousel` class (lines 563–589)
- The `SpeakingCarousel` class (lines 591–617)

- [ ] **Step 2: Remove the shuffle logic and carousel instantiation from `App.initializeModules()`**

In the `initializeModules()` method, replace the entire contents with:

```javascript
initializeModules() {
    try {
        const devHelper = new DevModeHelper();
        this.modules.push(devHelper);

        const moduleClasses = [
            { name: 'ThemeManager', class: ThemeManager },
            { name: 'NavigationManager', class: NavigationManager },
            { name: 'IntersectionObserverManager', class: IntersectionObserverManager },
            { name: 'LinkManager', class: LinkManager },
        ];

        moduleClasses.forEach(({ name, class: ModuleClass }) => {
            try {
                const instance = new ModuleClass();
                this.modules.push(instance);
                if (devHelper.isDevMode) console.log(`✅ ${name} initialized successfully`);
            } catch (error) {
                console.error(`❌ Failed to initialize ${name}:`, error);
            }
        });

        if (devHelper.isDevMode) {
            console.log(`🚀 Application initialized with ${this.modules.length}/${moduleClasses.length + 1} modules`);
        }
    } catch (error) {
        console.error('❌ Critical error during module initialization:', error);
    }
}
```

- [ ] **Step 3: Open in browser and verify no console errors**

```bash
open Web/index.html
```

Open DevTools console. Expected: No errors. Dark mode toggle works. Mobile menu works on narrow viewport.

- [ ] **Step 4: Commit**

```bash
git add Web/script.js
git commit -m "feat: remove carousel JS, retain theme and navigation managers"
```

---

## Task 4: Visual verification pass

**Files:** None modified — this is a manual verification checklist.

- [ ] **Step 1: Open the page and verify each section**

```bash
open Web/index.html
```

Check each of the following:

| Check | Expected |
|---|---|
| Nav links | About, Toolkit, Talks, Blog ↗ — all present |
| Nav scroll | Clicking "Toolkit" scrolls to toolkit section |
| Hero headline | "Here's how to fix it." renders in blue |
| About placement | About appears before toolkit |
| Toolkit grid | 8 tool cards in 3-column grid |
| Tool cards | Each has name, desc, tag, Visit + GitHub links |
| Talks timeline | 8 entries, newest first (Feb 2026 at top) |
| Slides links | Talk PDFs open (test 1–2: CVE.ICU Splunk TA has no PDF so skip) |
| Recording link | DEF CON 32 has amber "▶ Recording" pill |
| Footer | Copyright + 4 social links |

- [ ] **Step 2: Verify dark mode**

Click the moon/sun icon in the nav.

Expected: Background flips to `#0f172a`, text to `#f1f5f9`, borders to `#334155`. Blue accent adjusts to `#60a5fa`. Toggle persists on refresh.

- [ ] **Step 3: Verify mobile layout**

Open DevTools → toggle device toolbar → set to 375px width.

Expected:
- Nav links collapse, hamburger menu appears
- Hamburger opens nav links as vertical list
- Toolkit grid collapses to single column
- Timeline remains readable
- Hero text scales down gracefully

- [ ] **Step 4: Verify no regressions in the `<head>`**

```bash
grep -c "application/ld+json" Web/index.html
```

Expected: `3` (three structured data blocks — Person, Events, Software — must still be present)

- [ ] **Step 5: Commit and push**

```bash
git add -p   # review any remaining changes
git commit -m "feat: rogolabs.net redesign complete — toolkit grid, talks timeline, new hero"
git push
```

---

## Adding a New Talk (maintenance reference)

To add a new talk, insert a new `<div class="talk-item">` block at the **top** of the `.timeline` div in `Web/index.html`, following this template:

```html
<div class="talk-item">
    <div class="talk-meta">Mon YYYY · <span class="talk-venue">Conference Name</span> · City, Country</div>
    <div class="talk-title">Talk Title Here</div>
    <p class="talk-abstract">Abstract text here.</p>
    <div class="talk-links">
        <a href="Talks/filename.pdf" target="_blank" rel="noopener noreferrer" class="talk-link">📄 Slides</a>
        <!-- Add this line only if a recording exists: -->
        <!-- <a href="https://youtube.com/..." target="_blank" rel="noopener noreferrer" class="talk-link-video">▶ Recording</a> -->
    </div>
</div>
```

Also add the corresponding PDF to `Web/Talks/` and update the structured data `<script type="application/ld+json">` block in `<head>`.

## Adding a New Tool

Insert a new `<div class="tool-card">` anywhere in the `.toolkit-grid` div. The 3-column grid wraps automatically:

```html
<div class="tool-card">
    <div class="tool-name">Tool Name</div>
    <div class="tool-desc">One sentence: what it does, how often it updates, what data it uses.</div>
    <span class="tool-tag">Category</span>
    <div class="tool-links">
        <a href="https://tool-url.example" target="_blank" rel="noopener noreferrer" class="tool-link">Visit →</a>
        <a href="https://github.com/RogoLabs/repo" target="_blank" rel="noopener noreferrer" class="tool-link-gh">GitHub</a>
    </div>
</div>
```
