# rogolabs.net Redesign — Design Spec

**Date:** 2026-04-05  
**Author:** Jerry Gamblin  
**Status:** Approved

---

## Goal

Redesign rogolabs.net from a hobbyist-feeling single page into a world-class showcase for the RogoLabs toolkit and speaking/research work. The site is a reference and portfolio — not a lead generator or product site.

## Audiences

Two equal primary audiences:

1. **Conference organizers / program committees** — evaluating Jerry as a speaker, reviewing past talks and topics
2. **Security practitioners / researchers** — discovering and using the open-source tools, following the research

## Architecture

Single-page HTML/CSS/JS, hosted on GitHub Pages. No build pipeline, no static site generator. Same file structure as today (`Web/index.html`, `Web/styles.css`, `Web/script.js`). Adding a talk or tool is a direct HTML edit.

---

## Page Structure

Sections in order:

1. **Nav**
2. **Hero**
3. **About**
4. **Toolkit**
5. **Talks**
6. **Footer**

### 1. Nav

- Logo: `RogoLabs` (Rogo in dark, Labs in blue `#2563eb`)
- Links: About · Toolkit · Talks · Blog ↗
- Blog links to `https://jerrygamblin.com` (external, `↗` indicator)
- Dark mode toggle button (right side)
- Fixed/sticky, minimal — single border-bottom

### 2. Hero

- Eyebrow: `Jerry Gamblin / RogoLabs` in small uppercase blue
- Headline (3 lines):
  > The vulnerability intelligence system is broken.  
  > Here's how to fix it.
  - Last line rendered in `#2563eb` as the accent/punchline
- Subheading: `Open-source tools and research for security teams who need signal, not noise.`
- Two CTAs: `Explore the Toolkit` (primary blue button) · `View Talks →` (ghost button)

### 3. About

Placed immediately after the hero — establishes who is behind the work before diving into the tools.

- Section label: `About`
- Section title: `RogoLabs`
- Body copy (researcher voice, not marketing voice):
  - Paragraph 1: The *rogo* etymology and mission statement
  - Paragraph 2: The problem being solved (CVE data overload, noise vs. signal)
  - Paragraph 3: Open-source ethos — free, no vendor lock-in
  - Signed: `— Jerry Gamblin`

### 4. Toolkit

- Section label: `Open Source Toolkit`
- Section title: `The RogoLabs Toolkit` (not "suite" — avoids commercial connotation)
- Section subtitle: `One mission — make vulnerability intelligence actionable.` (avoids hardcoding a tool count that requires updating)
- Layout: **3-column CSS grid**, auto-wrapping — new tools are added by inserting a new card, no other changes required

Each tool card contains:
- Tool name (bold)
- One-sentence description (factual, not marketing copy)
- Category tag (e.g. Dashboard, Prioritization, Predictive, Quality, Monitoring, GitHub Action, Analytics, Splunk)
- Links: `Visit →` (primary site) + `GitHub` (muted, secondary)

Current tools (in display order):

| Tool | URL | Category |
|---|---|---|
| CVE.ICU | cve.icu | Dashboard |
| PatchThis.app | patchthis.app | Prioritization |
| CVEforecast | cveforecast.org | Predictive |
| CNA Scorecard | cnascorecard.org | Quality |
| CNAPulse | cnapulse.org | Monitoring |
| VulnRadar | github.com/RogoLabs/VulnRadar | GitHub Action |
| CVE Updates | rogolabs.github.io/CVE-Updates/ | Analytics |
| CVE.ICU Splunk TA | splunkbase.splunk.com/app/8395 | Splunk |

### 5. Talks

- Section label: `Speaking & Research`
- Section title: `Talks`
- Section subtitle: `Conference presentations on vulnerability intelligence, CVE ecosystem health, and data-driven security.`
- Layout: **vertical timeline** — left-border line with blue dot per entry, newest first

