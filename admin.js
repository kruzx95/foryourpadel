/* ═══════════════════════════════════════════════════════════
   FOR YOU PADEL — Admin Dashboard Logic
   Integrates with Supabase (with fallback to Mock/LocalStorage)
   ═══════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js';

// ─── Initial State & Mock Data ───
const COURTS = [
  { id: 'c1', code: 'court-1', name: 'Court 1 — Panoramic WPT', type: 'Panoramic' },
  { id: 'c2', code: 'court-2', name: 'Court 2 — Standard Pro A', type: 'Standard' },
  { id: 'c3', code: 'court-3', name: 'Court 3 — Standard Pro B', type: 'Standard' }
];

const DEFAULT_SLOTS = [
  '06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00',
  '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00',
  '18:00 - 20:00', '20:00 - 22:00', '22:00 - 23:00'
];

const MOCK_BOOKINGS = [
  {
    id: 'b-101',
    booking_code: 'FYP-20261001-A1',
    customer_name: 'Reza Pratama',
    customer_phone: '6281234567890',
    court_name: 'Court 1 — Panoramic WPT',
    booking_date: new Date().toISOString().split('T')[0],
    time_slot: '18:00 - 20:00',
    duration: 2,
    rackets_count: 2,
    balls_count: 1,
    total_amount: 645000,
    payment_status: 'paid_full',
    notes: 'Sparring kantor'
  },
  {
    id: 'b-102',
    booking_code: 'FYP-20261001-B2',
    customer_name: 'Dinda Kirana',
    customer_phone: '6285712349999',
    court_name: 'Court 2 — Standard Pro A',
    booking_date: new Date().toISOString().split('T')[0],
    time_slot: '16:00 - 18:00',
    duration: 2,
    rackets_count: 0,
    balls_count: 0,
    total_amount: 360000,
    payment_status: 'paid_dp',
    notes: 'DP 50% via BCA'
  },
  {
    id: 'b-103',
    booking_code: 'FYP-20261001-C3',
    customer_name: 'Budi Santoso',
    customer_phone: '6281399887766',
    court_name: 'Court 3 — Standard Pro B',
    booking_date: new Date().toISOString().split('T')[0],
    time_slot: '20:00 - 22:00',
    duration: 2,
    rackets_count: 4,
    balls_count: 2,
    total_amount: 810000,
    payment_status: 'pending',
    notes: 'Konfirmasi via WA pending'
  }
];

// ─── App Manager ───
class FYPAdminApp {
  constructor() {
    this.supabase = null;
    this.isLive = false;
    this.currentUser = null;
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.slotsData = {};
    this.bookings = [];
    this.tournamentData = {};
    
    this.init();
  }

  async init() {
    this.initSupabase();
    this.initAuth();
    this.bindEvents();
    this.loadData();
    this.renderAll();
  }

  // ─── Supabase Initialization ───
  initSupabase() {
    const savedUrl = localStorage.getItem('fyp_sb_url');
    const savedKey = localStorage.getItem('fyp_sb_key');

    if (savedUrl && savedKey) {
      try {
        this.supabase = createClient(savedUrl, savedKey);
        this.isLive = true;
      } catch (err) {
        console.error('Supabase init error:', err);
        this.isLive = false;
      }
    } else {
      this.isLive = false;
    }

    this.updateConnectionBadge();
  }

  updateConnectionBadge() {
    const badge = document.getElementById('connectionBadge');
    if (!badge) return;

    if (this.isLive) {
      badge.innerHTML = `
        <span class="connection-dot connection-dot--live"></span>
        <span>Supabase: <strong>Terhubung</strong></span>
      `;
    } else {
      badge.innerHTML = `
        <span class="connection-dot connection-dot--demo"></span>
        <span>Mode: <strong>Demo / Local</strong></span>
      `;
    }
  }

  // ─── Auth ───
  initAuth() {
    const sessionUser = localStorage.getItem('fyp_admin_session');
    if (sessionUser) {
      this.currentUser = JSON.parse(sessionUser);
      this.updateUserUI();
    } else {
      this.showLoginModal();
    }
  }

  showLoginModal() {
    const modal = document.getElementById('modalLogin');
    if (modal) modal.classList.add('is-open');
  }

  hideLoginModal() {
    const modal = document.getElementById('modalLogin');
    if (modal) modal.classList.remove('is-open');
  }

  updateUserUI() {
    const userEmailEl = document.getElementById('adminUserEmail');
    if (userEmailEl && this.currentUser) {
      userEmailEl.textContent = this.currentUser.email || 'Admin FYP';
    }
  }

  // ─── Data Loading ───
  loadData() {
    // 1. Slots
    const savedSlots = localStorage.getItem(`fyp_slots_${this.selectedDate}`);
    if (savedSlots) {
      this.slotsData = JSON.parse(savedSlots);
    } else {
      // Generate default available slots
      this.slotsData = {};
      COURTS.forEach(c => {
        this.slotsData[c.code] = {};
        DEFAULT_SLOTS.forEach(time => {
          this.slotsData[c.code][time] = {
            status: 'available',
            player: '',
            phone: '',
            notes: ''
          };
        });
      });
      // Mark default booked slots from mock
      MOCK_BOOKINGS.forEach(b => {
        if (b.booking_date === this.selectedDate) {
          const court = COURTS.find(c => c.name === b.court_name);
          if (court && this.slotsData[court.code] && this.slotsData[court.code][b.time_slot]) {
            this.slotsData[court.code][b.time_slot] = {
              status: 'booked',
              player: b.customer_name,
              phone: b.customer_phone,
              notes: b.notes
            };
          }
        }
      });
      this.saveSlots();
    }

    // 2. Bookings
    const savedBookings = localStorage.getItem('fyp_bookings');
    this.bookings = savedBookings ? JSON.parse(savedBookings) : [...MOCK_BOOKINGS];

    // 3. Tournament
    const savedTournament = localStorage.getItem('fyp_tournament_config');
    this.tournamentData = savedTournament ? JSON.parse(savedTournament) : {
      status: 'no_tournament',
      title: 'FYP Tasikmalaya Padel Championship 2026',
      dates: '18 - 19 Oktober 2026',
      prize: 'Rp 15.000.000',
      fee: 'Rp 350.000 / Tim',
      venue: 'FYP Padel Court Tasikmalaya'
    };
  }

  saveSlots() {
    localStorage.setItem(`fyp_slots_${this.selectedDate}`, JSON.stringify(this.slotsData));
  }

  saveBookings() {
    localStorage.setItem('fyp_bookings', JSON.stringify(this.bookings));
  }

  saveTournament() {
    localStorage.setItem('fyp_tournament_config', JSON.stringify(this.tournamentData));
  }

  // ─── Rendering ───
  renderAll() {
    this.renderMetrics();
    this.renderSlots();
    this.renderBookings();
    this.renderTournament();
    this.renderSettings();
  }

  renderMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = this.bookings.filter(b => b.booking_date === today);
    
    // Total Bookings
    const totalBookingsEl = document.getElementById('metricTotalBookings');
    if (totalBookingsEl) totalBookingsEl.textContent = todayBookings.length;

    // Slots Booked Count
    let bookedSlotsCount = 0;
    let totalSlotsCount = 0;
    Object.values(this.slotsData).forEach(courtSlots => {
      Object.values(courtSlots).forEach(slot => {
        totalSlotsCount++;
        if (slot.status === 'booked') bookedSlotsCount++;
      });
    });

    const slotsBookedEl = document.getElementById('metricSlotsBooked');
    if (slotsBookedEl) slotsBookedEl.textContent = `${bookedSlotsCount} / ${totalSlotsCount}`;

    // Revenue
    const revenue = todayBookings.reduce((sum, b) => sum + (b.payment_status !== 'cancelled' ? Number(b.total_amount) : 0), 0);
    const revenueEl = document.getElementById('metricRevenue');
    if (revenueEl) revenueEl.textContent = `Rp ${revenue.toLocaleString('id-ID')}`;

    // Tournament Status
    const tourneyStatusEl = document.getElementById('metricTournamentStatus');
    if (tourneyStatusEl) {
      const map = {
        no_tournament: 'Belum Ada',
        upcoming: 'Akan Datang',
        registration: 'Pendaftaran Dibuka',
        ongoing: 'Sedang Berlangsung',
        completed: 'Selesai'
      };
      tourneyStatusEl.textContent = map[this.tournamentData.status] || 'Belum Ada';
    }
  }

  renderSlots() {
    const container = document.getElementById('slotsMatrix');
    if (!container) return;

    container.innerHTML = COURTS.map(court => {
      const slots = this.slotsData[court.code] || {};
      const slotCards = Object.entries(slots).map(([time, data]) => {
        let statusLabel = 'Kosong';
        let badgeClass = 'admin-slot-card--available';
        if (data.status === 'booked') {
          statusLabel = 'Booked';
          badgeClass = 'admin-slot-card--booked';
        } else if (data.status === 'blocked') {
          statusLabel = 'Tutup / Maint.';
          badgeClass = 'admin-slot-card--blocked';
        }

        return `
          <div class="admin-slot-card ${badgeClass}" data-court="${court.code}" data-time="${time}">
            <div class="admin-slot-card__time">${time}</div>
            <div class="admin-slot-card__status">
              <span>${statusLabel}</span>
              ${data.status === 'booked' ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            ${data.player ? `<div class="admin-slot-card__player">${data.player}</div>` : ''}
          </div>
        `;
      }).join('');

      return `
        <div class="court-slot-column">
          <div class="court-slot-column__header">
            <div>
              <div class="court-slot-column__title">${court.name}</div>
              <small style="color:var(--muted);font-size:11px;">${court.type} Court</small>
            </div>
            <span class="court-slot-column__badge">${court.code.toUpperCase()}</span>
          </div>
          <div class="court-slot-list">
            ${slotCards}
          </div>
        </div>
      `;
    }).join('');

    // Bind click events on slot cards
    container.querySelectorAll('.admin-slot-card').forEach(card => {
      card.addEventListener('click', () => {
        const court = card.getAttribute('data-court');
        const time = card.getAttribute('data-time');
        this.openSlotModal(court, time);
      });
    });
  }

  openSlotModal(courtCode, timeSlot) {
    const slot = this.slotsData[courtCode][timeSlot];
    const court = COURTS.find(c => c.code === courtCode);

    document.getElementById('editSlotCourtName').textContent = court.name;
    document.getElementById('editSlotTime').textContent = timeSlot;
    document.getElementById('editSlotStatus').value = slot.status;
    document.getElementById('editSlotPlayer').value = slot.player || '';
    document.getElementById('editSlotPhone').value = slot.phone || '';
    document.getElementById('editSlotNotes').value = slot.notes || '';

    // Store active editing target
    this.activeEditSlot = { courtCode, timeSlot };

    const modal = document.getElementById('modalEditSlot');
    if (modal) modal.classList.add('is-open');
  }

  saveSlotModal() {
    if (!this.activeEditSlot) return;
    const { courtCode, timeSlot } = this.activeEditSlot;

    const status = document.getElementById('editSlotStatus').value;
    const player = document.getElementById('editSlotPlayer').value;
    const phone = document.getElementById('editSlotPhone').value;
    const notes = document.getElementById('editSlotNotes').value;

    this.slotsData[courtCode][timeSlot] = {
      status,
      player: status === 'booked' ? player : '',
      phone: status === 'booked' ? phone : '',
      notes
    };

    this.saveSlots();
    this.renderSlots();
    this.renderMetrics();
    this.showToast('Jadwal slot lapangan berhasil diperbarui!');

    const modal = document.getElementById('modalEditSlot');
    if (modal) modal.classList.remove('is-open');
  }

  renderBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;

    if (this.bookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--muted);">Belum ada data reservasi.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.bookings.map(b => {
      let badgeClass = 'status-badge--pending';
      let badgeLabel = 'Pending DP';
      if (b.payment_status === 'paid_dp') { badgeClass = 'status-badge--paid'; badgeLabel = 'DP Terbayar'; }
      if (b.payment_status === 'paid_full') { badgeClass = 'status-badge--completed'; badgeLabel = 'Lunas'; }
      if (b.payment_status === 'cancelled') { badgeClass = 'status-badge--cancelled'; badgeLabel = 'Batal'; }

      const waClean = (b.customer_phone || '').replace(/\D/g, '');
      const waLink = `https://wa.me/${waClean}?text=Halo%20kak%20${encodeURIComponent(b.customer_name)},%20mengenai%20booking%20FYP%20Padel%20tanggal%20${b.booking_date}...`;

      return `
        <tr>
          <td><strong style="color:#fff;font-size:12px;">${b.booking_code}</strong></td>
          <td>
            <div style="font-weight:700;color:#fff;">${b.booking_date}</div>
            <div style="font-size:11.5px;color:var(--muted);">${b.time_slot} (${b.duration} Jam)</div>
          </td>
          <td>${b.court_name}</td>
          <td>
            <div style="font-weight:700;color:#fff;">${b.customer_name}</div>
            <a href="${waLink}" target="_blank" class="wa-chat-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.076-1.127-.061-.284-.09-1.286-.474-2.45-1.512-1.5-1.336-1.615-2.033-1.696-2.261-.082-.228-.083-.497.082-.693.165-.197.362-.257.483-.257.121 0 .241.002.347.007.112.006.262-.042.409.311.15.361.512 1.25.557 1.341.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.09.091-.184.19-.079.371.105.182.467.77 1.002 1.246.689.613 1.27.803 1.452.894.182.091.288.076.394-.045.106-.121.454-.53.575-.712.121-.182.242-.151.409-.091.166.06 1.058.499 1.239.59.182.091.303.136.348.212.045.076.045.438-.099.843z"/></svg>
              ${b.customer_phone}
            </a>
          </td>
          <td>
            ${b.rackets_count ? `<span style="font-size:11px;background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;">${b.rackets_count} Raket</span>` : ''}
            ${b.balls_count ? `<span style="font-size:11px;background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;">${b.balls_count} Bola</span>` : ''}
            ${!b.rackets_count && !b.balls_count ? '<span style="color:var(--muted);font-size:12px;">Tanpa Addon</span>' : ''}
          </td>
          <td><strong style="color:var(--mint-light);">Rp ${Number(b.total_amount).toLocaleString('id-ID')}</strong></td>
          <td><span class="status-badge ${badgeClass}">${badgeLabel}</span></td>
          <td>
            <select class="form-select status-changer" data-id="${b.id}" style="padding:4px 8px;font-size:11.5px;border-radius:6px;">
              <option value="pending" ${b.payment_status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="paid_dp" ${b.payment_status === 'paid_dp' ? 'selected' : ''}>DP 50%</option>
              <option value="paid_full" ${b.payment_status === 'paid_full' ? 'selected' : ''}>Lunas</option>
              <option value="cancelled" ${b.payment_status === 'cancelled' ? 'selected' : ''}>Batal</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');

    // Bind status changer
    tbody.querySelectorAll('.status-changer').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
          booking.payment_status = newStatus;
          this.saveBookings();
          this.renderBookings();
          this.renderMetrics();
          this.showToast(`Status booking ${booking.booking_code} diubah.`);
        }
      });
    });
  }

  renderTournament() {
    const statusSelect = document.getElementById('tourneyStatusSelect');
    if (statusSelect) statusSelect.value = this.tournamentData.status;

    const titleInput = document.getElementById('tourneyTitleInput');
    if (titleInput) titleInput.value = this.tournamentData.title;

    const datesInput = document.getElementById('tourneyDatesInput');
    if (datesInput) datesInput.value = this.tournamentData.dates;

    const prizeInput = document.getElementById('tourneyPrizeInput');
    if (prizeInput) prizeInput.value = this.tournamentData.prize;

    const feeInput = document.getElementById('tourneyFeeInput');
    if (feeInput) feeInput.value = this.tournamentData.fee;
  }

  saveTournamentForm() {
    this.tournamentData = {
      status: document.getElementById('tourneyStatusSelect').value,
      title: document.getElementById('tourneyTitleInput').value,
      dates: document.getElementById('tourneyDatesInput').value,
      prize: document.getElementById('tourneyPrizeInput').value,
      fee: document.getElementById('tourneyFeeInput').value,
      venue: 'FYP Padel Court Tasikmalaya'
    };

    this.saveTournament();
    this.renderMetrics();
    this.showToast('Pengaturan Turnamen berhasil disimpan!');
  }

  renderSettings() {
    const urlInput = document.getElementById('supabaseUrlInput');
    const keyInput = document.getElementById('supabaseKeyInput');

    if (urlInput) urlInput.value = localStorage.getItem('fyp_sb_url') || '';
    if (keyInput) keyInput.value = localStorage.getItem('fyp_sb_key') || '';
  }

  saveSupabaseSettings() {
    const url = document.getElementById('supabaseUrlInput').value.trim();
    const key = document.getElementById('supabaseKeyInput').value.trim();

    if (url && key) {
      localStorage.setItem('fyp_sb_url', url);
      localStorage.setItem('fyp_sb_key', key);
      this.initSupabase();
      this.showToast('Konfigurasi Supabase disimpan & terhubung!');
    } else {
      localStorage.removeItem('fyp_sb_url');
      localStorage.removeItem('fyp_sb_key');
      this.isLive = false;
      this.updateConnectionBadge();
      this.showToast('Beralih ke mode Offline / LocalStorage.');
    }
  }

  // ─── Event Listeners ───
  bindEvents() {
    // Navigation Tabs
    const navItems = document.querySelectorAll('.admin-nav-item');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');
    const headerTitle = document.getElementById('headerTitle');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        navItems.forEach(i => i.classList.remove('is-active'));
        tabPanes.forEach(p => p.classList.remove('is-active'));

        item.classList.add('is-active');
        const targetPane = document.getElementById(`tab-${targetTab}`);
        if (targetPane) targetPane.classList.add('is-active');

        if (headerTitle) {
          const titles = {
            overview: 'Ringkasan & Metrik',
            slots: 'Manajemen Slot Lapangan',
            bookings: 'Daftar Reservasi Pemain',
            tournament: 'Pengaturan Turnamen',
            settings: 'Pengaturan & Koneksi Database'
          };
          headerTitle.textContent = titles[targetTab] || 'Dashboard';
        }

        // Close mobile drawer if open
        const sidebar = document.getElementById('adminSidebar');
        if (sidebar) sidebar.classList.remove('is-open');
      });
    });

    // Mobile burger
    const burgerBtn = document.getElementById('adminBurgerBtn');
    const sidebar = document.getElementById('adminSidebar');
    if (burgerBtn && sidebar) {
      burgerBtn.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });
    }

    // Date filters for slots
    const dateInput = document.getElementById('slotDatePicker');
    if (dateInput) {
      dateInput.value = this.selectedDate;
      dateInput.addEventListener('change', (e) => {
        this.selectedDate = e.target.value;
        this.loadData();
        this.renderSlots();
        this.renderMetrics();
      });
    }

    const btnSlotToday = document.getElementById('btnSlotToday');
    const btnSlotTomorrow = document.getElementById('btnSlotTomorrow');
    if (btnSlotToday) {
      btnSlotToday.addEventListener('click', () => {
        this.selectedDate = new Date().toISOString().split('T')[0];
        if (dateInput) dateInput.value = this.selectedDate;
        this.loadData();
        this.renderSlots();
        this.renderMetrics();
      });
    }
    if (btnSlotTomorrow) {
      btnSlotTomorrow.addEventListener('click', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.selectedDate = tomorrow.toISOString().split('T')[0];
        if (dateInput) dateInput.value = this.selectedDate;
        this.loadData();
        this.renderSlots();
        this.renderMetrics();
      });
    }

    // Modal Edit Slot actions
    const btnSaveSlot = document.getElementById('btnSaveSlotModal');
    if (btnSaveSlot) btnSaveSlot.addEventListener('click', () => this.saveSlotModal());

    const btnCloseSlotModal = document.getElementById('btnCloseSlotModal');
    if (btnCloseSlotModal) {
      btnCloseSlotModal.addEventListener('click', () => {
        document.getElementById('modalEditSlot').classList.remove('is-open');
      });
    }

    // Modal Tambah Booking Manual
    const btnOpenAddBooking = document.getElementById('btnOpenAddBooking');
    const modalAddBooking = document.getElementById('modalAddBooking');
    if (btnOpenAddBooking && modalAddBooking) {
      btnOpenAddBooking.addEventListener('click', () => {
        modalAddBooking.classList.add('is-open');
      });
    }
    const btnCloseAddBooking = document.getElementById('btnCloseAddBooking');
    if (btnCloseAddBooking && modalAddBooking) {
      btnCloseAddBooking.addEventListener('click', () => {
        modalAddBooking.classList.remove('is-open');
      });
    }

    const formAddBooking = document.getElementById('formAddBooking');
    if (formAddBooking) {
      formAddBooking.addEventListener('submit', (e) => {
        e.preventDefault();
        const courtName = document.getElementById('manualCourt').value;
        const customerName = document.getElementById('manualName').value;
        const customerPhone = document.getElementById('manualPhone').value;
        const bookingDate = document.getElementById('manualDate').value;
        const timeSlot = document.getElementById('manualTime').value;
        const duration = Number(document.getElementById('manualDuration').value) || 2;
        const rackets = Number(document.getElementById('manualRackets').value) || 0;
        const balls = Number(document.getElementById('manualBalls').value) || 0;
        const status = document.getElementById('manualStatus').value;
        const notes = document.getElementById('manualNotes').value;

        // Price calculation: basic rate 200k/hr + addons
        const courtRate = 200000;
        const totalAmount = (courtRate * duration) + (rackets * 35000) + (balls * 85000);

        const newBooking = {
          id: 'b-' + Date.now(),
          booking_code: `FYP-${bookingDate.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
          court_name: courtName,
          customer_name: customerName,
          customer_phone: customerPhone,
          booking_date: bookingDate,
          time_slot: timeSlot,
          duration,
          rackets_count: rackets,
          balls_count: balls,
          total_amount: totalAmount,
          payment_status: status,
          notes: notes || 'Walk-in / input manual admin'
        };

        this.bookings.unshift(newBooking);
        this.saveBookings();

        // Also mark slot if date matches
        if (bookingDate === this.selectedDate) {
          const court = COURTS.find(c => c.name === courtName);
          if (court && this.slotsData[court.code] && this.slotsData[court.code][timeSlot]) {
            this.slotsData[court.code][timeSlot] = {
              status: 'booked',
              player: customerName,
              phone: customerPhone,
              notes
            };
            this.saveSlots();
          }
        }

        this.renderAll();
        modalAddBooking.classList.remove('is-open');
        this.showToast(`Booking ${newBooking.booking_code} berhasil dibuat!`);
        formAddBooking.reset();
      });
    }

    // Tournament Save
    const btnSaveTournament = document.getElementById('btnSaveTournament');
    if (btnSaveTournament) {
      btnSaveTournament.addEventListener('click', () => this.saveTournamentForm());
    }

    // Supabase Settings Save
    const btnSaveSupabase = document.getElementById('btnSaveSupabase');
    if (btnSaveSupabase) {
      btnSaveSupabase.addEventListener('click', () => this.saveSupabaseSettings());
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    const btnDemoLogin = document.getElementById('btnDemoLogin');

    if (btnDemoLogin) {
      btnDemoLogin.addEventListener('click', () => {
        this.currentUser = { email: 'admin@foryoupadel.com', role: 'admin_demo' };
        localStorage.setItem('fyp_admin_session', JSON.stringify(this.currentUser));
        this.updateUserUI();
        this.hideLoginModal();
        this.showToast('Login berhasil sebagai Demo Admin! 🎉');
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (this.isLive && this.supabase) {
          const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
          if (error) {
            this.showToast('Login gagal: ' + error.message, 'error');
          } else {
            this.currentUser = data.user;
            localStorage.setItem('fyp_admin_session', JSON.stringify(this.currentUser));
            this.updateUserUI();
            this.hideLoginModal();
            this.showToast('Login Supabase berhasil! 🚀');
          }
        } else {
          // Local fallback
          if (email && password) {
            this.currentUser = { email, role: 'admin' };
            localStorage.setItem('fyp_admin_session', JSON.stringify(this.currentUser));
            this.updateUserUI();
            this.hideLoginModal();
            this.showToast('Login berhasil! Selamat datang.');
          }
        }
      });
    }

    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        localStorage.removeItem('fyp_admin_session');
        this.currentUser = null;
        this.showLoginModal();
        this.showToast('Anda telah logout.');
      });
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'error' ? '#EF4444' : '#1FBE94'}" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Start Admin App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.fypAdmin = new FYPAdminApp();
});
