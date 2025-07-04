<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <div class="logo-icon red">🎵</div>
            <h3>Practice Buddy</h3>
          </div>
          <p class="footer-tagline">Making music practice fun and engaging for everyone!</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#" @click="$emit('switch-mode', 'student')">Student Dashboard</a></li>
            <li><a href="#" @click="$emit('switch-mode', 'teacher')">Teacher Dashboard</a></li>
            <li><a href="#" @click="$emit('go-home')">Home</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Features</h4>
          <ul class="footer-links">
            <li>🎵 Practice Tracking</li>
            <li>👩‍🏫 Teacher Feedback</li>
            <li>📈 Progress Charts</li>
            <li>🌟 Achievement Stickers</li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="#" class="social-link red">📧</a>
            <a href="#" class="social-link blue">📱</a>
            <a href="#" class="social-link yellow">💬</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-decoration">
          <span class="decoration-item red bounce">🎻</span>
          <span class="decoration-item blue wiggle">🎵</span>
          <span class="decoration-item yellow">⭐</span>
          <span class="decoration-item green">🎼</span>
        </div>
        <p class="copyright">© 2024 Practice Buddy. Made with ❤️ for music lovers everywhere!</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['switch-mode', 'go-home'])
</script>

<style scoped>
.footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 4px solid #4FC3F7;
  margin-top: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 40px 0 20px;
}

.footer-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
  position: relative;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 3px;
  background: linear-gradient(90deg, #4FC3F7, #BA68C8);
  border-radius: 2px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid;
}

.logo-icon.red {
  background: linear-gradient(145deg, #4FC3F7, #29B6F6);
  border-color: #0288D1;
}

.footer-logo h3 {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
}

.footer-tagline {
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333333;
}

.footer-links a {
  color: #333333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #4FC3F7;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  text-decoration: none;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid;
  transition: all 0.3s ease;
}

.social-link.red {
  background: linear-gradient(145deg, #4FC3F7, #29B6F6);
  border-color: #0288D1;
}

.social-link.blue {
  background: linear-gradient(145deg, #BA68C8, #AB47BC);
  border-color: #8E24AA;
}

.social-link.yellow {
  background: linear-gradient(145deg, #FFEB3B, #FDD835);
  border-color: #F57F17;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.footer-bottom {
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
  text-align: center;
}

.footer-decoration {
  margin-bottom: 16px;
}

.decoration-item {
  display: inline-block;
  margin: 0 8px;
  font-size: 20px;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

.decoration-item.bounce {
  animation-name: bounce;
}

.decoration-item.wiggle {
  animation-name: wiggle;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes wiggle {
  0%, 7% {
    transform: rotateZ(0);
  }
  15% {
    transform: rotateZ(-15deg);
  }
  20% {
    transform: rotateZ(10deg);
  }
  25% {
    transform: rotateZ(-10deg);
  }
  30% {
    transform: rotateZ(6deg);
  }
  35% {
    transform: rotateZ(-4deg);
  }
  40%, 100% {
    transform: rotateZ(0);
  }
}

.copyright {
  color: #333333;
  font-size: 12px;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .footer-section h4::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .social-links {
    justify-content: center;
  }
}
</style> 