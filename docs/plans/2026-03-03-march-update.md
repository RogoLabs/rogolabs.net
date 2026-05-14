# March 2026 Update — rogolabs.net Improvement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve code quality, performance, SEO, accessibility, CI/CD, and maintainability of rogolabs.net

**Architecture:** Static single-page portfolio site (vanilla HTML/CSS/JS deployed via GitHub Pages). All improvements stay within the current vanilla stack — no build tools or frameworks introduced. The GitHub Actions workflow will be enhanced with validation, Lighthouse, and link-checking steps.

**Tech Stack:** HTML5, CSS3, ES6+ JavaScript, GitHub Actions, GitHub Pages

---

## Phase 1: Code Quality — DRY Up Duplicated Code

### Task 1: Extract a reusable BaseCarousel class from duplicated carousel code

**Why:** `ProjectsCarousel` (lines 377–560) and `SpeakingCarousel` (lines 562–734) in `script.js` are ~160 lines each of nearly identical logic. This violates DRY and means every bug fix or enhancement must be done in two places.

**Files:**
- Modify: `Web/script.js:377-734`

**Step 1: Write the BaseCarousel class**

Replace the two duplicate classes with a single `BaseCarousel` base class and two thin subclasses. The base class absorbs all shared methods: `init`, `updateCardsPerView`, `createDots`, `bindEvents`, `setupSwipeGestures`, `previousSlide`, `nextSlide`, `goToSlide`, `updateCarousel`, `updateButtons`, `updateDots`.

```javascript
class BaseCarousel {
    constructor({ trackId, prevBtnId, nextBtnId, dotsContainerId, itemLabel = 'slide' }) {
        this.track = document.getElementById(trackId);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        this.dotsContainer = document.getElementById(dotsContainerId);
        this.currentIndex = 0;
        this.totalItems = 0;
        this.cardsPerView = 3;
        this.itemLabel = itemLabel;

        if (this.track) {
            this.init();
        }
    }

    init() {
        this.totalItems = this.track.children.length;
        this.updateCardsPerView();
        this.createDots();
        this.bindEvents();
        this.updateCarousel();
        this.setupSwipeGestures();

        window.addEventListener('resize', () => {
            this.updateCardsPerView();
            this.updateCarousel();
            this.createDots();
        });
    }

    updateCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) this.cardsPerView = 1;
        else if (width <= 1024) this.cardsPerView = 2;
        else this.cardsPerView = 3;
    }

    createDots() {
        if (!this.dotsContainer) return;
        const maxSlides = Math.max(0, this.totalItems - this.cardsPerView + 1);
        // Clear existing dots using safe DOM method
        this.dotsContainer.replaceChildren();
        for (let i = 0; i < maxSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to ${this.itemLabel} ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
    }

    setupSwipeGestures() {
        let startX = 0, currentX = 0, isDragging = false;
        const handleStart = (e) => {
            isDragging = true;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            this.track.style.transition = 'none';
        };
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const diffX = currentX - startX;
            const cardWidth = this.track.children[0].offsetWidth;
            const gap = 32;
            const moveDistance = (cardWidth + gap) * this.currentIndex;
            this.track.style.transform = `translateX(${-moveDistance + diffX}px)`;
        };
        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            this.track.style.transition = 'transform 0.5s ease';
            const diffX = currentX - startX;
            if (Math.abs(diffX) > 50) {
                diffX > 0 ? this.previousSlide() : this.nextSlide();
            } else {
                this.updateCarousel();
            }
        };
        this.track.addEventListener('touchstart', handleStart, { passive: true });
        this.track.addEventListener('touchmove', handleMove, { passive: false });
        this.track.addEventListener('touchend', handleEnd);
        this.track.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }

    previousSlide() {
        if (this.currentIndex > 0) { this.currentIndex--; this.updateCarousel(); }
    }

    nextSlide() {
        const maxIndex = Math.max(0, this.totalItems - this.cardsPerView);
        if (this.currentIndex < maxIndex) { this.currentIndex++; this.updateCarousel(); }
    }

    goToSlide(index) {
        const maxIndex = Math.max(0, this.totalItems - this.cardsPerView);
        this.currentIndex = Math.min(index, maxIndex);
        this.updateCarousel();
    }

    updateCarousel() {
        if (!this.track) return;
        const cardWidth = this.track.children[0]?.offsetWidth || 300;
        const gap = 32;
        this.track.style.transform = `translateX(${-this.currentIndex * (cardWidth + gap)}px)`;
        this.updateButtons();
        this.updateDots();
    }

    updateButtons() {
        if (!this.prevBtn || !this.nextBtn) return;
        const maxIndex = Math.max(0, this.totalItems - this.cardsPerView);
        this.prevBtn.disabled = this.currentIndex <= 0;
        this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }

    updateDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }
}

class ProjectsCarousel extends BaseCarousel {
    constructor() {
        super({
            trackId: 'projectsTrack',
            prevBtnId: 'prevBtn',
            nextBtnId: 'nextBtn',
            dotsContainerId: 'carouselDots',
            itemLabel: 'slide'
        });
    }
}

class SpeakingCarousel extends BaseCarousel {
    constructor() {
        super({
            trackId: 'speakingTrack',
            prevBtnId: 'speakingPrevBtn',
            nextBtnId: 'speakingNextBtn',
            dotsContainerId: 'speakingCarouselDots',
            itemLabel: 'talk'
        });
    }
}
```

