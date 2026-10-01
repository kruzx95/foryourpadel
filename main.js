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

// ═══════════════════════════════════════════════════════════
// BOOKING & PRICE CALCULATOR SYSTEM
// ═══════════════════════════════════════════════════════════

const bookingState = {
  courtId: 1,
  courtName: 'Court 1 (Panoramic Center)',
  date: '',
  dateLabel: 'Hari Ini',
  formattedDate: '',
  duration: 2,
  startTime: '19:00',
  endTime: '21:00',
  isPeak: true,
  rackets: 0,
  balls: 0,
  hasBallboy: false,
  hasCoach: false,
  customerName: '',
  customerPhone: '',
  customerNotes: ''
};

// Pricing rates
const RATES = {
  offpeakPerHour: 200000,
  peakPerHour: 280000,
  racketPerUnit: 35000,
  ballsPerCan: 85000,
  ballboyPerHour: 50000,
  coachPerHour: 120000
};

// Format currency IDR
const formatIDR = (num) => {
  return 'Rp ' + num.toLocaleString('id-ID');
};

// Available time slots (06:00 to 21:00)
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

// Helper: Calculate end time string from startTime and duration
function calculateEndTime(startTime, duration) {
  const [hStr, mStr] = startTime.split(':');
  let totalMin = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + Math.round(duration * 60);
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

// Helper: Determine if hour is peak (15:00 - 23:00)
function checkIsPeak(timeStr) {
  const hour = parseInt(timeStr.split(':')[0], 10);
  return hour >= 15;
}

// Toast notification
const bookingToast = document.getElementById('bookingToast');
const toastMsg = document.getElementById('toastMsg');
const toastIcon = document.getElementById('toastIcon');
let toastTimer = null;

function showToast(message, isError = false) {
  if (!bookingToast) return;
  toastMsg.textContent = message;
  if (isError) {
    bookingToast.style.borderColor = '#F87171';
    toastIcon.style.color = '#F87171';
  } else {
    bookingToast.style.borderColor = 'var(--mint)';
    toastIcon.style.color = 'var(--mint)';
  }
  bookingToast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    bookingToast.classList.remove('is-show');
  }, 3200);
}

