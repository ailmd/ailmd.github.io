// ============================================
// 像素风名字逐字消失和出现动画
// ============================================
function initPixelNameAnimation() {
  const nameElement = document.getElementById('pixelName');
  if (!nameElement) return;

  const fullName = 'Mingda Liu';
  const chars = fullName.split('');
  let currentIndex = 0;
  let isHiding = false;
  let animationInterval = null;
  let waitTimeout = null;
  let isWaiting = false;

  function createNameElement() {
    nameElement.innerHTML = '';
    chars.forEach((char) => {
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
        if (charElements[currentIndex]) {
          charElements[currentIndex].classList.remove('hidden');
        }
        currentIndex++;
      } else {
        isWaiting = true;
        if (waitTimeout) clearTimeout(waitTimeout);
        waitTimeout = setTimeout(() => {
          isHiding = true;
          currentIndex = chars.length - 1;
          isWaiting = false;
        }, 3000);
      }
    } else {
      if (currentIndex >= 0) {
        if (charElements[currentIndex]) {
          charElements[currentIndex].classList.add('hidden');
        }
        currentIndex--;
      } else {
        isWaiting = true;
        if (waitTimeout) clearTimeout(waitTimeout);
        waitTimeout = setTimeout(() => {
          isHiding = false;
          currentIndex = 0;
          createNameElement();
          isWaiting = false;
        }, 800);
      }
    }
  }

  createNameElement();
  animationInterval = setInterval(animateName, 150);
}

// ============================================
// 平滑滚动导航
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// 滚动动画
// ============================================
function initScrollAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

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

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    // 更新活动导航项
    updateActiveNav();
    
    lastScroll = currentScroll;
  });
}

// ============================================
// 更新活动导航项
// ============================================
function updateActiveNav() {
  const sections = document.querySelectorAll('.content-section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let current = '';
  const scrollPosition = window.pageYOffset + 150;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ============================================
// 粒子效果 - 荧光绿色低密度慢速
// ============================================
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  // 低密度：只创建15-20个粒子
  const particleCount = 18;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置
    particle.style.left = Math.random() * 100 + '%';
    
    // 慢速：25-35秒的动画时长
    const duration = 25 + Math.random() * 10;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    // 随机大小（保持小尺寸）
    const size = 1.5 + Math.random() * 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // 随机透明度（保持较低）
    particle.style.opacity = 0.2 + Math.random() * 0.3;
    
    particlesContainer.appendChild(particle);
  }
}

// ============================================
// 页面加载完成后初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initPixelNameAnimation();
  initSmoothScroll();
  initScrollAnimation();
  initNavScroll();
  initParticles();
});
