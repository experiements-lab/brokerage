/* ── NAVBAR SCROLL ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER MENU ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── MARKET TICKER ───────────────────────────────────────────── */
const tickers = [
  { sym: 'JSE:SBK',  price: 'R 218.45', chg: '+1.23%',  dir: 'up'   },
  { sym: 'JSE:NPN',  price: 'R 3 102.00', chg: '-0.87%', dir: 'down' },
  { sym: 'JSE:MTN',  price: 'R 91.60',  chg: '+0.54%',  dir: 'up'   },
  { sym: 'JSE:FSR',  price: 'R 15.22',  chg: '+2.10%',  dir: 'up'   },
  { sym: 'USD/ZAR',  price: '18.4320',  chg: '-0.32%',  dir: 'down' },
  { sym: 'GOLD',     price: '$ 2 318',  chg: '+0.67%',  dir: 'up'   },
  { sym: 'BRENT',    price: '$ 84.10',  chg: '-0.21%',  dir: 'down' },
  { sym: 'JSE:AGL',  price: 'R 618.00', chg: '+1.85%',  dir: 'up'   },
  { sym: 'JSE:BHP',  price: 'R 512.30', chg: '-0.44%',  dir: 'down' },
  { sym: 'EUR/USD',  price: '1.0842',   chg: '+0.12%',  dir: 'up'   },
  { sym: 'S&P 500',  price: '5 238',    chg: '+0.38%',  dir: 'up'   },
  { sym: 'JSE:VOD',  price: 'R 127.50', chg: '+0.92%',  dir: 'up'   },
];

function buildTicker() {
  const track = document.getElementById('tickerTrack');
  const items = [...tickers, ...tickers]; // duplicate for seamless scroll
  track.innerHTML = items.map(t => `
    <div class="ticker-item">
      <span class="ticker-sym">${t.sym}</span>
      <span class="ticker-price">${t.price}</span>
      <span class="ticker-chg ${t.dir}">${t.dir === 'up' ? '▲' : '▼'} ${t.chg}</span>
    </div>
  `).join('');
}

buildTicker();

/* Live price simulation (slight random fluctuation every 5s) */
setInterval(() => {
  document.querySelectorAll('.ticker-chg').forEach(el => {
    const isUp   = Math.random() > 0.45;
    const pct    = (Math.random() * 2.5).toFixed(2);
    el.textContent = `${isUp ? '▲' : '▼'} ${pct}%`;
    el.className    = `ticker-chg ${isUp ? 'up' : 'down'}`;
  });
}, 5000);

/* ── ANIMATED COUNTERS ───────────────────────────────────────── */
const statCards = document.querySelectorAll('.stat-card');
const statNums  = [document.getElementById('stat0'), document.getElementById('stat1'),
                   document.getElementById('stat2'), document.getElementById('stat3')];

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el, target, suffix, duration = 1800) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const decimals  = isDecimal ? String(target).split('.')[1].length : 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = easeOutCubic(progress) * target;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsSection  = document.querySelector('.stats');
let   statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statCards.forEach((card, i) => {
      const target = parseFloat(card.dataset.target);
      const suffix = card.dataset.suffix;
      animateCounter(statNums[i], target, suffix);
    });
  }
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

/* ── FADE-UP SCROLL ANIMATIONS ───────────────────────────────── */
document.querySelectorAll(
  '.service-card, .step, .testi-card, .stat-card, .about-chart, .about-copy, .contact-info, .contact-form, .mini-card'
).forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 60}ms`;
  fadeObserver.observe(el);
});

/* ── CONTACT FORM ────────────────────────────────────────────── */
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('.btn-primary');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    form.innerHTML = `
      <div class="form-success show">
        <div class="success-icon">✓</div>
        <h3>Message Received</h3>
        <p>A senior strategist will contact you within one business day. Thank you.</p>
      </div>
    `;
  }, 1200);
});

/* ── SMOOTH ACTIVE NAV HIGHLIGHT ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = '#c9a84c';
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));
