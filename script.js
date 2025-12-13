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
  let animationInterval;

  function createNameElement() {
    nameElement.innerHTML = '';
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      nameElement.appendChild(span);
    });
  }

  function animateName() {
    const charElements = nameElement.querySelectorAll('.char');
    
    if (!isHiding) {
      // 逐字显示
      if (currentIndex < chars.length) {
        charElements[currentIndex].classList.remove('hidden');
        currentIndex++;
      } else {
        // 显示完成后等待一段时间再开始隐藏
        setTimeout(() => {
          isHiding = true;
          currentIndex = chars.length - 1;
        }, 2000);
      }
    } else {
      // 逐字隐藏
      if (currentIndex >= 0) {
        charElements[currentIndex].classList.add('hidden');
        currentIndex--;
      } else {
        // 隐藏完成后重新开始显示
        isHiding = false;
        currentIndex = 0;
        setTimeout(() => {
          createNameElement();
        }, 500);
      }
    }
  }

  // 初始化
  createNameElement();
  
  // 开始动画
  animationInterval = setInterval(animateName, 150);
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
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // 为所有 section 添加观察
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
  });
}

// ============================================
// 页面加载完成后初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initPixelNameAnimation();
  initSmoothScroll();
  initScrollAnimation();
});
