/* ── NAVBAR SCROLL ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER MENU ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


/* ── ANIMATED COUNTERS ───────────────────────────────────────── */
const statCards = document.querySelectorAll('.stat-card');
const statNums  = [document.getElementById('stat0'), document.getElementById('stat1'),
                   document.getElementById('stat2'), document.getElementById('stat3')];

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el, target, suffix, duration = 1800) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const decimals  = isDecimal ? String(target).split('.')[1].length : 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = easeOutCubic(progress) * target;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsSection  = document.querySelector('.stats');
let   statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statCards.forEach((card, i) => {
      const target = parseFloat(card.dataset.target);
      const suffix = card.dataset.suffix;
      animateCounter(statNums[i], target, suffix);
    });
  }
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

/* ── FADE-UP SCROLL ANIMATIONS ───────────────────────────────── */
document.querySelectorAll(
  '.service-card, .step, .testi-card, .stat-card, .about-chart, .about-copy, .contact-info, .contact-form, .mini-card'
).forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 60}ms`;
  fadeObserver.observe(el);
});

/* ── FAQ ACCORDION ───────────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    
    // Close other items
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      const answer = item.querySelector('.faq-answer');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ── RESOURCES MODAL ─────────────────────────────────────────── */
const resourceModal = document.getElementById('resourceModal');
const btnModalClose = document.getElementById('btnModalClose');
const resourceForm = document.getElementById('resourceForm');
const modalSuccess = document.getElementById('modalSuccess');
const modalBadge = document.getElementById('modalBadge');
const modalResourceTitle = document.getElementById('modalResourceTitle');

document.querySelectorAll('.btn-download').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const type = btn.getAttribute('data-type') || 'PDF Whitepaper';
    const title = btn.getAttribute('data-title') || 'Microstructure Alpha in SA Equities';
    
    modalBadge.textContent = type;
    modalResourceTitle.textContent = title;
    
    // Reset form states
    resourceForm.style.display = 'flex';
    modalSuccess.style.display = 'none';
    resourceForm.reset();
    
    resourceModal.classList.add('show');
  });
});

btnModalClose.addEventListener('click', () => {
  resourceModal.classList.remove('show');
});

resourceModal.addEventListener('click', (e) => {
  if (e.target === resourceModal) {
    resourceModal.classList.remove('show');
  }
});

resourceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = resourceForm.querySelector('.btn');
  btn.textContent = 'Preparing Download…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Request Resource';
    btn.disabled = false;
    resourceForm.style.display = 'none';
    modalSuccess.style.display = 'flex';
  }, 1000);
});

/* ── INTERACTIVE PANEL TABS ──────────────────────────────────── */
const btnTabAssessment = document.getElementById('btnTabAssessment');
const btnTabScheduler = document.getElementById('btnTabScheduler');
const tabContentAssessment = document.getElementById('tabContentAssessment');
const tabContentScheduler = document.getElementById('tabContentScheduler');

btnTabAssessment.addEventListener('click', () => {
  btnTabAssessment.classList.add('active');
  btnTabScheduler.classList.remove('active');
  tabContentAssessment.classList.add('show');
  tabContentScheduler.classList.remove('show');
});

btnTabScheduler.addEventListener('click', () => {
  btnTabScheduler.classList.add('active');
  btnTabAssessment.classList.remove('active');
  tabContentScheduler.classList.add('show');
  tabContentAssessment.classList.remove('show');
});

/* ── FUNDING READINESS WIZARD ────────────────────────────────── */
const wizardForm = document.getElementById('assessmentWizard');
const wizardSteps = wizardForm.querySelectorAll('.wizard-step');
const btnWizardBack = document.getElementById('btnWizardBack');
const btnWizardNext = document.getElementById('btnWizardNext');
const wizardProgress = document.getElementById('wizardProgress');
const stepCounter = document.getElementById('stepCounter');
const wizardResult = document.getElementById('wizardResult');

let currentStep = 1;
const totalSteps = 3;

const channelMap = {
  'Business Plan':   { channels: 'Commercial Banks, DFIs',   timeline: '4–8 weeks'  },
  'Government Fund': { channels: 'SEFA, NEF, IDC',           timeline: '6–10 weeks' },
  'Bank Loan':       { channels: 'Major Commercial Banks',    timeline: '3–6 weeks'  },
  'Investor':        { channels: 'Venture Capital, Angels',   timeline: '8–16 weeks' },
};

function updateWizard() {
  wizardSteps.forEach(step => {
    step.classList.toggle('show', parseInt(step.dataset.step) === currentStep);
  });
  wizardProgress.style.width = `${(currentStep / totalSteps) * 100}%`;
  stepCounter.textContent = `Step ${currentStep} of ${totalSteps}`;
  btnWizardBack.disabled = (currentStep === 1);
  btnWizardNext.textContent = currentStep === totalSteps ? 'Submit' : 'Next';
}

btnWizardBack.addEventListener('click', () => {
  if (currentStep > 1) { currentStep--; updateWizard(); }
});

btnWizardNext.addEventListener('click', () => {
  const activeStepEl = wizardForm.querySelector(`.wizard-step[data-step="${currentStep}"]`);
  const inputs = activeStepEl.querySelectorAll('input[required], select[required]');
  let valid = true;
  inputs.forEach(inp => { if (!inp.value) { inp.reportValidity(); valid = false; } });
  if (!valid) return;

  if (currentStep < totalSteps) {
    currentStep++;
    updateWizard();
  } else {
    const email     = document.getElementById('wizardEmail').value;
    const objective = wizardForm.querySelector('input[name="objective"]:checked').value;
    const stage     = document.getElementById('assessStage').value;
    const info      = channelMap[objective] || { channels: 'SEFA, NEF, IDC', timeline: '6–10 weeks' };
    const readiness = stage.startsWith('Start-up') ? 'Pre-qualification review required' : 'Good — eligible to apply';

    document.getElementById('resMandate').textContent  = objective;
    document.getElementById('resSharpe').textContent   = info.channels;
    document.getElementById('resSortino').textContent  = info.timeline;
    document.getElementById('resDrawdown').textContent = readiness;
    document.getElementById('resEmail').textContent    = email;

    wizardForm.style.display = 'none';
    wizardResult.style.display = 'flex';
    document.querySelector('#tabContentAssessment .wizard-header').style.display = 'none';
  }
});

document.getElementById('btnGoToBooking').addEventListener('click', () => {
  // Move to Scheduler Tab
  btnTabScheduler.click();
});

/* ── ZOOM SCHEDULER WIDGET ───────────────────────────────────── */
const calendarMonthYear = document.getElementById('calendarMonthYear');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const timeSlotsGrid = document.getElementById('timeSlotsGrid');
const selectedTimeText = document.getElementById('selectedTimeText');
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const bookingDateInput = document.getElementById('bookingDate');
const bookingTimeInput = document.getElementById('bookingTime');
const btnSubmitBooking = document.getElementById('btnSubmitBooking');

let bookingYear = 2026;
let bookingMonth = 5; // 0-indexed, so 5 is June
const monthsNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let selectedDateStr = '';
let selectedTimeStr = '';

function buildCalendar() {
  calendarMonthYear.textContent = `${monthsNames[bookingMonth]} ${bookingYear}`;
  calendarDays.innerHTML = '';
  
  // First day of month
  const firstDayIndex = new Date(bookingYear, bookingMonth, 1).getDay();
  // Get previous month days count
  const prevDaysCount = new Date(bookingYear, bookingMonth, 0).getDate();
  // Current month days count
  const currentDaysCount = new Date(bookingYear, bookingMonth + 1, 0).getDate();
  
  // Calculate empty starting cells (we want Monday first)
  // JS getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday.
  let startOffset = firstDayIndex - 1;
  if (startOffset < 0) startOffset = 6; // Sunday
  
  // Render empty leading days from previous month
  for (let x = startOffset; x > 0; x--) {
    const btn = document.createElement('button');
    btn.className = 'calendar-day-btn disabled';
    btn.textContent = prevDaysCount - x + 1;
    btn.disabled = true;
    calendarDays.appendChild(btn);
  }
  
  // Render current month days
  // We restrict booking dates to weekdays (Monday-Friday) only for professionalism
  const today = new Date();
  
  for (let i = 1; i <= currentDaysCount; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calendar-day-btn';
    btn.textContent = i;
    
    const cellDate = new Date(bookingYear, bookingMonth, i);
    const dayOfWeek = cellDate.getDay();
    
    // Check if weekend or past date
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isPast = cellDate < today && cellDate.toDateString() !== today.toDateString();
    
    if (isWeekend || isPast) {
      btn.className += ' disabled';
      btn.disabled = true;
    } else {
      // Highlight today
      if (cellDate.toDateString() === today.toDateString()) {
        btn.className += ' today';
      }
      
      btn.addEventListener('click', () => {
        calendarDays.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        selectedDateStr = `${bookingYear}-${String(bookingMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        bookingDateInput.value = selectedDateStr;
        updateBookingState();
      });
    }
    
    calendarDays.appendChild(btn);
  }
}

