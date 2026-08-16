/* ============================================================
   WEDDING ANNIVERSARY — SCRIPT (v2)
   GSAP animations, page navigation, confetti, interactions
   Fixed: animation flash bug (now uses fromTo + prepareHiddenStates)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- REFERENCES ----
  const landingScreen = document.getElementById('landing-screen');
  const folder        = document.getElementById('folder');
  const mainContent   = document.getElementById('main-content');
  const pageNav       = document.getElementById('page-nav');
  const navPrev       = document.getElementById('nav-prev');
  const navNext       = document.getElementById('nav-next');
  const navDots       = document.querySelectorAll('.nav-dot');
  const pages         = document.querySelectorAll('.page-section');
  const btnRestart    = document.getElementById('btn-restart');
  const canvas        = document.getElementById('confetti-canvas');
  const ctx           = canvas.getContext('2d');

  let currentPage = 1;
  const totalPages = pages.length;
  let isAnimating = false;

  // ---- FOLDER CLICK -> OPEN ANIMATION ----
  folder.addEventListener('click', openFolder);
  folder.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFolder();
    }
  });

  function openFolder() {
    if (isAnimating) return;
    isAnimating = true;

    const folderEl = document.querySelector('.folder');
    if (folderEl) folderEl.classList.add('open');

    const tl = gsap.timeline({
      delay: 0.9, // Wait for CSS pop animation
      onComplete: () => {
        landingScreen.style.display = 'none';
        mainContent.style.display = 'block';
        pageNav.classList.add('visible');
        showPage(1, 'none');
        isAnimating = false;
      }
    });

    // 1. Whole folder scales up and fades out
    tl.to('.folder-container', {
      duration: 0.7,
      scale: 1.5,
      opacity: 0,
      ease: 'power3.in'
    });

    // 2. Prompt fades out
    tl.to('.folder-prompt', {
      duration: 0.4,
      opacity: 0,
      y: -30,
      ease: 'power2.in'
    }, '-=0.7');

    // 3. Landing screen fades
    tl.to(landingScreen, {
      duration: 0.6,
      opacity: 0,
      ease: 'power2.inOut'
    }, '-=0.3');
  }

  // ---- PREPARE HIDDEN STATES (prevents flash) ----
  // Sets all animated children to opacity:0 BEFORE page is made visible
  function prepareHiddenStates(pageNum) {
    const page = document.getElementById(`page-${pageNum}`);
    if (!page) return;

    switch (pageNum) {
      case 1: {
        const els = page.querySelectorAll('.congrats-date, .congrats-title, .congrats-subtitle, .congrats-hero-photo, .congrats-text-container');
        gsap.set(els, { opacity: 0, y: 25 });
        gsap.set(page.querySelectorAll('.congrats-text'), { opacity: 0, y: 15 });
        gsap.set(page.querySelectorAll('.divider'), { opacity: 0 });
        break;
      }
      case 2: {
        gsap.set(page.querySelectorAll('.gallery-title, .gallery-subtitle'), { opacity: 0, y: 25 });
        gsap.set(page.querySelectorAll('.polaroid'), { opacity: 0, y: 50, scale: 0.85 });
        break;
      }
      case 3: {
        gsap.set(page.querySelectorAll('.family-title, .family-subtitle'), { opacity: 0, y: 25 });
        gsap.set(page.querySelectorAll('.family-photo'), { opacity: 0, scale: 0.88, y: 35 });
        break;
      }
      case 4: {
        gsap.set(page.querySelectorAll('#finale-heart-icon, .finale-message, .finale-author, .finale-date, .btn-restart'), { opacity: 0, y: 20 });
        gsap.set(page.querySelectorAll('#finale-heart-icon'), { scale: 0 });
        gsap.set(page.querySelectorAll('.divider'), { opacity: 0 });
        break;
      }
    }
  }

  // ---- PAGE NAVIGATION ----
  function showPage(pageNum, direction) {
    if (pageNum < 1 || pageNum > totalPages) return;
    if (isAnimating && direction !== 'none') return;

    currentPage = pageNum;

    // Update dots
    navDots.forEach(dot => {
      dot.classList.toggle('active', parseInt(dot.dataset.target) === currentPage);
    });

    // Update arrows
    navPrev.disabled = currentPage === 1;
    navNext.disabled = currentPage === totalPages;

    // Hide all pages
    pages.forEach(p => {
      p.classList.remove('active');
      gsap.set(p, { opacity: 0, x: 0 });
    });

    const targetPage = document.getElementById(`page-${pageNum}`);

    // CRITICAL: set children to hidden state BEFORE adding .active (display:flex)
    prepareHiddenStates(pageNum);

    targetPage.classList.add('active');

    if (direction === 'none') {
      gsap.set(targetPage, { opacity: 1, x: 0 });
      animatePageContent(pageNum);
      window.scrollTo(0, 0);
      return;
    }

    isAnimating = true;
    const xFrom = direction === 'next' ? 60 : -60;

    gsap.fromTo(targetPage,
      { opacity: 0, x: xFrom },
      {
        duration: 0.65,
        opacity: 1,
        x: 0,
        ease: 'power3.out',
        onComplete: () => {
          isAnimating = false;
          animatePageContent(pageNum);
          window.scrollTo(0, 0);
        }
      }
    );
  }

  // ---- ANIMATE PAGE CONTENT ON ENTER ----
  // Uses gsap.to() since elements are already set to hidden by prepareHiddenStates
  function animatePageContent(pageNum) {
    switch (pageNum) {
      case 1:
        animateCongrats();
        break;
      case 2:
        animateGallery();
        break;
      case 3:
        animateFamily();
        break;
      case 4:
        animateFinale();
        break;
    }
  }

  // --- Page 1: Congratulation ---
  function animateCongrats() {
    const tl = gsap.timeline();

    tl.to('.congrats-date', {
      duration: 0.7,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    });

    tl.to('.congrats-title', {
      duration: 0.8,
      opacity: 1,
      y: 0,
      ease: 'power3.out'
    }, '-=0.35');

    tl.to('.congrats-subtitle', {
      duration: 0.6,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, '-=0.35');

    tl.to('.congrats-hero-photo', {
      duration: 0.9,
      opacity: 1,
      y: 0,
      ease: 'power3.out'
    }, '-=0.25');

    tl.to('#page-1 .divider', {
      duration: 0.5,
      opacity: 1,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.4');

    tl.to('.congrats-text-container', {
      duration: 0.7,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, '-=0.4');

    tl.to('.congrats-text', {
      duration: 0.5,
      opacity: 1,
      y: 0,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.3');

    // Subtle floating petals
    createPetals(5);
  }

  // --- Page 2: Gallery (Polaroids) ---
  function animateGallery() {
    const tl = gsap.timeline();

    tl.to('.gallery-title', {
      duration: 0.7,
      opacity: 1,
      y: 0,
      ease: 'power3.out'
    });

    tl.to('.gallery-subtitle', {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, '-=0.25');

    tl.to('.polaroid', {
      duration: 0.65,
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: {
        amount: 0.7,
        from: 'random'
      },
      ease: 'power3.out'
    }, '-=0.15');
  }

  // --- Page 3: Family ---
  function animateFamily() {
    const tl = gsap.timeline();

    tl.to('.family-title', {
      duration: 0.7,
      opacity: 1,
      y: 0,
      ease: 'power3.out'
    });

    tl.to('.family-subtitle', {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, '-=0.25');

    tl.to('.family-photo', {
      duration: 0.7,
      opacity: 1,
      scale: 1,
      y: 0,
      stagger: {
        amount: 0.5,
        from: 'start'
      },
      ease: 'power3.out'
    }, '-=0.15');
  }

  // --- Page 4: Finale ---
  function animateFinale() {
    const tl = gsap.timeline();

    tl.to('#finale-heart-icon', {
      duration: 0.8,
      opacity: 1,
      y: 0,
      scale: 1,
      ease: 'elastic.out(1, 0.5)'
    });

    // Pulsing heart
    gsap.to('#finale-heart-icon', {
      scale: 1.15,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1
    });

    tl.to('.finale-message', {
      duration: 0.8,
      opacity: 1,
      y: 0,
      ease: 'power3.out'
    }, '-=0.3');

    tl.to('.finale-author', {
      duration: 0.6,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, '-=0.25');

    tl.to('.finale-date', {
      duration: 0.6,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, '-=0.2');

    tl.to('#page-4 .divider', {
      duration: 0.4,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.2');

    tl.to('.btn-restart', {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, '-=0.15');

    // Launch confetti
    setTimeout(() => launchConfetti(), 800);
  }

  // ---- NAV EVENTS ----
  navPrev.addEventListener('click', () => {
    if (currentPage > 1) showPage(currentPage - 1, 'prev');
  });

  navNext.addEventListener('click', () => {
    if (currentPage < totalPages) showPage(currentPage + 1, 'next');
  });

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.target);
      if (target !== currentPage) {
        showPage(target, target > currentPage ? 'next' : 'prev');
      }
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (mainContent.style.display !== 'block') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (currentPage < totalPages) showPage(currentPage + 1, 'next');
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (currentPage > 1) showPage(currentPage - 1, 'prev');
    }
  });

  // Touch swipe
  let touchStartX = 0;
  let touchStartY = 0;
  mainContent.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  mainContent.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0 && currentPage < totalPages) {
        showPage(currentPage + 1, 'next');
      } else if (dx > 0 && currentPage > 1) {
        showPage(currentPage - 1, 'prev');
      }
    }
  }, { passive: true });

  // Restart
  btnRestart.addEventListener('click', () => {
    isAnimating = true;

    gsap.to(mainContent, {
      duration: 0.5,
      opacity: 0,
      ease: 'power2.inOut',
      onComplete: () => {
        mainContent.style.display = 'none';
        mainContent.style.opacity = '1';
        pageNav.classList.remove('visible');

        // Reset landing
        landingScreen.style.display = 'flex';
        gsap.set(landingScreen, { opacity: 1 });
        gsap.set('.folder-container', { scale: 1, opacity: 1 });
        gsap.set('.folder-prompt', { opacity: 1, y: 0 });
        const folderEl = document.querySelector('.folder');
        if (folderEl) folderEl.classList.remove('open');

        // Reset all pages
        pages.forEach(p => {
          p.classList.remove('active');
          gsap.set(p, { opacity: 0, x: 0 });
        });

        currentPage = 1;
        clearConfetti();
        isAnimating = false;
      }
    });
  });

  // ---- PETAL PARTICLES ----
  function createPetals(count) {
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';

      const colors = ['#F4C2C2', '#E8B4B8', '#F9D5D3', '#F3E5AB', '#D4A89A'];
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];

      const size = gsap.utils.random(8, 18);
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;

      document.body.appendChild(petal);

      gsap.set(petal, {
        x: gsap.utils.random(0, window.innerWidth),
        y: -20,
        rotation: gsap.utils.random(0, 360),
        opacity: 0
      });

      gsap.to(petal, {
        duration: gsap.utils.random(4, 8),
        y: window.innerHeight + 50,
        x: `+=${gsap.utils.random(-100, 100)}`,
        rotation: gsap.utils.random(180, 720),
        opacity: gsap.utils.random(0.3, 0.7),
        ease: 'none',
        delay: gsap.utils.random(0, 3),
        onComplete: () => petal.remove()
      });
    }
  }

  // ---- CONFETTI SYSTEM ----
  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function launchConfetti() {
    clearConfetti();
    resizeCanvas();

    const colors = [
      '#F4C2C2', '#E8B4B8', '#D4918F', '#F9D5D3',
      '#F3E5AB', '#D4A574', '#D4A89A', '#FFF0E0'
    ];

    for (let i = 0; i < 120; i++) {
      confettiParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: Math.random() * 0.7 + 0.3,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.vy += 0.03;
      p.opacity -= 0.001;

      if (p.y > canvas.height + 20 || p.opacity <= 0) {
        confettiParticles.splice(i, 1);
        return;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    if (confettiParticles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    }
  }

  function clearConfetti() {
    confettiParticles = [];
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

});
