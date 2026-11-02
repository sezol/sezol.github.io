// =====================================================================
// 1) SCROLL EFFECTS
// As you scroll, this file writes small numbers (0 to 1) onto elements.
// The CSS (see the "SCROLL EFFECTS" block in style.css) turns those
// numbers into movement. Skipped entirely if the visitor has asked
// their device for reduced motion.
// =====================================================================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroTrack = document.querySelector(".hero-track");
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

function updateScrollEffects() {
  const y = window.scrollY;
  const vh = window.innerHeight;

  // Hero: progress over the first 800px of scrolling
  if (heroTrack) {
    heroTrack.style.setProperty("--hp", clamp(y / 800));
    heroTrack.querySelectorAll("[data-lit]").forEach((el) => {
      const [start, end] = el.dataset.lit.split("-").map(Number);
      el.style.setProperty("--lit", clamp((y - start) / (end - start)));
    });
  }

  // Everything else: how far an element has travelled up the screen
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (el.dataset.scroll === "rise") {
      // 0 when it first peeks in at the bottom, 1 once it is 40% up the screen
      el.style.setProperty("--rp", clamp((vh - rect.top) / (vh * 0.6)));
    } else if (el.dataset.scroll === "drift") {
      // 0 as it enters, 1 as it leaves
      const parent = el.parentElement.getBoundingClientRect();
      el.style.setProperty("--dp", clamp((vh - parent.top) / (vh + parent.height)));
    }
  });
}

if (!prefersReducedMotion) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateScrollEffects();
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateScrollEffects();
}

// =====================================================================
// 2) ACCURACY CHART (walkability project model progression)
// Real results from the walkability project, in the order they were tried.
// =====================================================================
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
    svg.appendChild(svgEl("line", { x1: padLeft, y1: y, x2: width - padRight, y2: y, stroke: "#1e2a22", "stroke-width": 1 }));
    const label = svgEl("text", { x: padLeft - 10, y: y + 4, "text-anchor": "end", "font-size": 12, fill: "#a3ada6", "font-family": "Inter, sans-serif" });
    label.textContent = `${v}%`;
    svg.appendChild(label);
  });

  // line path
  const linePoints = modelResults.map((m, i) => `${xFor(i)},${yFor(m.accuracy)}`).join(" ");
  const line = svgEl("polyline", { points: linePoints, fill: "none", stroke: "#34d97b", "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" });
  line.classList.add("chart-line");
  svg.appendChild(line);

  // points + x labels
  modelResults.forEach((m, i) => {
    const x = xFor(i), y = yFor(m.accuracy);
    const point = svgEl("circle", { cx: x, cy: y, r: 7, fill: "#0a0a0a", stroke: "#34d97b", "stroke-width": 3, tabindex: 0 });
    point.classList.add("chart-point");
    point.style.transitionDelay = `${0.9 + i * 0.15}s`;
    point.dataset.label = m.label;
    point.dataset.accuracy = m.accuracy;
    svg.appendChild(point);

    const xLabel = svgEl("text", { x: x, y: height - padBottom + 20, "text-anchor": "middle", "font-size": 11, fill: "#f4f4f0", "font-family": "Inter, sans-serif" });
    xLabel.textContent = m.label;
    svg.appendChild(xLabel);
  });

  // line-draw effect: hide the line behind its own length, then reveal it
  // by animating stroke-dashoffset back to 0 (the CSS does the animating)
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

// Reveal the chart once, the moment it scrolls into view.
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

// =====================================================================
// 3) ACTIVE NAV LINK (small nice-to-have, safe to delete)
// =====================================================================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute("href") === `#${id}` ? "#34d97b" : "";
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => navObserver.observe(section));
