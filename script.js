// Mobile Menu
function toggleMobileMenu() {
  document.querySelector('.mobile-menu-btn').classList.toggle('active');
  document.querySelector('.mobile-drawer').classList.toggle('open');
  document.querySelector('.mobile-drawer-overlay').classList.toggle('open');
  document.body.style.overflow = document.querySelector('.mobile-drawer').classList.contains('open') ? 'hidden' : '';
}

// Copy to Clipboard
function copyEmail() {
  navigator.clipboard.writeText('yankhochisale@gmail.com').then(() => {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> COPIED';
    btn.style.background = 'var(--green)';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
}

// GitHub Activity Heatmap
async function loadGitHubActivity() {
  try {
    const res = await fetch('https://api.github.com/users/YasperMW/events');
    if (!res.ok) return;
    const events = await res.json();
    const pushEvents = events.filter(e => e.type === 'PushEvent').slice(0, 14);
    if (pushEvents.length === 0) return;
    const heatmap = document.getElementById('githubHeatmap');
    if (!heatmap) return;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeks = [];
    for (let i = 13; i >= 0; i--) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const idx = (13 - i) * 7 + d;
        const event = pushEvents[idx];
        week.push(event ? event.payload.commits.length : 0);
      }
      weeks.push(week);
    }
    heatmap.innerHTML = weeks.map((week, wIdx) => `<div class="heatmap-week">${week.map((count, dIdx) => `<div class="heatmap-day ${count > 0 ? 'active' : ''}" data-count="${count}" title="${days[dIdx]}: ${count} commits" style="animation-delay:${(wIdx * 7 + dIdx) * 20}ms"></div>`).join('')}</div>`).join('');
  } catch (e) {
    console.log('GitHub activity unavailable');
  }
}

function formatRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

async function loadLatestCommit() {
  try {
    const res = await fetch('https://api.github.com/users/YasperMW/events');
    if (!res.ok) return;
    const events = await res.json();
    const pushEvent = events.find(e => e.type === 'PushEvent');
    if (!pushEvent) return;
    const repo = pushEvent.repo.name;
    const count = pushEvent.payload.commits.length;
    const time = formatRelativeTime(pushEvent.created_at);
    const ticker = document.getElementById('githubTicker');
    if (ticker) {
      ticker.innerHTML = ` <span class="ticker-dot"></span> <span class="ticker-repo">${repo}</span> · <span class="ticker-commits">${count} commit${count > 1 ? 's' : ''}</span> · <span class="ticker-time">${time}</span>`;
    }
  } catch (e) {
    console.log('GitHub ticker unavailable');
  }
}

// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// Scroll Progress
const spFill = document.getElementById('scroll-progress');
const spDot = document.getElementById('scroll-cursor-dot');
function updateScroll() {
  const st = window.scrollY;
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (st / max) * 100 : 0;
  spFill.style.setProperty('--prog', pct + '%');
  spFill.querySelector('div') || null;
  const fill = spFill.querySelector('div');
  if (fill) fill.style.height = pct + '%';
  spDot.style.top = (pct / 100 * (window.innerHeight)) + 'px';
  document.getElementById('backTop').classList.toggle('visible', st > 400);
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (st >= s.offsetTop - 100) cur = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--green)' : '';
  });
}
document.getElementById('scroll-progress').innerHTML = '<div id="sp-inner" style="position:absolute;top:0;left:0;right:0;height:0%;background:var(--green);box-shadow:0 0 8px var(--green),0 0 16px rgba(0,255,136,0.4);transition:height 0.05s linear;"></div>';
function updateScrollProgress() {
  const st = window.scrollY, max = document.body.scrollHeight - window.innerHeight, pct = max > 0 ? (st / max) * 100 : 0;
  document.getElementById('sp-inner').style.height = pct + '%';
  spDot.style.top = (pct / 100 * window.innerHeight) + 'px';
}
window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateScroll();
});

