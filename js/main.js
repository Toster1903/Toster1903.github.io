/* ── Particle wave canvas ── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let W, H, cols, rows, dots = [];
let time = 0;
let mouse = { x: -9999, y: -9999 };

const SPACING = 26;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cols = Math.ceil(W / SPACING) + 1;
  rows = Math.ceil(H / SPACING) + 1;
  buildDots();
}

function buildDots() {
  dots = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      dots.push({ bx: c * SPACING, by: r * SPACING });
    }
  }
}

function wave(x, y, t) {
  const nx = x / W;
  const ny = y / H;
  return (
    Math.sin(nx * 6.2 - t * 1.1) * 0.4 +
    Math.sin(ny * 4.8 + t * 0.7) * 0.3 +
    Math.sin((nx + ny) * 5.5 - t * 0.9) * 0.2 +
    Math.sin(nx * 11 + t * 1.4) * 0.1
  );
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  time += 0.012;

  for (const d of dots) {
    const w = wave(d.bx, d.by, time);
    /* normalised 0-1 */
    const n = (w + 1) * 0.5;

    /* mouse proximity boost */
    const dx = d.bx - mouse.x;
    const dy = d.by - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const prox = Math.max(0, 1 - dist / 200);

    const size    = 0.4 + n * 2.4 + prox * 2.2;
    const opacity = 0.06 + n * 0.55 + prox * 0.35;

    ctx.beginPath();
    ctx.arc(d.bx, d.by, Math.max(0.1, size), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, opacity)})`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

/* ── Cursor glow ── */
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ── Scroll reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal-section').forEach(el => io.observe(el));

/* ── Init ── */
window.addEventListener('resize', resize);
resize();
draw();