Each talk entry contains:
- Date · Venue (blue, bold) · City, Country
- Talk title (bold)
- Abstract (2–3 sentences)
- Links: `📄 Slides` (blue pill, links to PDF in `/Talks/`) and/or `▶ Recording` (amber pill, links to video) where available

Current talks (newest first):

| Date | Venue | Title | Slides | Recording |
|---|---|---|---|---|
| Feb 2026 | BSides Galway | Open Source Intelligence on a Budget | ✓ | — |
| Dec 2025 | Black Hat EU | The Post-NVD Era: A Call for Global CVE Decentralization | ✓ | — |
| Nov 2025 | BSides Munich | Navigating the Volatile Vulnerability Landscape | ✓ | — |
| Sep 2025 | Vuln4cast, Cambridge | A Time Series Approach to Predicting CVE Volume | ✓ | — |
| Aug 2025 | AppSec Village @ DEF CON 33 | CVE Crisis: State of the Vulnerability Disclosure Landscape | ✓ | — |
| Aug 2025 | BSidesLV | The Art of Concealment: CVE's Challenge with Transparency | ✓ | — |
| Apr 2025 | VulnCon | The Quality Imperative for CVEs | — | — |
| Aug 2024 | AppSec Village @ DEF CON 32 | Using EPSS for Better Vulnerability Management | — | ✓ |

### 6. Footer

- Left: `© 2026 RogoLabs · Jerry Gamblin`
- Right: GitHub · Twitter/X · LinkedIn · Blog ↗
- Minimal, light background (`#f8fafc`)

---

## Visual Design

### Color

| Token | Light mode | Dark mode |
|---|---|---|
| Primary | `#2563eb` | `#60a5fa` |
| Background | `#ffffff` | `#0f172a` |
| Surface | `#f8fafc` | `#1e293b` |
| Text primary | `#0f172a` | `#f1f5f9` |
| Text secondary | `#64748b` | `#94a3b8` |
| Border | `#e2e8f0` | `#334155` |

### Typography

- Font: Inter (already loaded)
- Hero headline: `2.4rem`, `font-weight: 800`, `letter-spacing: -0.03em`
- Section titles: `1.4rem`, `font-weight: 800`, `letter-spacing: -0.02em`
- Body: `0.85–0.9rem`, `line-height: 1.6–1.7`
- Section labels: `0.65rem`, uppercase, `letter-spacing: 0.12em`, blue

### Dark Mode

Dark mode is the light design inverted to navy/slate — same layout, same structure, same interactions. Toggled by the existing button in nav. The dark hero (navy background, muted palette) is the direct dark-mode equivalent of the light hero.

---

## Tone & Copy Principles

- **Researcher voice, not marketing voice** — factual, direct, no superlatives
- No phrases like "battle-tested," "cut through the noise" (as a cliché), "transform X into Y," "virtuous cycle"
- Tool descriptions: what it does, how often it updates, what data it uses — not what problem it "solves for you"
- About copy: keep the *rogo* etymology, rewrite surrounding paragraphs to match researcher tone

---

## What Changes vs. Today

| Area | Current | New |
|---|---|---|
| Hero | Generic tagline, two CTA buttons | POV statement, blue accent on punchline |
| About | Long, marketing-heavy | Shorter, researcher tone, moved above tools |
| Tools | Carousel (one at a time) | 3-column grid (all visible, auto-expanding) |
| Talks | Structured data only in `<head>`, visible display unclear | Vertical timeline with abstract + links |
| Nav | About / Projects / Speaking / Blog / Contact | About / Toolkit / Talks / Blog ↗ |
| Copy | "suite," "battle-tested," sales language | "toolkit," factual, direct |

## What Does NOT Change

- File structure (`Web/index.html`, `Web/styles.css`, `Web/script.js`)
- GitHub Pages hosting
- Dark mode toggle (existing JS behavior retained)
- Existing SEO structured data in `<head>` (keep as-is)
- Existing font (Inter) and icon library (Font Awesome)
- Accessibility work already done (skip links, ARIA labels, contrast ratios)
- `/Talks/` PDF directory structure
