// ============================================================
// script.js — Walid Ayman Portfolio
// الفيديو بيفتح بس لما تضغط Watch Demo أو View
// ============================================================

// ===== 1. تحميل البيانات =====
async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    renderProjects(data.projects);
    renderCertificates(data.certificates);
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('projects-grid').innerHTML = `
      <div class="loading-placeholder">
        <i class="fas fa-exclamation-circle"></i>
        <p>Make sure data.json is in the same folder.</p>
      </div>`;
  }
}

// ===== 2. عرض المشاريع =====
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!projects || projects.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center">No projects yet.</p>';
    return;
  }
  grid.innerHTML = '';

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';

    // ===== منطقة الصورة — فيها زرار Play لما تعدّي =====
    let mediaHTML = '';
    if (project.video) {
      const thumbnail = project.image
        ? `<img src="${project.image}" alt="${project.name}" class="project-img"
            onerror="this.style.display='none'">`
        : `<div class="project-img-placeholder"><i class="fas fa-chart-bar"></i></div>`;

      // الصورة مع overlay زرار Play — بيفتح الفيديو لما تضغطه
      mediaHTML = `
        <div class="project-media" onclick="openVideoModal('${project.video}', '${project.name}')">
          ${thumbnail}
          <div class="play-overlay">
            <div class="play-btn"><i class="fas fa-play"></i></div>
            <span class="play-label">Watch Demo</span>
          </div>
        </div>`;

    } else if (project.image) {
      mediaHTML = `<img src="${project.image}" alt="${project.name}" class="project-img"
        onerror="this.parentElement.innerHTML='<div class=\\'project-img-placeholder\\'><i class=\\'fas fa-chart-bar\\'></i></div>'">`;
    } else {
      mediaHTML = `<div class="project-img-placeholder"><i class="fas fa-chart-bar"></i></div>`;
    }

    // ===== Tags =====
    const tagsHTML = project.tags
      ? project.tags.map(t => `<span class="project-tag-item">${t}</span>`).join('')
      : '';

    // ===== أزرار الأكشن في أسفل الكرت =====
    // زرار Watch Demo — بيفتح الفيديو
    const watchBtn = project.video
      ? `<button class="video-tag-btn" onclick="openVideoModal('${project.video}', '${project.name}')">
           <i class="fas fa-circle-play"></i> Watch Demo
         </button>`
      : '';

    // زرار View Project — بيفتح رابط خارجي
    const linkBtn = project.link
      ? `<a href="${project.link}" target="_blank" class="project-link">
           View Project <i class="fas fa-arrow-right"></i>
         </a>`
      : '';

    card.innerHTML = `
      ${mediaHTML}
      <div class="project-body">
        <div class="project-tags">${tagsHTML}</div>
        <h3 class="project-title">${project.name}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-actions">
          ${watchBtn}
          ${linkBtn}
        </div>
      </div>`;

    grid.appendChild(card);
  });

  observeElements();
}

// ===== 3. Video Modal — نافذة تشغيل الفيديو =====
function openVideoModal(videoSrc, title) {
  let modal = document.getElementById('video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-overlay" onclick="closeVideoModal()"></div>
      <div class="video-modal-content">
        <div class="video-modal-header">
          <h3 id="video-modal-title"></h3>
          <button class="video-modal-close" onclick="closeVideoModal()">
            <i class="fas fa-xmark"></i>
          </button>
        </div>
        <video id="video-player" controls playsinline autoplay>
          Your browser does not support the video tag.
        </video>
      </div>`;
    document.body.appendChild(modal);
  }

  // حط العنوان والفيديو وشغّله
  document.getElementById('video-modal-title').textContent = title;
  const player = document.getElementById('video-player');
  player.src = videoSrc;
  player.load();
  player.play();

  // افتح النافذة
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('video-player');
  if (modal) {
    modal.classList.remove('open');
    player.pause();
    player.src = '';
  }
  document.body.style.overflow = '';
}

// إغلاق بـ Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideoModal();
});

// ===== 4. عرض الشهادات =====
function renderCertificates(certificates) {
  const grid = document.getElementById('certs-grid');
  if (!certificates || certificates.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center">No certificates yet.</p>';
    return;
  }
  grid.innerHTML = '';
  certificates.forEach(cert => {
    const tag = cert.link ? 'a' : 'div';
    const card = document.createElement(tag);
    card.className = 'cert-card reveal';
    if (cert.link) { card.href = cert.link; card.target = '_blank'; }
    card.innerHTML = `
      <div class="cert-icon"><i class="${cert.icon || 'fas fa-certificate'}"></i></div>
      <div class="cert-info">
        <div class="cert-name">${cert.name}</div>
        <div class="cert-org">${cert.organization}</div>
        <div class="cert-date">${cert.date}</div>
      </div>`;
    grid.appendChild(card);
  });
  observeElements();
}

// ===== 5. أنيميشن الظهور =====
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== 6. Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(10,15,30,0.98)'
    : 'rgba(10,15,30,0.85)';
});

// ===== 7. Hamburger =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== 8. Active Nav =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});

// ===== 9. Contact Form =====
const form = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        form.reset();
        formSuccess.classList.add('show');
        sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        setTimeout(() => {
          formSuccess.classList.remove('show');
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, 5000);
      } else { throw new Error(); }
    } catch {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      alert('Something went wrong. Please contact me directly via email.');
    }
  });
}

// ===== 10. تشغيل كل شيء =====
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  observeElements();
});
