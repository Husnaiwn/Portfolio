const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const overlay = $('.overlay'), header = $('.top'), menu = $('.menu'), nav = $('.nav');
const sheets = $$('.sheet'), ids = sheets.map(s => s.id);

// Open the panel that matches the URL (#about, #work, ...), or close everything
function sync() {
  overlay.style.top = header.offsetHeight + 'px';
  const id = location.hash.slice(1);
  const open = ids.includes(id);
  sheets.forEach(s => s.classList.toggle('show', s.id === id));
  overlay.classList.toggle('open', open);
  document.body.classList.toggle('locked', open);
  $$('.nav a').forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + id));
  if (open) overlay.scrollTop = 0;
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', false);
}
function closePanel() {
  history.pushState(null, '', location.pathname + location.search);
  sync();
}
addEventListener('hashchange', sync);
addEventListener('resize', sync);
$('.close').addEventListener('click', closePanel);
addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
sync();

menu.addEventListener('click', () => menu.setAttribute('aria-expanded', nav.classList.toggle('open')));
$('#year').textContent = new Date().getFullYear();

const copy = $('#copy');
copy.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(copy.dataset.email); copy.textContent = 'Email copied'; }
  catch { copy.textContent = 'Select the email above'; }
  setTimeout(() => (copy.textContent = 'Copy email'), 2200);
});

// Contact form: opens the visitor's email app with the message filled in
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = encodeURIComponent('Project enquiry from ' + f.get('name'));
  const body = encodeURIComponent(f.get('msg') + '\n\nFrom: ' + f.get('name') + ' (' + f.get('email') + ')');
  location.href = 'mailto:husnainrubina14@gmail.com?subject=' + subject + '&body=' + body;
});