const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

(function initPhotoShowcase() {
  const root = document.querySelector(".photo-showcase");
  if (!root) {
    return;
  }

  const slides = root.querySelectorAll(".photo-slide");
  const dots = root.querySelectorAll(".photo-showcase-dot");
  if (!slides.length || slides.length !== dots.length) {
    return;
  }

  let index = 0;
  let timerId = null;
  const intervalMs = 5000;

  function show(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function next() {
    show(index + 1);
  }

  function start() {
    stop();
    timerId = window.setInterval(next, intervalMs);
  }

  function stop() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      stop();
      start();
    });
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", () => {
    if (!root.contains(document.activeElement)) {
      start();
    }
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    show(0);
    return;
  }

  start();
})();
