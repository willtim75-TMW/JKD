document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroSlideshow();
  initAccordion();
  initGallery();
});

function initHeader() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      resetAutoplay();
    });
  });

  goTo(0);
  startAutoplay();
}

function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      item.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid || typeof GALLERY_IMAGES === 'undefined') return;

  const filters = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  let activeFilter = 'railings';
  let visibleImages = [];
  let lightboxIndex = 0;

  function renderGallery(filter) {
    activeFilter = filter;
    grid.innerHTML = '';

    const filtered = filter === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter(img => img.category === filter);

    visibleImages = filtered;

    filtered.forEach((img, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `View ${img.title}`);
      item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy" decoding="async" width="400" height="300">`;
      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
      grid.appendChild(item);
    });
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const img = visibleImages[lightboxIndex];
    if (!img || !lightbox) return;
    lightbox.querySelector('img').src = img.src;
    lightbox.querySelector('img').alt = img.alt;
    const caption = lightbox.querySelector('.lightbox-caption');
    if (caption) caption.textContent = img.title;
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });

  if (lightbox) {
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + visibleImages.length) % visibleImages.length;
      updateLightbox();
    });
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % visibleImages.length;
      updateLightbox();
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        lightboxIndex = (lightboxIndex - 1 + visibleImages.length) % visibleImages.length;
        updateLightbox();
      }
      if (e.key === 'ArrowRight') {
        lightboxIndex = (lightboxIndex + 1) % visibleImages.length;
        updateLightbox();
      }
    });
  }

  renderGallery('railings');
}