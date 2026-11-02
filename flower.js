// Proses bunga untuk anak: fotosintesis, polinasi, dan bunga menjadi biji.
// Tab 过程 di kebun bunga: pilih proses, lalu ketuk gambar untuk langkah berikutnya.

const PROC = {
  photo: { title: 'photosynthesis', steps: ['p_sun', 'p_water', 'p_air', 'p_food', 'p_oxygen'] },
  pollen: { title: 'pollination', steps: ['b_come', 'b_nectar', 'b_pollen', 'b_fly', 'b_done'] },
  seed: { title: 'fromflowertoseed', steps: ['s_petals', 's_fruit', 's_seeds', 's_fall', 's_sprout', 's_new'] },
};
const PR = { id: 'photo', i: 0, t: 0 };
const loop = (t, speed, i, n) => (t * speed + i / n) % 1;

// ---------- Gambar pendukung ----------
function drawBee(c, x, y, t, dusted) {
  x = Math.round(x); y = Math.round(y);
  const up = Math.floor(t * 14) % 2;
  px(c, x - 2, y - 3 - up, 3, 2, '#e8f6fc'); px(c, x + 1, y - 3 - (1 - up), 2, 2, '#ffffff');
  oval(c, x, y, 3, 2, '#f4cf3a');
  px(c, x - 1, y - 2, 1, 4, '#2a1d18'); px(c, x + 1, y - 2, 1, 4, '#2a1d18');
  px(c, x + 3, y - 1, 2, 2, '#2a1d18');
  if (dusted) { px(c, x - 3, y + 1, 1, 1, '#ffe98a'); px(c, x, y + 2, 1, 1, '#ffe98a'); px(c, x + 2, y + 2, 1, 1, '#ffe98a'); px(c, x - 2, y - 1, 1, 1, '#ffe98a'); }
}
function drawGround(c) { drawFlowerGround(c); }
function miniFlower(c, x, col) {
  px(c, x, 26, 2, 15, '#3f8a3a'); px(c, x, 26, 0.5, 15, '#58a84a');
  bigLeaf(c, x, 35, x - 6, 33.5, 1.4, '#4a9a3a', '#2f7a2c', '#7cc85a'); bigLeaf(c, x + 2, 32, x + 8, 30.5, 1.4, '#4a9a3a', '#2f7a2c', '#7cc85a');
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; disc(c, x + 1 + Math.cos(a) * 5, 20 + Math.sin(a) * 5, 3, col[2]); }
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; disc(c, x + 1 + Math.cos(a) * 5, 19.5 + Math.sin(a) * 5, 2.5, col[1]); }
  disc(c, x + 1, 20, 3, col[0] === 'yellow' ? '#8a5a35' : '#f4cf3a'); disc(c, x + 1, 20, 1.5, col[0] === 'yellow' ? '#6b4226' : '#e9b02a');
}
function glowLeaves(c) {
  bigLeaf(c, 23, 32, 11, 30, 2.8, '#a6e36e', '#58a84a', '#d4f5a0');
  bigLeaf(c, 25, 28, 37, 26, 2.8, '#a6e36e', '#58a84a', '#d4f5a0');
}
function drawPod(c, x, y, r, col, dark) {
  disc(c, x, y, r, dark); disc(c, x, y - 0.5, r - 0.5, col);
  oval(c, x - r / 2, y - r / 2 - 0.5, 1.5, 0.75, 'rgba(255,255,255,0.6)');
}

