'use strict';

// O menu só é recolhido depois que o JavaScript está disponível.
document.documentElement.classList.add('js');

// Animações progressivas: o conteúdo nunca depende de uma classe de opacidade para aparecer.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const runningAnimations = new Set();
function animateElement(element, keyframes, options = {}) {
  if (!element || reducedMotion.matches || typeof element.animate !== 'function') return;
  const animation = element.animate(keyframes, {
    duration: 600,
    easing: 'cubic-bezier(.22, 1, .36, 1)',
    ...options,
  });
  runningAnimations.add(animation);
  const release = () => runningAnimations.delete(animation);
  animation.addEventListener('finish', release, { once: true });
  animation.addEventListener('cancel', release, { once: true });
  return animation;
}
function syncMotionPreference() {
  document.documentElement.classList.toggle('motion-enabled', !reducedMotion.matches);
  if (reducedMotion.matches) runningAnimations.forEach(animation => animation.cancel());
}
syncMotionPreference();
reducedMotion.addEventListener('change', syncMotionPreference);

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open', opening);
    if (opening) animateElement(navigation, [
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 300 });
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
      closeMenu();
      if (wasOpen) menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}

// Os filtros apenas selecionam referências ilustrativas, nunca projetos atribuídos à empresa.
const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
const grid = document.querySelector('.portfolio-grid');
const status = document.querySelector('#filter-status');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    cards.forEach(card => {
      card.getAnimations().forEach(animation => animation.cancel());
      card.hidden = selected !== 'todos' && card.dataset.category !== selected;
      if (!card.hidden) {
        animateElement(card, [
          { opacity: 0, transform: 'translateY(14px) scale(.985)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ], { duration: 450, delay: count * 65 });
        count += 1;
      }
    });
    grid?.classList.toggle('is-filtered', selected !== 'todos');
    if (status) status.textContent = `${count} ${count === 1 ? 'inspiração exibida' : 'inspirações exibidas'}. Fotografias ilustrativas.`;
  });
});

// <dialog> oferece navegação por teclado e devolve o foco ao botão de origem.
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
let lastImageButton = null;
if (lightbox && typeof lightbox.showModal === 'function') {
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      lastImageButton = button;
      lightboxImage.src = button.dataset.image;
      lightboxImage.alt = button.querySelector('img').alt;
      lightboxTitle.textContent = button.dataset.title;
      lightbox.showModal();
      document.body.classList.add('modal-open');
      animateElement(lightbox, [
        { opacity: 0, transform: 'translateY(18px) scale(.97)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: 380 });
    });
  });
  document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    const bounds = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    lastImageButton?.focus({ preventScroll: true });
  });
}

// O atalho flutuante aparece durante a leitura, sem disputar espaço com os CTAs principais.
const floatingContact = document.querySelector('.floating-whatsapp');
if (floatingContact && 'IntersectionObserver' in window) {
  const visibleContactAreas = new Set();
  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleContactAreas.add(entry.target);
      else visibleContactAreas.delete(entry.target);
    });
    const resting = visibleContactAreas.size > 0;
    floatingContact.classList.toggle('is-resting', resting);
    floatingContact.setAttribute('tabindex', resting ? '-1' : '0');
    if (resting) floatingContact.setAttribute('aria-hidden', 'true');
    else floatingContact.removeAttribute('aria-hidden');
  }, { threshold: 0 });
  document.querySelectorAll('.hero-cta, #contato').forEach(area => contactObserver.observe(area));
}

// Entradas em cascata, executadas uma única vez por bloco durante a leitura.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      if (!element.contains(document.activeElement)) {
        animateElement(element, [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { delay: Number(element.dataset.motionDelay || 0) });
      }
      revealObserver.unobserve(element);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.section-top, .intro-main, .project-card, .service-list article, .benefit, .process-grid li, .faq-layout > div, .contact-top, .contact-grid > div').forEach((element, index) => {
    element.dataset.motionDelay = String((index % 3) * 55);
    revealObserver.observe(element);
  });
}

document.querySelectorAll('.hero-copy > *').forEach((element, index) => {
  animateElement(element, [
    { opacity: 0, transform: 'translateY(18px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 720, delay: index * 75 });
});
animateElement(document.querySelector('.hero-image'), [
  { transform: 'scale(1.055)' }, { transform: 'scale(1)' },
], { duration: 1300 });

// Um único listener passivo, atualizado por frame, para o progresso e o cabeçalho.
const readingProgress = document.querySelector('.reading-progress');
const siteHeader = document.querySelector('.site-header');
let scrollFrame = 0;
function updateReadingProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
  if (readingProgress) readingProgress.style.transform = `scaleX(${progress})`;
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 32);
  scrollFrame = 0;
}
function scheduleProgressUpdate() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateReadingProgress);
}
window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
window.addEventListener('resize', scheduleProgressUpdate);
updateReadingProgress();

// A navegação indica a seção atual, sem alterar o histórico ou interromper o scroll.
if ('IntersectionObserver' in window && navigation) {
  const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    const sectionId = visible[visible.length - 1].target.id;
    sectionLinks.forEach(link => {
      const current = link.hash === `#${sectionId}`;
      link.classList.toggle('nav-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-18% 0px -55% 0px', threshold: 0 });
  sectionLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
}

document.querySelectorAll('.faq-list details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open) animateElement(detail.querySelector('p'), [
      { opacity: 0, transform: 'translateY(-6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 300 });
  });
});

// Ondas fora da tela ficam pausadas para economizar bateria no celular.
if ('IntersectionObserver' in window) {
  const waveObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('wave-active', entry.isIntersecting));
  });
  document.querySelectorAll('.section-wave').forEach(wave => waveObserver.observe(wave));
}