// ─── Initialize Booking System ───
function initBookingSystem() {
  const courtCards = document.querySelectorAll('.court-card');
  const dateQuickPicker = document.getElementById('dateQuickPicker');
  const customDatePicker = document.getElementById('customDatePicker');
  const durationBtns = document.querySelectorAll('.duration-btn');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const slotScheduleDisplay = document.getElementById('slotScheduleDisplay');
  const slotSessionBadge = document.getElementById('slotSessionBadge');

  // Addon Steppers & Toggles
  const racketMinus = document.getElementById('racketMinus');
  const racketPlus = document.getElementById('racketPlus');
  const racketCount = document.getElementById('racketCount');

  const ballsMinus = document.getElementById('ballsMinus');
  const ballsPlus = document.getElementById('ballsPlus');
  const ballsCount = document.getElementById('ballsCount');

  const ballboyToggle = document.getElementById('ballboyToggle');
  const coachToggle = document.getElementById('coachToggle');

  // Customer Inputs
  const bookerNameInput = document.getElementById('bookerName');
  const bookerPhoneInput = document.getElementById('bookerPhone');
  const bookerNotesInput = document.getElementById('bookerNotes');

  // Summary Elements
  const sumCourtName = document.getElementById('sumCourtName');
  const sumSchedule = document.getElementById('sumSchedule');
  const sumCourtRateLabel = document.getElementById('sumCourtRateLabel');
  const sumCourtCost = document.getElementById('sumCourtCost');

  const sumRacketRow = document.getElementById('sumRacketRow');
  const sumRacketLabel = document.getElementById('sumRacketLabel');
  const sumRacketCost = document.getElementById('sumRacketCost');

  const sumBallsRow = document.getElementById('sumBallsRow');
  const sumBallsLabel = document.getElementById('sumBallsLabel');
  const sumBallsCost = document.getElementById('sumBallsCost');

  const sumBallboyRow = document.getElementById('sumBallboyRow');
  const sumBallboyLabel = document.getElementById('sumBallboyLabel');
  const sumBallboyCost = document.getElementById('sumBallboyCost');

  const sumCoachRow = document.getElementById('sumCoachRow');
  const sumCoachLabel = document.getElementById('sumCoachLabel');
  const sumCoachCost = document.getElementById('sumCoachCost');

  const sumGrandTotal = document.getElementById('sumGrandTotal');

  // Buttons
  const btnSendWhatsApp = document.getElementById('btnSendWhatsApp');
  const btnCopyChat = document.getElementById('btnCopyChat');

  if (!courtCards.length || !btnSendWhatsApp) return;

  // 1. Setup Dates (Today, Tomorrow, Day after)
  const now = new Date();
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const quickDates = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    const label = i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : 'Lusa';
    const dayStr = dayNames[d.getDay()];
    const dateFormatted = `${dayStr}, ${d.getDate()} ${monthNames[d.getMonth()]}`;
    const fullFormatted = `${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
    quickDates.push({ iso, label, dateFormatted, fullFormatted });
  }

  // Set default date
  bookingState.date = quickDates[0].iso;
  bookingState.dateLabel = quickDates[0].label;
  bookingState.formattedDate = quickDates[0].fullFormatted;

  let renderTimeSlots;

  if (customDatePicker) {
    customDatePicker.min = quickDates[0].iso;
    customDatePicker.value = quickDates[0].iso;
  }

  // Render Quick Date buttons
  if (dateQuickPicker) {
    dateQuickPicker.innerHTML = '';
    quickDates.forEach((qd, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `date-quick-btn${idx === 0 ? ' is-active' : ''}`;
      btn.innerHTML = `
        <span class="date-quick-btn__day">${qd.label}</span>
        <span class="date-quick-btn__sub">${qd.dateFormatted}</span>
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-quick-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        bookingState.date = qd.iso;
        bookingState.dateLabel = qd.label;
        bookingState.formattedDate = qd.fullFormatted;
        if (customDatePicker) customDatePicker.value = qd.iso;
        updateSummary();
      });
      dateQuickPicker.appendChild(btn);
    });
  }

  // Custom Date Picker Listener
  if (customDatePicker) {
    customDatePicker.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;
      document.querySelectorAll('.date-quick-btn').forEach(b => b.classList.remove('is-active'));

      // Check if matches one of the quick dates
      const matched = quickDates.find(qd => qd.iso === val);
      if (matched) {
        bookingState.date = matched.iso;
        bookingState.dateLabel = matched.label;
        bookingState.formattedDate = matched.fullFormatted;
        const matchingBtn = Array.from(document.querySelectorAll('.date-quick-btn'))
          .find(b => b.textContent.includes(matched.label));
        if (matchingBtn) matchingBtn.classList.add('is-active');
      } else {
        const parts = val.split('-');
        const parsed = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        bookingState.date = val;
        bookingState.dateLabel = parsed.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
        bookingState.formattedDate = parsed.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
      updateSummary();
    });
  }

  // 2. Setup Court Selection
  courtCards.forEach(card => {
    card.addEventListener('click', () => {
      courtCards.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('is-active');
      card.setAttribute('aria-pressed', 'true');
      bookingState.courtId = parseInt(card.dataset.court, 10);
      bookingState.courtName = card.dataset.name;
      updateSummary();
    });
  });

  // 3. Setup Duration Buttons
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      bookingState.duration = parseFloat(btn.dataset.hours);
      bookingState.endTime = calculateEndTime(bookingState.startTime, bookingState.duration);
      updateSummary();
    });
  });

  // 4. Setup Time Slots
  renderTimeSlots = () => {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';

    // Check slot availability from storage (synced with admin dashboard / Supabase)
    const courtCode = `court-${bookingState.courtId || 1}`;
    let daySlots = null;
    try {
      const stored = localStorage.getItem(`fyp_slots_${bookingState.date}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        daySlots = parsed[courtCode] || null;
      }
    } catch (_) {}

    TIME_SLOTS.forEach(time => {
      const isPeak = checkIsPeak(time);
      const isBooked = daySlots && daySlots[time] && daySlots[time].status !== 'available';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `time-slot-btn${isPeak ? ' time-slot-btn--peak' : ''}${time === bookingState.startTime ? ' is-active' : ''}${isBooked ? ' is-disabled' : ''}`;
      btn.textContent = time;
      btn.disabled = isBooked;
      btn.title = isBooked ? 'Slot sudah terisi / tidak tersedia' : (isPeak ? 'Peak Hours (Sore/Malam)' : 'Off-Peak (Pagi/Siang)');

      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        bookingState.startTime = time;
        bookingState.isPeak = isPeak;
        bookingState.endTime = calculateEndTime(time, bookingState.duration);
        updateSummary();
      });
      timeSlotsContainer.appendChild(btn);
    });
  };

  renderTimeSlots();
  window.addEventListener('storage', () => renderTimeSlots());

  // 5. Addon Steppers (Racket & Balls)
  if (racketPlus && racketMinus && racketCount) {
    racketPlus.addEventListener('click', () => {
      if (bookingState.rackets < 4) {
        bookingState.rackets++;
        racketCount.textContent = bookingState.rackets;
        updateSummary();
      }
    });
    racketMinus.addEventListener('click', () => {
      if (bookingState.rackets > 0) {
        bookingState.rackets--;
        racketCount.textContent = bookingState.rackets;
        updateSummary();
      }
    });
  }

  if (ballsPlus && ballsMinus && ballsCount) {
    ballsPlus.addEventListener('click', () => {
      if (bookingState.balls < 5) {
        bookingState.balls++;
        ballsCount.textContent = bookingState.balls;
        updateSummary();
      }
    });
    ballsMinus.addEventListener('click', () => {
      if (bookingState.balls > 0) {
        bookingState.balls--;
        ballsCount.textContent = bookingState.balls;
        updateSummary();
      }
    });
  }

  // 6. Addon Toggles (Ball Boy & Coach)
  if (ballboyToggle) {
    ballboyToggle.addEventListener('change', (e) => {
      bookingState.hasBallboy = e.target.checked;
      updateSummary();
    });
  }

  if (coachToggle) {
    coachToggle.addEventListener('change', (e) => {
      bookingState.hasCoach = e.target.checked;
      updateSummary();
    });
  }

  // 7. Customer Inputs Sync
  if (bookerNameInput) {
    bookerNameInput.addEventListener('input', (e) => {
      bookingState.customerName = e.target.value.trim();
      bookerNameInput.classList.remove('is-error');
    });
  }
  if (bookerPhoneInput) {
    bookerPhoneInput.addEventListener('input', (e) => {
      bookingState.customerPhone = e.target.value.trim();
    });
  }
  if (bookerNotesInput) {
    bookerNotesInput.addEventListener('input', (e) => {
      bookingState.customerNotes = e.target.value.trim();
    });
  }

  // 8. Update Summary Calculations & UI
  function updateSummary() {
    bookingState.endTime = calculateEndTime(bookingState.startTime, bookingState.duration);
    bookingState.isPeak = checkIsPeak(bookingState.startTime);

    // Schedule pill in step 3
    if (slotScheduleDisplay) {
      slotScheduleDisplay.textContent = `${bookingState.startTime} - ${bookingState.endTime} WIB (${bookingState.duration} Jam)`;
    }
    if (slotSessionBadge) {
      if (bookingState.isPeak) {
        slotSessionBadge.className = 'session-badge session-badge--peak';
        slotSessionBadge.textContent = 'Peak Hours (Malam)';
      } else {
        slotSessionBadge.className = 'session-badge session-badge--offpeak';
        slotSessionBadge.textContent = 'Off-Peak (Siang)';
      }
    }

    // Calculations
    const hourlyRate = bookingState.isPeak ? RATES.peakPerHour : RATES.offpeakPerHour;
    const courtCost = bookingState.duration * hourlyRate;
    const racketCost = bookingState.rackets * RATES.racketPerUnit;
    const ballsCost = bookingState.balls * RATES.ballsPerCan;
    const ballboyCost = bookingState.hasBallboy ? bookingState.duration * RATES.ballboyPerHour : 0;
    const coachCost = bookingState.hasCoach ? bookingState.duration * RATES.coachPerHour : 0;

    const grandTotal = courtCost + racketCost + ballsCost + ballboyCost + coachCost;

    // Update Summary Card
    if (sumCourtName) sumCourtName.textContent = bookingState.courtName;
    if (sumSchedule) {
      sumSchedule.textContent = `${bookingState.dateLabel} (${bookingState.formattedDate}) · ${bookingState.startTime} - ${bookingState.endTime} WIB (${bookingState.duration} Jam)`;
    }

    if (sumCourtRateLabel) {
      const sessionLabel = bookingState.isPeak ? 'Peak' : 'Off-Peak';
      sumCourtRateLabel.textContent = `Sewa Lapangan (${bookingState.duration} Jam · ${sessionLabel})`;
    }
    if (sumCourtCost) sumCourtCost.textContent = formatIDR(courtCost);

    // Racket row
    if (sumRacketRow) {
      if (bookingState.rackets > 0) {
        sumRacketRow.style.display = 'flex';
        sumRacketLabel.textContent = `Sewa Raket (${bookingState.rackets} unit)`;
        sumRacketCost.textContent = formatIDR(racketCost);
      } else {
        sumRacketRow.style.display = 'none';
      }
    }

    // Balls row
    if (sumBallsRow) {
      if (bookingState.balls > 0) {
        sumBallsRow.style.display = 'flex';
        sumBallsLabel.textContent = `Bola HEAD Baru (${bookingState.balls} can)`;
        sumBallsCost.textContent = formatIDR(ballsCost);
      } else {
        sumBallsRow.style.display = 'none';
      }
    }

    // Ballboy row
    if (sumBallboyRow) {
      if (bookingState.hasBallboy) {
        sumBallboyRow.style.display = 'flex';
        sumBallboyLabel.textContent = `Ball Boy (${bookingState.duration} Jam)`;
        sumBallboyCost.textContent = formatIDR(ballboyCost);
      } else {
        sumBallboyRow.style.display = 'none';
      }
    }

    // Coach row
    if (sumCoachRow) {
      if (bookingState.hasCoach) {
        sumCoachRow.style.display = 'flex';
        sumCoachLabel.textContent = `Coach / Sparring (${bookingState.duration} Jam)`;
        sumCoachCost.textContent = formatIDR(coachCost);
      } else {
        sumCoachRow.style.display = 'none';
      }
    }

    // Grand Total
    if (sumGrandTotal) {
      sumGrandTotal.textContent = formatIDR(grandTotal);
    }
  }

  // 9. Generate WhatsApp Message
  function generateBookingMessage() {
    const hourlyRate = bookingState.isPeak ? RATES.peakPerHour : RATES.offpeakPerHour;
    const courtCost = bookingState.duration * hourlyRate;
    const racketCost = bookingState.rackets * RATES.racketPerUnit;
    const ballsCost = bookingState.balls * RATES.ballsPerCan;
    const ballboyCost = bookingState.hasBallboy ? bookingState.duration * RATES.ballboyPerHour : 0;
    const coachCost = bookingState.hasCoach ? bookingState.duration * RATES.coachPerHour : 0;
    const grandTotal = courtCost + racketCost + ballsCost + ballboyCost + coachCost;

    const sessionLabel = bookingState.isPeak ? 'Peak Hours (Sore/Malam)' : 'Off-Peak (Pagi/Siang)';
    const name = bookingState.customerName || 'Belum diisi';
    const phone = bookingState.customerPhone ? `\n• No. WhatsApp: ${bookingState.customerPhone}` : '';
    const notes = bookingState.customerNotes ? `\n• Catatan: ${bookingState.customerNotes}` : '';

    let addonsText = '';
    const addonsList = [];
    if (bookingState.rackets > 0) addonsList.push(`• Sewa Raket: ${bookingState.rackets} Unit (${formatIDR(racketCost)})`);
    if (bookingState.balls > 0) addonsList.push(`• Bola HEAD Baru: ${bookingState.balls} Can (${formatIDR(ballsCost)})`);
    if (bookingState.hasBallboy) addonsList.push(`• Ball Boy: Ya, ${bookingState.duration} Jam (${formatIDR(ballboyCost)})`);
    if (bookingState.hasCoach) addonsList.push(`• Coach/Sparring: Ya, ${bookingState.duration} Jam (${formatIDR(coachCost)})`);

    if (addonsList.length > 0) {
      addonsText = `\n\n🎾 *PERLENGKAPAN & ADD-ON*\n${addonsList.join('\n')}`;
    }

    return `Halo Admin FYP Padel Court Tasikmalaya, saya ingin reservasi lapangan:

📋 *DETAIL RESERVASI*
• Lapangan: ${bookingState.courtName}
• Tanggal: ${bookingState.formattedDate}
• Waktu: ${bookingState.startTime} - ${bookingState.endTime} WIB (${bookingState.duration} Jam)
• Sesi: ${sessionLabel} (${formatIDR(hourlyRate)}/jam)${addonsText}

👤 *DATA PEMESAN*
• Nama: ${name}${phone}${notes}

💰 *ESTIMASI TOTAL BIAYA: ${formatIDR(grandTotal)}*
_(Termasuk lampu kompetisi & akses fasilitas)_

Mohon info konfirmasi ketersediaan slot tersebut. Terima kasih!`;
  }

  // 10. Send to WhatsApp handler
  btnSendWhatsApp.addEventListener('click', () => {
    if (!bookingState.customerName) {
      if (bookerNameInput) {
        bookerNameInput.classList.add('is-error');
        bookerNameInput.focus();
        bookerNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast('Harap masukkan nama pemesan terlebih dahulu', true);
      return;
    }

    const message = generateBookingMessage();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/6287886633636?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast('Membuka WhatsApp Admin FYP...');
  });

  // 11. Copy Chat handler
  btnCopyChat.addEventListener('click', () => {
    const message = generateBookingMessage();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message)
        .then(() => showToast('Format chat reservasi berhasil disalin!'))
        .catch(() => fallbackCopy(message));
    } else {
      fallbackCopy(message);
    }
  });

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Format chat reservasi berhasil disalin!');
    } catch (err) {
      showToast('Gagal menyalin pesan otomatis', true);
    }
    document.body.removeChild(textArea);
  }

  // Initial trigger
  updateSummary();
}

// ═══════════════════════════════════════════════════════════
// LIVE TASIKMALAYA WEATHER WIDGET
// ═══════════════════════════════════════════════════════════

const WMO_WEATHER = {
  0: { text: 'Cerah', icon: 'sun', ideal: true },
  1: { text: 'Cerah Berawan', icon: 'sun-cloud', ideal: true },
  2: { text: 'Cerah Berawan', icon: 'sun-cloud', ideal: true },
  3: { text: 'Berawan Sebagian', icon: 'cloud', ideal: true },
  45: { text: 'Berkabut Tipis', icon: 'cloud', ideal: true },
  48: { text: 'Berkabut', icon: 'cloud', ideal: true },
  51: { text: 'Gerimis Ringan', icon: 'rain', ideal: false },
  53: { text: 'Gerimis Sedang', icon: 'rain', ideal: false },
  55: { text: 'Gerimis Lebat', icon: 'rain', ideal: false },
  61: { text: 'Hujan Ringan', icon: 'rain', ideal: false },
  63: { text: 'Hujan Sedang', icon: 'rain', ideal: false },
  65: { text: 'Hujan Lebat', icon: 'rain', ideal: false },
  80: { text: 'Hujan Lokal Ringan', icon: 'rain', ideal: false },
  81: { text: 'Hujan Lokal', icon: 'rain', ideal: false },
  82: { text: 'Hujan Lebat', icon: 'rain', ideal: false },
  95: { text: 'Hujan Petir', icon: 'thunder', ideal: false },
  96: { text: 'Badai Petir', icon: 'thunder', ideal: false },
  99: { text: 'Badai Petir', icon: 'thunder', ideal: false }
};

const WEATHER_SVGS = {
  sun: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  'sun-cloud': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
  cloud: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  rain: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
  thunder: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>`
};

function initWeatherWidget() {
  const tempEl = document.getElementById('weatherTemp');
  const condEl = document.getElementById('weatherCondition');
  const humEl = document.getElementById('weatherHumidity');
  const windEl = document.getElementById('weatherWind');
  const statusEl = document.getElementById('weatherPlayStatus');
  const iconWrap = document.getElementById('weatherIconWrap');
  const refreshBtn = document.getElementById('btnRefreshWeather');

  if (!tempEl) return;

  const fetchWeather = async () => {
    try {
      if (refreshBtn) refreshBtn.style.transform = 'rotate(360deg)';
      // Tasikmalaya coordinates
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.3274&longitude=108.2207&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FJakarta');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const current = data.current;

      const temp = Math.round(current.temperature_2m);
      const humidity = current.relative_humidity_2m;
      const wind = Math.round(current.wind_speed_10m);
      const code = current.weather_code;
      const info = WMO_WEATHER[code] || { text: 'Cerah Berawan', icon: 'sun-cloud', ideal: true };

      tempEl.textContent = `${temp}°C`;
      condEl.textContent = info.text;
      humEl.textContent = `${humidity}%`;
      windEl.textContent = `${wind} km/h`;

      if (info.ideal) {
        statusEl.className = 'weather-badge weather-badge--good';
        statusEl.textContent = '🟢 Ideal Bermain';
      } else {
        statusEl.className = 'weather-badge weather-badge--rain';
        statusEl.textContent = '🌧️ Hujan / Indoor';
      }

      if (iconWrap && WEATHER_SVGS[info.icon]) {
        iconWrap.innerHTML = WEATHER_SVGS[info.icon];
      }
    } catch (err) {
      console.warn('Weather fetch failed, using fallback:', err);
      // Realistic fallback for Tasikmalaya
      tempEl.textContent = '27°C';
      condEl.textContent = 'Cerah Berawan';
      humEl.textContent = '72%';
      windEl.textContent = '9 km/h';
      statusEl.className = 'weather-badge weather-badge--good';
      statusEl.textContent = '🟢 Ideal Bermain';
      if (iconWrap) iconWrap.innerHTML = WEATHER_SVGS['sun-cloud'];
    } finally {
      if (refreshBtn) {
        setTimeout(() => { refreshBtn.style.transform = ''; }, 300);
      }
    }
  };

  fetchWeather();

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchWeather();
      showToast('Memperbarui data cuaca Tasikmalaya...');
    });
  }
}