// Particles
const pCont = document.getElementById('particles');
for (let i = 0; i < 35; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const left = Math.random() * 100, delay = Math.random() * 8, dur = 6 + Math.random() * 10, drift = (Math.random() - 0.5) * 60 + 'px';
  p.style.cssText = `left:${left}%;bottom:-4px;animation-duration:${dur}s;animation-delay:${delay}s;--drift:${drift};`;
  pCont.appendChild(p);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Services Command Palette
function selectService(idx, el) {
  document.querySelectorAll('.svc-menu-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.svc-detail-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('svc-' + idx).classList.add('active');
}

// Reveal Animation
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, {
  threshold: 0.1
});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Skill Bars + Signal Bars
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      e.target.querySelectorAll('.skill-signal').forEach(sig => {
        const n = parseInt(sig.dataset.bars) || 3;
        sig.querySelectorAll('.signal-bar').forEach((b, i) => {
          setTimeout(() => b.classList.add('lit'), i * 80);
        });
        sig.querySelectorAll('.signal-bar').forEach((b, i) => {
          if (i >= n) setTimeout(() => {
            b.classList.remove('lit');
            b.style.opacity = '0.2';
          }, i * 80 + 200);
        });
      });
    }
  });
}, {
  threshold: 0.3
});
document.querySelectorAll('.skill-group').forEach(el => barObs.observe(el));

// Radar Chart
(function drawRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 160, cy = 160, r = 110;
  const cats = ['Frontend', 'Backend', 'Security', 'Network', 'ML', 'DevOps'];
  const vals = [0.93, 0.86, 0.83, 0.80, 0.72, 0.78];
  const n = cats.length;
  const green = '#00ff88', dim = '#1a3020', text = '#5a8a6a', cyan = '#00e5ff';

  function getPoint(i, pct, radius) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * pct,
      y: cy + Math.sin(angle) * radius * pct
    };
  }

  let prog = 0;

  function draw(p) {
    ctx.clearRect(0, 0, 320, 320);
    [0.25, 0.5, 0.75, 1].forEach(ring => {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const pt = getPoint(i, ring, r);
        i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.strokeStyle = dim;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    for (let i = 0; i < n; i++) {
      const pt = getPoint(i, 1, r);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = dim;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const pt = getPoint(i, vals[i] * p, r);
      i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,255,136,0.08)';
    ctx.fill();
    ctx.strokeStyle = green;
    ctx.lineWidth = 2;
    ctx.shadowColor = green;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (let i = 0; i < n; i++) {
      const pt = getPoint(i, vals[i] * p, r);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = cyan;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (let i = 0; i < n; i++) {
      const pt = getPoint(i, 1.2, r);
      ctx.font = '700 11px JetBrains Mono, monospace';
      ctx.fillStyle = text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cats[i].toUpperCase(), pt.x, pt.y);
    }
  }
  const radarObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        let start = null;
        function anim(ts) {
          if (!start) start = ts;
          prog = Math.min((ts - start) / 900, 1);
          draw(prog);
          if (prog < 1) requestAnimationFrame(anim);
        }
        requestAnimationFrame(anim);
        radarObs.disconnect();
      }
    });
  }, {
    threshold: 0.3
  });
  radarObs.observe(canvas);
  draw(0);
})();

