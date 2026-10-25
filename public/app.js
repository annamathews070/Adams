(() => {
  'use strict';

  const root = document.documentElement;
  const pageNames = {
    home: 'Home', about: 'About', services: 'Services', project: 'Chembra Project',
    contact: 'Contact', privacy: 'Privacy', terms: 'Terms',
  };
  const currentPage = pageNames[root.dataset.page] ? root.dataset.page : 'home';
  document.title = currentPage === 'home'
    ? 'Adams — A better way to build on land'
    : `${pageNames[currentPage]} — Adams The Complete Property Solutions`;
  const skipTargets = {
    home: '#home', about: '#story-start', services: '#services-start',
    project: '#opportunity-start', contact: '#contact-start',
    privacy: '#privacy-title', terms: '#terms-title',
  };
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.href = skipTargets[currentPage];
  document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach((link) => {
    const route = link.getAttribute('href')?.replace(/^\//, '') || 'home';
    if (route === currentPage) link.setAttribute('aria-current', 'page');
  });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const heroTrack = document.querySelector('.hero-track i');
  const heroCurrent = document.querySelector('.hero-current');
  const header = document.querySelector('.site-header');
  let activeSlide = 0;
  let heroTimer;
  let heroVisible = true;
  let scrollFrame = 0;

  const showHeroSlide = (index) => {
    if (!slides.length) return;
    slides[activeSlide]?.classList.remove('active');
    activeSlide = (index + slides.length) % slides.length;
    slides[activeSlide]?.classList.add('active');
    if (heroCurrent) heroCurrent.textContent = String(activeSlide + 1).padStart(2, '0');
    if (heroTrack) heroTrack.style.width = `${((activeSlide + 1) / slides.length) * 100}%`;
  };
  const stopHero = () => window.clearInterval(heroTimer);
  const syncHero = () => {
    stopHero();
    if (slides.length > 1 && heroVisible && !document.hidden && !reducedMotion.matches) {
      heroTimer = window.setInterval(() => showHeroSlide(activeSlide + 1), 6500);
    }
  };
  if (hero) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncHero();
    }, { threshold: 0.05 }).observe(hero);
  }

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('nav-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
    document.body.classList.toggle('nav-open', open);
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const atmosphere = document.querySelector('.site-atmosphere');
  const crystal = atmosphere?.querySelector('.site-atmosphere__crystal');
  const veil = atmosphere?.querySelector('.site-atmosphere__veil');
  const light = atmosphere?.querySelector('.site-atmosphere__light');
  const updateScrollState = () => {
    scrollFrame = 0;
    const scrollY = window.scrollY;
    header?.classList.toggle('scrolled', scrollY > 24);
    const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, scrollY / range);
    const heroRange = Math.max(1, (hero?.offsetHeight || window.innerHeight) - window.innerHeight);
    const heroProgress = Math.max(0, Math.min(1, (scrollY - (hero?.offsetTop || 0)) / heroRange));
    root.style.setProperty('--page-progress', progress.toFixed(4));
    root.style.setProperty('--hero-scroll', heroProgress.toFixed(4));
    const depth = progress - 0.5;
    const mobileFactor = window.innerWidth <= 700 ? 0.65 : 1;
    if (crystal) crystal.style.transform = `translate3d(${(depth * window.innerWidth * 0.016 * mobileFactor).toFixed(1)}px,${(depth * window.innerHeight * 0.04 * mobileFactor).toFixed(1)}px,0) scale(1.025)`;
    if (veil) veil.style.transform = `translate3d(${(-depth * window.innerWidth * 0.011 * mobileFactor).toFixed(1)}px,${(-depth * window.innerHeight * 0.02 * mobileFactor).toFixed(1)}px,0)`;
    if (light) light.style.transform = `translate3d(${(depth * window.innerWidth * 0.032 * mobileFactor).toFixed(1)}px,${(Math.sin(progress * Math.PI * 2) * window.innerHeight * 0.008).toFixed(1)}px,0)`;
  };
  const requestScrollUpdate = () => {
    if (!scrollFrame && !reducedMotion.matches) scrollFrame = window.requestAnimationFrame(updateScrollState);
    else if (reducedMotion.matches) updateScrollState();
  };
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });

  const journeyImages = [
    {
      src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85',
      alt: 'Morning light falling across a green landscape',
      title: 'Room to imagine',
      caption: 'LAND · A FOUNDATION FOR POSSIBILITY',
    },
    {
      src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85',
      alt: 'Expansive green agricultural fields beneath a wide sky',
      title: 'Rooted in the land',
      caption: 'LAND · CHEMBRA, PALAKKAD',
    },
    {
      src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1800&q=85',
      alt: 'A thoughtful home set among trees and greenery',
      title: 'A future taking shape',
      caption: 'DEVELOPMENT · DESIGNED WITH CARE',
    },
  ];
  const journey = document.querySelector('.journey-viewer');
  const journeyImage = journey?.querySelector('.journey-image');
  const journeyTitle = journey?.querySelector('.journey-title');
  const journeyCount = journey?.querySelector('.journey-count');
  const journeyCaption = journey?.querySelector('.journey-image-caption');
  const journeyStatus = journey?.querySelector('.journey-status');
  const journeyMarks = [...(journey?.querySelectorAll('.journey-progress i') || [])];
  let journeyIndex = 0;
  let journeyVisible = false;
  let journeyTimer;
  let journeyHovered = false;
  let journeyFocused = false;
  let imageRequest = 0;

  const canRotateJourney = () => journeyVisible && !document.hidden && !reducedMotion.matches && !journeyHovered && !journeyFocused;
  const scheduleJourney = () => {
    window.clearTimeout(journeyTimer);
    if (canRotateJourney()) journeyTimer = window.setTimeout(() => changeJourney(1, false), 7000);
  };
  const changeJourney = async (delta, announce = true) => {
    const nextIndex = (journeyIndex + delta + journeyImages.length) % journeyImages.length;
    const request = ++imageRequest;
    const item = journeyImages[nextIndex];
    journeyImage?.classList.add('is-changing');
    const image = new Image();
    image.src = item.src;
    try {
      if (image.decode) await image.decode();
    } catch {
      if (request === imageRequest && journeyStatus) journeyStatus.textContent = 'This image could not be loaded. Please try again.';
      scheduleJourney();
      return;
    }
    if (request !== imageRequest || !journeyImage) return;
    journeyIndex = nextIndex;
    journeyImage.src = item.src;
    journeyImage.alt = item.alt;
    journeyTitle.textContent = item.title;
    journeyCount.textContent = `${String(nextIndex + 1).padStart(2, '0')} / ${String(journeyImages.length).padStart(2, '0')}`;
    journeyCaption.textContent = item.caption;
    journeyMarks.forEach((mark, index) => mark.classList.toggle('is-current', index === nextIndex));
    if (announce) journeyStatus.textContent = `${item.title}, image ${nextIndex + 1} of ${journeyImages.length}`;
    window.setTimeout(() => journeyImage?.classList.remove('is-changing'), 40);
    scheduleJourney();
  };
  journey?.querySelector('.journey-prev')?.addEventListener('click', () => changeJourney(-1));
  journey?.querySelector('.journey-next')?.addEventListener('click', () => changeJourney(1));
  journey?.addEventListener('pointerenter', () => { journeyHovered = true; scheduleJourney(); });
  journey?.addEventListener('pointerleave', () => { journeyHovered = false; scheduleJourney(); });
  journey?.addEventListener('focusin', () => { journeyFocused = true; scheduleJourney(); });
  journey?.addEventListener('focusout', () => { journeyFocused = false; scheduleJourney(); });
  journey?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') changeJourney(-1);
    if (event.key === 'ArrowRight') changeJourney(1);
  });
  if (journey) new IntersectionObserver(([entry]) => {
    journeyVisible = entry.isIntersecting;
    scheduleJourney();
  }, { threshold: 0.45 }).observe(journey);

  const phone = '917594880033';
  const makeWhatsAppUrl = (message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const serviceName = link.dataset.service;
    const defaultMessage = link.dataset.message || 'Hello Adams, I would like to discuss a property enquiry.';
    const message = serviceName
      ? `Hello Adams, I am enquiring about ${serviceName}. Please share the next steps.`
      : defaultMessage;
    link.href = makeWhatsAppUrl(message);
  });
  document.querySelectorAll('.service-card[data-service]').forEach((link) => {
    link.href = makeWhatsAppUrl(`Hello Adams, I am enquiring about ${link.dataset.service}. Please share the next steps.`);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const projectSelect = document.querySelector('#project-view-select');
  const projectViews = [...document.querySelectorAll('.project-view')];
  projectSelect?.addEventListener('change', () => {
    const selectedProject = projectSelect.value;
    projectViews.forEach((view) => {
      const isSelected = view.id === `${selectedProject}-project`;
      view.hidden = !isSelected;
      view.classList.toggle('is-selected', isSelected);
    });
    document.querySelector('#opportunity')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });

  reducedMotion.addEventListener('change', () => {
    syncHero();
    if (reducedMotion.matches) window.clearTimeout(journeyTimer);
    else scheduleJourney();
  });
  document.addEventListener('visibilitychange', () => {
    syncHero();
    scheduleJourney();
  });
  document.querySelector('#year').textContent = String(new Date().getFullYear());
  window.addEventListener('load', () => {
    window.setTimeout(() => document.querySelector('.preloader')?.classList.add('done'), 450);
  });
  updateScrollState();
})();
