(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => [...el.querySelectorAll(s)];

  // Mobile menu
  const burger = qs('[data-burger]');
  const mobileMenu = qs('[data-mobile-menu]');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    qsa('a', mobileMenu).forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach(el => observer.observe(el));

  // Lightbox for gallery
  const lightbox = qs('[data-lightbox]');
  const lbImg = qs('[data-lightbox-img]');
  const lbTitle = qs('[data-lightbox-title]');
  const lbDesc = qs('[data-lightbox-desc]');
  const lbClose = qs('[data-lightbox-close]');

  const openLightbox = (src, title, desc) => {
    lbImg.src = src;
    lbImg.alt = title || 'Photo';
    lbTitle.textContent = title || '';
    lbDesc.textContent = desc || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  qsa('[data-gallery-item]').forEach(card => {
    card.addEventListener('click', () => {
      const img = qs('img', card);
      openLightbox(img.dataset.full || img.src, card.dataset.title, card.dataset.desc);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
  });

  // Video sound toggle (keeps autoplay muted by default)
  const video = qs('[data-hero-video]');
  const soundBtn = qs('[data-sound-toggle]');
  if (video && soundBtn) {
    const setLabel = () => soundBtn.textContent = video.muted ? 'Sound off' : 'Sound on';
    setLabel();
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.paused) {
        // keep playing
      } else {
        video.play().catch(()=>{});
      }
      setLabel();
    });
  }
})();