**Step 2: Verify the site still works**

Open `Web/index.html` in a browser. Test:
- Projects carousel: prev/next buttons, dot navigation, swipe gestures
- Speaking carousel: same tests
- Responsive: resize to mobile (< 768px), tablet (768–1024px), desktop (> 1024px)

**Step 3: Commit**

```bash
git add Web/script.js
git commit -m "refactor: extract BaseCarousel class to eliminate 160 lines of duplication"
```

---

### Task 2: Remove dead CSS and deduplicate carousel styles

**Why:** `.projects-grid` and `.speaking-grid` have `display: none` (never used). Speaking carousel CSS (lines 526–652 in `styles.css`) duplicates projects carousel CSS. `.btn` is defined twice (lines 160–174 and 830–833).

**Files:**
- Modify: `Web/styles.css:300-652` and `Web/styles.css:830-848`

**Step 1: Remove dead grid CSS**

Delete these rules entirely:
- `.projects-grid { display: none; }` (line 300-302)
- `.speaking-grid { display: none; }` (line 521-523)

**Step 2: Remove duplicated speaking carousel CSS**

Delete the entire block from `.speaking-carousel .carousel-nav` through `.speaking-carousel .carousel-dot.active` (lines 526-600). These are identical to the base `.carousel-nav`, `.carousel-btn`, `.carousel-dot` rules already defined in lines 305-379. The speaking carousel already uses the same class names.

Also remove the duplicated responsive rules for `.speaking-carousel .carousel-btn.prev/.next` at 768px, 1024px, and 480px breakpoints (lines 609-652), since the base carousel responsive rules already cover these.

**Step 3: Remove duplicate `.btn` definition**

Delete the second `.btn` block at lines 830-833 and the duplicate `::before` at lines 835-848 — these are exact copies of lines 160-189.

**Step 4: Verify dark mode and light mode still look correct**

Open site, toggle theme, check all sections.

**Step 5: Commit**

```bash
git add Web/styles.css
git commit -m "fix: remove dead CSS rules and deduplicate carousel/button styles"
```

---

### Task 3: Move inline styles from HTML to CSS classes

**Why:** `index.html` has many inline `style="..."` attributes (especially in speaking and project cards) that should be CSS classes for maintainability.

**Files:**
- Modify: `Web/index.html` (throughout speaking and project sections)
- Modify: `Web/styles.css` (add utility classes)

**Step 1: Add utility CSS classes**

Add these to `styles.css`:

```css
/* Utility classes to replace inline styles */
.flex-row { display: flex; gap: 0.5rem; }
.flex-col { display: flex; flex-direction: column; gap: 0.5rem; }
.mt-1 { margin-top: 1rem; }
.mt-auto { margin-top: auto; }
.text-sm { font-size: 0.875rem; }
.text-secondary { color: var(--text-secondary); }
```

**Step 2: Replace inline styles in HTML**

Search for `style="` in `index.html` and replace each with the appropriate CSS class. For example:
- `style="display: flex; gap: 0.5rem;"` → `class="flex-row"`
- `style="margin-top: auto;"` → `class="mt-auto"`
- `style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;"` → `class="mt-1 flex-col"`

**Step 3: Verify no visual regressions**

Check all cards in both carousels.

**Step 4: Commit**

