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
      span.className = 'char hidden'; // 初始状态全部隐藏
      span.textContent = char === ' ' ? '\u00A0' : char;
      nameElement.appendChild(span);
    });
    currentIndex = 0;
    isHiding = false;
    isWaiting = false;
  }

  function animateName() {
    // 如果正在等待，不执行动画
    if (isWaiting) return;
    
    const charElements = nameElement.querySelectorAll('.char');
    
    if (!isHiding) {
      // 逐字显示
      if (currentIndex < chars.length) {
        if (charElements[currentIndex]) {
          charElements[currentIndex].classList.remove('hidden');
        }
        currentIndex++;
      } else {
        // 显示完成后等待一段时间再开始隐藏
        isWaiting = true;
        if (waitTimeout) clearTimeout(waitTimeout);
        waitTimeout = setTimeout(() => {
          isHiding = true;
          currentIndex = chars.length - 1;
          isWaiting = false;
        }, 2500);
      }
    } else {
      // 逐字隐藏
      if (currentIndex >= 0) {
        if (charElements[currentIndex]) {
          charElements[currentIndex].classList.add('hidden');
        }
        currentIndex--;
      } else {
        // 隐藏完成后重新开始显示
        isWaiting = true;
        if (waitTimeout) clearTimeout(waitTimeout);
        waitTimeout = setTimeout(() => {
          isHiding = false;
          currentIndex = 0;
          createNameElement();
          isWaiting = false;
        }, 600);
      }
    }
  }

  // 初始化
  createNameElement();
  
  // 开始动画
  animationInterval = setInterval(animateName, 120);
}

// ============================================
// 平滑滚动导航
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // 更新活动状态
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// 滚动时的淡入动画
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

  // 为所有 section 添加观察
  document.querySelectorAll('section.fade-in').forEach(section => {
    observer.observe(section);
  });
}

// ============================================
// 粒子效果
// ============================================
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置和延迟
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    // 随机大小
    const size = 1 + Math.random() * 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    particlesContainer.appendChild(particle);
  }
}

// ============================================
// 打字机效果（用于副标题）
// ============================================
function initTypewriter() {
  const subtitle = document.querySelector('.subtitle');
  if (!subtitle) return;

  const text = subtitle.textContent;
  subtitle.textContent = '';
  subtitle.style.opacity = '0';

  setTimeout(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        subtitle.textContent += text[index];
        index++;
      } else {
        clearInterval(typeInterval);
        subtitle.style.opacity = '1';
        subtitle.style.transition = 'opacity 0.5s ease';
      }
    }, 50);
  }, 1000);
}

// ============================================
// 卡片悬停效果增强
// ============================================
function initCardEffects() {
  const cards = document.querySelectorAll('.interest-card, .blog-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// ============================================
// 页面加载完成后初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initPixelNameAnimation();
  initSmoothScroll();
  initScrollAnimation();
  initParticles();
  initTypewriter();
  initCardEffects();
  
  // 设置当前导航项
  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath.endsWith('index.html')) {
    const firstNav = document.querySelector('nav a[href^="#"]');
    if (firstNav) firstNav.classList.add('active');
  }
});

// ============================================
// 滚动时更新导航活动状态
// ============================================
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});
