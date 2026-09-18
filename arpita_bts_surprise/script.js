const openBtn = document.getElementById("openBtn");
const surprise = document.getElementById("surprise");
const blushBtn = document.getElementById("blushBtn");
const reply = document.getElementById("reply");
const toast = document.getElementById("toast");
const musicBtn = document.getElementById("musicBtn");

// Tiny star field — no external libraries.
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  stars = Array.from({length: Math.min(120, Math.floor(window.innerWidth / 9))}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.3,
    a: Math.random() * .6 + .15,
    speed: Math.random() * .008 + .002
  }));
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawStars(t = 0) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach(s => {
    const alpha = s.a + Math.sin(t * s.speed) * .15;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240, 225, 255, ${Math.max(.05, alpha)})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

openBtn.addEventListener("click", () => {
  surprise.classList.remove("hidden");
  requestAnimationFrame(() => surprise.classList.add("show"));
  setTimeout(() => surprise.scrollIntoView({behavior: "smooth", block: "start"}), 100);
  burstHearts(24);
});

blushBtn.addEventListener("click", () => {
  reply.textContent = "Sure. And I'm the CEO of believing that. 😌💜";
  toast.classList.add("show");
  burstHearts(18);
  setTimeout(() => toast.classList.remove("show"), 2800);
});

function burstHearts(count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = ["💜", "♡", "✨", "💫"][Math.floor(Math.random() * 4)];
    heart.style.left = `${35 + Math.random() * 30}%`;
    heart.style.top = `${45 + Math.random() * 25}%`;
    heart.style.animationDelay = `${Math.random() * .5}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2300);
  }
}

// A soft, synthesized "little melody" so the site doesn't need a copyrighted audio file.
let audioCtx;
let playing = false;

musicBtn.addEventListener("click", async () => {
  if (playing) return;
  playing = true;
  musicBtn.innerHTML = "<span>♫</span> playing for you...";
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();

  const notes = [
    [261.63, 0], [329.63, .22], [392.00, .44], [523.25, .70],
    [392.00, 1.02], [329.63, 1.25], [293.66, 1.48], [261.63, 1.75]
  ];

  notes.forEach(([freq, delay]) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(.055, audioCtx.currentTime + delay + .03);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + delay + .45);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + .5);
  });

  setTimeout(() => {
    playing = false;
    musicBtn.innerHTML = "<span>♪</span> play again";
  }, 2600);
});
