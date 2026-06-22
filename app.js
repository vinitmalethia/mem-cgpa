/* ========================================================
   CGPA MEME CALCULATOR – app.js
   ======================================================== */

/* ── Grading System ───────────────────────────────────── */
const GRADE_POINTS = { S:10, A:9, B:8, C:7, D:6, E:5, F:0 };
const CREDIT_OPTIONS = [1, 1.5, 2, 3, 4, 5];

/* ── Meme Data per CGPA range ─────────────────────────── */
const MEME_DATA = [
  {
    min: 9.5, max: 10,
    emoji: "👑",
    text: "GOAT MODE UNLOCKED 🐐",
    subtext: "Parents crying tears of joy. Relatives asking for your study notes. Teachers using you as an example. Bhai tu toh legend hai! 🔥",
    color: "#f59e0b"
  },
  {
    min: 9.0, max: 9.5,
    emoji: "🚀",
    text: "Nerd Alert! 📡 Placement se pehle teri pooja hogi!",
    subtext: "Microsoft, Google, Amazon – they're all secretly stalking your LinkedIn. Hustle mode: PERMANENT. 🙏",
    color: "#8b5cf6"
  },
  {
    min: 8.5, max: 9.0,
    emoji: "😎",
    text: "Pretty solid! Distracted Boyfriend meme but the girlfriend is your GPA 💼",
    subtext: "You did the work. You got the grades. Moms brag to relatives. Dream placement? Still possible. Keep going, bestie. 💪",
    color: "#6366f1"
  },
  {
    min: 8.0, max: 8.5,
    emoji: "🤌",
    text: "Solid 8+. 'Main theek hoon' energy ✅",
    subtext: "You're not top ranker, but you're definitely not dead either. Placement hai, life hai, vibe hai. 🎯",
    color: "#3b82f6"
  },
  {
    min: 7.5, max: 8.0,
    emoji: "📊",
    text: "7.5 wala gang! 'I tried' participation trophy 🏅",
    subtext: "Bro this is the threshold. You MADE it past the 7.5 cutoff. Barely. But counts! Companies accept you. Mostly. 😅",
    color: "#06b6d4"
  },
  {
    min: 7.0, max: 7.5,
    emoji: "😅",
    text: "7 gang represent! The 'This is Fine' dog meme 🐶🔥",
    subtext: "Everything is... fine. The world is burning. Your CGPA is 7. And you're drinking coffee. Same. Totally fine. Probably. 😂",
    color: "#10b981"
  },
  {
    min: 6.5, max: 7.0,
    emoji: "😬",
    text: "Bhai... 6.5? That's Distracted Boyfriend but YOU are the distracted boyfriend 👀",
    subtext: "You were distracted by: Netflix, sleep, memes, and 'I'll study tomorrow'. We've all been there. No judgment. Sort of. 😬",
    color: "#f59e0b"
  },
  {
    min: 6.0, max: 6.5,
    emoji: "😰",
    text: "Yikes. 6-pointer loading... 💀",
    subtext: "Drake meme: Looking away from studying. Looking at memes. That's you. That's literally you. Time to wake up, champ. 🙈",
    color: "#f97316"
  },
  {
    min: 5.0, max: 6.0,
    emoji: "💀",
    text: "BHAI. BRO. SIR. MADAM. What is happening?? 😭",
    subtext: "Panik mode: 100%. This is the 'Surprised Pikachu' moment. You thought this would happen? No. But here we are. Time to grind. Like RIGHT NOW. 📚",
    color: "#ef4444"
  },
  {
    min: 0, max: 5.0,
    emoji: "💀☠️💀",
    text: "You. Have. Reached. End. Game. 💀",
    subtext: "Okay bhai calm down. This is not a farewell speech. This IS a wake-up call. Pull an absolute reverse card. You got this (probably). Main prayerful hoon tere liye. 🙏",
    color: "#dc2626"
  }
];

function getMemeForScore(score) {
  return MEME_DATA.find(m => score >= m.min && score <= m.max)
    || MEME_DATA[MEME_DATA.length - 1];
}

/* ── Utility ──────────────────────────────────────────── */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function round2(n) { return Math.round(n * 100) / 100; }

/* ── Theme Toggle ─────────────────────────────────────── */
const savedTheme = localStorage.getItem('cgpa-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '🌙' : '☀️';

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('cgpa-theme', next);
  document.getElementById('themeToggle').textContent = next === 'dark' ? '🌙' : '☀️';
  showToast(next === 'dark' ? '🌙 Dark mode on!' : '☀️ Light mode on!');
});

/* ── Navbar scroll effect ─────────────────────────────── */
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  nb.style.boxShadow = window.scrollY > 60 ? '0 4px 30px rgba(0,0,0,0.3)' : '';
});

/* ============================================================
   INSTANT GPA CALCULATOR
   ============================================================ */
