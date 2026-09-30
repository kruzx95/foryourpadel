/* ═══════════════════════════════════════════════════════════
   FOR YOU PADEL — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

// ─── Navbar Scroll Effect ───
const navbar = document.getElementById('navbar');
const handleScroll = () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// ─── Mobile Menu Toggle ───
const burger = document.getElementById('nav-burger');
const mobileMenu = document.getElementById('nav-mobile');
const mobileLinks = document.querySelectorAll('.navbar__mobile-link, .navbar__mobile-cta');

burger.addEventListener('click', () => {
  burger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open');
  document.body.style.overflow = burger.classList.contains('is-open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

// ─── Scroll Reveal ───
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animations for siblings
        const delay = Array.from(entry.target.parentElement.children)
          .filter(c => c.classList.contains('reveal'))
          .indexOf(entry.target) * 80;
        
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ─── Counter Animation ───
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        
        el.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ─── Qualification Tabs ───
const tabs = document.querySelectorAll('.qual-tab');
const panels = document.querySelectorAll('.qual-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.tab;
    
    tabs.forEach(t => t.classList.remove('is-active'));
    panels.forEach(p => p.classList.remove('is-active'));
    
    tab.classList.add('is-active');
    document.getElementById(`panel-${targetId}`).classList.add('is-active');
  });
});

// ─── Sponsors Marquee ───
const sponsors = [
  { name: "", logo: "https://ik.imagekit.io/fyovge0xb/COMINGSOON.png" },
  { name: "", logo: "https://ik.imagekit.io/fyovge0xb/COMINGSOON.png" },
  { name: "", logo: "https://ik.imagekit.io/fyovge0xb/COMINGSOON.png" },
  { name: "", logo: "https://ik.imagekit.io/fyovge0xb/COMINGSOON.png" },
  { name: "", logo: "https://ik.imagekit.io/fyovge0xb/COMINGSOON.png" },
  { name: "", logo: "https://ik.imagekit.io/fyovge0xb/COMINGSOON.png" }
];

const track = document.getElementById('sponsorTrack');
if (track) {
  const renderList = sponsors.concat(sponsors);
  renderList.forEach(s => {
    const el = document.createElement('div');
    if (s.logo) {
      el.className = 'sponsor-item';
      const img = document.createElement('img');
      img.src = s.logo;
      img.alt = s.name || 'Sponsor';
      img.loading = 'lazy';
      img.onerror = function () {
        el.classList.add('sponsor-item--text');
        el.textContent = s.name || 'Coming Soon';
        if (el.contains(img)) el.removeChild(img);
      };
      el.appendChild(img);
    } else {
      el.className = 'sponsor-item sponsor-item--text';
      el.textContent = s.name || 'Coming Soon';
    }
    track.appendChild(el);
  });
}

// ─── Smooth scroll for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ─── Active nav link highlight ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__link');

const highlightNav = () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('is-active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('is-active');
    }
  });
};

window.addEventListener('scroll', highlightNav, { passive: true });

// ─── Parallax on hero (subtle) ───
const heroBg = document.querySelector('.hero__bg-img');
if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(${1.05 + scrollY * 0.0002}) translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════
// GALLERY SYSTEM
// ═══════════════════════════════════════════════════════════

// Gallery data — sourced directly from @foryoupadel Instagram & venue assets
const galleryData = [
  {
    src: '/images/gallery/ig_1__reel_Ddxf-B7hm0q_.jpg',
    title: 'Night Session & Atmosphere',
    caption: 'Pemandangan aerial spektakuler suasana malam For You Padel Court Tasikmalaya saat turnamen',
    category: 'court',
    size: 'wide',
    igUrl: 'https://www.instagram.com/reel/Ddxf-B7hm0q/'
  },
  {
    src: '/images/gallery/fyp_6_slide1.jpg',
    title: "Men's Elite — Group Stage",
    caption: "Para pemain kategori Men's Elite siap adu skill dan strategi terbaik di Smash for Smiles 2026",
    category: 'event',
    size: 'tall',
    igUrl: 'https://www.instagram.com/p/Ddtn4gkGgfQ/'
  },
  {
    src: '/images/gallery/highlight_13.jpg',
    title: 'Selebrasi Juara Komunitas FYP',
    caption: 'Momen kebersamaan dan kegembiraan para juara serta komunitas padel Tasikmalaya di dalam court',
    category: 'community',
    size: 'normal'
  },
  {
    src: '/images/gallery/fyp_7_slide1.jpg',
    title: "Women's Challenger",
    caption: "Power, passion, dan presisi tinggi dari para pemain putri di Smash for Smiles 2026",
    category: 'event',
    size: 'tall',
    igUrl: 'https://www.instagram.com/p/Ddtnd_emqMW/'
  },
  {
    src: '/images/gallery/highlight_8.jpg',
    title: 'Tribun & Court Lounge',
    caption: 'Area tribun dan lounge nyaman di sisi lapangan untuk menikmati setiap pertandingan',
    category: 'court',
    size: 'normal'
  },
  {
    src: '/images/gallery/fyp_5_slide1.jpg',
    title: "Men's Challenger",
    caption: "Rally sengit dan determinasi tinggi di kategori Men's Challenger Group Stage",
    category: 'event',
    size: 'normal',
    igUrl: 'https://www.instagram.com/p/DdtoOHgmiCP/'
  },
  {
    src: '/images/gallery/highlight_11.jpg',
    title: 'Padel Community Gathering',
    caption: 'Antusiasme dan senyum kebersamaan para pemain padel Tasikmalaya saat sesi latihan dan fun match',
    category: 'community',
    size: 'normal'
  },
  {
    src: '/images/gallery/fyp_8_slide1.jpg',
    title: "Women's Rookie",
    caption: "Energi baru dan semangat kompetitif para pemain kategori Women's Rookie",
    category: 'event',
    size: 'normal',
    igUrl: 'https://www.instagram.com/p/DdtnNmMGl5C/'
  },
  {
    src: '/images/gallery/highlight_7.jpg',
    title: 'Beach Ride League Vol. 1',
    caption: 'Liga komunitas padel yang mempertemukan para penggiat olahraga di Tasikmalaya',
    category: 'community',
    size: 'normal'
  },
  {
    src: '/images/gallery/ig_10__p_Ddsu-HNh6LV_.jpg',
    title: 'Official Ball Partner — HEAD',
    caption: 'Standar bola turnamen resmi HEAD Padel untuk kualitas rally terbaik di court',
    category: 'court',
    size: 'normal',
    igUrl: 'https://www.instagram.com/p/Ddsu-HNh6LV/'
  },
  {
    src: '/images/gallery/fyp_9_slide1.jpg',
    title: 'Corporate Clash',
    caption: 'Adu taktik, chemistry, dan teamwork antar tim perusahaan di arena padel',
    category: 'event',
    size: 'tall',
    igUrl: 'https://www.instagram.com/p/Ddtm6ifmvdk/'
  },
  {
    src: '/images/gallery/highlight_5.jpg',
    title: 'Clash of Ages Vol. 1',
    caption: 'Turnamen seru antar kelompok usia (KU 20, KU 30, KU 40+) yang penuh sportivitas',
    category: 'community',
    size: 'normal'
  },
  {
    src: '/images/gallery/fyp_4_slide1.jpg',
    title: 'Master KU+40',
    caption: 'Pengalaman dan kematangan permainan para atlet veteran kategori Master KU+40',
    category: 'event',
    size: 'normal',
    igUrl: 'https://www.instagram.com/p/DdtofHTGp7u/'
  },
  {
    src: '/images/gallery/ig_11__p_DdsF7qVTzOL_.jpg',
    title: 'Winner Get More!',
    caption: 'Hadiah spektakuler dan ratusan doorprize menanti peserta dan pengunjung turnamen',
    category: 'event',
    size: 'normal',
    igUrl: 'https://www.instagram.com/p/DdsF7qVTzOL/'
  },
  {
    src: '/images/gallery/highlight_3.jpg',
    title: 'Smash for Smiles Prize Pool',
    caption: 'Total hadiah hingga Rp70.000.000 untuk 7 kategori kompetisi padel bergengsi',
    category: 'event',
    size: 'tall'
  },
  {
    src: '/images/hero-bg.jpg',
    title: 'FYP Padel Center',
    caption: 'Lapangan padel berstandar internasional pertama dan terbesar di Tasikmalaya',
    category: 'court',
    size: 'wide'
  },
  {
    src: '/images/facility.jpg',
    title: 'Fasilitas Terintegrasi',
    caption: 'Dilengkapi café, shower room, pro shop, dan area parkir luas',
    category: 'court',
    size: 'normal'
  },
  {
    src: '/images/gallery/fyp_6_slide14.jpg',
    title: 'Match Schedule & Roster',
    caption: 'Bagan resmi pertandingan dan daftar grup turnamen Smash for Smiles 2026',
    category: 'event',
    size: 'normal',
    igUrl: 'https://www.instagram.com/p/Ddtn4gkGgfQ/'
  }
];

// ─── Render Gallery Grid ───
const galleryGrid = document.getElementById('gallery-grid');
let currentFilter = 'all';
let filteredData = [...galleryData];

function renderGallery(data, animate = false) {
  galleryGrid.innerHTML = '';
  data.forEach((item, index) => {
    const el = document.createElement('div');
    const sizeClass = item.size === 'tall' ? ' gallery__item--tall' : item.size === 'wide' ? ' gallery__item--wide' : '';
    el.className = `gallery__item${sizeClass}${animate ? ' is-animating-in' : ''}`;
    el.dataset.index = index;
    el.style.animationDelay = `${index * 40}ms`;

    const igBadge = item.igUrl ? `
      <div class="gallery__item-ig-badge" title="Dari Instagram @foryoupadel">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </div>
    ` : '';

    el.innerHTML = `
      <img src="${item.src}" alt="${item.title}" class="gallery__item-img" loading="lazy">
      ${igBadge}
      <div class="gallery__item-overlay">
        <span class="gallery__item-tag">${item.category}</span>
        <span class="gallery__item-title">${item.title}</span>
      </div>
      <div class="gallery__item-zoom">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </div>
    `;

    el.addEventListener('click', () => openLightbox(index));
    galleryGrid.appendChild(el);
  });
}

// Initial render
renderGallery(galleryData);

// ─── Gallery Filter ───
const filterBtns = document.querySelectorAll('.gallery__filter');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter === currentFilter) return;
    
    currentFilter = filter;
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    filteredData = filter === 'all' 
      ? [...galleryData] 
      : galleryData.filter(item => item.category === filter);
    
    renderGallery(filteredData, true);
  });
});

// ─── Lightbox ───
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxIgLink = document.getElementById('lightbox-ig-link');
let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const item = filteredData[lightboxIndex];
  if (!item) return;
  lightboxImg.src = item.src;
  lightboxImg.alt = item.title;
  lightboxCaption.textContent = item.caption;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${filteredData.length}`;

  if (lightboxIgLink) {
    if (item.igUrl) {
      lightboxIgLink.href = item.igUrl;
      lightboxIgLink.style.display = 'inline-flex';
    } else {
      lightboxIgLink.style.display = 'none';
    }
  }
}

function nextImage() {
  lightboxIndex = (lightboxIndex + 1) % filteredData.length;
  updateLightbox();
}

function prevImage() {
  lightboxIndex = (lightboxIndex - 1 + filteredData.length) % filteredData.length;
  updateLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextImage);
lightboxPrev.addEventListener('click', prevImage);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox__content')) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});