// 3D Tilt on Project Cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// 3D Tilt on About Img
const imgCard = document.getElementById('imgCard');
if (imgCard) {
  imgCard.addEventListener('mousemove', e => {
    const r = imgCard.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    imgCard.style.transform = `rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
  });
  imgCard.addEventListener('mouseleave', () => {
    imgCard.style.transform = '';
  });
}

// Typewriter Role
const roles = ['// Full Stack Developer & Cybersecurity Specialist', '// Building Secure Digital Solutions', '// Network Engineer & ML Enthusiast', '// Malawi\'s Digital Problem Solver'];
let ri = 0, ci = 0, typing = true;
const roleEl = document.getElementById('heroRole');

function typeLoop() {
  if (typing) {
    if (ci < roles[ri].length) {
      roleEl.textContent = roles[ri].substring(0, ++ci);
      setTimeout(typeLoop, 30);
    } else {
      typing = false;
      setTimeout(typeLoop, 2200);
    }
  } else {
    if (ci > 0) {
      roleEl.textContent = roles[ri].substring(0, --ci);
      setTimeout(typeLoop, 14);
    } else {
      ri = (ri + 1) % roles.length;
      typing = true;
      setTimeout(typeLoop, 300);
    }
  }
}
setTimeout(typeLoop, 1200);

// GitHub Activity
loadGitHubActivity();
loadLatestCommit();

// About: uptime counter + commit hash
const startDate = new Date('2022-01-01');
const days = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
const uptimeEl = document.getElementById('uptimeVal');
if (uptimeEl) uptimeEl.textContent = days;
const commitEl = document.getElementById('lastCommit');
if (commitEl) commitEl.textContent = '"' + Math.abs(Math.floor(Math.sin(days) * 0xffffff)).toString(16).padStart(7, '0') + '"';

// Social btn hover fix for telegram
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const i = btn.querySelector('i');
    if (i) i.style.color = '#000';
  });
  btn.addEventListener('mouseleave', () => {
    const i = btn.querySelector('i');
    if (i) i.style.color = 'var(--text-dim)';
  });
});

// Konami Code Easter Egg
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let kIdx = 0;
document.addEventListener('keydown', e => {
  if (e.keyCode === KONAMI[kIdx]) {
    kIdx++;
    if (kIdx === KONAMI.length) {
      triggerKonami();
      kIdx = 0;
    }
  } else {
    kIdx = e.keyCode === KONAMI[0] ? 1 : 0;
  }
});

function triggerKonami() {
  const overlay = document.getElementById('konami-overlay');
  const output = document.getElementById('konami-output');
  overlay.classList.add('active');
  output.innerHTML = '';
  const ua = navigator.userAgent;
  const os = ua.includes('Win') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Linux') ? 'Linux' : 'Unknown OS';
  const br = ua.includes('Chrome') ? 'Chromium' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Unknown Browser';
  const lines = [
    {
      cls: 'k-red',
      txt: '⚠  BREACH DETECTED // UNAUTHORIZED ACCESS ATTEMPT',
      delay: 0
    },
    {
      cls: 'k-green',
      txt: '',
      delay: 200
    },
    {
      cls: 'k-green',
      txt: '> INITIALIZING MAINFRAME CONNECTION...',
      delay: 400
    },
    {
      cls: 'k-amber',
      txt: '  ████████████████████ 100%',
      delay: 900
    },
    {
      cls: 'k-green',
      txt: '',
      delay: 1100
    },
    {
      cls: 'k-green',
      txt: '> SCANNING OPERATOR FINGERPRINT...',
      delay: 1300
    },
    {
      cls: 'k-cyan',
      txt: '  BROWSER  : ' + br,
      delay: 1800
    },
    {
      cls: 'k-cyan',
      txt: '  OS       : ' + os,
      delay: 2100
    },
    {
      cls: 'k-cyan',
      txt: '  LOCATION : CLASSIFIED',
      delay: 2400
    },
    {
      cls: 'k-green',
      txt: '',
      delay: 2700
    },
    {
      cls: 'k-green',
      txt: '> CROSS-REFERENCING IDENTITY DATABASE...',
      delay: 2900
    },
    {
      cls: 'k-amber',
      txt: '  [■■■■■■■■■■■■■■■■■] MATCH FOUND',
      delay: 3600
    },
    {
      cls: 'k-green',
      txt: '',
      delay: 4000
    },
    {
      cls: 'k-white',
      txt: '  ACCESS GRANTED.',
      delay: 4200
    },
    {
      cls: 'k-white',
      txt: '  WELCOME, OPERATOR.',
      delay: 4600
    },
    {
      cls: 'k-green',
      txt: '',
      delay: 5000
    },
    {
      cls: 'k-green',
      txt: '> You found the easter egg. Tell Yankho in your interview 😄',
      delay: 5300
    },
    {
      cls: 'k-green',
      txt: '> "Curiosity is the mark of a good hacker." — Anonymous',
      delay: 5800
    },
  ];
  lines.forEach(({
    cls,
    txt,
    delay
  }) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'konami-line show ' + cls;
      div.textContent = txt || ' ';
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    }, delay);
  });
}

function closeKonami() {
  const overlay = document.getElementById('konami-overlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.5s';
  setTimeout(() => {
    overlay.classList.remove('active');
    overlay.style.opacity = '1';
    overlay.style.transition = '';
  }, 500);
}
document.getElementById('konami-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeKonami();
});