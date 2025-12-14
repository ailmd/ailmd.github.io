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
      const href = this.getAttribute('href');
      
      // 如果是hero链接，直接滚动到顶部
      if (href === '#hero') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        // 更新导航高亮
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
        });
        setTimeout(() => {
          updateActiveNav();
        }, 500);
        return;
      }
      
      const target = document.querySelector(href);
      
      if (target) {
        // 立即更新活动导航项
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        // 如果点击的是导航链接，则高亮它
        if (this.closest('.nav-links')) {
          this.classList.add('active');
        } else {
          // 如果点击的是其他链接，找到对应的导航链接并高亮
          const correspondingNavLink = document.querySelector(`.nav-links a[href="${href}"]`);
          if (correspondingNavLink) {
            correspondingNavLink.classList.add('active');
          }
        }
        
        // 计算准确的滚动位置
        const nav = document.querySelector('.main-nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        
        // 获取目标元素相对于文档的位置
        let targetPosition = target.offsetTop;
        
        // 如果目标元素在main-content内，需要考虑main-content的offsetTop
        const mainContent = document.querySelector('.main-content');
        if (mainContent && target.closest('.main-content')) {
          // 不需要额外调整，offsetTop已经是相对于文档的位置
        }
        
        // 减去导航栏高度和额外间距
        targetPosition = targetPosition - navHeight - 40;
        
        // 平滑滚动到目标位置
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
        
        // 滚动完成后再次确认高亮状态
        setTimeout(() => {
          updateActiveNav();
        }, 800);
      } else {
        console.warn('Target element not found for:', href);
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
  const scrollPosition = window.pageYOffset || window.scrollY;
  const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
  const offset = navHeight + 150; // 偏移量，考虑导航栏高度和额外间距
  
  // 遍历所有section，找到当前应该高亮的section
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionBottom = sectionTop + sectionHeight;
    const sectionId = section.getAttribute('id');
    
    // 判断当前滚动位置是否在这个section的范围内
    // 考虑偏移量，当滚动位置进入section区域时高亮
    if (scrollPosition + offset >= sectionTop && scrollPosition + offset < sectionBottom) {
      current = sectionId;
    }
    
    // 特殊处理：如果滚动位置在section顶部附近（在section开始之前但很接近）
    if (scrollPosition + offset >= sectionTop - 100 && scrollPosition + offset < sectionTop) {
      current = sectionId;
    }
  });
  
  // 如果还在页面顶部，高亮hero
  if (scrollPosition < 100) {
    current = 'hero';
  }
  
  // 如果滚动到底部，高亮最后一个section
  if (!current && sections.length > 0) {
    const lastSection = sections[sections.length - 1];
    if (scrollPosition + window.innerHeight >= document.documentElement.scrollHeight - 50) {
      current = lastSection.getAttribute('id');
    }
  }

  // 更新导航链接的高亮状态
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
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

  // 低密度：只创建30个粒子
  const particleCount = 66;

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
// 自定义鼠标样式
// ============================================
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.display = 'block';
  });
  
  // 平滑跟随动画
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // 悬停效果
  const hoverElements = document.querySelectorAll('a, button, .hero-link, .contact-link, .nav-links a, .research-card, .project-card, .blog-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
  
  // 点击效果
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
  });
  
  // 鼠标离开页面时隐藏
  document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
  });
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
  initCustomCursor();
});
