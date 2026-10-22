'use strict';

// O menu só é recolhido depois que o JavaScript está disponível.
document.documentElement.classList.add('js');
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
      card.hidden = selected !== 'todos' && card.dataset.category !== selected;
      if (!card.hidden) count += 1;
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
