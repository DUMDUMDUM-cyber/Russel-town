// Berlayar: perahu layar di tepi Pantai. Gerakkan perahu ke atas dan bawah, kumpulkan 8 bintang, lalu sampai di pulau kecil.

const SA = { lane: 1, by: 72, items: [], spawn: 0, stars: 0, goal: 8, t: 0, bump: 0, whale: -1, end: 0, done: false, cv: $('sa-cv'), src: document.createElement('canvas') };
SA.src.width = 160; SA.src.height = 110;
SA.sctx = SA.src.getContext('2d', { willReadFrequently: true });
SA.ctx = SA.cv.getContext('2d');
const SA_LANES = [54, 74, 94];
PANELS.sail = $('p-sail');
PANELS.sail.addEventListener('pointerdown', e => { if (e.target === PANELS.sail) closePanel(); });

function saRender() {
  const box = $('sa-opts'); box.innerHTML = '';
  const tileOf = (k, fn) => { const w = word(k), b = document.createElement('button'); b.type = 'button'; b.className = 'tile proc-btn'; b.setAttribute('aria-label', w.id); b.innerHTML = `<img src="${stickerCanvas(k)}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`; b.addEventListener('click', fn); return b; };
  if (SA.done) box.appendChild(tileOf('sailing', saStart));
  else { box.appendChild(tileOf('goup', () => saMove(-1))); box.appendChild(tileOf('godown', () => saMove(1))); }
  saStars();
}
function saStars() { $('sa-stars').innerHTML = Array.from({ length: SA.goal }, (_, i) => `<span class="fstar${i < SA.stars ? ' on' : ''}" aria-hidden="true"></span>`).join(''); }
function saMove(d) { if (SA.done || SA.end) return; const l = Math.max(0, Math.min(2, SA.lane + d)); if (l !== SA.lane) { SA.lane = l; sfx('tap'); } }
function saStart() {
  Object.assign(SA, { lane: 1, by: SA_LANES[1], items: [], spawn: 0.6, stars: 0, t: 0, bump: 0, whale: -1, end: 0, done: false });
  saRender(); sfx('whoosh'); say([{ k: 'sailing' }, { k: 'boat' }]);
}
function saOpen() { saStart(); }
// gambar perahu layar (x = tengah lambung, y = garis air), Russel duduk di dalamnya
function drawSailboat(c, x, y, t, tilt) {
  x = Math.round(x); y = Math.round(y);
  px(c, x, y - 40, 1, 36, '#7d5230');
  for (let k = 0; k < 30; k++) { const w = Math.round(k * 0.6); px(c, x + 1, y - 40 + k, w, 1, k % 8 < 4 ? '#ffffff' : '#e8eef2'); }
  for (let k = 0; k < 20; k++) { const w = Math.round(k * 0.45); px(c, x - 1 - w, y - 30 + k, w, 1, '#e2483d'); }
  px(c, x + 1, y - 40, 5, 2, '#f4cf3a');
  drawPerson(c, x - 6, y - 3 + tilt, { look: 'me', dir: 'right', mood: 'happy', outfit: effOutfit(), noShadow: true });
  for (let k = 0; k < 7; k++) px(c, x - 17 + k, y - 7 + k, 34 - k * 2, 1, k < 2 ? '#ffffff' : '#4f86e0');
  px(c, x - 15, y - 4, 30, 1, '#2f5bab');
}
PANEL_HOOK.sail = dt => {
  const c = SA.sctx, t = G.t; SA.t += dt;
  const sp = SA.end ? 0 : 26;
  if (!SA.done) {
    // muncul benda dari kanan
    if (!SA.end) {
      SA.spawn -= dt;
      if (SA.spawn <= 0) {
        SA.spawn = 1.15 + Math.random() * 0.5;
        const r = Math.random(), type = r < 0.55 ? 'star' : r < 0.68 ? 'fish' : r < 0.8 ? 'duck' : 'rock';
        SA.items.push({ type, x: 172, lane: Math.floor(Math.random() * 3), got: false });
      }
      if (SA.whale < 0 && SA.stars >= 4) SA.whale = 0;
    }
    for (const it of SA.items) {
      it.x -= sp * dt;
      if (!it.got && Math.abs(it.x - 30) < 9 && it.lane === SA.lane) {
        it.got = true;
        if (it.type === 'star') { SA.stars++; sfx('sparkle'); saStars(); const card = countWord(SA.stars, 'star', '颗', 'kē'); say([{ card, zh: card.zh }]); }
        else if (it.type === 'rock') { SA.bump = 0.8; sfx('bounce'); say([{ k: 'careful' }]); }
        else { sfx('splash'); say([{ k: it.type }]); }
        if (SA.stars >= SA.goal && !SA.end) { SA.end = 0.01; SA.items = SA.items.filter(i => i.x < 40); say([{ k: 'lighthouse' }, { k: 'island' }]); }
      }
    }
    SA.items = SA.items.filter(i => i.x > -12 && !(i.got && i.type !== 'rock'));
    if (SA.whale >= 0) { SA.whale += dt; if (SA.whale > 0.2 && SA.whale < 0.25) say([{ k: 'whale' }]); }
    if (SA.end) {
      SA.end += dt; SA.lane = 1;
      if (SA.end > 4 && !SA.done) {
        SA.done = true; sfx('sparkle'); addCoins(2, G.boy.x, G.boy.y - 30); saRender();
        say([{ k: 'arrived' }, { k: 'island' }, { k: 'great' }]);
      }
    }
  }
  SA.bump = Math.max(0, SA.bump - dt);
  SA.by += (SA_LANES[SA.lane] - SA.by) * Math.min(1, dt * 8);
  // langit, matahari, awan
  for (let y = 0; y < 36; y++) { const k = y / 36; px(c, 0, y, 160, 1, `rgb(${150 + k * 60},${212 + k * 26},245)`); }
  disc(c, 132, 12, 6, '#ffd84a'); disc(c, 132, 12, 4, '#fff2a8');
  for (let i = 0; i < 3; i++) { const cx = ((i * 64 - SA.t * 4) % 200 + 200) % 200 - 20; oval(c, cx, 10 + i * 6, 10, 2, '#ffffff'); oval(c, cx + 4, 8 + i * 6, 5, 2, '#ffffff'); }
  // laut berlapis dengan ombak bergerak
  [[36, '#3a95cc'], [48, '#3f9fd6'], [64, '#4fabdf'], [82, '#5fb3e0'], [98, '#6ec0e8']].forEach(([y, col]) => px(c, 0, y, 160, 110 - y, col));
  for (let y = 40; y < 110; y += 7) for (let x = ((y * 13) % 23) - ((SA.t * (10 + y / 6)) % 23); x < 160; x += 23) px(c, x, y, 7, 1, '#a8dcf5');
  // paus di kejauhan menyemburkan air
  if (SA.whale > 0 && SA.whale < 8) {
    const wx = 170 - SA.whale * 22;
    oval(c, wx, 44, 14, 4, '#2f4a7a'); oval(c, wx - 2, 43, 12, 3, '#3f5f9a'); px(c, wx + 12, 41, 4, 3, '#2f4a7a'); px(c, wx - 6, 42, 1, 1, '#ffffff');
    if (Math.floor(SA.whale * 3) % 2) for (let k = 0; k < 5; k++) px(c, wx - 4 + (k - 2) * 2, 34 - Math.abs(k - 2), 1, 4, '#e8f6fc');
  }
  // pulau dan mercusuar di akhir perjalanan
  if (SA.end) {
    const ix = Math.max(104, 190 - SA.end * 30);
    oval(c, ix + 20, 76, 34, 9, '#e8d6a0'); oval(c, ix + 20, 73, 28, 6, '#f2dca0'); oval(c, ix + 24, 68, 20, 5, '#7cc85a');
    px(c, ix + 34, 40, 8, 28, '#ffffff'); for (let y = 44; y < 68; y += 8) px(c, ix + 34, y, 8, 4, '#e2483d'); px(c, ix + 33, 36, 10, 4, '#2a2a32'); px(c, ix + 35, 37, 6, 2, Math.floor(t * 3) % 2 ? '#ffd84a' : '#fff2a8');
    px(c, ix + 12, 54, 2, 14, '#8a5a35'); oval(c, ix + 13, 54, 7, 2, '#4a9a3a');
  }
  // benda di laut
  for (const it of SA.items) {
    const y = SA_LANES[it.lane], x = Math.round(it.x), bob = Math.round(Math.sin(SA.t * 3 + it.x / 10));
    if (it.type === 'star') { disc(c, x, y - 6 + bob, 4, '#fff2a8'); drawStar(c, x, y - 6 + bob, '#ffd84a'); }
    else if (it.type === 'fish') { const j = Math.max(0, Math.sin(SA.t * 4 + it.x)) * 6; oval(c, x, y - 3 - j, 4, 2, '#f08a32'); px(c, x + 3, y - 5 - j, 2, 4, '#f08a32'); px(c, x - 2, y - 4 - j, 1, 1, '#2a1d18'); }
    else if (it.type === 'duck') drawDuck(c, x, y + bob, -1, SA.t, true);
    else { oval(c, x, y - 2, 6, 4, '#7f7c78'); oval(c, x - 1, y - 3, 5, 3, '#a9a6a0'); px(c, x - 6, y, 12, 1, '#ffffff'); }
  }
  // perahu Russel
  const tilt = SA.bump > 0 ? Math.round(Math.sin(SA.bump * 30)) : 0, bx = SA.end ? Math.min(90, 30 + SA.end * 15) : 30;
  px(c, bx - 16, Math.round(SA.by) + 1, 32, 1, '#ffffff');
  drawSailboat(c, bx, Math.round(SA.by) + Math.round(Math.sin(SA.t * 2.5)) + tilt, t, tilt);
  if (SA.done) for (let i = 0; i < 6; i++) { const a = t * 2 + i * 1.05; drawStar(c, Math.round(80 + Math.cos(a) * 52), Math.round(52 + Math.sin(a) * 30), i % 2 ? '#ffd84a' : '#fff2a8'); }
  SA.ctx.drawImage(upscale4(SA.src), 0, 0);
};
SA.cv.addEventListener('pointerdown', e => {
  if (SA.done) { saStart(); return; }
  const [, y] = cvPoint(SA.cv, e).map(v => v / 4);
  saMove(y < SA.by - 8 ? -1 : y > SA.by + 4 ? 1 : 0);
});
window.addEventListener('keydown', e => { if (G.panel !== 'sail') return; if (e.key === 'ArrowUp') saMove(-1); if (e.key === 'ArrowDown') saMove(1); });
$('sa-title').innerHTML = rubyHTML(word('sailing').zh, word('sailing').py);
$('sa-title').addEventListener('click', () => say([{ k: 'sailing' }]));

