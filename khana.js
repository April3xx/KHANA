/* KHANA — shared behaviour: mobile nav + scroll reveal */
(function () {
  // Mobile nav toggle
  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal — fail-open. Adds .in to in-view elements; a startup probe
  // detects a frozen animation clock and force-reveals everything so content
  // is never stuck invisible.
  function initReveal() {
    var html = document.documentElement;
    var ticking = false;
    function revealInView() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var els = document.querySelectorAll('.reveal:not(.in)');
      for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -40) els[i].classList.add('in');
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(revealInView); }
    }
    function revealAll() {
      html.classList.remove('pre');
      var els = document.querySelectorAll('.reveal');
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', revealInView);
    revealInView();

    // Probe: is the CSS animation clock running? If not, drop the effect.
    if (html.classList.contains('pre')) {
      var p = document.createElement('div');
      p.style.cssText = 'position:fixed;left:-50px;top:-50px;width:6px;height:6px;opacity:0;pointer-events:none;animation:__probe 0.25s linear forwards';
      document.body.appendChild(p);
      setTimeout(function () {
        var running = parseFloat(getComputedStyle(p).opacity) > 0.3;
        p.remove();
        if (!running) revealAll();
      }, 300);
    }
  }

  // Language toggle — switches the whole page between Thai and English.
  function initLang() {
    var html = document.documentElement;
    var btns = document.querySelectorAll('[data-setlang]');
    function apply(l) {
      html.classList.remove('lang-th', 'lang-en');
      html.classList.add('lang-' + l);
      html.lang = l;
      try { localStorage.setItem('khana-lang', l); } catch (e) {}
      btns.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === l ? 'true' : 'false');
      });
    }
    apply(html.classList.contains('lang-en') ? 'en' : 'th');
    btns.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-setlang')); });
    });
  }

  // "Coming soon" toast for social icons that don't have a real link yet.
  function initComingSoon() {
    var links = document.querySelectorAll('.foot__social a[data-soon]');
    if (!links.length) return;
    var toast;
    var hideTimer;
    function show() {
      var en = document.documentElement.classList.contains('lang-en');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'khana-toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
      }
      toast.textContent = en ? 'Coming soon' : 'เปิดให้บริการเร็ว ๆ นี้';
      // force reflow so re-trigger animates
      void toast.offsetWidth;
      toast.classList.add('show');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { toast.classList.remove('show'); }, 1900);
    }
    links.forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(); });
    });
  }

  // Header elevation — detaches the sticky nav from the body on scroll.
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var ticking = false;
    function update() {
      ticking = false;
      nav.classList.toggle('nav--scrolled', window.scrollY > 6);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initLang(); initNav(); initNavScroll(); initReveal(); initComingSoon(); });
  } else { initLang(); initNav(); initNavScroll(); initReveal(); initComingSoon(); }
})();
