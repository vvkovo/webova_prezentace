const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

(function initPhotoShowcase() {
  const root = document.querySelector(".photo-showcase");
  if (!root) {
    return;
  }

  const viewport = root.querySelector(".photo-showcase-viewport");
  const slides = root.querySelectorAll(".photo-slide");
  const dots = root.querySelectorAll(".photo-showcase-dot");
  const toggle = root.querySelector(".photo-showcase-toggle");
  if (!slides.length || slides.length !== dots.length) {
    return;
  }

  let index = 0;
  let timerId = null;
  let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intervalMs = 5000;

  function show(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
      dot.tabIndex = on ? 0 : -1;
    });
  }

  function next() {
    show(index + 1);
  }

  function start() {
    stop();
    if (paused) {
      return;
    }
    timerId = window.setInterval(next, intervalMs);
  }

  function stop() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function setPaused(value) {
    paused = value;
    if (viewport) {
      viewport.setAttribute("aria-live", paused ? "polite" : "off");
    }
    if (toggle) {
      toggle.classList.toggle("is-paused", paused);
      toggle.setAttribute(
        "aria-label",
        paused ? "Spustit automatické přehrávání" : "Pozastavit automatické přehrávání"
      );
    }
    if (paused) {
      stop();
    } else {
      start();
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      start();
    });
  });

  const dotList = root.querySelector(".photo-showcase-dots");
  if (dotList) {
    dotList.addEventListener("keydown", (event) => {
      const steps = { ArrowRight: 1, ArrowLeft: -1 };
      let target = null;

      if (event.key in steps) {
        target = (index + steps[event.key] + slides.length) % slides.length;
      } else if (event.key === "Home") {
        target = 0;
      } else if (event.key === "End") {
        target = slides.length - 1;
      }

      if (target === null) {
        return;
      }

      event.preventDefault();
      show(target);
      dots[target].focus();
      start();
    });
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      setPaused(!paused);
    });
  }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", () => {
    if (!root.contains(document.activeElement)) {
      start();
    }
  });

  setPaused(paused);
})();