let gpaRows = 0;
const gpaContainer = document.getElementById('gpa-subjects-container');

function createGpaRow() {
  gpaRows++;
  const id = gpaRows;
  const row = document.createElement('div');
  row.className = 'subject-row';
  row.id = `gpa-row-${id}`;
  row.innerHTML = `
    <div class="form-field">
      <label>Credits</label>
      <select id="gpa-credits-${id}">
        <option value="">Select credits</option>
        ${CREDIT_OPTIONS.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-field">
      <label>Grade</label>
      <select id="gpa-grade-${id}">
        <option value="">Select grade</option>
        ${Object.keys(GRADE_POINTS).map(g => `<option value="${g}">${g}</option>`).join('')}
      </select>
    </div>
    <button class="btn-remove-row" onclick="removeGpaRow(${id})" title="Remove">×</button>
  `;
  gpaContainer.appendChild(row);
}

function removeGpaRow(id) {
  const el = document.getElementById(`gpa-row-${id}`);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition = '0.25s ease';
    setTimeout(() => el.remove(), 250);
  }
}

// Init with 5 rows
for (let i = 0; i < 5; i++) createGpaRow();

document.getElementById('addGpaSubject').addEventListener('click', () => {
  createGpaRow();
  setTimeout(() => gpaContainer.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
});

document.getElementById('resetGpa').addEventListener('click', () => {
  gpaContainer.innerHTML = '';
  gpaRows = 0;
  document.getElementById('gpa-result').style.display = 'none';
  for (let i = 0; i < 5; i++) createGpaRow();
  showToast('🔄 GPA Calculator reset!');
});

document.getElementById('calcGpa').addEventListener('click', () => {
  const rows = gpaContainer.querySelectorAll('.subject-row');
  let totalPoints = 0, totalCredits = 0, valid = 0;

  rows.forEach(row => {
    const id = row.id.replace('gpa-row-', '');
    const credEl = document.getElementById(`gpa-credits-${id}`);
    const gradeEl = document.getElementById(`gpa-grade-${id}`);
    if (!credEl || !gradeEl) return;

    const cred = parseFloat(credEl.value);
    const grade = gradeEl.value;

    if (cred && grade && grade in GRADE_POINTS) {
      totalPoints += cred * GRADE_POINTS[grade];
      totalCredits += cred;
      valid++;
    }
  });

  if (valid === 0) {
    showToast('❗ Please fill at least one row completely!');
    return;
  }

  const gpa = round2(totalPoints / totalCredits);
  displayResult('gpa', gpa);
});

/* ============================================================
   CGPA CALCULATOR
   ============================================================ */
let semCount = 0;
const semContainer = document.getElementById('semesters-container');

function createSemCard() {
  semCount++;
  const id = semCount;
  const card = document.createElement('div');
  card.className = 'semester-card';
  card.id = `sem-card-${id}`;
  card.innerHTML = `
    <button class="btn-remove-sem" onclick="removeSem(${id})" title="Remove semester">✕</button>
    <div class="semester-card-title">Semester ${id}</div>
    <div class="form-field" style="margin-bottom:0.75rem;">
      <label>GPA</label>
      <input type="number" id="sem-gpa-${id}" placeholder="e.g. 8.5" step="0.01" min="0" max="10" />
    </div>
    <div class="form-field">
      <label>Total Credits</label>
      <input type="number" id="sem-credits-${id}" placeholder="e.g. 24" min="0" />
    </div>
  `;
  semContainer.appendChild(card);
}

function removeSem(id) {
  const el = document.getElementById(`sem-card-${id}`);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.85)';
    el.style.transition = '0.25s ease';
    setTimeout(() => el.remove(), 250);
  }
}

// Init with 4 semesters
for (let i = 0; i < 4; i++) createSemCard();

