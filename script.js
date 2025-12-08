
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 600);
    }
    revealOnScroll();
    animateSkillBars();
    animateRings();
  }, 700);
});


(() => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  const stars = [];
  const STAR_COUNT = Math.round((w * h) / 60000); // density tweak

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function Star() {
    this.reset();
  }
  Star.prototype.reset = function () {
    this.x = rand(0, w);
    this.y = rand(0, h);
    this.z = rand(0.2, 1); // depth (parallax)
    this.size = rand(0.3, 1.8) * this.z;
    this.alpha = rand(0.3, 0.95);
    this.vx = rand(-0.04, 0.04) * this.z;
    this.vy = rand(-0.02, 0.02) * this.z;
  };

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
  }

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    initStars();
  }
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // small gradient Milky way band
    const g = ctx.createLinearGradient(0, h * 0.2, w, h * 0.8);
    g.addColorStop(0, 'rgba(2,6,23,0.0)');
    g.addColorStop(0.5, 'rgba(0,12,32,0.05)');
    g.addColorStop(1, 'rgba(2,6,23,0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let s of stars) {
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < -10 || s.x > w + 10 || s.y < -10 || s.y > h + 10) s.reset();

      // glow
      const rg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 6);
      rg.addColorStop(0, `rgba(0,229,255,${s.alpha * 0.9})`);
      rg.addColorStop(0.3, `rgba(0,229,255,${s.alpha * 0.25})`);
      rg.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.beginPath();
      ctx.fillStyle = rg;
      ctx.arc(s.x, s.y, s.size * 6, 0, Math.PI * 2);
      ctx.fill();

      // core
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  initStars();
  draw();
})();

/* --------------------------
   Cursor glow follower
   ---------------------------*/
(() => {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

/* --------------------------
   Reveal on scroll (staggered)
   ---------------------------*/
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    const delay = parseFloat(el.dataset.delay || 0);
    if (rect.top < window.innerHeight - 110) {
      setTimeout(() => el.classList.add('active'), Math.round(delay * 300));
    }
  });
}
window.addEventListener('scroll', revealOnScroll);

/* --------------------------
   Typewriter effect
   ---------------------------*/
(() => {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['Full-Stack Developer', 'Java • Web • ML Enthusiast', 'Responsive UX & Performance', 'Open-source Contributor'];
  let w = 0, forward = true, letter = 0;
  function tick() {
    const word = words[w];
    if (forward) {
      letter++;
      el.textContent = word.slice(0, letter);
      if (letter === word.length) { forward = false; setTimeout(tick, 900); return; }
    } else {
      letter--;
      el.textContent = word.slice(0, letter);
      if (letter === 0) { forward = true; w = (w + 1) % words.length; }
    }
    setTimeout(tick, forward ? 70 : 30);
  }
  tick();
})();

/* --------------------------
   Swiper slider init
   ---------------------------*/
(() => {
  if (typeof Swiper !== 'undefined') {
    new Swiper('.mySwiper', {
      loop: true,
      slidesPerView: 1.05,
      spaceBetween: 18,
      centeredSlides: true,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: { 760: { slidesPerView: 2.1 }, 1100: { slidesPerView: 2.6 } }
    });
  }
})();

/* --------------------------
   VanillaTilt init
   ---------------------------*/
(() => {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), { max: 12, speed: 350, glare: true, 'max-glare': 0.18 });
  }
})();

/* --------------------------
   Skill bars & rings animation
   ---------------------------*/
function animateSkillBars() {
  document.querySelectorAll('.bar-fill').forEach(el => {
    const pct = el.dataset.percent || 80;
    setTimeout(() => el.style.width = pct + '%', 150);
  });
}

function animateRings() {
  document.querySelectorAll('svg.ring').forEach(svg => {
    const pct = parseFloat(svg.dataset.percent || 70);
    // overlay circle for animated stroke
    const ns = 'http://www.w3.org/2000/svg';
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', '18');
    circle.setAttribute('cy', '18');
    circle.setAttribute('r', '15.9155');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00e5ff');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('stroke-linecap', 'round');
    circle.style.strokeDasharray = '100';
    circle.style.strokeDashoffset = '100';
    circle.style.transition = 'stroke-dashoffset 1s ease-out';
    svg.appendChild(circle);
    setTimeout(() => circle.style.strokeDashoffset = String(100 - pct), 400);
  });
}

/* --------------------------
   Scroll-to-top button
   ---------------------------*/
(() => {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.style.display = (window.scrollY > 420) ? 'flex' : 'none';
  });
})();

/* --------------------------
   EmailJS contact form
   ---------------------------*/
(() => {

  try { emailjs.init('-UrEAF2pDzYwAmXoP'); } catch (e) { /* ignore if lib missing */ }

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    const data = {
      from_name: document.getElementById('name').value,
      reply_to: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    const SERVICE_ID = 'service_mnrv5wp';
    const TEMPLATE_ID = 'template_lzs8zb7';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, data)
      .then(() => {
        status.textContent = 'Message sent — thank you!';
        form.reset();
      }, (err) => {
        console.error(err);
        status.textContent = 'Failed to send. Please try again or email directly.';
      });
  });
})();

/* --------------------------
   Initialize reveal & animations on DOM ready
   ---------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  revealOnScroll();
  animateSkillBars();
  animateRings();

});
