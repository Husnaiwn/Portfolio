(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile menu ----------
  const menu = document.querySelector('.menu');
  const links = document.getElementById('links');

  function setMenu(open) {
    links.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  menu.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', e => {
    if (e.target.closest('a')) setMenu(false);
  });
  addEventListener('resize', () => {
    if (innerWidth > 860) setMenu(false);
  });

  // ---------- Nav glass intensifies on scroll ----------
  const nav = document.querySelector('.nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

  // ---------- Active section highlight ----------
  const navLinks = [...document.querySelectorAll('.links a[href^="#"]')];
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id)
      );
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  // ---------- Scroll reveal with stagger ----------
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => {
    const idx = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = (idx % 4) * 90 + 'ms';
    io.observe(el);
  });

  // ---------- Cursor / touch light on cards ----------
  document.querySelectorAll('.work-card, .exp').forEach(card => {
    let raf = 0;
    card.addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        raf = 0;
      });
    });
  });

  // ---------- Lightbox ----------
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('.lb-cap');
  const lbClose = lb.querySelector('.lb-close');
  let opener = null;

  function openLightbox(src, caption, from) {
    opener = from;
    lbImg.src = src;
    lbImg.alt = caption;
    lbCap.textContent = caption;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lb.classList.contains('open')) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }

  document.querySelectorAll('[data-lightbox]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      openLightbox(a.href, a.dataset.caption || '', a);
    });
  });

  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.closest('.lb-close')) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      setMenu(false);
    }
  });

  // ---------- Copy email ----------
  const copy = document.getElementById('copy');
  const copyLabel = copy.querySelector('span');

  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.email);
      copyLabel.textContent = 'Email copied ✓';
    } catch {
      copyLabel.textContent = 'Select the email above';
    }
    setTimeout(() => (copyLabel.textContent = 'Copy email'), 2200);
  });

  // ---------- Contact form: opens the visitor's email app ----------
  const form = document.getElementById('form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const f = new FormData(form);
    const name = String(f.get('name') || '').slice(0, 80);
    const email = String(f.get('email') || '').slice(0, 120);
    const msg = String(f.get('msg') || '').slice(0, 1500);

    const subject = `Project enquiry from ${name}`;
    const body = `${msg}\n\nFrom: ${name} (${email})`;

    location.href =
      'mailto:husnainrubina14@gmail.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();