// ---------- Fotosintesis ----------
function drawPhoto(c, col, s, t) {
  drawBigFlower(c, col, null, G.t, 6);
  if (s === 3 || (s === 0 && Math.floor(t * 3) % 2)) glowLeaves(c);
  // matahari selalu terlihat
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; px(c, 41 + Math.round(Math.cos(a) * 7), 7 + Math.round(Math.sin(a) * 7), 1, 1, '#f0a83a'); }
  disc(c, 41, 7, 5, '#ffd84a'); disc(c, 40, 6, 3, '#fff2a8');
  if (s === 0 || s === 3) for (let i = 0; i < 4; i++) {
    const p = loop(t, 0.6, i, 4);
    px(c, Math.round(38 + (32 - 38) * p), Math.round(12 + (26 - 12) * p), 2, 1, '#ffc93a');
    px(c, Math.round(36 + (18 - 36) * p), Math.round(11 + (30 - 11) * p), 2, 1, '#ffc93a');
  }
  if (s === 1 || s === 3) {
    px(c, 16, 49, 3, 1, '#4fa0cf'); px(c, 30, 50, 3, 1, '#4fa0cf'); px(c, 20, 53, 2, 1, '#4fa0cf');
    for (let i = 0; i < 5; i++) {
      const p = loop(t, 0.35, i, 5), y = 52 - 24 * p, side = i % 2 ? 1 : -1;
      const x = p < 0.8 ? 23 : 23 + side * (p - 0.8) * 30;
      px(c, Math.round(x), Math.round(y), 2, 2, '#3f8fe0');
    }
  }
  if (s === 2 || s === 3) for (let i = 0; i < 4; i++) {
    const p = loop(t, 0.4, i, 4);
    disc(c, Math.round(1 + 14 * p), Math.round(20 + i * 3 + (31 - 20 - i * 3) * p), 1, '#a9b6c4');
    disc(c, Math.round(47 - 13 * p), Math.round(18 + i * 3 + (27 - 18 - i * 3) * p), 1, '#a9b6c4');
  }
  if (s === 3) for (let i = 0; i < 6; i++) {
    const p = loop(t, 0.8, i, 6);
    if (p < 0.5) { px(c, 12 + i * 2, 29 + (i % 3), 1, 1, '#fff7b0'); px(c, 27 + i * 2, 25 + (i % 3), 1, 1, '#fff7b0'); }
  }
  if (s === 4) for (let i = 0; i < 6; i++) {
    const p = loop(t, 0.3, i, 6), x = (i % 2 ? 31 : 17) + Math.round(Math.sin(t * 2 + i) * 2);
    disc(c, x, Math.round((i % 2 ? 24 : 28) - 24 * p), 1, '#7fd0f5'); px(c, x, Math.round((i % 2 ? 24 : 28) - 24 * p) - 1, 1, 1, '#ffffff');
  }
}

// ---------- Polinasi ----------
function drawPollen(c, col, s, t) {
  if (s < 3) {
    drawBigFlower(c, col, null, G.t, 6);
    if (s === 0) {
      const p = Math.min(1, t / 1.6), w = Math.sin(t * 5) * 2;
      drawBee(c, 46 - 18 * p, 4 + 4 * p + w, t, false);
    } else {
      drawBee(c, 24 + Math.sin(t * 8), 10 + Math.abs(Math.sin(t * 4)), t, s === 2);
      if (s === 1) for (let i = 0; i < 3; i++) { const p = loop(t, 0.8, i, 3); px(c, 24 + i - 1, Math.round(16 - 4 * p), 1, 1, '#f08a32'); }
      if (s === 2) for (let i = 0; i < 6; i++) { const p = loop(t, 0.9, i, 6); px(c, 21 + i, Math.round(17 - 6 * p), 1, 1, '#ffe24a'); }
    }
    return;
  }
  drawGround(c);
  miniFlower(c, 11, col); miniFlower(c, 33, col);
  if (s === 3) {
    const p = Math.min(1, t / 2.4), x = 12 + 22 * p, y = 13 - Math.sin(p * Math.PI) * 9;
    for (let i = 1; i < 5; i++) { const q = Math.max(0, p - i * 0.07); px(c, Math.round(12 + 22 * q), Math.round(15 - Math.sin(q * Math.PI) * 9), 1, 1, '#ffe24a'); }
    drawBee(c, x, y, t, true);
  } else {
    drawBee(c, 34 + Math.sin(t * 8), 14 + Math.abs(Math.sin(t * 4)), t, true);
    for (let i = 0; i < 5; i++) { const p = loop(t, 0.9, i, 5); px(c, 32 + i, Math.round(16 + 4 * p), 1, 1, '#ffe24a'); }
    if (t > 1.5 && Math.floor(t * 4) % 2) { px(c, 28, 11, 1, 3, '#fff7b0'); px(c, 27, 12, 3, 1, '#fff7b0'); px(c, 41, 15, 1, 3, '#fff7b0'); px(c, 40, 16, 3, 1, '#fff7b0'); }
  }
}

