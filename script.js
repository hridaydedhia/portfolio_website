/**
 * ============================================================================
 * PERSONAL PORTFOLIO - VANILLA JAVASCRIPT CONTROLLER
 * Features:
 *  1. Accessible Mobile Navigation Toggle (ARIA & Keyboard states)
 *  2. Smooth Scrolling with Sticky Header Offset
 *  3. IntersectionObserver Active Navigation Highlighting
 *  4. IntersectionObserver Subtle Scroll-Reveal
 *  5. Contact Form Validation & Mailto Fallback
 *  6. Interactive 3D Skill Domain Deck System
 *  7. Cinematic Projects Section & Dedicated Case File Engine
 * ============================================================================
 */

import { initProjectsSystem } from './projects-controller.js';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DOM REFERENCES
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  // --------------------------------------------------------------------------
  // 2. ACCESSIBLE MOBILE NAVIGATION TOGGLE
  // --------------------------------------------------------------------------
  if (mobileToggle && primaryNav) {
    const toggleNav = (isOpen) => {
      const state = typeof isOpen === 'boolean' ? isOpen : !primaryNav.classList.contains('is-open');
      mobileToggle.setAttribute('aria-expanded', String(state));
      primaryNav.classList.toggle('is-open', state);
      if (state) {
        // Set focus to the first nav link for keyboard users
        const firstLink = primaryNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    };

    mobileToggle.addEventListener('click', () => {
      toggleNav();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(event.target) &&
        !mobileToggle.contains(event.target)
      ) {
        toggleNav(false);
      }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        toggleNav(false);
        mobileToggle.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. SMOOTH SCROLLING WITH STICKY HEADER OFFSET
  // --------------------------------------------------------------------------
  const getHeaderHeight = () => {
    return header ? header.getBoundingClientRect().height : 68;
  };

  const smoothScrollTo = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const headerOffset = getHeaderHeight();
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  // Attach to internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        smoothScrollTo(targetId);

        // Close mobile nav if open
        if (primaryNav && primaryNav.classList.contains('is-open') && mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          primaryNav.classList.remove('is-open');
        }

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK HIGHLIGHTING (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserverOptions = {
      root: null,
      rootMargin: `-${getHeaderHeight()}px 0px -50% 0px`,
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 5. SUBTLE SCROLL-REVEAL SYSTEM
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Reveal all elements immediately
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 6. CONTACT FORM SUBMISSION & FEEDBACK
  // --------------------------------------------------------------------------
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Basic client-side validation
      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback is-error';
        formFeedback.textContent = '[Error: Please provide your name, a valid email address, and a message.]';
        return;
      }

      // Simple email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formFeedback.className = 'form-feedback is-error';
        formFeedback.textContent = '[Error: Please enter a valid email address.]';
        return;
      }

      // Successful dispatch simulation & Mailto Trigger
      formFeedback.className = 'form-feedback is-success';
      formFeedback.textContent = `[System Status: Message prepared for dispatch from ${name}. Opening mail client fallback...]`;

      const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject || 'New Message from ' + name}`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:placeholder@example.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Reset form fields
      contactForm.reset();

      // Trigger mailto after brief UI update
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }

  // --------------------------------------------------------------------------
  // 7. HERO HOMEPAGE INTERACTIVE 3D DEPTH & SLIDING TEXT ENGINE
  // --------------------------------------------------------------------------
  const heroSection = document.getElementById('hero');
  const portraitCard = document.getElementById('portrait-depth-card');
  const portraitImg = document.getElementById('hero-portrait-img');
  const bgTextFuture = document.getElementById('bg-text-future');
  const bgTextNow = document.getElementById('bg-text-now');
  const hudTag1 = document.getElementById('hud-tag-role');
  const hudTag2 = document.getElementById('hud-tag-metric');
  const hudTag3 = document.getElementById('hud-tag-status');
  const hudTagBottom = document.getElementById('hud-tag-coords');
  const focusIndicator = document.getElementById('focus-indicator');
  const photoInput = document.getElementById('hero-photo-file-input');
  const resetPhotoBtn = document.getElementById('btn-reset-photo');

  if (heroSection && portraitCard) {
    let isMouseOverHero = false;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let animationFrameId = null;

    // Smooth Lerp animation loop for physical responsiveness
    const updateParallax = () => {
      // Linear interpolation for silky-smooth motion
      currentTiltX += (targetTiltX - currentTiltX) * 0.12;
      currentTiltY += (targetTiltY - currentTiltY) * 0.12;

      if (isMouseOverHero) {
        // Image tilts towards mouse & elevates forward
        const rotateY = currentTiltX * 12; // degrees
        const rotateX = -currentTiltY * 10; // degrees
        portraitCard.style.transform = `scale(1.06) translateY(-8px) translateZ(50px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

        // Background typography slides inversely with parallax depth
        if (bgTextFuture) {
          bgTextFuture.style.transform = `translateX(${(currentTiltX * -40 - 30).toFixed(1)}px)`;
        }
        if (bgTextNow) {
          bgTextNow.style.transform = `translateX(${(currentTiltX * 40 + 30).toFixed(1)}px)`;
        }

        // Surrounding HUD tags slide dynamically around the portrait
        if (hudTag1) {
          hudTag1.style.transform = `translate(${(currentTiltX * 15 + 30).toFixed(1)}px, ${(currentTiltY * 10 - 8).toFixed(1)}px) scale(1.02)`;
        }
        if (hudTag2) {
          hudTag2.style.transform = `translate(${(currentTiltX * 20 + 38).toFixed(1)}px, ${(currentTiltY * 12).toFixed(1)}px) scale(1.02)`;
        }
        if (hudTag3) {
          hudTag3.style.transform = `translate(${(currentTiltX * 15 + 30).toFixed(1)}px, ${(currentTiltY * 10 + 8).toFixed(1)}px) scale(1.02)`;
        }
        if (hudTagBottom) {
          hudTagBottom.style.transform = `translate(-50%, ${(currentTiltY * 8 + 18).toFixed(1)}px) scale(1.02)`;
        }
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(updateParallax);

    // Track mouse position over the hero area
    heroSection.addEventListener('pointermove', (event) => {
      const rect = heroSection.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      // Normalized coordinates from -1 to 1
      targetTiltX = (clientX / rect.width) * 2 - 1;
      targetTiltY = (clientY / rect.height) * 2 - 1;

      if (!isMouseOverHero) {
        isMouseOverHero = true;
        heroSection.classList.add('is-hovered');
      }
    });

    heroSection.addEventListener('pointerleave', () => {
      isMouseOverHero = false;
      targetTiltX = 0;
      targetTiltY = 0;
      heroSection.classList.remove('is-hovered');

      // Smooth reset of transforms
      portraitCard.style.transform = '';
      if (bgTextFuture) bgTextFuture.style.transform = '';
      if (bgTextNow) bgTextNow.style.transform = '';
      if (hudTag1) hudTag1.style.transform = '';
      if (hudTag2) hudTag2.style.transform = '';
      if (hudTag3) hudTag3.style.transform = '';
      if (hudTagBottom) hudTagBottom.style.transform = '';
    });

    // Tap / Click Spotlight Focus Mode
    const toggleSpotlight = () => {
      const isActive = heroSection.classList.toggle('is-spotlight-active');
      if (focusIndicator) {
        const textSpan = focusIndicator.querySelector('.focus-key-icon');
        if (textSpan) {
          textSpan.textContent = isActive ? 'CLICK TO DISMISS' : 'CLICK TO SPOTLIGHT';
        }
      }
    };

    portraitCard.addEventListener('click', (e) => {
      // Don't trigger toggle if user clicked on photo upload or reset button
      if (e.target.closest('.terminal-tools')) return;
      toggleSpotlight();
    });

    portraitCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSpotlight();
      } else if (e.key === 'Escape' && heroSection.classList.contains('is-spotlight-active')) {
        toggleSpotlight();
      }
    });

    // ------------------------------------------------------------------------
    // Custom Photo Upload & Persistence System
    // ------------------------------------------------------------------------
    const savedCustomPhoto = localStorage.getItem('hriday_custom_portrait');
    if (savedCustomPhoto && portraitImg) {
      // Validate saved photo
      portraitImg.src = savedCustomPhoto;
      if (resetPhotoBtn) resetPhotoBtn.style.display = 'inline-block';
    }

    if (portraitImg) {
      portraitImg.addEventListener('error', () => {
        // Fallback to local Hriday-Photo.png if custom photo failed to load
        if (!portraitImg.src.includes('Hriday-Photo.png')) {
          portraitImg.src = './Hriday-Photo.png';
          localStorage.removeItem('hriday_custom_portrait');
          if (resetPhotoBtn) resetPhotoBtn.style.display = 'none';
        }
      });
    }

    if (photoInput && portraitImg) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (result && typeof result === 'string') {
            portraitImg.src = result;
            try {
              localStorage.setItem('hriday_custom_portrait', result);
            } catch (err) {
              console.warn('Image too large for localStorage, displayed in session only.', err);
            }
            if (resetPhotoBtn) resetPhotoBtn.style.display = 'inline-block';
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (resetPhotoBtn && portraitImg) {
      resetPhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        portraitImg.src = './Hriday-Photo.png';
        localStorage.removeItem('hriday_custom_portrait');
        resetPhotoBtn.style.display = 'none';
        if (photoInput) photoInput.value = '';
      });
    }

    // Drag-and-drop custom photo onto portrait frame
    portraitCard.addEventListener('dragover', (e) => {
      e.preventDefault();
      portraitCard.style.borderColor = 'var(--accent-orange)';
    });

    portraitCard.addEventListener('dragleave', () => {
      portraitCard.style.borderColor = '';
    });

    portraitCard.addEventListener('drop', (e) => {
      e.preventDefault();
      portraitCard.style.borderColor = '';
      const file = e.dataTransfer && e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/') && portraitImg) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (result && typeof result === 'string') {
            portraitImg.src = result;
            try {
              localStorage.setItem('hriday_custom_portrait', result);
            } catch (err) {
              console.warn('Image too large for localStorage', err);
            }
            if (resetPhotoBtn) resetPhotoBtn.style.display = 'inline-block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ==========================================================================
  // 6. INTERACTIVE 4-NODE ZIGZAG JOURNEY ENGINE
  // ==========================================================================
  const zigzagStage = document.getElementById('zigzag-stage');
  const guideTrack = document.getElementById('zigzag-guide-track');
  const activeTrack = document.getElementById('zigzag-active-track');
  const verticesGroup = document.getElementById('zigzag-vertices-group');
  const pulseDot = document.getElementById('zigzag-pulse-dot');
  const nodeRows = document.querySelectorAll('.zigzag-node-row');
  const hudTabs = document.querySelectorAll('.hud-node-tab');
  const toggleAllStagesBtn = document.getElementById('btn-toggle-all-branches');
  const toggleStagesLabel = document.getElementById('toggle-branches-label');

  let allStagesExpanded = false;
  let activeNodeId = null;
  let cachedPathLength = 0;
  let pulseProgress = 0;
  let pulseAnimId = null;
  // prefersReducedMotion already declared above

  // Calculate precision tactical zig-zag path with EXACTLY ONE sharp acute-angle turn for each node
  function renderZigzagConduit() {
    if (!zigzagStage || !guideTrack || !activeTrack) return;
    if (window.innerWidth < 900) {
      guideTrack.setAttribute('d', '');
      activeTrack.setAttribute('d', '');
      if (pulseDot) pulseDot.style.opacity = '0';
      if (verticesGroup) verticesGroup.innerHTML = '';
      return;
    }

    const stageRect = zigzagStage.getBoundingClientRect();
    const beacons = [];

    nodeRows.forEach((row) => {
      const beacon = row.querySelector('.node-anchor-beacon');
      if (beacon) {
        const bRect = beacon.getBoundingClientRect();
        beacons.push({
          x: bRect.left - stageRect.left + bRect.width / 2,
          y: bRect.top - stageRect.top + bRect.height / 2
        });
      }
    });

    if (beacons.length < 2) return;

    const stageWidth = stageRect.width;
    const xMid = stageWidth / 2;
    // Dynamic horizontal swing distance to guarantee a dramatic acute angle turn (< 50 deg)
    const swingSpan = Math.min(260, Math.max(160, stageWidth * 0.24));

    let pathD = `M ${Math.round(beacons[0].x)} ${Math.round(beacons[0].y)}`;
    const allTurnVertices = [];

    // Add marker for the starting node beacon
    allTurnVertices.push({ x: Math.round(beacons[0].x), y: Math.round(beacons[0].y) });

    for (let i = 0; i < beacons.length - 1; i++) {
      const p1 = beacons[i];
      const p2 = beacons[i + 1];
      const deltaY = p2.y - p1.y;
      if (deltaY <= 0) continue;

      // When leaving a left-side beacon, open corridor swings right (+swingSpan).
      // When leaving a right-side beacon, open corridor swings left (-swingSpan).
      const isLeftToRight = p1.x <= p2.x;
      const vx = isLeftToRight ? Math.round(xMid + swingSpan) : Math.round(xMid - swingSpan);
      // Single sharp acute vertex positioned midway between the two stages
      const vy = Math.round(p1.y + deltaY * 0.5);

      // Connect with EXACTLY ONE sharp turn for this node stage
      pathD += ` L ${vx} ${vy} L ${Math.round(p2.x)} ${Math.round(p2.y)}`;

      allTurnVertices.push({ x: vx, y: vy });
      allTurnVertices.push({ x: Math.round(p2.x), y: Math.round(p2.y) });
    }

    guideTrack.setAttribute('d', pathD);
    activeTrack.setAttribute('d', pathD);

    // Render sharp acute diamond vertex markers at each turn and node beacon
    if (verticesGroup) {
      let markersHtml = '';
      allTurnVertices.forEach((v) => {
        markersHtml += `<polygon points="${v.x},${v.y - 5} ${v.x + 5},${v.y} ${v.x},${v.y + 5} ${v.x - 5},${v.y}" class="zigzag-vertex-diamond" />`;
      });
      verticesGroup.innerHTML = markersHtml;
    }

    try {
      cachedPathLength = activeTrack.getTotalLength();
      activeTrack.style.strokeDasharray = `${cachedPathLength}`;
      updateScrollProgress();
    } catch (err) {
      cachedPathLength = 0;
    }
  }

  // Update progressive scroll draw of the active conduit
  function updateScrollProgress() {
    if (!activeTrack || !zigzagStage || cachedPathLength === 0) return;
    if (window.innerWidth < 900) return;

    if (prefersReducedMotion) {
      activeTrack.style.strokeDashoffset = '0';
      if (pulseDot) pulseDot.style.opacity = '0';
      return;
    }

    const stageRect = zigzagStage.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Section enters at 85% of screen, completes reveal by 35% of screen
    const startY = stageRect.top - windowHeight * 0.85;
    const endY = stageRect.bottom - windowHeight * 0.45;
    const totalDistance = endY - startY;

    let progress = 0;
    if (totalDistance > 0) {
      progress = Math.min(Math.max((0 - startY) / totalDistance, 0), 1);
    }

    // Minimum visible segment so line is noticed as an active path
    const drawnLength = Math.max(cachedPathLength * progress, 40);
    const offset = Math.max(cachedPathLength - drawnLength, 0);
    activeTrack.style.strokeDashoffset = `${offset}`;
  }

  // Continuous subtle orange pulse travelling along the revealed conduit
  function animateTravelingPulse() {
    if (prefersReducedMotion || !pulseDot || !activeTrack || cachedPathLength === 0 || window.innerWidth < 900) {
      if (pulseDot) pulseDot.style.opacity = '0';
      return;
    }

    pulseProgress += 0.0035;
    if (pulseProgress > 1) {
      pulseProgress = 0;
    }

    try {
      // Calculate position along path based on current drawn length or full path
      const currentLength = pulseProgress * cachedPathLength;
      const point = activeTrack.getPointAtLength(currentLength);
      pulseDot.setAttribute('cx', point.x);
      pulseDot.setAttribute('cy', point.y);
      pulseDot.style.opacity = '1';
    } catch (e) {
      pulseDot.style.opacity = '0';
    }

    pulseAnimId = requestAnimationFrame(animateTravelingPulse);
  }

  // Animate Node 02 Exam Statistics on Expansion
  function animateExamStats(container) {
    if (!container) return;
    const cards = container.querySelectorAll('.comp-stat-card');
    cards.forEach((card) => {
      const targetVal = parseFloat(card.getAttribute('data-target') || '0');
      const counterEl = card.querySelector('.counter-val');
      const barFill = card.querySelector('.comp-stat-bar-fill');
      const barTarget = card.getAttribute('data-bar-target') || '0%';

      if (barFill) {
        barFill.style.width = barTarget;
      }

      if (counterEl) {
        let current = 0;
        const duration = 1200;
        const startTime = performance.now();
        const isDecimal = targetVal % 1 !== 0;

        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = targetVal * easeProgress;

          if (targetVal > 1000) {
            // e.g. 25,730
            counterEl.textContent = Math.round(currentVal).toLocaleString();
          } else if (isDecimal) {
            counterEl.textContent = currentVal.toFixed(1);
          } else {
            counterEl.textContent = Math.round(currentVal).toString();
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      }
    });
  }

  // Expand / Collapse in place with non-modal subtle dimming
  function toggleNodeExpansion(nodeId, forceState = null) {
    const isCurrentlyActive = activeNodeId === String(nodeId);
    const shouldBeActive = forceState !== null ? forceState : !isCurrentlyActive;

    if (shouldBeActive) {
      activeNodeId = String(nodeId);
    } else {
      activeNodeId = null;
    }

    const anyActive = activeNodeId !== null || allStagesExpanded;
    if (zigzagStage) {
      zigzagStage.classList.toggle('has-expanded-node', anyActive);
    }

    nodeRows.forEach((row) => {
      const id = row.getAttribute('data-node-id');
      const card = row.querySelector('.zigzag-node-card');
      const unfoldContainer = row.querySelector('.node-unfold-container');
      const ctaBtn = row.querySelector('.node-cta-button');
      const ctaText = row.querySelector('.cta-text');

      const isTarget = allStagesExpanded || (activeNodeId && id === activeNodeId);

      if (isTarget) {
        row.classList.add('is-active');
        if (card) card.classList.add('is-active');
        if (unfoldContainer) unfoldContainer.classList.add('is-expanded');
        if (ctaBtn) ctaBtn.setAttribute('aria-expanded', 'true');
        if (ctaText) ctaText.textContent = 'CLICK TO COLLAPSE';

        // Trigger Node 02 stats animation if opening node 2
        if (id === '2' && unfoldContainer) {
          setTimeout(() => animateExamStats(unfoldContainer), 150);
        }
      } else {
        row.classList.remove('is-active');
        if (card) card.classList.remove('is-active');
        if (unfoldContainer) unfoldContainer.classList.remove('is-expanded');
        if (ctaBtn) ctaBtn.setAttribute('aria-expanded', 'false');
        if (ctaText) ctaText.textContent = 'EXPLORE STAGE DETAILS';
      }
    });

    // Update HUD Tabs
    hudTabs.forEach((tab) => {
      const tabNode = tab.getAttribute('data-node');
      const isSelected = activeNodeId && tabNode === activeNodeId;
      tab.classList.toggle('active', Boolean(isSelected));
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // Re-render SVG track seamlessly after height change
    setTimeout(renderZigzagConduit, 350);
  }

  // Bind click interactions to each of the 4 nodes
  nodeRows.forEach((row) => {
    const nodeId = row.getAttribute('data-node-id');
    const card = row.querySelector('.zigzag-node-card');
    const beacon = row.querySelector('.node-anchor-beacon');
    const ctaBtn = row.querySelector('.node-cta-button');

    if (card) {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        toggleNodeExpansion(nodeId);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleNodeExpansion(nodeId);
        }
      });
    }

    if (beacon) {
      beacon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNodeExpansion(nodeId);
      });
    }

    if (ctaBtn) {
      ctaBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNodeExpansion(nodeId);
      });
    }
  });

  // HUD Tab navigation
  hudTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetNode = tab.getAttribute('data-node');
      if (targetNode) {
        toggleNodeExpansion(targetNode, true);
        const targetRow = document.getElementById(`node-row-${targetNode}`);
        if (targetRow) {
          targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  // Toggle All Stages in HUD
  if (toggleAllStagesBtn && toggleStagesLabel) {
    toggleAllStagesBtn.addEventListener('click', () => {
      allStagesExpanded = !allStagesExpanded;

      if (allStagesExpanded) {
        toggleStagesLabel.textContent = 'COLLAPSE ALL STAGES';
        toggleAllStagesBtn.style.background = 'rgba(255, 107, 26, 0.2)';
        nodeRows.forEach((row) => {
          const id = row.getAttribute('data-node-id');
          toggleNodeExpansion(id, true);
        });
      } else {
        toggleStagesLabel.textContent = 'EXPAND ALL STAGES';
        toggleAllStagesBtn.style.background = '';
        activeNodeId = null;
        if (zigzagStage) zigzagStage.classList.remove('has-expanded-node');
        nodeRows.forEach((row) => {
          const card = row.querySelector('.zigzag-node-card');
          const unfoldContainer = row.querySelector('.node-unfold-container');
          const ctaBtn = row.querySelector('.node-cta-button');
          const ctaText = row.querySelector('.cta-text');

          row.classList.remove('is-active');
          if (card) card.classList.remove('is-active');
          if (unfoldContainer) unfoldContainer.classList.remove('is-expanded');
          if (ctaBtn) ctaBtn.setAttribute('aria-expanded', 'false');
          if (ctaText) ctaText.textContent = 'EXPLORE STAGE DETAILS';
        });
        hudTabs.forEach((tab) => tab.classList.remove('active'));
      }

      setTimeout(renderZigzagConduit, 350);
    });
  }

  // Scroll listener for conduit progressive reveal
  window.addEventListener('scroll', () => {
    updateScrollProgress();
  }, { passive: true });

  window.addEventListener('resize', () => {
    renderZigzagConduit();
  });

  if (typeof ResizeObserver !== 'undefined' && zigzagStage) {
    const ro = new ResizeObserver(() => {
      renderZigzagConduit();
    });
    ro.observe(zigzagStage);
  }

  // Start continuous pulse and conduit render
  window.addEventListener('load', () => {
    renderZigzagConduit();
    animateTravelingPulse();
  });

  setTimeout(() => {
    renderZigzagConduit();
    animateTravelingPulse();
  }, 100);

  // ==========================================================================
  // 8. EDITORIAL ABOUT SECTION: CONTINUOUS ORBITAL IDENTITIES ENGINE
  // ==========================================================================
  /**
   * Configuration for the Four Identities orbiting around HRIDAY.
   * Modify the titles, dimensions, or placeholder descriptions here or directly in index.html.
   */
  const ABOUT_IDENTITIES = {
    '01': {
      id: '01',
      title: 'THE ENGINEER',
      dimension: 'how I think',
      description: 'Architecting resilient systems, optimizing latency curves, deterministic state machines, and distributed concurrency.'
    },
    '02': {
      id: '02',
      title: 'THE FINANCIER',
      dimension: 'finance & markets',
      description: 'Fascinated by market dynamics, capital allocation principles, quantitative models, and global macroeconomics.'
    },
    '03': {
      id: '03',
      title: 'THE BUILDER',
      dimension: 'what I create',
      description: 'Transforming complex concepts into intuitive user experiences, robust frontend architectures, and shipped products.'
    },
    '04': {
      id: '04',
      title: 'THE HUMAN',
      dimension: 'who I am',
      description: 'Driven by curiosity, open conversations, continuous self-mastery, endurance athletic pursuits, and creative thought.'
    }
  };

  const orbitalArena = document.getElementById('orbital-arena');
  const identityButtons = document.querySelectorAll('.identity-action-item');
  const rosterLinks = document.querySelectorAll('.roster-link');
  const statusDimensionLabel = document.getElementById('status-dimension-label');

  let activePinnedIdentityId = null;

  function setActiveIdentity(id, isPinned = false) {
    if (!id) {
      if (activePinnedIdentityId && !isPinned) {
        // Return to pinned state
        renderIdentityState(activePinnedIdentityId);
        return;
      }
      // Reset to neutral continuous orbit state
      activePinnedIdentityId = null;
      if (orbitalArena) {
        orbitalArena.classList.remove('has-active-selection');
        orbitalArena.classList.remove('is-hovering-node');
      }
      identityButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      rosterLinks.forEach((link) => link.classList.remove('is-active'));
      if (statusDimensionLabel) {
        statusDimensionLabel.textContent = 'CONTINUOUS ORBIT';
      }
      return;
    }

    const config = ABOUT_IDENTITIES[id];
    if (!config) return;

    if (isPinned) {
      // If clicking already pinned identity, toggle it off
      if (activePinnedIdentityId === id) {
        setActiveIdentity(null, true);
        return;
      }
      activePinnedIdentityId = id;
    }

    renderIdentityState(id);
  }

  function renderIdentityState(id) {
    const config = ABOUT_IDENTITIES[id];
    if (!config) return;

    if (orbitalArena) orbitalArena.classList.add('has-active-selection');

    identityButtons.forEach((btn) => {
      const btnId = btn.getAttribute('data-id');
      const isMatch = btnId === id;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    rosterLinks.forEach((link) => {
      const linkId = link.getAttribute('data-roster-id');
      link.classList.toggle('is-active', linkId === id);
    });

    if (statusDimensionLabel) {
      statusDimensionLabel.textContent = `${config.id} // ${config.dimension.toUpperCase()}`;
    }
  }

  // Bind identity buttons hover and click events
  identityButtons.forEach((btn) => {
    const id = btn.getAttribute('data-id');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveIdentity(id, true);
    });

    btn.addEventListener('mouseenter', () => {
      if (orbitalArena) orbitalArena.classList.add('is-hovering-node');
      setActiveIdentity(id, false);
    });

    btn.addEventListener('mouseleave', () => {
      if (orbitalArena) orbitalArena.classList.remove('is-hovering-node');
      if (activePinnedIdentityId) {
        renderIdentityState(activePinnedIdentityId);
      } else {
        setActiveIdentity(null, false);
      }
    });

    btn.addEventListener('focus', () => {
      setActiveIdentity(id, false);
    });

    btn.addEventListener('blur', () => {
      if (activePinnedIdentityId) {
        renderIdentityState(activePinnedIdentityId);
      } else {
        setActiveIdentity(null, false);
      }
    });
  });

  // Bind bottom-right roster links
  rosterLinks.forEach((link) => {
    const id = link.getAttribute('data-roster-id');

    link.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveIdentity(id, true);
    });

    link.addEventListener('mouseenter', () => {
      setActiveIdentity(id, false);
    });

    link.addEventListener('mouseleave', () => {
      if (activePinnedIdentityId) {
        renderIdentityState(activePinnedIdentityId);
      } else {
        setActiveIdentity(null, false);
      }
    });
  });

  // Clicking anywhere outside identity nodes resets selection
  document.addEventListener('click', (e) => {
    if (activePinnedIdentityId && !e.target.closest('.identity-action-item') && !e.target.closest('.roster-link')) {
      setActiveIdentity(null, true);
    }
  });

  // Resume Download Button feedback and resilient download handler
  const btnDownloadResume = document.getElementById('btn-download-resume');
  if (btnDownloadResume) {
    btnDownloadResume.addEventListener('click', (e) => {
      const btnText = btnDownloadResume.querySelector('.btn-dl-text');
      if (btnText) {
        const originalText = btnText.textContent;
        btnText.textContent = 'DOWNLOADING...';

        setTimeout(() => {
          btnText.textContent = 'RESUME READY ✓';
        }, 600);

        setTimeout(() => {
          btnText.textContent = originalText;
        }, 3200);
      }
    });
  }

  // Initialize 3D Card Deck Skills System
  initSkills3DDeck();

  // Initialize Asymmetric Projects & Dedicated Case Studies System
  initProjectsSystem();
});