function updateBookingState() {
  if (selectedDateStr && selectedTimeStr) {
    const formattedDate = new Date(selectedDateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    selectedTimeText.textContent = `Selected: ${formattedDate} at ${selectedTimeStr} SAST`;
    btnSubmitBooking.disabled = false;
  } else {
    selectedTimeText.textContent = 'Please select both a date and a time slot above.';
    btnSubmitBooking.disabled = true;
  }
}

// Nav Month Buttons
prevMonthBtn.addEventListener('click', () => {
  const currentLimit = new Date();
  if (bookingYear > currentLimit.getFullYear() || (bookingYear === currentLimit.getFullYear() && bookingMonth > currentLimit.getMonth())) {
    bookingMonth--;
    if (bookingMonth < 0) {
      bookingMonth = 11;
      bookingYear--;
    }
    buildCalendar();
    // Disable prev button if current month
    if (bookingYear === currentLimit.getFullYear() && bookingMonth === currentLimit.getMonth()) {
      prevMonthBtn.disabled = true;
    }
  }
});

nextMonthBtn.addEventListener('click', () => {
  bookingMonth++;
  if (bookingMonth > 11) {
    bookingMonth = 0;
    bookingYear++;
  }
  buildCalendar();
  prevMonthBtn.disabled = false;
});

// Time Slot Click
timeSlotsGrid.querySelectorAll('.slot-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    timeSlotsGrid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTimeStr = btn.getAttribute('data-time') + ' ' + (btn.textContent.includes('AM') ? 'AM' : 'PM');
    bookingTimeInput.value = btn.getAttribute('data-time');
    updateBookingState();
  });
});

