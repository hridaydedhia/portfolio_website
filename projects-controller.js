/**
 * ==============================================================================
 * PROJECTS CONTROLLER & CASE STUDY TRANSITION ENGINE
 * Handles:
 *  - Cinematic card expansion and morphing into dedicated case studies
 *  - Reverse transition back to editorial grid with zero layout jump
 *  - Full 7-section technical case file rendering
 *  - Interactive quantitative widgets (Markowitz MPT slider, CAPM Beta inspector, etc.)
 *  - Deep linking via URL hash (#project-[id]) and keyboard accessibility
 * ==============================================================================
 */

import { PROJECTS_DATA } from './projects-data.js';

export function initProjectsSystem() {
  const stage = document.getElementById('projects-editorial-stage');
  const overlay = document.getElementById('project-case-overlay');
  const overlayBackdrop = document.getElementById('case-overlay-backdrop');
  const contentContainer = document.getElementById('case-file-content');
  const btnTopBack = document.getElementById('btn-top-back');
  const statusIndicator = document.getElementById('case-active-status');

  if (!stage || !overlay || !contentContainer) return;

  const projectCards = stage.querySelectorAll('.project-editorial-card');
  const projectOrder = ['markowitz', 'capm', 'stockmaster', 'paisadiary'];
  let activeProjectId = null;
  let originatingCard = null;
  let isTransitioning = false;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Transition portal elements
  const portal = document.getElementById('page-nav-portal');
  const portalTitle = document.getElementById('portal-dest-title');
  const portalStatus = document.getElementById('portal-status-text');
  const portalBar = document.getElementById('portal-progress-bar');
  const portalCode = document.getElementById('portal-route-code');
  const topCrumb = document.getElementById('case-top-crumb');

  // --------------------------------------------------------------------------
  // 1. OPEN PROJECT CASE STUDY WITH CINEMATIC PAGE TRANSITION
  // --------------------------------------------------------------------------
  function openProjectCase(projectId, sourceCard = null) {
    if (isTransitioning) return;
    const data = PROJECTS_DATA[projectId];
    if (!data) return;

    isTransitioning = true;
    activeProjectId = projectId;

    if (!sourceCard) {
      sourceCard = stage.querySelector(`[data-project-id="${projectId}"]`);
    }
    originatingCard = sourceCard;

    // Render the case study content into viewport container
    renderCaseStudy(data);

    // Update status text and top bar breadcrumb
    if (statusIndicator) {
      statusIndicator.textContent = `CASE_FILE // ${data.shortTitle} [${data.number}]`;
    }
    if (topCrumb) {
      topCrumb.textContent = data.crumb || data.shortTitle;
    }

    // Card launch highlight feedback
    if (sourceCard) {
      sourceCard.classList.add('is-launching');
    }

    // Dim and gently scale sibling cards in the grid
    projectCards.forEach((c) => {
      if (c !== sourceCard) {
        c.classList.add('is-dimmed');
      } else {
        c.classList.add('is-originating');
      }
    });

    if (!prefersReducedMotion && portal) {
      // Configure Portal HUD
      if (portalTitle) portalTitle.textContent = data.title;
      if (portalStatus) portalStatus.textContent = `PAGE ROUTE ENGAGED // PROJECT [${data.number}]`;
      if (portalCode) portalCode.textContent = `200 OK // /projects/${data.id}.html • ROUTE OK`;
      if (portalBar) portalBar.style.width = '0%';

      // Trigger Portal Entry Animation
      portal.classList.remove('is-opening', 'is-closing');
      portal.classList.add('is-active');

      // Progress bar fill sweep
      requestAnimationFrame(() => {
        if (portalBar) portalBar.style.width = '100%';
      });

      // Switch to project page once shutters close smoothly
      setTimeout(() => {
        overlay.hidden = false;
        overlay.classList.add('is-active');
        document.body.classList.add('case-overlay-open');
        document.title = `${data.title} — Quantitative Systems Portfolio | Hriday Dedhia`;

        // Reset scroll position
        const viewport = overlay.querySelector('.case-overlay-viewport');
        if (viewport) viewport.scrollTop = 0;

        // Open shutters revealing dedicated project page after brief pause
        setTimeout(() => {
          portal.classList.add('is-opening');
          setTimeout(() => {
            portal.classList.remove('is-active', 'is-opening');
            if (portalBar) portalBar.style.width = '0%';
            if (sourceCard) sourceCard.classList.remove('is-launching');
            isTransitioning = false;
          }, 750);
        }, 350);
      }, 800);

    } else {
      // Instant switch for reduced motion
      overlay.hidden = false;
      overlay.classList.add('is-active');
      document.body.classList.add('case-overlay-open');
      document.title = `${data.title} — Quantitative Systems Portfolio | Hriday Dedhia`;
      const viewport = overlay.querySelector('.case-overlay-viewport');
      if (viewport) viewport.scrollTop = 0;
      if (sourceCard) sourceCard.classList.remove('is-launching');
      isTransitioning = false;
    }

    // Update URL hash without reload
    history.pushState({ projectId }, '', `#project-${projectId}`);

    // Attach interactive widgets inside the case file
    attachInteractiveWidgets(projectId);
  }

  // --------------------------------------------------------------------------
  // 2. CLOSE PROJECT CASE STUDY (RETURN TO GRID)
  // --------------------------------------------------------------------------
  function closeProjectCase() {
    if (isTransitioning || !overlay.classList.contains('is-active')) return;
    isTransitioning = true;

    if (!prefersReducedMotion && portal) {
      if (portalTitle) portalTitle.textContent = 'PORTFOLIO OVERVIEW';
      if (portalStatus) portalStatus.textContent = 'RETURNING TO PORTFOLIO REPOSITORY';
      if (portalCode) portalCode.textContent = '200 OK // /index.html#projects';
      if (portalBar) {
        portalBar.style.width = '0%';
        requestAnimationFrame(() => {
          portalBar.style.width = '100%';
        });
      }

      portal.classList.remove('is-opening');
      portal.classList.add('is-active', 'is-closing');

      setTimeout(() => {
        overlay.classList.remove('is-active');
        document.body.classList.remove('case-overlay-open');
        document.title = 'Hriday Dedhia | Quantitative Finance & Systems Portfolio';
        overlay.hidden = true;
        contentContainer.innerHTML = '';

        // Restore sibling card states
        projectCards.forEach((c) => {
          c.classList.remove('is-dimmed');
          c.classList.remove('is-originating');
          c.classList.remove('is-launching');
        });

        // Reset URL hash to projects section
        history.pushState(null, '', '#projects');

        // Scroll smoothly back to originating card
        if (originatingCard) {
          originatingCard.focus();
          const headerOffset = 80;
          const cardPos = originatingCard.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: cardPos, behavior: 'smooth' });
        }

        // Open shutters revealing portfolio grid after brief pause
        setTimeout(() => {
          portal.classList.remove('is-closing');
          portal.classList.add('is-opening');

          setTimeout(() => {
            portal.classList.remove('is-active', 'is-opening');
            if (portalBar) portalBar.style.width = '0%';
            activeProjectId = null;
            isTransitioning = false;
          }, 750);
        }, 300);

      }, 800);

    } else {
      overlay.classList.remove('is-active');
      document.body.classList.remove('case-overlay-open');
      document.title = 'Hriday Dedhia | Quantitative Finance & Systems Portfolio';
      overlay.hidden = true;
      contentContainer.innerHTML = '';

      projectCards.forEach((c) => {
        c.classList.remove('is-dimmed');
        c.classList.remove('is-originating');
        c.classList.remove('is-launching');
      });

      history.pushState(null, '', '#projects');

      if (originatingCard) {
        originatingCard.focus();
      }

      activeProjectId = null;
      isTransitioning = false;
    }
  }

  // --------------------------------------------------------------------------
  // 3. SWITCH TO ANOTHER PROJECT (PREV / NEXT)
  // --------------------------------------------------------------------------
  function navigateProject(direction) {
    if (!activeProjectId || isTransitioning) return;
    const currentIndex = projectOrder.indexOf(activeProjectId);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      if (currentIndex >= projectOrder.length - 1) return;
      nextIndex = currentIndex + 1;
    } else {
      if (currentIndex <= 0) return;
      nextIndex = currentIndex - 1;
    }

    const nextProjectId = projectOrder[nextIndex];
    const data = PROJECTS_DATA[nextProjectId];
    if (!data) return;

    isTransitioning = true;
    activeProjectId = nextProjectId;

    // Immediately update breadcrumb and status bar
    const crumbEl = document.getElementById('case-top-crumb');
    if (crumbEl) {
      crumbEl.textContent = data.crumb || data.shortTitle;
    }
    if (statusIndicator) {
      statusIndicator.textContent = `CASE_FILE // ${data.shortTitle} [${data.number}]`;
    }
    if (portalCode) {
      portalCode.textContent = `200 OK // /projects/${data.id}.html • ROUTE OK`;
    }

    // Smooth lateral transition
    contentContainer.classList.add('is-switching');

    setTimeout(() => {
      renderCaseStudy(data);
      const crumbElAfter = document.getElementById('case-top-crumb');
      if (crumbElAfter) {
        crumbElAfter.textContent = data.crumb || data.shortTitle;
      }
      if (statusIndicator) {
        statusIndicator.textContent = `CASE_FILE // ${data.shortTitle} [${data.number}]`;
      }
      const viewport = overlay.querySelector('.case-overlay-viewport');
      if (viewport) viewport.scrollTop = 0;

      history.pushState({ projectId: nextProjectId }, '', `#project-${nextProjectId}`);
      attachInteractiveWidgets(nextProjectId);

      contentContainer.classList.remove('is-switching');
      isTransitioning = false;
    }, 400);
  }

  // --------------------------------------------------------------------------
  // 4. RENDER FULL CASE STUDY CONTENT
  // --------------------------------------------------------------------------
  function renderCaseStudy(data) {
    const currentIndex = projectOrder.indexOf(data.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    const nextIndex = currentIndex < projectOrder.length - 1 ? currentIndex + 1 : projectOrder.length - 1;
    const prevProject = PROJECTS_DATA[projectOrder[prevIndex]];
    const nextProject = PROJECTS_DATA[projectOrder[nextIndex]];

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === projectOrder.length - 1;

    // Always update top bar breadcrumbs, status indicator, and document title
    const crumbEl = document.getElementById('case-top-crumb');
    if (crumbEl) {
      crumbEl.textContent = data.crumb || data.shortTitle;
    }
    if (statusIndicator) {
      statusIndicator.textContent = `CASE_FILE // ${data.shortTitle} [${data.number}]`;
    }
    document.title = `${data.title} — Quantitative Systems Portfolio | Hriday Dedhia`;

    contentContainer.innerHTML = `
      <article class="case-file-document" id="case-doc-${data.id}" role="document">
        
        <!-- Document Meta Header -->
        <header class="case-doc-header">
          <div class="case-doc-identity font-mono">
            <span class="case-number">PROJECT ${data.number}</span>
            <span class="case-slash">/</span>
            <span class="case-flag ${data.isFlagship ? 'is-flagship' : ''}">${data.flag}</span>
          </div>

          <h1 class="case-main-title font-sans">${data.title}</h1>
          <p class="case-lead-summary text-secondary">${data.summary}</p>

          <!-- Key Metrics Grid -->
          <div class="case-metrics-rail font-mono" aria-label="Project Engineering Metrics">
            ${data.metrics.map(m => `
              <div class="metric-block">
                <span class="metric-label">${m.label}</span>
                <span class="metric-value">${m.value}</span>
                <span class="metric-sub">${m.sub}</span>
              </div>
            `).join('')}
          </div>

          <!-- Outbound Navigation & Direct Action Bar -->
          ${(() => {
            const hasLiveApp = Boolean(data.liveUrl && data.id !== 'markowitz' && data.id !== 'capm' && data.id !== 'stockmaster');
            const hasGithub = Boolean(data.githubUrl && data.id !== 'paisadiary');
            if (!hasLiveApp && !hasGithub) return '';
            return `
              <div class="case-header-actions font-mono">
                ${hasLiveApp ? `
                  <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="case-action-btn live-btn" id="btn-live-app" title="Launch deployed live application">
                    <span class="btn-live-dot"></span>
                    <span>OPEN LIVE APP</span>
                    <span class="action-btn-arrow">↗</span>
                  </a>
                ` : ''}
                ${hasGithub ? `
                  <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="case-action-btn repo-btn" id="btn-github-repo" title="View source repository on GitHub">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                    <span>GITHUB REPO</span>
                    <span class="action-btn-arrow">↗</span>
                  </a>
                ` : ''}
              </div>
            `;
          })()}
        </header>

        <!-- Dynamic Hero Project Visual Stage with Interactive Workbench -->
        <section class="case-hero-stage" aria-label="Interactive Project Telemetry Stage">
          ${renderHeroWorkbench(data)}
        </section>

        <!-- Structured 7 Case Study Sections -->
        <div class="case-study-sections">

          <!-- 01 — THE PROBLEM -->
          <section class="case-section" id="case-sec-problem">
            <div class="case-section-header font-mono">
              <span class="section-num">01</span>
              <h2 class="section-heading font-sans">THE PROBLEM</h2>
            </div>
            <div class="case-text-body">
              ${formatParagraphs(data.problem)}
            </div>
          </section>

          <!-- 02 — THE APPROACH -->
          <section class="case-section" id="case-sec-approach">
            <div class="case-section-header font-mono">
              <span class="section-num">02</span>
              <h2 class="section-heading font-sans">THE APPROACH</h2>
            </div>
            <div class="case-text-body">
              ${formatParagraphs(data.approach)}
            </div>
          </section>

          <!-- 03 — HOW IT WORKS -->
          <section class="case-section" id="case-sec-how-it-works">
            <div class="case-section-header font-mono">
              <span class="section-num">03</span>
              <h2 class="section-heading font-sans">HOW IT WORKS</h2>
            </div>
            <div class="pipeline-pipeline-flow" aria-label="Technical Pipeline Stages">
              ${data.pipelineStages.map((stage, idx) => `
                <div class="pipeline-step-card">
                  <div class="step-card-header font-mono">
                    <span class="step-idx">${stage.step}</span>
                    <span class="step-title font-sans">${stage.title}</span>
                  </div>
                  <p class="step-desc text-secondary">${stage.desc}</p>
                  ${idx < data.pipelineStages.length - 1 ? `
                    <div class="pipeline-conduit font-mono" aria-hidden="true">
                      <span class="conduit-line"></span>
                      <span class="conduit-arrow">↓</span>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>

          <!-- 04 — KEY DECISIONS -->
          <section class="case-section" id="case-sec-decisions">
            <div class="case-section-header font-mono">
              <span class="section-num">04</span>
              <h2 class="section-heading font-sans">KEY DECISIONS</h2>
            </div>
            <div class="decisions-grid">
              ${data.decisions.map(d => `
                <div class="decision-card">
                  <h3 class="decision-title font-sans">${d.title}</h3>
                  <div class="decision-choice font-mono">
                    <span class="choice-label">CHOICE:</span>
                    <span class="choice-text">${d.decision}</span>
                  </div>
                  <p class="decision-rationale text-secondary">${d.rationale}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- 05 — TECHNOLOGY -->
          <section class="case-section" id="case-sec-technology">
            <div class="case-section-header font-mono">
              <span class="section-num">05</span>
              <h2 class="section-heading font-sans">TECHNOLOGY</h2>
            </div>
            <div class="technology-roles-grid font-mono">
              ${data.techRoles.map(t => `
                <div class="tech-role-item">
                  <div class="tech-role-badge">${t.name}</div>
                  <p class="tech-role-desc">${t.role}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- 06 — THE RESULT -->
          <section class="case-section" id="case-sec-results">
            <div class="case-section-header font-mono">
              <span class="section-num">06</span>
              <h2 class="section-heading font-sans">THE RESULT</h2>
            </div>
            <ul class="results-list">
              ${data.results.map(r => `
                <li class="result-item text-secondary">
                  <span class="result-bullet font-mono" aria-hidden="true">✦</span>
                  <span class="result-text">${r}</span>
                </li>
              `).join('')}
            </ul>
          </section>

          <!-- 07 — WHAT I LEARNED -->
          <section class="case-section" id="case-sec-learnings">
            <div class="case-section-header font-mono">
              <span class="section-num">07</span>
              <h2 class="section-heading font-sans">WHAT I LEARNED</h2>
            </div>
            <div class="learnings-stack">
              ${data.learnings.map(l => `
                <div class="learning-card">
                  <span class="learning-icon font-mono" aria-hidden="true">//</span>
                  <p class="learning-text text-secondary">${l}</p>
                </div>
              `).join('')}
            </div>
          </section>

        </div>

        <!-- Integrated Editorial Bottom Navigation -->
        <nav class="case-bottom-nav font-mono" aria-label="Project Case Study Navigation">
          <button type="button" class="nav-case-btn prev-btn ${isFirst ? 'is-disabled' : ''}" id="btn-prev-project" ${isFirst ? 'disabled aria-disabled="true"' : ''} aria-label="${isFirst ? 'First project in sequence' : `Previous project: ${prevProject.title}`}">
            <span class="nav-dir-label">← PREVIOUS</span>
            <span class="nav-target-title">${isFirst ? 'START OF PROJECTS' : `${prevProject.shortTitle} [${prevProject.number}]`}</span>
          </button>

          <button type="button" class="btn-return-to-projects font-mono" id="btn-bottom-return" aria-label="Back to projects grid">
            <span>BACK TO PROJECTS ↑</span>
          </button>

          <button type="button" class="nav-case-btn next-btn ${isLast ? 'is-disabled' : ''}" id="btn-next-project" ${isLast ? 'disabled aria-disabled="true"' : ''} aria-label="${isLast ? 'Last project in sequence' : `Next project: ${nextProject.title}`}">
            <span class="nav-dir-label">NEXT →</span>
            <span class="nav-target-title">${isLast ? 'END OF PROJECTS' : `${nextProject.shortTitle} [${nextProject.number}]`}</span>
          </button>
        </nav>

      </article>
    `;

    // Attach navigation button handlers
    const prevBtn = contentContainer.querySelector('#btn-prev-project');
    const nextBtn = contentContainer.querySelector('#btn-next-project');
    const bottomReturn = contentContainer.querySelector('#btn-bottom-return');

    if (prevBtn) prevBtn.addEventListener('click', () => navigateProject('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateProject('next'));
    if (bottomReturn) bottomReturn.addEventListener('click', closeProjectCase);
  }

  // --------------------------------------------------------------------------
  // 5. RENDER HERO WORKBENCH PER PROJECT
  // --------------------------------------------------------------------------
  function renderHeroWorkbench(data) {
    if (data.id === 'markowitz') {
      return `
        <div class="hero-workbench-box">
          <div class="workbench-bar font-mono">
            <span class="workbench-title">STREAMLIT INTERACTIVE ENGINE // EFFICIENT FRONTIER SIMULATOR</span>
            <span class="workbench-badge">SLSQP OPTIMIZER: ACTIVE</span>
          </div>

          <div class="workbench-body">
            <div class="chart-display-frame">
              <svg class="case-chart-svg" viewBox="0 0 760 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Grid lines -->
                <g stroke="#222836" stroke-width="1" stroke-dasharray="3 3">
                  <line x1="60" y1="40" x2="720" y2="40" />
                  <line x1="60" y1="100" x2="720" y2="100" />
                  <line x1="60" y1="160" x2="720" y2="160" />
                  <line x1="60" y1="220" x2="720" y2="220" />
                  <line x1="60" y1="280" x2="720" y2="280" />
                  <line x1="160" y1="30" x2="160" y2="290" />
                  <line x1="300" y1="30" x2="300" y2="290" />
                  <line x1="440" y1="30" x2="440" y2="290" />
                  <line x1="580" y1="30" x2="580" y2="290" />
                </g>

                <!-- Axes -->
                <line x1="60" y1="280" x2="730" y2="280" stroke="#4b5563" stroke-width="1.5" />
                <line x1="60" y1="280" x2="60" y2="20" stroke="#4b5563" stroke-width="1.5" />
                <text x="710" y="304" fill="#676e80" font-family="'JetBrains Mono', monospace" font-size="10" text-anchor="end">PORTFOLIO VOLATILITY (σ %)</text>
                <text x="30" y="30" fill="#676e80" font-family="'JetBrains Mono', monospace" font-size="10" transform="rotate(-90 30 30)" text-anchor="end">ANNUALIZED RETURN E[R] %</text>

                <!-- Monte Carlo Scatter Cloud -->
                <g class="mc-cloud" opacity="0.45">
                  <circle cx="170" cy="245" r="2.5" fill="#4b5563" />
                  <circle cx="190" cy="230" r="3" fill="#6b7280" />
                  <circle cx="210" cy="215" r="2.5" fill="#4b5563" />
                  <circle cx="230" cy="240" r="3" fill="#6b7280" />
                  <circle cx="250" cy="195" r="3" fill="#ff6b1a" fill-opacity="0.5" />
                  <circle cx="270" cy="225" r="2" fill="#4b5563" />
                  <circle cx="290" cy="180" r="3" fill="#ff6b1a" fill-opacity="0.6" />
                  <circle cx="310" cy="205" r="3" fill="#6b7280" />
                  <circle cx="340" cy="160" r="3.5" fill="#ff853f" fill-opacity="0.7" />
                  <circle cx="370" cy="190" r="2.5" fill="#4b5563" />
                  <circle cx="400" cy="140" r="3.5" fill="#ff853f" fill-opacity="0.8" />
                  <circle cx="440" cy="170" r="2.5" fill="#6b7280" />
                  <circle cx="480" cy="120" r="3" fill="#ffaa70" fill-opacity="0.9" />
                  <circle cx="520" cy="150" r="2" fill="#4b5563" />
                  <circle cx="560" cy="105" r="3.5" fill="#ffaa70" />
                  <circle cx="600" cy="135" r="2.5" fill="#6b7280" />
                  <circle cx="640" cy="95" r="3" fill="#ffb380" />
                </g>

                <!-- CAL Line -->
                <line x1="60" y1="240" x2="620" y2="40" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 2" />
                <circle cx="60" cy="240" r="3.5" fill="#3b82f6" />
                <text x="68" y="244" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="9">Rf = 4.2%</text>

                <!-- Efficient Frontier Curve -->
                <path d="M 150 230 C 185 180, 250 110, 400 85 C 500 70, 600 62, 670 56" fill="none" stroke="#ff6b1a" stroke-width="3" stroke-linecap="round" />

                <!-- Min Volatility Marker -->
                <rect x="146" y="226" width="8" height="8" fill="#10b981" transform="rotate(45 150 230)" />
                <text x="120" y="215" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600">MIN VOL: 8.4%</text>

                <!-- Tangency Max Sharpe Marker -->
                <circle cx="395" cy="90" r="10" stroke="#ff6b1a" stroke-width="1.5" stroke-dasharray="2 2" />
                <circle cx="395" cy="90" r="5" fill="#ff6b1a" />
                <circle cx="395" cy="90" r="2" fill="#fff" />
                <rect x="420" y="72" width="180" height="34" rx="3" fill="#141720" stroke="#ff6b1a" stroke-width="1" />
                <text x="430" y="86" fill="#fff" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600">MAX SHARPE RATIO: 1.48</text>
                <text x="430" y="99" fill="#ff853f" font-family="'JetBrains Mono', monospace" font-size="8">E[R]: 24.8% // σ: 14.2%</text>

                <!-- User Interactive Target Position Marker -->
                <g id="interactive-user-marker">
                  <circle id="user-point" cx="395" cy="90" r="7" stroke="#3b82f6" stroke-width="2" fill="none" />
                </g>
              </svg>
            </div>

            <!-- Interactive Risk Parameter Controller -->
            <div class="workbench-controls-rail font-mono">
              <div class="control-group">
                <label for="risk-tolerance-slider" class="control-label">
                  <span>INVESTOR RISK PROFILE:</span>
                  <strong id="risk-profile-value" class="text-orange">BALANCED (TANGENCY)</strong>
                </label>
                <input type="range" id="risk-tolerance-slider" min="1" max="5" value="3" step="1" class="interactive-range">
                <div class="range-ticks">
                  <span>CONSERVATIVE</span>
                  <span>BALANCED</span>
                  <span>AGGRESSIVE</span>
                </div>
              </div>

              <div class="weights-breakdown-card">
                <span class="breakdown-title">OPTIMAL ASSET ALLOCATION WEIGHTS:</span>
                <div class="weights-bars" id="weights-bars-container">
                  <div class="weight-row">
                    <span class="asset-name">AAPL (Technology)</span>
                    <div class="bar-track"><div class="bar-fill" style="width: 28%;"></div></div>
                    <span class="weight-pct">28.0%</span>
                  </div>
                  <div class="weight-row">
                    <span class="asset-name">MSFT (Enterprise)</span>
                    <div class="bar-track"><div class="bar-fill" style="width: 32%;"></div></div>
                    <span class="weight-pct">32.0%</span>
                  </div>
                  <div class="weight-row">
                    <span class="asset-name">JNJ (Healthcare)</span>
                    <div class="bar-track"><div class="bar-fill" style="width: 22%;"></div></div>
                    <span class="weight-pct">22.0%</span>
                  </div>
                  <div class="weight-row">
                    <span class="asset-name">XOM (Energy)</span>
                    <div class="bar-track"><div class="bar-fill" style="width: 18%;"></div></div>
                    <span class="weight-pct">18.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (data.id === 'capm') {
      return `
        <div class="hero-workbench-box">
          <div class="workbench-bar font-mono">
            <span class="workbench-title">SECURITY MARKET LINE & BETA REGRESSION ANALYSIS</span>
            <span class="workbench-badge">OLS FIT: R² = 0.74</span>
          </div>
          <div class="workbench-body">
            <div class="chart-display-frame">
              <svg class="case-chart-svg" viewBox="0 0 760 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="60" y1="260" x2="720" y2="260" stroke="#4b5563" stroke-width="1.5" />
                <line x1="60" y1="260" x2="60" y2="20" stroke="#4b5563" stroke-width="1.5" />
                <text x="700" y="285" fill="#676e80" font-family="'JetBrains Mono', monospace" font-size="10" text-anchor="end">SYSTEMATIC RISK (BETA β)</text>
                <text x="30" y="30" fill="#676e80" font-family="'JetBrains Mono', monospace" font-size="10" transform="rotate(-90 30 30)" text-anchor="end">EXPECTED RETURN E[R]</text>
                
                <!-- SML Line -->
                <line x1="60" y1="220" x2="680" y2="50" stroke="#ff6b1a" stroke-width="2.5" />
                <text x="630" y="42" fill="#ff6b1a" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600">SML: E[R] = Rf + β(Rm - Rf)</text>

                <!-- Scatter Points -->
                <circle cx="160" cy="195" r="3.5" fill="#6b7280" />
                <circle cx="280" cy="165" r="3.5" fill="#6b7280" />
                <circle cx="380" cy="135" r="4" fill="#9ca3af" />
                <circle cx="480" cy="80" r="5" stroke="#ff6b1a" stroke-width="2" fill="#ff6b1a" fill-opacity="0.3" />
                <circle cx="580" cy="95" r="3.5" fill="#6b7280" />

                <!-- Alpha spread callout -->
                <line x1="480" y1="80" x2="480" y2="108" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 2" />
                <rect x="495" y="70" width="160" height="30" rx="3" fill="#141720" stroke="#10b981" stroke-width="1" />
                <text x="505" y="84" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600">JENSEN'S ALPHA: +2.1%</text>
                <text x="505" y="94" fill="#9ca3af" font-family="'JetBrains Mono', monospace" font-size="8">BETA: 1.24 (High Sensitivity)</text>
              </svg>
            </div>
          </div>
        </div>
      `;
    }

    if (data.id === 'paisadiary') {
      return `
        <div class="hero-workbench-box">
          <div class="workbench-bar font-mono">
            <span class="workbench-title">GEMINI ZERO-SHOT NATURAL LANGUAGE LEDGER PARSER</span>
            <span class="workbench-badge">HACKATHON WINNER // 1ST PLACE</span>
          </div>
          <div class="workbench-body">
            <div class="ai-console-stage font-mono">
              <div class="console-box">
                <div class="console-row input-row">
                  <span class="c-prompt">RAW_INPUT&gt;</span>
                  <span class="c-val">"Split ₹1,420 for team dinner at cafe via UPI with 4 friends"</span>
                </div>
                <div class="console-row token-row">
                  <span class="c-prompt">GEMINI_EXTRACT&gt;</span>
                  <span class="token-item">[AMOUNT: 1420.00]</span>
                  <span class="token-item">[CURRENCY: INR]</span>
                  <span class="token-item">[CATEGORY: Dining]</span>
                  <span class="token-item">[GATEWAY: UPI]</span>
                  <span class="token-item">[SPLIT: 4 PAIR]</span>
                </div>
                <div class="console-row sql-row">
                  <span class="c-prompt">SQL_TRANSACTION&gt;</span>
                  <span class="sql-code">INSERT INTO transactions (amt, cat, method, timestamp) VALUES (1420.00, 'DINING', 'UPI', NOW());</span>
                  <span class="sql-status font-mono">COMMIT 200 OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (data.id === 'stockmaster') {
      return `
        <div class="hero-workbench-box">
          <div class="workbench-bar font-mono">
            <span class="workbench-title">REAL-TIME INVENTORY DEPLETION & PREDICTIVE RESTOCKING</span>
            <span class="workbench-badge">ALERTS: ACTIVE // DYNAMIC ROP</span>
          </div>
          <div class="workbench-body">
            <div class="chart-display-frame">
              <svg class="case-chart-svg" viewBox="0 0 760 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="60" y1="220" x2="720" y2="220" stroke="#4b5563" stroke-width="1.5" />
                <line x1="60" y1="220" x2="60" y2="20" stroke="#4b5563" stroke-width="1.5" />
                <text x="700" y="244" fill="#676e80" font-family="'JetBrains Mono', monospace" font-size="10" text-anchor="end">TIME (OPERATIONAL DAYS)</text>
                <text x="30" y="30" fill="#676e80" font-family="'JetBrains Mono', monospace" font-size="10" transform="rotate(-90 30 30)" text-anchor="end">STOCK ON HAND (UNITS)</text>

                <!-- Reorder Point Threshold line -->
                <line x1="60" y1="130" x2="720" y2="130" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="4 2" />
                <text x="710" y="124" fill="#ef4444" font-family="'JetBrains Mono', monospace" font-size="9" text-anchor="end">REORDER POINT ROP = (d̄ × L) + SS</text>

                <!-- Depletion Step Slope -->
                <path d="M 60 40 L 180 70 L 300 100 L 420 130" stroke="#ff6b1a" stroke-width="2.5" stroke-linecap="round" />
                <!-- Replenishment Inflow -->
                <path d="M 420 130 L 420 50 L 560 80 L 700 110" stroke="#10b981" stroke-width="2" stroke-dasharray="4 2" />

                <!-- Trigger Point -->
                <circle cx="420" cy="130" r="6" fill="#ef4444" />
                <circle cx="420" cy="130" r="10" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2 2" />
                <rect x="440" y="125" width="200" height="32" rx="3" fill="#141720" stroke="#ef4444" stroke-width="1" />
                <text x="450" y="140" fill="#ef4444" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600">AUTO-RESTOCK DISPATCHED</text>
                <text x="450" y="151" fill="#9ca3af" font-family="'JetBrains Mono', monospace" font-size="8">Lead-Time Buffer: 3.2 Days</text>
              </svg>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  // --------------------------------------------------------------------------
  // 6. ATTACH INTERACTIVE WIDGETS
  // --------------------------------------------------------------------------
  function attachInteractiveWidgets(projectId) {
    if (projectId === 'markowitz') {
      const slider = contentContainer.querySelector('#risk-tolerance-slider');
      const label = contentContainer.querySelector('#risk-profile-value');
      const userMarker = contentContainer.querySelector('#user-point');
      const weightsContainer = contentContainer.querySelector('#weights-bars-container');

      if (!slider || !label || !weightsContainer) return;

      const profiles = {
        1: { name: 'MINIMUM RISK (CONSERVATIVE)', cx: 150, cy: 230, weights: [10, 15, 55, 20] },
        2: { name: 'DEFENSIVE GROWTH', cx: 270, cy: 150, weights: [18, 22, 40, 20] },
        3: { name: 'BALANCED (MAX SHARPE)', cx: 395, cy: 90, weights: [28, 32, 22, 18] },
        4: { name: 'AGGRESSIVE GROWTH', cx: 520, cy: 70, weights: [42, 38, 12, 8] },
        5: { name: 'MAX EXPECTED RETURN', cx: 670, cy: 56, weights: [65, 30, 5, 0] }
      };

      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const p = profiles[val] || profiles[3];
        label.textContent = p.name;
        if (userMarker) {
          userMarker.setAttribute('cx', p.cx);
          userMarker.setAttribute('cy', p.cy);
        }

        weightsContainer.innerHTML = `
          <div class="weight-row">
            <span class="asset-name">AAPL (Technology)</span>
            <div class="bar-track"><div class="bar-fill" style="width: ${p.weights[0]}%;"></div></div>
            <span class="weight-pct">${p.weights[0]}%</span>
          </div>
          <div class="weight-row">
            <span class="asset-name">MSFT (Enterprise)</span>
            <div class="bar-track"><div class="bar-fill" style="width: ${p.weights[1]}%;"></div></div>
            <span class="weight-pct">${p.weights[1]}%</span>
          </div>
          <div class="weight-row">
            <span class="asset-name">JNJ (Healthcare)</span>
            <div class="bar-track"><div class="bar-fill" style="width: ${p.weights[2]}%;"></div></div>
            <span class="weight-pct">${p.weights[2]}%</span>
          </div>
          <div class="weight-row">
            <span class="asset-name">XOM (Energy)</span>
            <div class="bar-track"><div class="bar-fill" style="width: ${p.weights[3]}%;"></div></div>
            <span class="weight-pct">${p.weights[3]}%</span>
          </div>
        `;
      });
    }
  }

  // --------------------------------------------------------------------------
  // 7. HELPER: PARAGRAPH FORMATTER
  // --------------------------------------------------------------------------
  function formatParagraphs(text) {
    if (!text) return '';
    return text
      .split('\n\n')
      .map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('-')) {
          return `<div class="formatted-list-block font-mono">${escapeHtml(trimmed).replace(/\n/g, '<br>')}</div>`;
        }
        return `<p>${escapeHtml(trimmed).replace(/\n/g, '<br>')}</p>`;
      })
      .join('');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // --------------------------------------------------------------------------
  // 8. EVENT ATTACHMENTS FOR GRID CARDS
  // --------------------------------------------------------------------------
  projectCards.forEach((card) => {
    const projectId = card.dataset.projectId;

    card.addEventListener('click', (e) => {
      openProjectCase(projectId, card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectCase(projectId, card);
      }
    });

    const trigger = card.querySelector('.view-project-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectCase(projectId, card);
      });
    }
  });

  // Top sticky back button
  if (btnTopBack) {
    btnTopBack.addEventListener('click', closeProjectCase);
  }

  // Backdrop click closes case overlay
  if (overlayBackdrop) {
    overlayBackdrop.addEventListener('click', closeProjectCase);
  }

  // Global Keyboard shortcuts when case overlay is open
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeProjectCase();
    } else if (e.key === 'ArrowRight') {
      navigateProject('next');
    } else if (e.key === 'ArrowLeft') {
      navigateProject('prev');
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
      const id = hash.replace('#project-', '');
      if (PROJECTS_DATA[id]) {
        openProjectCase(id);
      }
    } else if (overlay.classList.contains('is-active')) {
      closeProjectCase();
    }
  });

  // Check initial deep link on page load
  const initialHash = window.location.hash;
  if (initialHash.startsWith('#project-')) {
    const id = initialHash.replace('#project-', '');
    if (PROJECTS_DATA[id]) {
      setTimeout(() => openProjectCase(id), 100);
    }
  }
}
