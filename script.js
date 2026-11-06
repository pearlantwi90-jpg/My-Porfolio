(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const header = $('#header'), nav = $('#nav'), burger = $('#burger');
  const toTop = $('#toTop'), progress = $('#progress');
  const links = $$('.nav a'), sections = $$('main section[id]');

  /* Mobile menu */
  const closeMenu = () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  links.forEach(a => a.addEventListener('click', closeMenu));

  /* Scroll: header style, progress bar, back-to-top, active link */
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 500);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    let current = sections[0].id;
    sections.forEach(s => { if (y + 140 >= s.offsetTop) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* Typing effect */
  const phrases = ['Building practical digital solutions, one step at a time.', 'Backend Developer in training.', 'Node.js, APIs and MongoDB.', 'Computer Networking student at KTU.'];
  const typed = $('#typed');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    typed.textContent = phrases[0];
  } else {
    let p = 0, i = 0, del = false;
    (function tick() {
      const word = phrases[p];
      typed.textContent = word.slice(0, i);
      if (!del && i < word.length) { i++; setTimeout(tick, 55); }
      else if (!del) { del = true; setTimeout(tick, 1800); }
      else if (i > 0) { i--; setTimeout(tick, 28); }
      else { del = false; p = (p + 1) % phrases.length; setTimeout(tick, 400); }
    })();
  }

  /* Reveal on scroll + animated skill bars */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      const bar = $('.bar i', e.target);
      if (bar) bar.style.width = bar.dataset.w + '%';
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 90 + 'ms';
    io.observe(el);
  });

  /* Feedback slider */
  const slides = $$('.slide'), dotsBox = $('#dots');
  let idx = 0, timer;
  const show = n => {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === idx));
    $$('button', dotsBox).forEach((d, k) => d.classList.toggle('on', k === idx));
  };
  if (slides.length > 1) {
    slides.forEach((_, k) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Show feedback ' + (k + 1));
      b.addEventListener('click', () => { show(k); restart(); });
      dotsBox.appendChild(b);
    });
    const restart = () => { clearInterval(timer); timer = setInterval(() => show(idx + 1), 6000); };
    restart();
    show(0);
  }

  /* Contact form: opens the visitor's email app with the message filled in */
  const form = $('#contactForm'), note = $('#formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name').value.trim(), email = $('#email').value.trim(), msg = $('#message').value.trim();
    const subject = encodeURIComponent('Portfolio message from ' + name);
    const body = encodeURIComponent(msg + '\n\nFrom: ' + name + ' (' + email + ')');
    location.href = 'mailto:pearlantwi90@gmail.com?subject=' + subject + '&body=' + body;
    note.textContent = 'Opening your email app. If nothing opens, write to pearlantwi90@gmail.com.';
    form.reset();
  });
})();