// ================= PERAHU LAYAR DI PANTAI =================
SCENES.beach.objs.push({ x: 60, y: 104, hit: [44, 68, 34, 40], go: [74, 114], skin: 'obj-perahu-layar',
  draw(c, t) { shadow(c, 60, 105, 14); drawSailboatSmall(c, 60, 103, t); },
  tap() { say([{ k: 'boat' }, { k: 'sailing' }]); },
  arrive() { G.boy.dir = 'left'; openPanel('sail'); saOpen(); } });
function drawSailboatSmall(c, x, y, t) {
  x = Math.round(x); y = Math.round(y) + Math.round(Math.sin(t * 1.5));
  px(c, x, y - 30, 1, 26, '#7d5230');
  for (let k = 0; k < 20; k++) px(c, x + 1, y - 30 + k, Math.round(k * 0.55), 1, k % 8 < 4 ? '#ffffff' : '#e8eef2');
  for (let k = 0; k < 14; k++) px(c, x - 1 - Math.round(k * 0.4), y - 24 + k, Math.round(k * 0.4), 1, '#e2483d');
  for (let k = 0; k < 5; k++) px(c, x - 12 + k, y - 5 + k, 24 - k * 2, 1, k < 2 ? '#ffffff' : '#4f86e0');
}

// ================= GAMBAR STIKER =================
Object.assign(ST_ART, {
  sailing: (c, x, y) => { drawSailboatSmall(c, x, y - 2, 0); px(c, x - 16, y - 1, 32, 1, '#5fb3e0'); },
  island: (c, x, y) => { oval(c, x, y - 3, 16, 4, '#f2dca0'); oval(c, x + 2, y - 6, 10, 3, '#7cc85a'); px(c, x - 5, y - 20, 2, 14, '#8a5a35'); oval(c, x - 4, y - 20, 7, 2, '#4a9a3a'); px(c, x - 16, y - 1, 32, 1, '#5fb3e0'); },
  lighthouse: (c, x, y) => { px(c, x - 4, y - 28, 8, 28, '#ffffff'); for (let k = 0; k < 24; k += 8) px(c, x - 4, y - 24 + k, 8, 4, '#e2483d'); px(c, x - 5, y - 32, 10, 4, '#2a2a32'); px(c, x - 3, y - 31, 6, 2, '#ffd84a'); },
  whale: (c, x, y) => { oval(c, x, y - 6, 14, 5, '#2f4a7a'); oval(c, x - 2, y - 7, 12, 4, '#3f5f9a'); px(c, x + 12, y - 9, 4, 4, '#2f4a7a'); px(c, x - 6, y - 8, 1, 1, '#ffffff'); for (let k = 0; k < 5; k++) px(c, x - 4 + (k - 2) * 2, y - 18 - Math.abs(k - 2), 1, 5, '#8fd0f2'); },
  careful: (c, x, y) => { oval(c, x, y - 5, 8, 5, '#7f7c78'); oval(c, x - 1, y - 6, 7, 4, '#a9a6a0'); px(c, x - 1, y - 24, 3, 9, '#e2483d'); px(c, x - 1, y - 13, 3, 3, '#e2483d'); },
});
