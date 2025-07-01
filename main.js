const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");

let cw, ch;
function resizeCanvas() {
  canvas.width = cw = window.innerWidth;
  canvas.height = ch = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const createStarField = () => {
  const arr = [];
  const N = 300;
  for (let i = 0; i < N; i++) {
    arr.push({
      x: Math.random() * cw,
      y: Math.random() * ch,
      r: 0.5 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.8,
    });
  }
  return arr;
};
let starsBg = createStarField();

const centerX = () => cw / 2;
const centerY = () => ch / 2;

// Planets data
const planets = [
  { name: "Mercury", d: 90, r: 6, color: "#d4d4d4", speed: 0.004 },
  { name: "Venus", d: 130, r: 8, color: "#e3c07b", speed: 0.003 },
  { name: "Earth", d: 170, r: 10, color: "#3399ff", speed: 0.0025 },
  { name: "Mars", d: 210, r: 9, color: "#d94c3d", speed: 0.0015 },
  { name: "Jupiter", d: 270, r: 16, color: "#f4e2c0", speed: 0.001 },
  { name: "Saturn", d: 320, r: 14, color: "#f6d98a", speed: 0.0008 },
  { name: "Uranus", d: 370, r: 12, color: "#b3ffff", speed: 0.0006 },
];
planets.forEach((p) => (p.angle = Math.random() * Math.PI * 2));

// Handle click on Earth
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  planets.forEach((p) => {
    if (p.name === "Earth") {
      const x = centerX() + p.d * Math.cos(p.angle);
      const y = centerY() + p.d * Math.sin(p.angle);
      if (Math.hypot(mx - x, my - y) <= p.r + 8) {
        window.location.href = "https://hien0101.github.io/loveyou2/";
      }
    }
  });
});

function draw() {
  ctx.clearRect(0, 0, cw, ch);

  // draw background stars
  starsBg.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  });

  const sx = centerX(),
    sy = centerY();
  const sunR = Math.min(cw, ch) * 0.09;
  // draw sun
  const sunGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sunR);
  sunGrad.addColorStop(0, "#fffcee");
  sunGrad.addColorStop(0.3, "#ffd54f");
  sunGrad.addColorStop(1, "rgba(255,160,0,0.2)");
  ctx.beginPath();
  ctx.arc(sx, sy, sunR, 0, 2 * Math.PI);
  ctx.fillStyle = sunGrad;
  ctx.shadowBlur = 30;
  ctx.shadowColor = "#ffd54f";
  ctx.fill();
  ctx.shadowBlur = 0;

  // draw orbits and planets
  planets.forEach((p) => {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.setLineDash([4, 4]);
    ctx.arc(sx, sy, p.d, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    p.angle += p.speed;
    const x = sx + p.d * Math.cos(p.angle);
    const y = sy + p.d * Math.sin(p.angle);

    // draw planet with glow
    const grad = ctx.createRadialGradient(
      x - p.r / 3,
      y - p.r / 3,
      1,
      x,
      y,
      p.r
    );
    grad.addColorStop(0, "white");
    grad.addColorStop(0.3, p.color);
    grad.addColorStop(1, p.color);
    ctx.beginPath();
    ctx.arc(x, y, p.r, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // planet label
    ctx.font = "bold 13px Arial";
    ctx.fillStyle = "#ccc";
    ctx.textAlign = "center";
    ctx.fillText(p.name, x, y + p.r + 12);
  });

  requestAnimationFrame(draw);
}
draw();
