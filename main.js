gsap.registerPlugin(ScrollTrigger);

function initHeroEntrance() {
  const title = document.querySelector(".js-hero-title");
  if (title) {
    const text = title.textContent;
    title.textContent = "";
    title.setAttribute("aria-label", text);
    [...text].forEach((ch) => {
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.display = "inline-block";
      s.setAttribute("aria-hidden", "true");
      title.appendChild(s);
    });
  }
  const tl = gsap.timeline({ defaults: { ease: "back.out(1.6)" } });
  tl.from(".js-g-card", { scale: 0.9, y: 48, opacity: 0, rotate: -4, duration: 0.7 })
    .from(".g-badge", { scale: 0, duration: 0.45, ease: "back.out(2.5)" }, "-=0.15")
    .from(".js-hero-title span", {
      y: () => gsap.utils.random(-56, 56),
      x: () => gsap.utils.random(-24, 24),
      rotation: () => gsap.utils.random(-14, 14),
      opacity: 0,
      filter: "blur(5px)",
      duration: 0.55,
      stagger: 0.06,
      clearProps: "filter",
    }, "-=0.1")
    .from(".js-hero-sub", { y: 24, opacity: 0, duration: 0.45 }, "-=0.1")
    .from(".js-hero-cta", { y: 18, opacity: 0, stagger: 0.1, duration: 0.4 }, "-=0.15");
}

function initMagneticPill(pillSelector, radius, strength) {
  radius = radius || 120;
  strength = strength || 0.28;
  const pill = document.querySelector(pillSelector);
  if (!pill || !window.matchMedia("(hover: hover)").matches) return;

  document.addEventListener("mousemove", (e) => {
    const r = pill.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < radius) {
      const pull = 1 - dist / radius;
      gsap.to(pill, { x: dx * pull * strength, y: dy * pull * strength, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(pill, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    }
  });
}

function initLineReveal(headingSelector) {
  document.querySelectorAll(headingSelector).forEach((heading) => {
    const lines = heading.querySelectorAll(".line-inner");
    gsap.from(lines, {
      y: "110%",
      duration: 0.7,
      ease: "back.out(1.4)",
      stagger: 0.08,
      scrollTrigger: { trigger: heading, start: "top 82%", toggleActions: "play none none none" },
    });
  });
}

function initShowcaseReveal() {
  document.querySelectorAll(".js-showcase-item").forEach((block) => {
    ScrollTrigger.create({
      trigger: block,
      start: "top 75%",
      toggleActions: "play none none reverse",
      onEnter: () => block.classList.add("is-visible"),
      onLeaveBack: () => block.classList.remove("is-visible"),
    });
  });
}

function initParallax() {
  [
    { selector: ".g-decor-1", speed: 0.7 },
    { selector: ".g-decor-2", speed: 1.25 },
    { selector: ".g-decor-3", speed: 0.85 },
  ].forEach(({ selector, speed }) => {
    gsap.to(selector, {
      y: () => window.innerHeight * (speed - 1) * -0.4,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: speed },
    });
  });
}

function initHeroTilt() {
  const hero = document.querySelector(".hero");
  const card = document.querySelector(".js-g-card");
  if (!hero || !card || !window.matchMedia("(hover: hover)").matches) return;

  const tiltX = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
  const tiltY = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });

  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tiltX(nx * 5);
    tiltY(ny * -5);
  });
  hero.addEventListener("mouseleave", () => { tiltX(0); tiltY(0); });
}

function initCornerMark() {
  const mark = document.querySelector(".corner-mark");
  if (!mark) return;
  ScrollTrigger.create({
    trigger: ".hero",
    start: "bottom top+=120",
    onEnter: () => mark.classList.add("is-hidden"),
    onLeaveBack: () => mark.classList.remove("is-hidden"),
  });
}

function initCopyHandle() {
  document.querySelectorAll(".c-copy").forEach((btn) => {
    const handle = btn.querySelector(".c-handle");
    const original = handle.textContent;
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy).then(() => {
        handle.textContent = "已复制 ✓";
        gsap.fromTo(btn, { scale: 0.98 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
        setTimeout(() => { handle.textContent = original; }, 1400);
      });
    });
  });
}

function initSparkle() {
  document.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.9) {
      const s = document.createElement("span");
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:4px;height:4px;background:var(--accent);border-radius:50%;pointer-events:none;z-index:9999;box-shadow:0 0 12px var(--accent)`;
      document.body.appendChild(s);
      gsap.to(s, { opacity: 0, scale: 3, duration: 0.8, ease: "power2.out", onComplete: () => s.remove() });
    }
  });
}

initHeroEntrance();
initMagneticPill(".pill-nav");
initLineReveal(".line-reveal");
initShowcaseReveal();
initParallax();
initHeroTilt();
initCornerMark();
initCopyHandle();
initSparkle();

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