// ---------- Bunga menjadi biji ----------
function drawSeedStep(c, col, s, t) {
  if (s === 0) {
    drawBigFlower(c, col, null, G.t, 4);
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * Math.PI * 2 - Math.PI / 2, fall = Math.max(0, t * 16 - k * 5);
      const x = 24 + Math.cos(a) * 8 + Math.sin(fall / 6 + k) * (fall ? 3 : 0), y = Math.min(39, 15 + Math.sin(a) * 8 + fall);
      disc(c, x, y, fall ? 2.5 : 4.5, col[2]); disc(c, x, y - 0.5, fall ? 2 : 3.5, col[1]);
    }
    disc(c, 24, 15, 4, col[0] === 'yellow' ? '#8a5a35' : '#f4cf3a');
  } else if (s === 1) {
    drawBigFlower(c, col, null, G.t, 4);
    const r = 4 + Math.round(Math.min(4, t * 2));
    drawPod(c, 24, 16, r, '#8fd16a', '#58a84a');
    px(c, 23, 16 - r - 1, 2, 2, '#c9a24a');
  } else if (s === 2) {
    drawBigFlower(c, col, null, G.t, 4);
    disc(c, 24, 16, 9, '#58a84a'); disc(c, 24, 16, 7, '#eef6cf');
    [[21, 13], [26, 13], [19, 17], [24, 17], [28, 17], [22, 20], [26, 20]].forEach(([x, y]) => { oval(c, x, y, 1, 2, '#7d5230'); px(c, x, y - 1, 1, 1, '#a8743c'); });
    if (Math.floor(t * 3) % 2) { px(c, 36, 8, 1, 3, '#fff7b0'); px(c, 35, 9, 3, 1, '#fff7b0'); }
  } else if (s === 3) {
    drawBigFlower(c, col, null, G.t, 4);
    drawPod(c, 24, 16, 7, '#c9a26a', '#8a6a3a');
    px(c, 21, 19, 6, 3, '#6b4a2a');
    [[12, 0], [19, 0.4], [30, 0.8], [37, 1.2]].forEach(([tx, d]) => {
      const p = Math.min(1, Math.max(0, (t - d) / 1.2));
      oval(c, Math.round(24 + (tx - 24) * p), Math.round(21 + 24 * p * p), 1, 2, '#7d5230');
    });
  } else if (s === 4) {
    drawGround(c);
    oval(c, 24, 45, 3, 2, '#c9a24a'); px(c, 23, 44, 1, 1, '#f0dcae');
    const h = Math.min(12, t * 6), root = Math.min(6, t * 4);
    px(c, 23, 46, 2, Math.round(root), '#f0dcae');
    if (root > 3) { px(c, 21, 49, 2, 1, '#f0dcae'); px(c, 25, 50, 2, 1, '#f0dcae'); }
    if (t > 0.5) px(c, 23, Math.round(43 - h), 2, Math.round(h), '#3f8a3a');
    if (h >= 6) { oval(c, 20, Math.round(43 - h), 3, 1, '#58a84a'); oval(c, 28, Math.round(42 - h), 3, 1, '#58a84a'); }
  } else {
    const stage = Math.min(6, 3 + Math.floor(t * 1.4));
    drawBigFlower(c, col, null, G.t, stage);
    if (stage === 6 && Math.floor(t * 4) % 2) { px(c, 9, 8, 1, 3, '#ffd84a'); px(c, 8, 9, 3, 1, '#ffd84a'); px(c, 39, 12, 1, 3, '#ffd84a'); px(c, 38, 13, 3, 1, '#ffd84a'); }
  }
}
const PROC_DRAW = { photo: drawPhoto, pollen: drawPollen, seed: drawSeedStep };

// dipanggil dari flowerDraw di ui.js
function procDraw(c, dt) {
  PR.t += dt;
  PROC_DRAW[PR.id](c, FLOWER_COLORS[FL.ci], PR.i, PR.t);
  // panah kecil: tanda bahwa gambar bisa diketuk untuk lanjut
  if (PR.t > 2.5 && Math.floor(PR.t * 2) % 2) { px(c, 43, 49, 3, 3, '#ffd84a'); px(c, 46, 50, 1, 1, '#ffd84a'); px(c, 42, 48, 1, 5, '#c9772a'); }
}