```bash
git add Web/index.html Web/styles.css
git commit -m "refactor: replace inline styles with CSS utility classes"
```

---

## Phase 2: Performance Improvements

### Task 4: Add `&display=swap` to Google Fonts URL

**Why:** Without `display=swap`, text is invisible until the font loads (FOIT). This hurts LCP.

**Files:**
- Modify: `Web/index.html:43` (the Google Fonts `<link>` tag)

**Step 1: Find and update the Google Fonts URL**

Find the `<link>` tag for Google Fonts in `<head>` and ensure it has `&display=swap` in the URL.

If `display=swap` is already present, verify it. If the font URL is missing it, add it.

**Step 2: Remove the duplicate font link**

There is a duplicate `<link>` for styles.css at line ~394 in `index.html`. Remove it.

**Step 3: Commit**

```bash
git add Web/index.html
git commit -m "perf: ensure font-display swap and remove duplicate stylesheet link"
```

---

### Task 5: Add Subresource Integrity (SRI) to CDN resources

**Why:** External CDN resources (Font Awesome) loaded without integrity attributes could be tampered with if the CDN is compromised.

**Files:**
- Modify: `Web/index.html` (Font Awesome `<link>` tag)

**Step 1: Generate SRI hash for Font Awesome**

Run:
```bash
curl -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css | openssl dgst -sha384 -binary | openssl base64 -A
```

**Step 2: Add integrity and crossorigin attributes**

```html
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      integrity="sha384-<hash>"
      crossorigin="anonymous"
      media="print"
      onload="this.media='all'">
```

**Step 3: Commit**

```bash
git add Web/index.html
git commit -m "security: add SRI hash to Font Awesome CDN link"
```

---

### Task 6: Add debounced resize handler for carousels

**Why:** Every `resize` event fires carousel recalculation. On rapid resizing this causes jank.

**Files:**
- Modify: `Web/script.js` (BaseCarousel.init method)

**Step 1: Add debounce utility and apply to resize handler**

Add a `debounce` helper at the top of `script.js`:

```javascript
function debounce(fn, delay = 150) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
```

Then in `BaseCarousel.init()`, change the resize handler to use debounce:

```javascript
window.addEventListener('resize', debounce(() => {
    this.updateCardsPerView();
    this.updateCarousel();
    this.createDots();
}));
```

**Step 2: Verify carousel still responds to resize**

Resize browser window. Confirm carousel adjusts after a short delay.

**Step 3: Commit**

```bash
git add Web/script.js
git commit -m "perf: debounce carousel resize handler to prevent jank"
```

---

## Phase 3: SEO & Missing Assets

### Task 7: Create og-image.jpg placeholder and fix broken meta references

**Why:** `og:image` references `https://rogolabs.net/og-image.jpg` and Person schema references `jerry-gamblin.jpg` — neither exists. Social sharing previews will be broken.

**Files:**
- Create: `Web/og-image.jpg` (1200x630 recommended for OG)
- Modify: `Web/index.html` (fix image references if needed)

**Step 1: Generate a simple OG image**

Use the existing logo to create a branded OG image. As a quick solution, use ImageMagick or manually create a 1200x630 image with the RogoLabs branding.

If ImageMagick is available:
```bash
convert -size 1200x630 xc:'#0f172a' \
  -fill '#2563eb' -font Helvetica-Bold -pointsize 72 \
  -gravity center -annotate 0 "RogoLabs\nVulnerability Intelligence" \
  Web/og-image.jpg
```

Otherwise, note this as a manual TODO — the owner should provide a branded image.

**Step 2: Verify meta tags reference the correct path**

Confirm the og:image meta tag matches the file location.

**Step 3: Commit**

```bash
git add Web/og-image.jpg
git commit -m "seo: add OG image for social sharing previews"
```

---

### Task 8: Update copyright year and fix sitemap lastmod

**Why:** Footer says "2025 RogoLabs" but it's 2026. Sitemap `lastmod` should reflect actual last modification.

**Files:**
- Modify: `Web/index.html` (footer copyright)
- Modify: `Web/sitemap.xml` (lastmod dates)

**Step 1: Update copyright year**

Find "2025 RogoLabs" and change to "2026 RogoLabs".

**Step 2: Update sitemap lastmod dates**

Change all `<lastmod>` values to today's date or the actual date of this update.

**Step 3: Commit**

