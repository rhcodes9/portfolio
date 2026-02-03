// Helpers
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

const body = document.body;

/* =========================
   Year (safe)
========================= */
(() => {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

/* =========================
   Theme Toggle (your HTML: #themeToggle)
   - saves to localStorage
   - updates aria-pressed + button label
========================= */
(() => {
  const btn = $("#themeToggle");
  if (!btn) return;

  const apply = (mode) => {
    const isDark = mode === "dark";
    body.classList.toggle("dark", isDark);
    btn.setAttribute("aria-pressed", String(isDark));
    btn.textContent = isDark ? "Light Mode" : "Dark Mode";
  };

  // load saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") apply(saved);
  else apply("light");

  btn.addEventListener("click", () => {
    const next = body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", next);
    apply(next);
  });
})();

/* =========================
   ✅ Project Cards -> Open GitHub
   - Requires: .project-card + data-url in HTML
========================= */
(() => {
  const cards = $$(".project-card");
  if (cards.length === 0) return;

  const open = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  cards.forEach(card => {
    card.addEventListener("click", () => open(card.dataset.url));

    // keyboard support (Enter/Space)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(card.dataset.url);
      }
    });
  });
})();

/* =========================
   Gallery Prev/Next
   - supports #gTrack (your HTML)
   - also supports #gtrack (if you accidentally used lowercase before)
========================= */
(() => {
  const track = $("#gTrack") || $("#gtrack");
  const prev = $("#gPrev");
  const next = $("#gNext");
  if (!track || !prev || !next) return;

  const step = () => Math.max(260, Math.min(420, track.clientWidth * 0.7));

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });

  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") track.scrollBy({ left: -step(), behavior: "smooth" });
    if (e.key === "ArrowRight") track.scrollBy({ left: step(), behavior: "smooth" });
  });
})();

/* =========================
   Slider Modal
   - Open buttons: [data-open-slider]
   - Controls: #prevBtn #nextBtn #closeBtn
   - Dots container: #dots
   - Slides track: #track
========================= */
(() => {
  const overlay = $("#overlay");
  const track = $("#track");
  const dotsWrap = $("#dots");
  const btnPrev = $("#prevBtn");
  const btnNext = $("#nextBtn");
  const btnClose = $("#closeBtn");
  const openBtns = $$("[data-open-slider]");

  // If any required element missing, just skip without errors
  if (!overlay || !track || !dotsWrap || !btnPrev || !btnNext || !btnClose || openBtns.length === 0) return;

  const slides = $$(".slide", track);
  if (slides.length === 0) return;

  let index = 0;

  // Create dots
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dot" + (i === 0 ? " active" : "");
    b.dataset.i = String(i);
    b.setAttribute("aria-label", `Slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });

  const dots = $$(".dot", dotsWrap);

  function goTo(i) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transform = `translateX(${-100 * index}%)`;

    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");

    // disable buttons at ends (nice UX)
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === slides.length - 1;
  }

  function open() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    goTo(0);
  }

  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  openBtns.forEach(b => b.addEventListener("click", open));
  btnClose.addEventListener("click", close);
  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  // Click outside modal closes it
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // initialize button states
  goTo(0);
})();
