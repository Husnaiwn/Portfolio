(() => {
  const ROBOT = 'images/nain%20ai.png';   // change this if your robot image has another name
  const API = '/api/chat';
  const MAX_LEN = 800;
  const MAX_HISTORY = 6;
  const EMAIL = 'husnainrubina14@gmail.com';
  const CHIPS = [
    { l: 'Services', q: 'What services does Husnain offer?' },
    { l: 'Skills', q: 'What are Husnain\'s main skills?' },
    { l: 'Availability', q: 'Is Husnain available for freelance work?' },
    { l: 'Contact', q: 'How can I contact Husnain?' }
  ];
  const WELCOME = 'Hey 👋 I\'m NAIN AI, Husnain\'s assistant. Ask me about his work, skills, education or availability, or tap a question below.';

  // Remove the old widget if it is still in index.html
  const old = document.getElementById('nainAi');
  if (old) old.remove();
  if (document.getElementById('nx')) return;

  // Load the widget's own stylesheet, then build the widget
  let built = false;
  const start = () => { if (!built) { built = true; build(); } };
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'nain-ai.css';
  css.addEventListener('load', start);
  css.addEventListener('error', () => { console.error('nain-ai.css not found'); start(); });
  document.head.appendChild(css);
  setTimeout(start, 1500);

  function build() {
    const root = document.createElement('div');
    root.className = 'nx';
    root.id = 'nx';
    root.innerHTML = `
      <div class="nx-hello" id="nxHello" hidden>
        <button class="nx-hello-txt" id="nxHelloTxt" type="button">Hi 👋 Ask me anything about Husnain</button>
        <button class="nx-hello-x" id="nxHelloX" type="button" aria-label="Dismiss">×</button>
      </div>

      <section class="nx-panel" id="nxPanel" role="dialog" aria-label="Chat with NAIN AI" aria-hidden="true">
        <header class="nx-head">
          <img class="nx-av" src="${ROBOT}" alt="" width="36" height="36">
          <div class="nx-ttl">
            <strong>NAIN AI</strong>
            <span><i class="nx-dot"></i>Online · replies in seconds</span>
          </div>
          <button class="nx-ic" id="nxReset" type="button" aria-label="Start a new chat" title="New chat">↻</button>
          <button class="nx-ic" id="nxClose" type="button" aria-label="Close chat" title="Close">×</button>
        </header>
        <div class="nx-body" id="nxLog" role="log" aria-live="polite"></div>
        <div class="nx-chips" id="nxChips"></div>
        <form class="nx-form" id="nxForm" autocomplete="off">
          <input class="nx-input" id="nxInput" type="text" maxlength="${MAX_LEN}" placeholder="Type your question..." aria-label="Your question" enterkeyhint="send">
          <button class="nx-send" id="nxSend" type="submit" aria-label="Send message" disabled>↑</button>
        </form>
        <div class="nx-foot">AI can make mistakes. For anything important, email Husnain.</div>
      </section>

      <button class="nx-fab" id="nxFab" type="button" aria-label="Chat with NAIN AI" aria-expanded="false" aria-controls="nxPanel">
        <span class="nx-glow"></span>
        <img src="${ROBOT}" alt="" width="78" height="78">
        <span class="nx-tag">ASK AI</span>
      </button>`;
    document.body.appendChild(root);

    const $ = id => document.getElementById(id);
    const fab = $('nxFab'), panel = $('nxPanel'), log = $('nxLog'), chips = $('nxChips');
    const form = $('nxForm'), input = $('nxInput'), send = $('nxSend');
    const hello = $('nxHello');

    let history = [];
    let busy = false;

    // ---------- helpers ----------
    function fill(el, text) {
      text = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^\s*[*-]\s+/gm, '• ');
      text.split(/(husnainrubina14@gmail\.com)/gi).forEach(part => {
        if (part.toLowerCase() === EMAIL) {
          const a = document.createElement('a');
          a.href = 'mailto:' + EMAIL;
          a.textContent = EMAIL;
          el.appendChild(a);
        } else {
          el.appendChild(document.createTextNode(part));
        }
      });
    }

    function addMsg(role, text, extra) {
      const el = document.createElement('div');
      el.className = 'nx-msg ' + role + (extra ? ' ' + extra : '');
      fill(el, text);           // text nodes only, never innerHTML
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }

    function addTyping() {
      const el = document.createElement('div');
      el.className = 'nx-msg bot nx-typing';
      el.setAttribute('aria-label', 'NAIN AI is typing');
      el.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }

    function syncSend() {
      send.disabled = busy || !input.value.trim();
    }

    function resetChat() {
      history = [];
      log.textContent = '';
      addMsg('bot', WELCOME);
      chips.hidden = false;
    }

    // ---------- suggestion buttons ----------
    CHIPS.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = c.l;
      b.addEventListener('click', () => ask(c.q));
      chips.appendChild(b);
    });

    // ---------- open / close ----------
    function setOpen(open) {
      root.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', String(!open));
      fab.setAttribute('aria-expanded', String(open));
      fab.setAttribute('aria-label', open ? 'Close chat' : 'Chat with NAIN AI');
      if (open) {
        hideHello();
        if (!matchMedia('(pointer:coarse)').matches) setTimeout(() => input.focus(), 250);
      } else if (panel.contains(document.activeElement)) {
        fab.focus();
      }
    }

    function hideHello() {
      hello.classList.remove('show');
      setTimeout(() => { hello.hidden = true; }, 300);
      try { sessionStorage.setItem('nx-hello', '1'); } catch (e) { /* storage blocked */ }
    }

    fab.addEventListener('click', () => setOpen(!root.classList.contains('open')));
    $('nxClose').addEventListener('click', () => setOpen(false));
    $('nxReset').addEventListener('click', resetChat);
    $('nxHelloTxt').addEventListener('click', () => setOpen(true));
    $('nxHelloX').addEventListener('click', hideHello);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && root.classList.contains('open')) setOpen(false);
    });

    // friendly greeting bubble, shown once per visit
    let seen = false;
    try { seen = sessionStorage.getItem('nx-hello') === '1'; } catch (e) { /* ignore */ }
    if (!seen) {
      setTimeout(() => {
        if (root.classList.contains('open')) return;
        hello.hidden = false;
        requestAnimationFrame(() => hello.classList.add('show'));
        setTimeout(() => { if (hello.classList.contains('show')) hideHello(); }, 12000);
      }, 4000);
    }

    // ---------- sending ----------
    async function ask(question) {
      question = (question || '').trim().slice(0, MAX_LEN);
      if (!question || busy) return;

      busy = true;
      chips.hidden = true;
      input.value = '';
      syncSend();

      addMsg('user', question);
      history.push({ role: 'user', text: question });
      const typing = addTyping();

      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);

      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) }),
          signal: ctrl.signal
        });

        let data = {};
        try { data = await res.json(); } catch (e) { /* not JSON */ }
        if (!res.ok || !data.answer) throw new Error(data.error || 'Request failed.');

        typing.remove();
        addMsg('bot', data.answer);
        history.push({ role: 'model', text: data.answer });
      } catch (err) {
        typing.remove();
        history.pop();
        const msg = err.name === 'AbortError'
          ? 'That took too long. Please try again.'
          : (err.message && err.message !== 'Request failed.' && err.message !== 'Failed to fetch'
              ? err.message
              : 'NAIN AI is unavailable right now. You can email ' + EMAIL + ' instead.');
        addMsg('bot', msg, 'error');
      } finally {
        clearTimeout(timer);
        busy = false;
        syncSend();
        if (!matchMedia('(pointer:coarse)').matches) input.focus();
      }
    }

    input.addEventListener('input', syncSend);
    form.addEventListener('submit', e => {
      e.preventDefault();
      ask(input.value);
    });

    resetChat();
  }
})();