// ---------- Tombol & langkah ----------
function procUI() {
  document.querySelectorAll('#flower-proc [data-proc]').forEach(b => b.setAttribute('aria-pressed', b.dataset.proc === PR.id ? 'true' : 'false'));
  $('proc-dots').innerHTML = PROC[PR.id].steps.map((k, i) => `<span class="fstar${i <= PR.i ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('proc-dots').setAttribute('aria-label', 'Langkah ' + (PR.i + 1) + ' dari ' + PROC[PR.id].steps.length);
}
function procStart(id) {
  PR.id = id; PR.i = 0; PR.t = 0; procUI();
  say([{ k: PROC[id].title }, { k: PROC[id].steps[0] }]);
}
function procNext() {
  const p = PROC[PR.id];
  if (PR.i >= p.steps.length - 1) { procStart(PR.id); return; }
  PR.i++; PR.t = 0; sfx('pop'); procUI();
  const last = PR.i === p.steps.length - 1;
  if (last) setTimeout(() => sfx('sparkle'), 400);
  say(last ? [{ k: p.steps[PR.i] }, { k: p.title }, { k: 'great' }] : [{ k: p.steps[PR.i] }]);
}
// dipanggil dari flowerMode di ui.js
function procMode(m) {
  $('flower-proc').hidden = m !== 'process';
  $('flower-title').hidden = m === 'process';
  if (m === 'process') procStart(PR.id);
}
function buildProc() {
  const box = $('flower-proc');
  Object.entries(PROC).forEach(([id, p]) => {
    const w = word(p.title), b = document.createElement('button');
    b.type = 'button'; b.className = 'tile proc-btn'; b.dataset.proc = id; b.setAttribute('aria-label', w.id);
    b.innerHTML = `<img src="${stickerCanvas(p.title)}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
    b.addEventListener('click', () => { sfx('tap'); procStart(id); });
    box.appendChild(b);
  });
  box.insertAdjacentHTML('beforeend', `<div class="proc-foot"><div class="stars" id="proc-dots"></div>
    <button class="act act-eat" id="proc-next" type="button" aria-label="Langkah berikutnya"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1.5L8.5 5 2.5 8.5z" fill="#fff"/></svg></button></div>`);
  $('proc-next').addEventListener('click', procNext);
}

