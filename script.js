// === HERO VISUAL INTERACTION ===
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