// Handle Booking Form Submit
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formattedDate = new Date(selectedDateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const fundingType = document.getElementById('bookFundingType').value;
  document.getElementById('summaryFunding').textContent = fundingType || 'Funding Consultation';
  document.getElementById('summaryDateTime').textContent = `${formattedDate} at ${selectedTimeStr} SAST`;
  
  const submitBtn = bookingForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Booking Slot…';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    submitBtn.textContent = 'Confirm Booking';
    submitBtn.disabled = false;
    bookingForm.style.display = 'none';
    document.querySelector('.scheduler-widget').style.display = 'none';
    document.querySelector('.scheduler-header').style.display = 'none';
    bookingSuccess.style.display = 'flex';
  }, 1200);
});

// Reset Booking
document.getElementById('btnResetBooking').addEventListener('click', () => {
  bookingForm.reset();
  bookingForm.style.display = 'flex';
  document.querySelector('.scheduler-widget').style.display = 'grid';
  document.querySelector('.scheduler-header').style.display = 'block';
  bookingSuccess.style.display = 'none';
  selectedDateStr = '';
  selectedTimeStr = '';
  calendarDays.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('selected'));
  timeSlotsGrid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  updateBookingState();
});

// Initialize Calendar
buildCalendar();


/* ── SMOOTH ACTIVE NAV HIGHLIGHT ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = '#c9a84c';
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));
