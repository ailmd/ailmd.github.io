// ============================================
// 全局统一滚动偏移量（核心）
// ============================================
function getNavOffset() {
  const nav = document.querySelector('.main-nav');
  return (nav?.offsetHeight || 0) + 60; // 统一安全距离
}

// ============================================
// 像素风名字逐字消失和出现动画
// ============================================
function initPixelNameAnimation() {
  const nameElement = document.getElementById('pixelName');
  if (!nameElement) return;

  const fullName = 'Hello, I am Liu Mingda !';
  const chars = fullName.split('');
  let currentIndex = 0;
  let isHiding = false;
  let waitTimeout = null;
  let isWaiting = false;

  function createNameElement() {
    nameElement.innerHTML = '';
    chars.forEach(char => {
      const span = document.createElement('span');
      span.className = 'char hidden';
      span.textContent = char === ' ' ? '\u00A0' : char;
      nameElement.appendChild(span);
    });
    currentIndex = 0;
    isHiding = false;
    isWaiting = false;
  }

  function animateName() {
    if (isWaiting) return;

    const charElements = nameElement.querySelectorAll('.char');

    if (!isHiding) {
      if (currentIndex < chars.length) {
        charElements[currentIndex]?.classList.remove('hidden');
        currentIndex++;
      } else {
        isWaiting = true;
        waitTimeout && clearTimeout(waitTimeout);
        waitTimeout = setTimeout(() => {
          isHiding = true;
          currentIndex = chars.length - 1;
          isWaiting = false;
        }, 3000);
      }
    } else {
      if (currentIndex >= 0) {
        charElements[currentIndex]?.classList.add('hidden');
        currentIndex--;
      } else {
        isWaiting = true;
        waitTimeout && clearTimeout(waitTimeout);
        waitTimeout = setTimeout(() => {
          createNameElement();
          isWaiting = false;
        }, 800);
      }
    }
  }

  createNameElement();
  setInterval(animateName, 150);
}

// ============================================
// 平滑滚动导航（已统一 offset）
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const href = anchor.getAttribute('href');

      if (href === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(updateActiveNav, 500);
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      const offset = getNavOffset();
      // 使用 getBoundingClientRect() 获取相对于视口的位置，然后加上当前滚动位置
      const rect = target.getBoundingClientRect();
      const targetPosition = window.scrollY + rect.top - offset;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });

      // 等待滚动完成后再更新导航状态
      setTimeout(updateActiveNav, 800);
    });
  });
}

// ============================================
// 滚动进入动画
// ============================================
function initScrollAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  document.querySelectorAll('.content-section').forEach(section => {
    observer.observe(section);
  });
}

// ============================================
// 导航栏滚动效果
// ============================================
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateActiveNav();
  });
}

// ============================================
// 更新活动导航项（已统一 offset）
// ============================================
function updateActiveNav() {
  const sections = document.querySelectorAll('.content-section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');
  const scrollPos = window.scrollY;
  const offset = getNavOffset();

  let currentId = '';

  sections.forEach(section => {
    // 使用 getBoundingClientRect() 获取相对于视口的位置，更准确
    const rect = section.getBoundingClientRect();
    const top = scrollPos + rect.top;
    const bottom = top + rect.height;
    
    // 判断当前滚动位置（加上偏移量）是否在section范围内
    if (scrollPos + offset >= top && scrollPos + offset < bottom) {
      currentId = section.id;
    }
  });

  // 如果滚动位置接近顶部，设置为hero
  if (scrollPos < 100) currentId = 'hero';

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${currentId}`
    );
  });
}

// ============================================
// 粒子效果（荧光绿色低密度慢速）
// ============================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 66;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = 25 + Math.random() * 10 + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    const size = 1.5 + Math.random();
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.opacity = 0.2 + Math.random() * 0.3;
    container.appendChild(p);
  }
}

// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initPixelNameAnimation();
  initSmoothScroll();
  initScrollAnimation();
  initNavScroll();
  initParticles();
});
