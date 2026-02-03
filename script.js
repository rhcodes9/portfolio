// -------- Helpers --------
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

// -------- Year --------
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -------- Theme Toggle --------
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light");

function updateThemeButton(){
  const isLight = document.body.classList.contains("light");
  if (!themeToggle) return;
  themeToggle.textContent = isLight ? "Dark Mode" : "Light Mode";
  themeToggle.setAttribute("aria-pressed", String(!isLight));
}
updateThemeButton();

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  updateThemeButton();
});

// -------- Project Cards (click + keyboard) --------
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

// -------- Gallery Buttons --------
const gTrack = $("#gTrack");
$("#gPrev")?.addEventListener("click", () => gTrack?.scrollBy({ left: -280, behavior: "smooth" }));
$("#gNext")?.addEventListener("click", () => gTrack?.scrollBy({ left:  280, behavior: "smooth" }));

// -------- Slider / Modal --------
const overlay = $("#overlay");
const track = $("#track");
const dotsWrap = $("#dots");
const openBtns = $$("[data-open-slider]");
const closeBtn = $("#closeBtn");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

let index = 0;

function slideCount(){
  return track ? track.children.length : 0;
}

function renderDots(){
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  const count = slideCount();
  for (let i=0; i<count; i++){
    const d = document.createElement("div");
    d.className = "dot" + (i === index ? " active" : "");
    d.addEventListener("click", () => { index = i; updateSlider(); });
    dotsWrap.appendChild(d);
  }
}

function updateSlider(){
  if (!track) return;
  track.style.transform = `translateX(-${index * 100}%)`;
  renderDots();
}

function openModal(){
  if (!overlay) return;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  index = 0;
  updateSlider();
}

function closeModal(){
  if (!overlay) return;
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

openBtns.forEach(b => b.addEventListener("click", openModal));
closeBtn?.addEventListener("click", closeModal);

overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (!overlay?.classList.contains("show")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") prevBtn?.click();
  if (e.key === "ArrowRight") nextBtn?.click();
});

prevBtn?.addEventListener("click", () => {
  const count = slideCount();
  if (!count) return;
  index = (index - 1 + count) % count;
  updateSlider();
});

nextBtn?.addEventListener("click", () => {
  const count = slideCount();
  if (!count) return;
  index = (index + 1) % count;
  updateSlider();
});

// -------- Scroll Animations (reveal on scroll) --------
const revealTargets = [
  ...document.querySelectorAll(".card"),
  ...document.querySelectorAll(".mini-card"),
  ...document.querySelectorAll(".gslider"),
];

revealTargets.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      io.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => io.observe(el));
