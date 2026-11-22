(() => {
  const root = document.documentElement;
  root.classList.add('js');

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

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
    if (e.target.tagName === 'A') setMenu(false);
  });
  addEventListener('resize', () => {
    if (innerWidth > 860) setMenu(false);
  });

  // ---------- Nav: glass intensifies on scroll ----------
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

  // ---------- Cursor / touch spotlight on work cards ----------
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // ---------- Lightbox ----------
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('.lb-cap');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCap.textContent = caption;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      openLightbox(a.href, a.dataset.caption || '');
    });
  });

  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.closest('.lb-close')) closeLightbox();
  });

  // ---------- Keyboard ----------
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
  document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const name = f.get('name');
    const email = f.get('email');
    const msg = f.get('msg');

    const subject = `Project enquiry from ${name}`;
    const body = `${msg}\n\nFrom: ${name} (${email})`;

    location.href =
      'mailto:husnainrubina14@gmail.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();