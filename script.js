const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', false);
}));

document.getElementById('year').textContent = new Date().getFullYear();

const copyBtn = document.getElementById('copy');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = 'Email copied';
  } catch {
    copyBtn.textContent = 'Copy failed. Select the email above.';
  }
  setTimeout(() => (copyBtn.textContent = 'Copy email'), 2200);
});