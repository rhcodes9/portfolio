// ===== Helpers =====
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

// ===== Footer Year =====
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Theme Toggle =====
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") document.body.classList.add("dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  });

  // set initial text
  const isDarkNow = document.body.classList.contains("dark");
  themeToggle.setAttribute("aria-pressed", String(isDarkNow));
  themeToggle.textContent = isDarkNow ? "Light Mode" : "Dark Mode";
}

// ===== Project Cards Click =====
$$(".project-card").forEach(card => {
  const open = () => {
    const url = card.getAttribute("data-url");
    if (url) window.open(url, "_blank", "noopener");
  };
  card.addEventListener("click", open);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
});

// ===== Modal Slider =====
const overlay = $("#overlay");
const track = $("#track");
const dotsWrap = $("#dots");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const closeBtn = $("#closeBtn");
const openBtns = $$("[data-open-slider]");

let slideIndex = 0;

function slides() {
  return track ? $$(".slide", track) : [];
}

function setSlide(i) {
  const s = slides();
  if (!track || s.length === 0) return;

  slideIndex = Math.max(0, Math.min(i, s.length - 1));
  track.style.transform = `translateX(-${slideIndex * 100}%)`;

  // dots
  if (dotsWrap) {
    $$(".dot", dotsWrap).forEach((d, idx) => d.classList.toggle("active", idx === slideIndex));
  }

  // buttons
  if (prevBtn) prevBtn.disabled = slideIndex === 0;
  if (nextBtn) nextBtn.disabled = slideIndex === s.length - 1;
}

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides().forEach((_, idx) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "dot" + (idx === 0 ? " active" : "");
    d.setAttribute("aria-label", `Go to slide ${idx + 1}`);
    d.addEventListener("click", () => setSlide(idx));
    dotsWrap.appendChild(d);
  });
}

function openModal() {
  if (!overlay) return;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  slideIndex = 0;
  buildDots();
  setSlide(0);
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openBtns.forEach(btn => btn.addEventListener("click", openModal));
if (closeBtn) closeBtn.addEventListener("click", closeModal);

if (prevBtn) prevBtn.addEventListener("click", () => setSlide(slideIndex - 1));
if (nextBtn) nextBtn.addEventListener("click", () => setSlide(slideIndex + 1));

if (overlay) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (!overlay || !overlay.classList.contains("open")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") setSlide(slideIndex - 1);
  if (e.key === "ArrowRight") setSlide(slideIndex + 1);
});

// ===== Gallery Controls =====
const gTrack = $("#gTrack");
const gPrev = $("#gPrev");
const gNext = $("#gNext");

function scrollGallery(dir) {
  if (!gTrack) return;
  const amount = Math.max(240, Math.floor(gTrack.clientWidth * 0.8));
  gTrack.scrollBy({ left: dir * amount, behavior: "smooth" });
}

if (gPrev) gPrev.addEventListener("click", () => scrollGallery(-1));
if (gNext) gNext.addEventListener("click", () => scrollGallery(1));