/* --------------------------------------------------------------------------
   Interactive 3D Skill Domain Deck System
   - Smooth and slowed-down 3D rotating card expansion animation (1800ms extract, 1500ms return)
   - Real-time 3D flight from grid dock slot to dead-center of viewport
   - Deep cinematic backdrop blur overlay (14px) over the entire screen
   - Dynamic 3D perspective spin (Y-axis revolutions with subtle X-axis tilt)
   - Mid-flight seamless face swap revealing comprehensive skill competencies
   - Tactile return animation gliding back into resting dock with zero layout jump
   - Resilient keyboard (ESC/Enter/Space), backdrop click, and button dismissals
   -------------------------------------------------------------------------- */
function initSkills3DDeck() {
  const stage = document.getElementById('skills-deck-stage');
  if (!stage) return;

  const skillsSection = document.getElementById('skills');
  const backdrop = document.getElementById('skills-deck-backdrop');
  const cards = Array.from(stage.querySelectorAll('.skill-card-3d'));

  let activeCard = null;
  let activeSlot = null;
  let isAnimating = false;

  function extractCardToCenter(card) {
    if (isAnimating || activeCard) return;
    isAnimating = true;
    activeCard = card;
    activeSlot = card.closest('.skill-card-slot');

    // 1. Capture geometric positions in viewport coordinates
    const cardRect = card.getBoundingClientRect();
    const startLeft = Math.round(cardRect.left);
    const startTop = Math.round(cardRect.top);
    const startW = Math.round(cardRect.width);
    const startH = Math.round(cardRect.height);

    // Active slot stays firmly anchored in grid with origin dock silhouette
    if (activeSlot) activeSlot.classList.add('is-origin-dock');

    // Dim remaining cards cleanly
    cards.forEach((c) => {
      if (c !== card) {
        c.classList.add('is-card-dimmed');
      }
    });

    // Elevate stacking contexts
    stage.classList.add('has-active-card');
    if (skillsSection) skillsSection.classList.add('has-active-card');
    if (backdrop) backdrop.classList.add('is-active');

    // Calculate dead-center coordinates in viewport
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const targetW = Math.min(840, viewportW - 32);
    const targetH = Math.min(650, viewportH - 48);
    const targetLeft = Math.round((viewportW - targetW) / 2);
    const targetTop = Math.round((viewportH - targetH) / 2);

    // Position card as fixed element at its exact current dock location
    card.classList.add('is-extracting');
    card.style.position = 'fixed';
    card.style.left = `${startLeft}px`;
    card.style.top = `${startTop}px`;
    card.style.width = `${startW}px`;
    card.style.height = `${startH}px`;
    card.style.zIndex = '9300';
    card.style.margin = '0';

    // Smooth, slowed-down 3D rotating animation (1800ms)
    const anim = card.animate(
      [
        {
          left: `${startLeft}px`,
          top: `${startTop}px`,
          width: `${startW}px`,
          height: `${startH}px`,
          transform: 'perspective(1400px) rotateY(0deg) rotateX(0deg) scale(1)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45), 0 0 0 rgba(255, 107, 26, 0)',
          offset: 0
        },
        {
          left: `${Math.round(startLeft + (targetLeft - startLeft) * 0.28)}px`,
          top: `${Math.round(startTop + (targetTop - startTop) * 0.28)}px`,
          width: `${Math.round(startW + (targetW - startW) * 0.28)}px`,
          height: `${Math.round(startH + (targetH - startH) * 0.28)}px`,
          transform: 'perspective(1400px) rotateY(180deg) rotateX(-3deg) scale(1.04)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 107, 26, 0.2)',
          offset: 0.28
        },
        {
          left: `${Math.round(startLeft + (targetLeft - startLeft) * 0.55)}px`,
          top: `${Math.round(startTop + (targetTop - startTop) * 0.55)}px`,
          width: `${Math.round(startW + (targetW - startW) * 0.55)}px`,
          height: `${Math.round(startH + (targetH - startH) * 0.55)}px`,
          transform: 'perspective(1400px) rotateY(360deg) rotateX(2deg) scale(1.06)',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.85), 0 0 45px rgba(255, 107, 26, 0.28)',
          offset: 0.55
        },
        {
          left: `${Math.round(startLeft + (targetLeft - startLeft) * 0.82)}px`,
          top: `${Math.round(startTop + (targetTop - startTop) * 0.82)}px`,
          width: `${Math.round(startW + (targetW - startW) * 0.82)}px`,
          height: `${Math.round(startH + (targetH - startH) * 0.82)}px`,
          transform: 'perspective(1400px) rotateY(540deg) rotateX(-1deg) scale(1.03)',
          boxShadow: '0 32px 85px rgba(0, 0, 0, 0.92), 0 0 40px rgba(255, 107, 26, 0.22)',
          offset: 0.82
        },
        {
          left: `${targetLeft}px`,
          top: `${targetTop}px`,
          width: `${targetW}px`,
          height: `${targetH}px`,
          transform: 'perspective(1400px) rotateY(720deg) rotateX(0deg) scale(1)',
          boxShadow: '0 25px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 107, 26, 0.2)',
          offset: 1
        }
      ],
      {
        duration: 1800,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      }
    );

    // Swap to detail face mid-spin while card is dynamically turning
    const faceSwapTimer = setTimeout(() => {
      if (activeCard === card) {
        card.classList.add('is-centered-expanded');
      }
    }, 950);

    anim.onfinish = () => {
      // Cancel WAAPI animation to avoid persistent override of inline styles
      anim.cancel();
      clearTimeout(faceSwapTimer);

      card.classList.add('is-centered-expanded');
      card.style.position = 'fixed';
      card.style.left = `${targetLeft}px`;
      card.style.top = `${targetTop}px`;
      card.style.width = `${targetW}px`;
      card.style.height = `${targetH}px`;
      card.style.transform = 'none';
      card.style.zIndex = '9300';
      card.setAttribute('aria-expanded', 'true');
      isAnimating = false;

      const returnBtn = card.querySelector('.btn-return-card');
      if (returnBtn) returnBtn.focus();
    };
  }

  function returnCardToDock() {
    if (isAnimating || !activeCard || !activeSlot) return;
    isAnimating = true;

    const card = activeCard;
    const slot = activeSlot;

    // Viewport coordinates
    const currentCardRect = card.getBoundingClientRect();
    const currentLeft = Math.round(currentCardRect.left);
    const currentTop = Math.round(currentCardRect.top);
    const currentW = Math.round(currentCardRect.width);
    const currentH = Math.round(currentCardRect.height);

    const slotRect = slot.getBoundingClientRect();
    const endLeft = Math.round(slotRect.left);
    const endTop = Math.round(slotRect.top);
    const endW = Math.round(slotRect.width);
    const endH = Math.round(slotRect.height);

    // Fade out backdrop blur and restore background cards
    if (backdrop) backdrop.classList.remove('is-active');
    cards.forEach((c) => c.classList.remove('is-card-dimmed'));

    // Reset internal scroll position of the detail face
    const detailFace = card.querySelector('.card-detail-face');
    if (detailFace) detailFace.scrollTop = 0;

    // Smooth, slowed-down reverse 3D flight animation back to dock (1500ms)
    const returnAnim = card.animate(
      [
        {
          left: `${currentLeft}px`,
          top: `${currentTop}px`,
          width: `${currentW}px`,
          height: `${currentH}px`,
          transform: 'perspective(1400px) rotateY(720deg) rotateX(0deg) scale(1)',
          boxShadow: '0 25px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 107, 26, 0.2)',
          offset: 0
        },
        {
          left: `${Math.round(currentLeft + (endLeft - currentLeft) * 0.35)}px`,
          top: `${Math.round(currentTop + (endTop - currentTop) * 0.35)}px`,
          width: `${Math.round(currentW + (endW - currentW) * 0.35)}px`,
          height: `${Math.round(currentH + (endH - currentH) * 0.35)}px`,
          transform: 'perspective(1400px) rotateY(540deg) rotateX(-2deg) scale(1.04)',
          boxShadow: '0 24px 65px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 107, 26, 0.22)',
          offset: 0.35
        },
        {
          left: `${Math.round(currentLeft + (endLeft - currentLeft) * 0.65)}px`,
          top: `${Math.round(currentTop + (endTop - currentTop) * 0.65)}px`,
          width: `${Math.round(currentW + (endW - currentW) * 0.65)}px`,
          height: `${Math.round(currentH + (endH - currentH) * 0.65)}px`,
          transform: 'perspective(1400px) rotateY(360deg) rotateX(2deg) scale(1.03)',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.65), 0 0 25px rgba(255, 107, 26, 0.18)',
          offset: 0.65
        },
        {
          left: `${Math.round(currentLeft + (endLeft - currentLeft) * 0.88)}px`,
          top: `${Math.round(currentTop + (endTop - currentTop) * 0.88)}px`,
          width: `${Math.round(currentW + (endW - currentW) * 0.88)}px`,
          height: `${Math.round(currentH + (endH - currentH) * 0.88)}px`,
          transform: 'perspective(1400px) rotateY(180deg) rotateX(-1deg) scale(1.01)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          offset: 0.88
        },
        {
          left: `${endLeft}px`,
          top: `${endTop}px`,
          width: `${endW}px`,
          height: `${endH}px`,
          transform: 'perspective(1400px) rotateY(0deg) rotateX(0deg) scale(1)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
          offset: 1
        }
      ],
      {
        duration: 1500,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      }
    );

    // Swap back to preview face midway through return spin
    const returnSwapTimer = setTimeout(() => {
      card.classList.remove('is-centered-expanded');
    }, 650);

    returnAnim.onfinish = () => {
      returnAnim.cancel();
      clearTimeout(returnSwapTimer);

      card.removeAttribute('style');
      card.classList.remove('is-extracting', 'is-centered-expanded');
      card.setAttribute('aria-expanded', 'false');

      slot.classList.remove('is-origin-dock');
      stage.classList.remove('has-active-card');
      if (skillsSection) skillsSection.classList.remove('has-active-card');

      activeCard = null;
      activeSlot = null;
      isAnimating = false;

      card.focus();
    };
  }

  // Bind click and keyboard triggers to all 5 domain cards
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If clicking return button, dock the card
      if (e.target.closest('.btn-return-card')) {
        e.stopPropagation();
        returnCardToDock();
        return;
      }

      // If already expanded, allow normal interaction with chips/content
      if (card.classList.contains('is-centered-expanded')) {
        return;
      }

      extractCardToCenter(card);
    });

    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !card.classList.contains('is-centered-expanded')) {
        e.preventDefault();
        extractCardToCenter(card);
      }
    });
  });

  // Full-screen backdrop click closes active card
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (activeCard && !isAnimating) {
        returnCardToDock();
      }
    });
  }

  // Dismiss if clicking outside the active card anywhere on page
  document.addEventListener('click', (e) => {
    if (activeCard && !isAnimating && activeCard.classList.contains('is-centered-expanded')) {
      if (!activeCard.contains(e.target)) {
        returnCardToDock();
      }
    }
  });

  // Escape key closes active card
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeCard && !isAnimating) {
      returnCardToDock();
    }
  });

  // Window resize handler to maintain dead center in viewport
  window.addEventListener('resize', () => {
    if (activeCard && activeCard.classList.contains('is-centered-expanded') && !isAnimating) {
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const targetW = Math.min(840, viewportW - 32);
      const targetH = Math.min(650, viewportH - 48);
      const targetLeft = Math.round((viewportW - targetW) / 2);
      const targetTop = Math.round((viewportH - targetH) / 2);

      activeCard.style.left = `${targetLeft}px`;
      activeCard.style.top = `${targetTop}px`;
      activeCard.style.width = `${targetW}px`;
      activeCard.style.height = `${targetH}px`;
    }
  });
}