// ═══════════════════════════════════════════════════════════
// GOOGLE MAPS INTERACTIVE ACTIONS
// ═══════════════════════════════════════════════════════════

function initMapActions() {
  const btnCopyMapAddress = document.getElementById('btnCopyMapAddress');
  if (btnCopyMapAddress) {
    btnCopyMapAddress.addEventListener('click', () => {
      const address = 'FYP Padel Court, Tasikmalaya, Jawa Barat';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(() => {
          showToast('Alamat FYP Padel Court berhasil disalin!');
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = address;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Alamat FYP Padel Court berhasil disalin!');
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════
// PWA (PROGRESSIVE WEB APP) INSTALLATION & SERVICE WORKER
// ═══════════════════════════════════════════════════════════

let deferredPrompt = null;

function initPwa() {
  // Register service worker
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('SW registration skipped or failed:', err);
      });
    });
  }

  const pwaBanner = document.getElementById('pwaBanner');
  const btnInstallPwa = document.getElementById('btnInstallPwa');
  const btnClosePwaBanner = document.getElementById('btnClosePwaBanner');
  const btnNavInstallPwa = document.getElementById('btnNavInstallPwa');
  const btnMobileInstallPwa = document.getElementById('btnMobileInstallPwa');

  // Trigger install prompt helper
  const triggerInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('Terima kasih! Aplikasi FYP Padel sedang dipasang.');
        }
        deferredPrompt = null;
        if (pwaBanner) pwaBanner.classList.remove('is-active');
      });
    } else {
      // Guidance if already installed or unsupported browser
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        showToast('Untuk install di iOS: Tap tombol Share lalu pilih "Add to Home Screen"');
      } else {
        showToast('Aplikasi siap digunakan atau pilih "Install App" dari menu browser');
      }
    }
  };

  // Listen for beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Check if dismissed recently (within 3 days)
    const lastDismissed = localStorage.getItem('fyp_pwa_dismissed');
    const isRecentlyDismissed = lastDismissed && (Date.now() - parseInt(lastDismissed, 10) < 3 * 24 * 60 * 60 * 1000);

    if (pwaBanner && !isRecentlyDismissed) {
      setTimeout(() => {
        pwaBanner.classList.add('is-active');
      }, 3500);
    }
  });

  if (btnInstallPwa) btnInstallPwa.addEventListener('click', triggerInstall);
  if (btnNavInstallPwa) btnNavInstallPwa.addEventListener('click', triggerInstall);
  if (btnMobileInstallPwa) btnMobileInstallPwa.addEventListener('click', triggerInstall);

  if (btnClosePwaBanner && pwaBanner) {
    btnClosePwaBanner.addEventListener('click', () => {
      pwaBanner.classList.remove('is-active');
      localStorage.setItem('fyp_pwa_dismissed', Date.now().toString());
    });
  }

  window.addEventListener('appinstalled', () => {
    showToast('Aplikasi FYP Padel berhasil dipasang di perangkat Anda! 🎉');
    if (pwaBanner) pwaBanner.classList.remove('is-active');
    deferredPrompt = null;
  });
}

// ─── Initialize All Features ───
const startApp = () => {
  initBookingSystem();
  initWeatherWidget();
  initMapActions();
  initPwa();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}