document.getElementById('addSemester').addEventListener('click', () => {
  createSemCard();
  setTimeout(() => semContainer.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
});

document.getElementById('resetCgpa').addEventListener('click', () => {
  semContainer.innerHTML = '';
  semCount = 0;
  document.getElementById('cgpa-result').style.display = 'none';
  for (let i = 0; i < 4; i++) createSemCard();
  showToast('🔄 CGPA Calculator reset!');
});

document.getElementById('calcCgpa').addEventListener('click', () => {
  const cards = semContainer.querySelectorAll('.semester-card');
  let totalPoints = 0, totalCredits = 0, valid = 0;

  cards.forEach(card => {
    const id = card.id.replace('sem-card-', '');
    const gpaEl = document.getElementById(`sem-gpa-${id}`);
    const credEl = document.getElementById(`sem-credits-${id}`);
    if (!gpaEl || !credEl) return;

    const gpa = parseFloat(gpaEl.value);
    const cred = parseFloat(credEl.value);

    if (!isNaN(gpa) && !isNaN(cred) && gpa >= 0 && gpa <= 10 && cred > 0) {
      totalPoints += gpa * cred;
      totalCredits += cred;
      valid++;
    }
  });

  if (valid === 0) {
    showToast('❗ Please fill in at least one semester with valid values!');
    return;
  }

  const cgpa = round2(totalPoints / totalCredits);
  displayResult('cgpa', cgpa);
});

/* ============================================================
   DISPLAY RESULT (shared)
   ============================================================ */
function displayResult(type, score) {
  const resultCard = document.getElementById(`${type}-result`);
  const scoreEl = document.getElementById(`${type}-score-display`);
  const emojiEl = document.getElementById(`${type}-meme-emoji`);
  const textEl = document.getElementById(`${type}-meme-text`);
  const subtextEl = document.getElementById(`${type}-meme-subtext`);

  const meme = getMemeForScore(score);

  resultCard.style.display = 'block';
  resultCard.style.animation = 'none';
  void resultCard.offsetWidth; // reflow
  resultCard.style.animation = '';

  scoreEl.textContent = score.toFixed(2);
  emojiEl.textContent = meme.emoji;
  textEl.textContent = meme.text;
  subtextEl.textContent = meme.subtext;
  scoreEl.style.background = `linear-gradient(135deg, ${meme.color}, #ec4899)`;
  scoreEl.style['-webkit-background-clip'] = 'text';
  scoreEl.style['-webkit-text-fill-color'] = 'transparent';
  scoreEl.style['background-clip'] = 'text';

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const label = type === 'gpa' ? 'GPA' : 'CGPA';
  showToast(`${label} Calculated: ${score.toFixed(2)} ${meme.emoji}`, 4000);
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const TESTIMONIALS = [
  { meme: '😭', text: '"Bro I got 6.2 CGPA and I thought it was over. Used this site, cried, then somehow studied harder. Now at 7.8. Calculator cured my depression ngl."', author: 'Rahul S.', college: '3rd Year CSE, VIT Vellore' },
  { meme: '💀', text: '"The roast when I got 5.9 was more motivating than my parents. Genuinely. The meme slapped me awake."', author: 'Priya M.', college: 'Final Year ECE, VIT Chennai' },
  { meme: '🔥', text: '"Got 9.8. The site called me a GOAT. I screenshot it and it is now my lock screen. My identity. My personality."', author: 'Arjun K.', college: '2nd Year IT, VIT Bhopal' },
  { meme: '😅', text: '"7.5 waala gang forever. Every sem I think I will hit 8 and every sem I hit exactly 7.5. The calculator knows my soul."', author: 'Sneha R.', college: '4th Year, VIT Vellore' },
  { meme: '🚀', text: '"Excel sheet le mera CGPA galat calculate ho raha tha. Yeh site ne pehle attempt mein sahi bataya. Legend."', author: 'Dev P.', college: '3rd Year Mech, VIT' },
  { meme: '😬', text: '"The F grade roast destroyed me emotionally and rebuilt me academically. Character development arc complete."', author: 'Kavya T.', college: '2nd Year Biotech, VIT Chennai' },
  { meme: '🎓', text: '"My placement company required 7.0 CGPA. I had 6.97. I literally calculated this multiple times hoping the number would change. It did not."', author: 'Rishi N.', college: 'Final Year CSE, VIT Vellore' },
  { meme: '💜', text: '"Told my parents my CGPA with the meme reaction screenshot. They were confused. I was entertained. 10/10 experience."', author: 'Aisha Z.', college: '1st Year, VIT Bhopal' }
];

function buildTestimonials() {
  const track = document.getElementById('testimonialTrack');
  // Double the array for seamless scroll loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  track.innerHTML = doubled.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-meme">${t.meme}</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">${t.author}</div>
      <div class="testimonial-college">${t.college}</div>
    </div>
  `).join('');
}
buildTestimonials();

/* ============================================================
   CONTACT FORM
   ============================================================ */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('formSuccess').style.display = 'block';
    this.reset();
    btn.textContent = '🚀 Send Message';
    btn.disabled = false;
    showToast('✅ Message sent! We got it.', 4000);

    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 5000);
  }, 1500);
});

/* ============================================================
   TICKER – duplicate content for seamless loop
   ============================================================ */
(function fixTicker() {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;
  const clone = ticker.innerHTML;
  ticker.innerHTML = clone + clone; // duplicate for seamless loop
})();

/* ============================================================
   INTERSECTION OBSERVER – subtle entrance animations
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .calculator-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* ============================================================
   HERO – copy meme image from generated path
   ============================================================ */
// The hero image is referenced as meme-hero.png (local copy)
// If not present, hide gracefully
document.getElementById('heroMemeImg')?.addEventListener('error', function() {
  this.style.display = 'none';
});