// ---------- Gambar stiker kata proses ----------
const stLeaf = (c, x, y) => { oval(c, x, y, 8, 3, '#58a84a'); px(c, x - 8, y, 16, 1, '#3d7f33'); };
const stSun = (c, x, y) => { for (let a = 0; a < 8; a++) px(c, x + Math.round(Math.cos(a * 0.785) * 7), y + Math.round(Math.sin(a * 0.785) * 7), 1, 1, '#f0a83a'); disc(c, x, y, 4, '#ffd84a'); };
const stFlower = (c, x, y, r = 4) => { for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; disc(c, x + Math.round(Math.cos(a) * r), y + Math.round(Math.sin(a) * r), Math.max(2, r - 1), '#f39ac0'); } disc(c, x, y, Math.max(2, r - 1), '#f4cf3a'); };
const stSeed = (c, x, y) => { oval(c, x, y, 2, 3, '#a8743c'); px(c, x, y - 2, 1, 1, '#d9b06a'); };
const stGround = (c, x, y) => { px(c, x - 14, y - 6, 28, 6, '#8a5a35'); px(c, x - 14, y - 7, 28, 1, '#7cc85a'); };
Object.assign(ST_ART, {
  photosynthesis: (c, x, y) => { stSun(c, x + 8, y - 20); stLeaf(c, x - 3, y - 6); },
  pollination: (c, x, y) => { stFlower(c, x - 5, y - 7); drawBee(c, x + 7, y - 17, 0, true); },
  fromflowertoseed: (c, x, y) => { stFlower(c, x - 8, y - 8); px(c, x + 1, y - 9, 4, 2, '#c9772a'); px(c, x + 4, y - 11, 1, 6, '#c9772a'); stSeed(c, x + 11, y - 8); },
  p_sun: (c, x, y) => { stSun(c, x + 8, y - 20); stLeaf(c, x - 3, y - 6); for (let i = 0; i < 3; i++) px(c, x + 3 - i * 2, y - 14 + i * 2, 2, 1, '#ffc93a'); },
  p_water: (c, x, y) => { stGround(c, x, y); px(c, x, y - 18, 2, 18, '#3f8a3a'); stLeaf(c, x + 1, y - 18); for (let i = 0; i < 3; i++) px(c, x - 4, y - 3 - i * 5, 2, 2, '#3f8fe0'); },
  p_air: (c, x, y) => { stLeaf(c, x + 3, y - 6); for (let i = 0; i < 3; i++) disc(c, x - 12 + i * 3, y - 14 + i * 2, 1, '#8a9aaa'); },
  p_food: (c, x, y) => { oval(c, x, y - 6, 9, 4, '#a6e36e'); px(c, x - 9, y - 6, 18, 1, '#58a84a'); for (let i = 0; i < 4; i++) drawStar(c, x - 9 + i * 6, y - 14 - (i % 2) * 3, '#ffd84a'); },
  p_oxygen: (c, x, y) => { stLeaf(c, x, y - 4); for (let i = 0; i < 4; i++) { disc(c, x - 7 + i * 5, y - 11 - (i % 2) * 6 - i * 2, 1, '#4fb0e8'); px(c, x - 7 + i * 5, y - 12 - (i % 2) * 6 - i * 2, 1, 1, '#ffffff'); } },
  bee: (c, x, y) => drawBee(c, x, y - 6, 0, false),
  nectar: (c, x, y) => { stFlower(c, x, y - 9, 5); for (let i = 0; i < 3; i++) px(c, x - 2 + i * 2, y - 2 + (i % 2), 1, 2, '#f08a32'); },
  pollen: (c, x, y) => { for (const [a, b] of [[-6, -6], [-2, -10], [3, -5], [6, -11], [0, -2], [-7, -12], [8, -3]]) disc(c, x + a, y + b, 1, '#ffd23a'); },
  b_come: (c, x, y) => { drawBee(c, x + 2, y - 8, 0, false); for (let i = 0; i < 4; i++) px(c, x - 12 + i * 3, y - 5 - i, 1, 1, '#7d8a98'); },
  b_nectar: (c, x, y) => { stFlower(c, x, y - 7); drawBee(c, x, y - 15, 0, false); },
  b_pollen: (c, x, y) => { drawBee(c, x, y - 8, 0, true); for (const [a, b] of [[-7, -3], [6, -2], [0, -1]]) px(c, x + a, y + b, 1, 1, '#ffd23a'); },
  b_fly: (c, x, y) => { stFlower(c, x - 12, y - 6, 3); stFlower(c, x + 12, y - 6, 3); drawBee(c, x, y - 18, 0, true); },
  b_done: (c, x, y) => { stFlower(c, x, y - 7, 5); for (const [a, b] of [[-2, -16], [1, -18], [3, -15]]) px(c, x + a, y + b, 1, 1, '#ffd23a'); },
  s_petals: (c, x, y) => { px(c, x, y - 12, 1, 12, '#3f8a3a'); disc(c, x, y - 14, 2, '#f4cf3a'); for (const [a, b] of [[-7, -8], [6, -5], [-5, -2], [8, -11]]) disc(c, x + a, y + b, 2, '#f39ac0'); },
  s_fruit: (c, x, y) => { px(c, x, y - 8, 2, 8, '#3f8a3a'); drawPod(c, x + 1, y - 13, 6, '#8fd16a', '#58a84a'); },
  s_seeds: (c, x, y) => { disc(c, x, y - 9, 9, '#58a84a'); disc(c, x, y - 9, 7, '#eef6cf'); for (const [a, b] of [[-3, -3], [2, -3], [-4, 2], [0, 2], [4, 2]]) oval(c, x + a, y - 9 + b, 1, 1, '#7d5230'); },
  s_fall: (c, x, y) => { stGround(c, x, y); stSeed(c, x - 7, y - 14); stSeed(c, x + 1, y - 17); stSeed(c, x + 8, y - 10); },
  s_sprout: (c, x, y) => { stGround(c, x, y); oval(c, x, y - 3, 2, 2, '#c9a24a'); px(c, x, y - 15, 1, 11, '#3f8a3a'); oval(c, x - 3, y - 15, 3, 1, '#58a84a'); oval(c, x + 4, y - 16, 3, 1, '#58a84a'); },
  s_new: (c, x, y) => { stGround(c, x, y); px(c, x, y - 14, 2, 8, '#3f8a3a'); stFlower(c, x + 1, y - 18, 4); },
});
buildProc(); // setelah gambar stiker tersedia
