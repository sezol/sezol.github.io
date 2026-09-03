// === ACCURACY CHART (walkability project model progression) ===
// Real results from the walkability project, in the order they were tried.
const modelResults = [
  { label: "Naive Bayes", accuracy: 72 },
  { label: "Decision Tree", accuracy: 76 },
  { label: "Logistic Regression", accuracy: 81 },
  { label: "SVM (RBF)", accuracy: 84 },
  { label: "Random Forest", accuracy: 87 },
];

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function drawAccuracyChart() {
  const svg = document.getElementById("accuracy-chart");
  if (!svg) return;

  const width = 640, height = 260;
  const padLeft = 50, padRight = 20, padTop = 20, padBottom = 40;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const minY = 65, maxY = 90;

  const xFor = (i) => padLeft + (i / (modelResults.length - 1)) * plotW;
  const yFor = (v) => padTop + plotH - ((v - minY) / (maxY - minY)) * plotH;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // gridlines + y labels
  [70, 75, 80, 85, 90].forEach((v) => {
    const y = yFor(v);
    svg.appendChild(svgEl("line", { x1: padLeft, y1: y, x2: width - padRight, y2: y, stroke: "#DCE3DE", "stroke-width": 1 }));
    const label = svgEl("text", { x: padLeft - 10, y: y + 4, "text-anchor": "end", "font-size": 11, fill: "#55665C", "font-family": "Inter, sans-serif" });
    label.textContent = `${v}%`;
    svg.appendChild(label);
  });

  // line path
  const linePoints = modelResults.map((m, i) => `${xFor(i)},${yFor(m.accuracy)}`).join(" ");
  const line = svgEl("polyline", { points: linePoints, fill: "none", stroke: "#D48C82", "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" });
  line.classList.add("chart-line");
  svg.appendChild(line);

  // points + x labels
  modelResults.forEach((m, i) => {
    const x = xFor(i), y = yFor(m.accuracy);
    const point = svgEl("circle", { cx: x, cy: y, r: 7, fill: "#1F3A2E", stroke: "#F7F6F2", "stroke-width": 2, tabindex: 0 });
    point.classList.add("chart-point");
    point.style.transitionDelay = `${0.9 + i * 0.15}s`;
    point.dataset.label = m.label;
    point.dataset.accuracy = m.accuracy;
    svg.appendChild(point);

    const xLabel = svgEl("text", { x: x, y: height - padBottom + 20, "text-anchor": "middle", "font-size": 10.5, fill: "#223028", "font-family": "Inter, sans-serif" });
    xLabel.textContent = m.label;
    svg.appendChild(xLabel);
  });

  // set up the line-draw effect: hide the line behind its own length,
  // then reveal it by animating stroke-dashoffset back to 0
  const lineLength = line.getTotalLength();
  line.style.strokeDasharray = lineLength;
  line.style.strokeDashoffset = lineLength;

  const noteEl = document.getElementById("chart-note");
  svg.querySelectorAll(".chart-point").forEach((point) => {
    const show = () => {
      noteEl.textContent = `${point.dataset.label}: ${point.dataset.accuracy}% accuracy`;
    };
    point.addEventListener("mouseenter", show);
    point.addEventListener("click", show);
    point.addEventListener("focus", show);
  });
}

drawAccuracyChart();

// Reveal the chart (line draws itself, points fade in) once, the moment
// it scrolls into view — not a continuous scroll-scrubbed effect, just a
// single clean trigger.
const chartBlock = document.querySelector(".chart-block");
if (chartBlock) {
  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chartBlock.classList.add("revealed");
          chartObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  chartObserver.observe(chartBlock);
}


// === PROJECT CARD "WHEEL" EFFECT ===
// As the panel scrolls, each card tilts away from the viewer the further
// it sits from the vertical center — like looking down at cards arranged
// around a slowly turning wheel. Cards dead center sit flat and full size.
const cardScroll = document.querySelector(".card-scroll");

function updateCardWheel() {
  if (!cardScroll) return;
  const containerRect = cardScroll.getBoundingClientRect();
  const centerY = containerRect.top + containerRect.height / 2;

  cardScroll.querySelectorAll(".card").forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.top + cardRect.height / 2;
    const delta = (cardCenter - centerY) / (containerRect.height / 2);
    const clamped = Math.max(-1.3, Math.min(1.3, delta));

    const rotate = clamped * -22; // degrees; top cards tilt back, bottom cards tilt forward
    const scale = 1 - Math.min(Math.abs(clamped), 1) * 0.14;
    const opacity = 1 - Math.min(Math.abs(clamped), 1) * 0.5;

    card.style.transform = `perspective(700px) rotateX(${rotate}deg) scale(${scale})`;
    card.style.opacity = opacity;
  });
}

if (cardScroll) {
  cardScroll.addEventListener("scroll", updateCardWheel, { passive: true });
  window.addEventListener("resize", updateCardWheel);
  updateCardWheel();
}


// The bobblehead idea is on hold. This is just a placeholder click effect
// (a little pulse) so the interaction slot isn't empty. When you land on
// your actual animation idea, this is the function to gut and rebuild —
// the click listener below can stay exactly as it is.

const heroVisual = document.getElementById("hero-visual");

function playHeroAnimation() {
  // --- placeholder effect, replace this body later ---
  heroVisual.classList.add("pulse");
  setTimeout(() => heroVisual.classList.remove("pulse"), 200);
  // --- end placeholder ---
}

if (heroVisual) {
  heroVisual.addEventListener("click", playHeroAnimation);
  heroVisual.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playHeroAnimation();
    }
  });
}

// --- Active nav link on scroll (small nice-to-have, safe to delete) ---
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute("href") === `#${id}` ? "#A85D50" : "";
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => observer.observe(section));
