document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
    });
  }

  // Active Link State
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a, .nav-list a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/index.html')) {
      link.classList.add('active');
    }
  });

  // Privacy Preferences Toggle
  const privacyBtn = document.getElementById('privacy-preferences');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', () => {
      const status = document.getElementById('preference-status');
      try {
        if (window.googlefc && typeof window.googlefc.showRevocationMessage === 'function') {
          window.googlefc.showRevocationMessage();
          status.textContent = 'Google onay tercihleri açılıyor.';
        } else {
          status.textContent = 'Bu sayfada bir Google tercih aracı kullanılamıyor. Tarayıcı ayarlarını veya Google Reklam Merkezini kullanabilirsin.';
        }
      } catch (error) {
        status.textContent = 'Tercih aracı açılamadı. Tarayıcı ayarlarını veya Google Reklam Merkezini kullanabilirsin.';
      }
    });
  }
});