```bash
git add Web/index.html Web/sitemap.xml
git commit -m "fix: update copyright year to 2026 and refresh sitemap dates"
```

---

### Task 9: Add structured data for projects (SoftwareApplication schema)

**Why:** The 8 projects have no structured data. Adding SoftwareApplication schema helps search engines understand and surface them.

**Files:**
- Modify: `Web/index.html` (add JSON-LD in `<head>`)

**Step 1: Add JSON-LD for projects**

Add a `<script type="application/ld+json">` block with an ItemList containing SoftwareApplication entries for each project. Include name, url, applicationCategory, operatingSystem, description, and author fields for each.

**Step 2: Validate with Google's Rich Results Test**

Copy the JSON-LD and test with Google's validation tool.

**Step 3: Commit**

```bash
git add Web/index.html
git commit -m "seo: add SoftwareApplication structured data for all projects"
```

---

## Phase 4: Accessibility Improvements

### Task 10: Improve link context for screen readers

**Why:** Multiple links say "View Source Code" or "Event Site" without indicating which project/talk. Screen reader users navigating by links will hear duplicates.

**Files:**
- Modify: `Web/index.html` (project card and talk card links)

**Step 1: Add descriptive aria-labels to project links**

For each project card, change generic links like:
```html
<a href="..." class="btn">View Source Code</a>
```
To:
```html
<a href="..." class="btn" aria-label="View CVE.ICU source code on GitHub">View Source Code</a>
```

Do the same for "Try It Live", "Download Slides", and "Event Site" links in talk cards.

**Step 2: Test with a screen reader or accessibility checker**

Use the browser's accessibility tree inspector to verify links have unique names.

**Step 3: Commit**

```bash
git add Web/index.html
git commit -m "a11y: add descriptive aria-labels to project and talk links"
```

---

### Task 11: Fix keyboard navigation scope for carousels

**Why:** In `script.js:441-449`, arrow key listeners are added to the global `document`. This means pressing left/right arrow ANYWHERE on the page moves the projects carousel, which is unexpected (e.g., when focused on a text input or the speaking section).

**Files:**
- Modify: `Web/script.js` (BaseCarousel.bindEvents)

**Step 1: Scope keyboard events to the carousel container**

Instead of listening on `document`, listen on the carousel's parent container:

```javascript
bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.previousSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    // Scope keyboard nav to the carousel section
    const container = this.track.closest('.projects-carousel, .speaking-carousel');
    container?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.previousSlide(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); this.nextSlide(); }
    });
}
```

**Step 2: Add `tabindex="0"` to carousel containers in HTML**

So they can receive focus:
```html
<div class="projects-carousel" tabindex="0" role="region" aria-label="Projects carousel">
```

**Step 3: Verify arrow keys work when carousel is focused, don't interfere elsewhere**

**Step 4: Commit**

```bash
git add Web/script.js Web/index.html
git commit -m "a11y: scope carousel keyboard navigation to focused carousel only"
```

---

## Phase 5: GitHub Actions Enhancements

### Task 12: Add HTML validation step to CI

**Why:** Currently the workflow only deploys — it doesn't validate the HTML. Broken markup can ship silently.

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Step 1: Add an HTML validation job that runs before deploy**

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Validate HTML
        uses: nickcox/html-validate-action@v1
        with:
          path: Web/index.html

  deploy:
    needs: validate
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload Web directory as artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./Web
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add HTML validation step before deploy"
```

---

### Task 13: Add Lighthouse CI audit to the workflow

**Why:** Automated Lighthouse scores catch performance, accessibility, SEO, and best-practices regressions.

**Files:**
- Create: `.github/workflows/lighthouse.yml`

**Step 1: Create Lighthouse CI workflow**

```yaml
name: Lighthouse Audit

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Lighthouse CI
        run: npm install -g @lhci/cli@0.14.x

      - name: Serve site and run Lighthouse
        run: |
          npx serve Web -l 8080 &
          sleep 3
          lhci autorun --collect.url=http://localhost:8080 \
            --assert.preset=lighthouse:recommended \
            --assert.assertions.categories:performance=off \
            --upload.target=temporary-public-storage
```

**Step 2: Commit**

```bash
git add .github/workflows/lighthouse.yml
git commit -m "ci: add Lighthouse audit on pull requests"
```

---

### Task 14: Add link checker to CI

**Why:** The site has 80+ external links to GitHub repos, tools, and event sites. Broken links degrade user experience silently.

**Files:**
- Create: `.github/workflows/link-check.yml`

**Step 1: Create link checker workflow**

```yaml
name: Check Links

