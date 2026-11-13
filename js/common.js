const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const bg = $(".burger"),
  nv = $(".nav"),
  sc = $(".scrim");
function tog(o) {
  nv.classList.toggle("open", o);
  bg.classList.toggle("x", o);
  sc.classList.toggle("on", o);
  bg.setAttribute("aria-expanded", o);
  document.body.style.overflow = o ? "hidden" : "";
}
bg.onclick = () => tog(!nv.classList.contains("open"));
sc.onclick = () => tog(false);
$$(".nav a").forEach((a) => (a.onclick = () => tog(false)));
addEventListener("keydown", (e) => {
  if (e.key === "Escape") tog(false);
});
addEventListener("scroll", () =>
  $(".top").classList.toggle("sc", scrollY > 40),
);
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
        const n = e.target.querySelector("[data-n]");
        if (n) count(n);
      }
    }),
  { threshold: 0.15 },
);
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 90 + "ms";
  io.observe(el);
});
function count(n) {
  const t = +n.dataset.n,
    s = performance.now();
  (function f(now) {
    const p = Math.min((now - s) / 1600, 1);
    n.textContent =
      Math.floor(t * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN") +
      (p < 1 ? "" : "+");
    if (p < 1) requestAnimationFrame(f);
  })(s);
}
addEventListener("pointermove", (e) => {
  if (Math.random() > 0.2 || matchMedia("(pointer:coarse)").matches) return;
  const s = document.createElement("span");
  s.className = "spark";
  s.textContent = ["✦", "✿", "♥"][(Math.random() * 3) | 0];
  s.style.left = e.clientX + "px";
  s.style.top = e.clientY + "px";
  s.style.setProperty("--x", Math.random() * 40 - 20 + "px");
  s.style.setProperty("--y", Math.random() * 40 + 10 + "px");
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 900);
});
(function () {
  const c = $("#petals");
  if (!c) return;
  const x = c.getContext("2d");
  let w,
    h,
    P = [];
  function rs() {
    w = c.width = c.offsetWidth;
    h = c.height = c.offsetHeight;
  }
  rs();
  addEventListener("resize", rs);
  for (let i = 0; i < 40; i++)
    P.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 4 + Math.random() * 8,
      s: 0.4 + Math.random() * 1.2,
      a: Math.random() * 6,
      c: ["#ff7aa5", "#ffd0e0", "#f4c26b"][i % 3],
    });
  (function d() {
    x.clearRect(0, 0, w, h);
    P.forEach((p) => {
      p.y += p.s;
      p.a += 0.02;
      p.x += Math.sin(p.a) * 0.8;
      if (p.y > h + 10) {
        p.y = -10;
        p.x = Math.random() * w;
      }
      x.save();
      x.translate(p.x, p.y);
      x.rotate(p.a);
      x.fillStyle = p.c;
      x.globalAlpha = 0.8;
      x.beginPath();
      x.ellipse(0, 0, p.r, p.r / 2, 0, 0, 7);
      x.fill();
      x.restore();
    });
    requestAnimationFrame(d);
  })();
})();