on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly on Monday at 9am UTC
  workflow_dispatch:

jobs:
  check-links:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Check links
        uses: lycheeverse/lychee-action@v2
        with:
          args: --verbose --no-progress Web/index.html
          fail: false
```

**Step 2: Commit**

```bash
git add .github/workflows/link-check.yml
git commit -m "ci: add weekly broken link checker"
```

---

### Task 15: Gate deploy to only run on main (not PRs)

**Why:** The current workflow triggers on `pull_request` to `main`, which means PRs also deploy to production. PRs should only validate, not deploy.

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Step 1: Add condition to deploy job**

This was already addressed in Task 12's restructure. Verify the deploy job has:
```yaml
if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
```

**Step 2: Verify by opening a test PR**

Confirm the validate job runs but deploy does not.

**Step 3: Commit (if not already done in Task 12)**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: prevent deploy on pull requests, only validate"
```

---

## Phase 6: Cleanup & Polish

### Task 16: Remove PWA references to missing assets

**Why:** `manifest.json` references `screenshots/desktop.png`, `screenshots/mobile.png`, `icons/projects-icon.png`, and `icons/contact-icon.png` — none of which exist. The `icon-512x512.png` is referenced in manifest but missing from the icons directory. Service worker (`sw.js`) is referenced in `script.js` but doesn't exist in the repo.

**Files:**
- Modify: `Web/manifest.json` (remove screenshot and shortcut icon references)
- Modify: `Web/script.js` (remove or guard SW registration)

**Step 1: Remove non-existent references from manifest.json**

Remove the `screenshots` array and the `icons` from `shortcuts`. Remove `icon-512x512.png` from the icons list since it doesn't exist in `icons/` directory.

**Step 2: Remove SW registration since sw.js doesn't exist**

In `script.js`, the service worker registration block (lines 803-817) tries to register `./sw.js` which doesn't exist. Remove or comment it out, along with the `isServiceWorkerSupported()` function (lines 819-826) and the DevModeHelper references to it.

**Step 3: Commit**

```bash
git add Web/manifest.json Web/script.js
git commit -m "fix: remove references to non-existent PWA assets and service worker"
```

---

### Task 17: Suppress console.log in production

**Why:** Multiple `console.log` and `console.warn` calls fire in production (module init messages, LCP logging, etc.).

**Files:**
- Modify: `Web/script.js` (App.initializeModules and PerformanceObserver)

**Step 1: Guard console output behind dev mode check**

In `App.initializeModules()`, wrap the console.log calls with a dev mode check:

```javascript
const devMode = new DevModeHelper().isDevMode;
```

Then guard all console.log calls with `if (devMode)`.

Similarly in `IntersectionObserverManager.setupPerformanceObserver()`, guard the LCP console.log behind a dev check.

**Step 2: Verify no console output in production (non-localhost)**

**Step 3: Commit**

```bash
git add Web/script.js
git commit -m "perf: suppress console output in production builds"
```

---

### Task 18: Add a 404.html page for GitHub Pages

**Why:** GitHub Pages serves a generic 404 for unknown routes. A custom 404 helps users navigate back.

**Files:**
- Create: `Web/404.html`

**Step 1: Create a minimal 404 page**

Create a simple page that uses the existing `styles.css`, shows a "404 - Page Not Found" message, and has a link back to the homepage.

**Step 2: Commit**

```bash
git add Web/404.html
git commit -m "feat: add custom 404 page for GitHub Pages"
```

---

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1: Code Quality | 1–3 | DRY carousel code, remove dead CSS, eliminate inline styles |
| 2: Performance | 4–6 | Font loading, SRI security, debounced resize |
| 3: SEO | 7–9 | OG image, copyright, structured data |
| 4: Accessibility | 10–11 | Link context, scoped keyboard nav |
| 5: CI/CD | 12–15 | HTML validation, Lighthouse, link checker, deploy gating |
| 6: Cleanup | 16–18 | PWA fixes, production console cleanup, 404 page |

**Total: 18 tasks across 6 phases**

**Estimated lines of code changed:**
- ~300 lines removed (duplication)
- ~150 lines added (new functionality)
- Net improvement: cleaner, more maintainable, better performing
