// Mesin game: dunia, sentuhan, Ān'ān & Dòudou, cuaca, siang/malam, kartu kata.

const PANTS = [['blue', '#3f6fb5'], ['green', '#4f8a3a'], ['red', '#c9473a'], ['yellow', '#d9a82a']];
const G = {
  scene: null, night: false, weather: 'sun', t: 0, started: false, panel: null,
  outfit: { hat: false, shirt: 0, pants: 0, shoes: true, scarf: false, umbrella: false },
  mood: 'happy', moodT: 0, eggCount: 0, appleCount: 0, eatCount: 0,
  fade: 0, fadeDir: 0, fadeMid: null, fadeAfter: null, bgDirty: true, marker: null, sleepT: 0, sleepStep: 0,
};
const SAVE_KEY = 'anan-village-v1';
G.bag = []; G.giving = null; G.hd = true; G.cardPos = null; G.hudOff = false; G.cardOff = false;
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ outfit: G.outfit, music: Snd.on, alsoId: Talk.alsoId, bag: G.bag, hd: G.hd, cardPos: G.cardPos, hudOff: G.hudOff, cardOff: G.cardOff, lang: LANG })); } catch (e) {} }
(function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (d) {
      Object.assign(G.outfit, d.outfit || {}); Snd.on = d.music !== false; Talk.alsoId = !!d.alsoId;
      G.bag = (d.bag || []).filter(k => ITEMS[k]).slice(0, 8); G.hd = d.hd !== false; G.cardPos = d.cardPos || null; G.hudOff = !!d.hudOff; G.cardOff = !!d.cardOff;
    }
  } catch (e) {}
})();

// Dunia digambar di 320x180, lalu dihaluskan dengan Scale2x ke 640x360 (tepi miring jadi lebih rapi)
// Dihaluskan dua kali: 320x180 → 640x360 → 1280x720. Perangkat lambat otomatis turun ke 2×.
const cv = document.getElementById('game');
cv.width = W * 4; cv.height = H * 4;
const outCtx = cv.getContext('2d');
const lo = document.createElement('canvas'); lo.width = W; lo.height = H;
const ctx = lo.getContext('2d', { willReadFrequently: true });
const midCv = document.createElement('canvas'); midCv.width = W * 2; midCv.height = H * 2;
const midCtx = midCv.getContext('2d');
const midImg = midCtx.createImageData(W * 2, H * 2);
const mid32 = new Uint32Array(midImg.data.buffer);
const outImg = outCtx.createImageData(W * 4, H * 4);
const out32 = new Uint32Array(outImg.data.buffer);
let hdLevel = 2, perfN = 0, perfSum = 0;
function present() {
  outCtx.imageSmoothingEnabled = false;
  if (!G.hd) { outCtx.drawImage(lo, 0, 0, W * 4, H * 4); return; }
  const t0 = performance.now();
  epx(new Uint32Array(ctx.getImageData(0, 0, W, H).data.buffer), mid32, W, H);
  if (hdLevel === 2) { epx(mid32, out32, W * 2, H * 2); outCtx.putImageData(outImg, 0, 0); }
  else { midCtx.putImageData(midImg, 0, 0); outCtx.drawImage(midCv, 0, 0, W * 4, H * 4); }
  perfSum += performance.now() - t0;
  if (++perfN === 90) { if (hdLevel === 2 && perfSum / perfN > 14) hdLevel = 1; perfN = 0; perfSum = 0; }
}
const bgCv = document.createElement('canvas'); bgCv.width = W; bgCv.height = H;
const bgCtx = bgCv.getContext('2d');
const layer = document.createElement('canvas'); layer.width = W; layer.height = H;
const lctx = layer.getContext('2d');
const sil = document.createElement('canvas'); sil.width = W; sil.height = H;
const sctx = sil.getContext('2d');
const $ = id => document.getElementById(id);

// ---------- Ān'ān & Dòudou ----------
G.boy = { x: 58, y: 92, tx: 58, ty: 92, moving: false, dir: 'down', frame: 0, ft: 0, act: null, actT: 0, actDur: 0, cb: null, hidden: false, inBed: false };
G.dog = {
  x: 40, y: 96, dir: 1, f: 0, ft: 0, state: 'sit', happyT: 0, idle: 0, n: 0,
  // Dòudou hanya ada di halaman (Pertanian), tidak ikut ke tempat lain
  get hidden() { return !G.scene || G.scene.id !== 'farm' || !!this.hiding; },
  get hit() { return [this.x - 11, this.y - 18, 22, 19]; },
  tap() {
    this.happyT = 1.8; this.n++;
    say([{ k: ['dog', 'woof', 'doudou'][this.n % 3] }]);
    fx('heart', this.x, this.y - 18, 2);
  },
  receive(type) {
    this.happyT = 2;
    if (ITEMS[type].food) { say([{ k: type }, { k: 'woof' }]); fx('heart', this.x, this.y - 18, 3); }
    else say([{ k: 'cannoteat' }, { k: 'woof' }]);
  },
};

// ---------- Tas ----------
const BAG_MAX = 8;
function removeObj(o) { const a = G.scene.objs, i = a.indexOf(o); if (i >= 0) a.splice(i, 1); }
function updateBag(bump) {
  const n = $('bag-count'); n.textContent = G.bag.length; n.hidden = !G.bag.length;
  if (bump) { const b = $('btn-bag'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
}
function bagAdd(type, x, y, quiet) {
  if (G.bag.length >= BAG_MAX) { say([{ k: 'bagfull' }]); return false; }
  G.bag.push(type); save(); updateBag(true);
  doAct(G.boy, 'wash', 0.4); sfx('pop');
  fx('item', x, y, 1, type);
  if (!quiet) say([{ k: type }, { k: 'take', zh: '拿！' }]);
  return true;
}
// Dua tombol besar melayang di atas benda: 吃 (makan) atau 拿 (ambil ke tas)
const CHOICE_HTML = LANG === 'en' ? {
  eat: '<span class="en">Eat</span><small>makan</small>',
  take: '<span class="en">Take</span><small>ke tas</small>',
} : LANG === 'ja' ? {
  eat: '<ruby class="ja">たべる<rt>taberu</rt></ruby><small>makan</small>',
  take: '<ruby class="ja">とる<rt>toru</rt></ruby><small>ke tas</small>',
} : {
  eat: '<ruby>吃<rt class="t1">chī</rt></ruby><small>makan</small>',
  take: '<ruby>拿<rt class="t2">ná</rt></ruby><small>ke tas</small>',
};
let choiceT = null;
function hideChoice() { $('choice').hidden = true; clearTimeout(choiceT); }
function offerChoice(x, y, opts) {
  const el = $('choice'); el.innerHTML = '';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'act act-' + o.act; b.innerHTML = o.html || CHOICE_HTML[o.act];
    b.addEventListener('click', e => { e.stopPropagation(); hideChoice(); sfx('tap'); o.fn(); });
    el.appendChild(b);
  });
  el.style.left = (x / W * 100) + '%'; el.style.top = (y / H * 100) + '%';
  el.hidden = false; clearTimeout(choiceT); choiceT = setTimeout(hideChoice, 6000);
  sfx('pop');
}
// Tombol bergambar untuk anak yang belum bisa membaca; offerPics menjaga barisan tetap di dalam layar
function picBtn(k, act, fn) {
  const w = word(k);
  return { act, html: `<img class="act-pic" src="${stickerCanvas(k)}" alt=""><span>${rubyHTML(w.zh, w.py)}</span>`, fn };
}
function offerPics(x, y, btns) {
  const half = btns.length * 16;
  offerChoice(Math.max(half, Math.min(W - half, x)), Math.max(58, y), btns);
}
function bagTake(type) { const i = G.bag.indexOf(type); if (i >= 0) G.bag.splice(i, 1); save(); updateBag(); }
function eatItem(type) {
  if (!ITEMS[type].food) { doAct(G.boy, 'wave', 1); say(ITEMS[type].adult ? [{ k: 'coffeeadult' }, { k: 'givedad' }] : [{ k: 'cannoteat' }]); return; }
  bagTake(type);
  G.boy.dir = 'down'; doAct(G.boy, 'eat', 1.4); sfx('eat');
  say([{ k: type }, { k: 'yummy', by: G.boy }]); fx('heart', G.boy.x, G.boy.y - 28, 2);
}
function startGive(type) {
  G.giving = type; G.givingT = 25;
  say([{ k: 'towhom' }]);
}
function giveTo(o) {
  const type = G.giving; if (!type) return;
  G.giving = null; bagTake(type);
  fx('item', (G.boy.x + o.x) / 2, Math.min(G.boy.y, o.y) - 20, 1, type);
  doAct(G.boy, 'wave', 0.8); sfx('chime');
  o.receive(type);
}
function throwItem(type) {
  bagTake(type);
  const b = G.boy, w = G.scene.walk;
  const dx = b.dir === 'left' ? -1 : b.dir === 'right' ? 1 : 0, dy = b.dir === 'up' ? -1 : b.dir === 'down' ? 1 : 0;
  const tx = Math.max(w[0] + 6, Math.min(w[2] - 6, b.x + dx * 56)), ty = Math.max(w[1] + 8, Math.min(w[3] - 2, b.y + dy * 36 + (dx ? 4 : 0)));
  const sx = b.x, sy = b.y - 16;
  doAct(b, 'wave', 0.6); sfx('whoosh');
  say([{ k: 'throw', zh: '扔！' }]);
  G.scene.objs.push({
    x: sx, y: sy, k: 0, top: true,
    draw(c) { const h = Math.sin(this.k * Math.PI) * 22; drawItem(c, this.x, this.y - h, type); },
    update(dt) {
      this.k += dt / 0.6;
      this.x = sx + (tx - sx) * Math.min(1, this.k); this.y = sy + (ty - sy) * Math.min(1, this.k);
      if (this.k >= 1) { removeObj(this); G.scene.objs.push(pickup(type, tx, ty)); sfx('bounce'); fx('dust', tx, ty, 3); }
    },
  });
}

function effOutfit() {
  const o = G.outfit, out = G.scene && G.scene.outdoor;
  return {
    hat: o.hat, shoes: o.shoes, shirt: SHIRT_COLORS[o.shirt], pants: PANTS[o.pants][1], costume: o.costume,
    scarf: o.scarf || (out && G.weather === 'snow'), umbrella: o.umbrella || (out && G.weather === 'rain'),
  };
}

function doAct(o, name, dur) { o.act = name; o.actT = 0; o.actDur = dur; }
function sfx(n) { Snd.sfx(n); }

function canStand(x, y) {
  const s = G.scene, w = s.walk;
  if (x < w[0] || x > w[2] || y < w[1] || y > w[3]) return false;
  for (const b of s.blocks) if (x > b[0] - 3 && x < b[0] + b[2] + 3 && y > b[1] && y < b[1] + b[3] + 2) return false;
  return true;
}
function walkTo(x, y, cb) {
  const b = G.boy, w = G.scene.walk;
  if (b.hidden) return;
  b.tx = Math.max(w[0], Math.min(w[2], x)); b.ty = Math.max(w[1], Math.min(w[3], y));
  b.cb = cb || null; b.moving = true;
}
function updateBoy(dt) {
  const b = G.boy;
  if (b.act) { b.actT += dt; if (b.actT > b.actDur) b.act = null; }
  if (b.ride) { b.ride(dt); return; }
  if (!b.moving) return;
  const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy);
  const arrive = () => { b.moving = false; b.frame = 0; const cb = b.cb; b.cb = null; if (cb) cb(); };
  if (d < 1.5) return arrive();
  const st = Math.min(d, 60 * dt), nx = b.x + dx / d * st, ny = b.y + dy / d * st;
  if (canStand(nx, ny)) { b.x = nx; b.y = ny; }
  else if (Math.abs(dx) > 0.5 && canStand(nx, b.y)) b.x = nx;
  else if (Math.abs(dy) > 0.5 && canStand(b.x, ny)) b.y = ny;
  else return arrive();
  b.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  b.ft += dt; b.frame = [1, 0, 2, 0][Math.floor(b.ft * 8) % 4];
}
// Russel naik permainan (ayunan, perosotan): b.ride dipanggil tiap frame sampai selesai
function ridePath(points, durs, onPhase, onEnd) {
  let i = 0, t = 0;
  return dt => {
    const b = G.boy; t += dt;
    const k = Math.min(1, t / durs[i]), p = points[i], q = points[i + 1];
    b.x = p[0] + (q[0] - p[0]) * k; b.y = p[1] + (q[1] - p[1]) * k;
    b.ft += dt; b.frame = q[2] === 'slide' ? 0 : [1, 0, 2, 0][Math.floor(b.ft * 7) % 4];
    b.dir = q[3] || b.dir;
    if (k >= 1) {
      i++; t = 0;
      if (i >= durs.length) { b.ride = null; b.frame = 0; if (onEnd) onEnd(); }
      else if (onPhase) onPhase(i);
    }
  };
}
function stopRide() { const b = G.boy; if (b.rideEnd) b.rideEnd(); b.ride = null; b.rideEnd = null; b.frame = 0; }

function updateDog(dt) {
  const d = G.dog, b = G.boy, w = G.scene.walk;
  if (d.hidden) return;
  d.ft += dt;
  if (d.trickT > 0) { d.trickT -= dt; d.state = d.trick; d.ft += dt; return; }
  // ikut naik perosotan: Dòudou menapaki jejak Russel sedikit di belakangnya
  if (b.dogFollow || (d.trail && d.trail.length)) {
    d.trail = d.trail || [];
    if (b.dogFollow) d.trail.push([b.x - 5, b.y + 1]);
    if (d.trail.length > (b.dogFollow ? 12 : 0)) {
      const [nx, ny] = d.trail.shift();
      if (Math.abs(nx - d.x) > 0.2) d.dir = nx > d.x ? 1 : -1;
      d.x = nx; d.y = ny; d.state = 'walk'; d.ft += dt; d.f = [1, 0, 2, 0][Math.floor(d.ft * 10) % 4];
    }
    return;
  }
  if (d.happyT > 0) { d.happyT -= dt; d.state = 'happy'; return; }
  if (b.soak) { d.state = 'sit'; d.f = 0; return; }
  const face = b.dir === 'left' ? -1 : b.dir === 'right' ? 1 : (d.x < b.x ? 1 : -1);
  const tx = Math.max(w[0], Math.min(w[2], b.x - face * 16)), ty = Math.max(w[1], Math.min(w[3], b.y + 3));
  const dx = tx - d.x, dy = ty - d.y, dist = Math.hypot(dx, dy);
  if (dist > 6 && !b.hidden) {
    const sp = dist > 50 ? 95 : 62, st = Math.min(dist, sp * dt);
    d.x += dx / dist * st; d.y += dy / dist * st;
    if (Math.abs(dx) > 1) d.dir = dx > 0 ? 1 : -1;
    d.state = 'walk'; d.f = [1, 0, 2, 0][Math.floor(d.ft * 10) % 4]; d.idle = 0;
  } else {
    d.idle += dt; d.f = 0;
    if (d.idle > 0.5) { d.state = 'sit'; d.dir = b.x >= d.x ? 1 : -1; }
  }
}

// ---------- Partikel ----------
const parts = [];
function fx(type, x, y, n = 1, item) {
  for (let i = 0; i < n; i++) {
    const p = { type, x: x + (n > 1 ? (Math.random() - 0.5) * 10 : 0), y, vx: 0, vy: 0, life: 1, max: 1, item };
    if (type === 'heart') { p.vy = -16; p.vx = (Math.random() - 0.5) * 8; p.max = p.life = 1.2; p.x = x + (i - (n - 1) / 2) * 8; }
    if (type === 'note') { p.vy = -14; p.max = p.life = 1.4; }
    if (type === 'spark') { const a = Math.random() * 6.28; p.vx = Math.cos(a) * 30; p.vy = Math.sin(a) * 30; p.max = p.life = 0.6; }
    if (type === 'bubble') { p.vy = -10 - Math.random() * 10; p.vx = (Math.random() - 0.5) * 16; p.max = p.life = 1 + Math.random() * 0.6; }
    if (type === 'drop') { p.y = y - 6 - Math.random() * 6; p.vy = 40; p.max = p.life = 0.35 + Math.random() * 0.2; p.x = x + (Math.random() - 0.5) * 14; }
    if (type === 'z') { p.vy = -9; p.vx = 4; p.max = p.life = 1.8; }
    if (type === 'dust') { p.vx = (Math.random() - 0.5) * 20; p.vy = -6; p.max = p.life = 0.5; }
    if (type === 'smoke' || type === 'steam') { p.vy = -10; p.vx = type === 'smoke' ? -6 : (Math.random() - 0.5) * 4; p.max = p.life = 1.6; }
    if (type === 'splash') { p.vx = (Math.random() - 0.5) * 30; p.vy = -30 - Math.random() * 20; p.max = p.life = 0.6; }
    if (type === 'item') { p.vy = -34; p.max = p.life = 1.1; }
    parts.push(p);
  }
}
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; }
    if (p.type === 'splash') p.vy += 120 * dt;
    if (p.type === 'item') p.vy += 30 * dt;
    if (p.type === 'note') p.vx = Math.sin(p.life * 8) * 8;
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
}
function drawParts(c) {
  for (const p of parts) {
    const a = Math.min(1, p.life / p.max * 2.2), x = Math.round(p.x), y = Math.round(p.y);
    c.globalAlpha = a;
    switch (p.type) {
      case 'heart': drawHeart(c, x, y); break;
      case 'note': drawNote(c, x, y); break;
      case 'spark': px(c, x, y - 1, 1, 3, '#fff2a8'); px(c, x - 1, y, 3, 1, '#fff2a8'); break;
      case 'bubble': px(c, x - 1, y - 2, 3, 1, '#ffffff'); px(c, x - 1, y + 1, 3, 1, '#ffffff'); px(c, x - 2, y - 1, 1, 2, '#ffffff'); px(c, x + 2, y - 1, 1, 2, '#ffffff'); break;
      case 'drop': px(c, x, y, 1, 2, '#8fd0f2'); break;
      case 'z': drawZ(c, x, y, '#ffffff'); break;
      case 'dust': px(c, x, y, 2, 2, '#d9c9a0'); break;
      case 'smoke': disc(c, x, y, 2 + Math.round((1 - p.life / p.max) * 3), '#e3e3e3'); break;
      case 'steam': c.globalAlpha = a * 0.6; disc(c, x, y, 1 + Math.round((1 - p.life / p.max) * 2), '#ffffff'); break;
      case 'splash': px(c, x, y, 1, 1, '#d8f0fc'); break;
      case 'item': drawItem(c, x, y, p.item); break;
    }
  }
  c.globalAlpha = 1;
}

// ---------- Cuaca ----------
const wx = { drops: [], flakes: [], leaves: [], clouds: [] };
for (let i = 0; i < 80; i++) wx.drops.push({ x: Math.random() * W, y: Math.random() * H, s: 150 + Math.random() * 60 });
for (let i = 0; i < 70; i++) wx.flakes.push({ x: Math.random() * W, y: Math.random() * H, s: 10 + Math.random() * 14, p: Math.random() * 6, big: Math.random() < 0.3 });
for (let i = 0; i < 16; i++) wx.leaves.push({ x: Math.random() * W, y: Math.random() * H, s: 90 + Math.random() * 60, p: Math.random() * 6, c: Math.random() < 0.5 ? '#7cc85a' : '#e9c84a' });
for (let i = 0; i < 4; i++) wx.clouds.push({ x: i * 90, y: 20 + Math.random() * 130, rx: 30 + Math.random() * 20 });
function drawWeather(c, dt) {
  const w = G.weather;
  if (w === 'cloud' || w === 'rain' || w === 'snow') for (const cl of wx.clouds) { cl.x += dt * 6; if (cl.x - cl.rx > W) cl.x = -cl.rx; oval(c, Math.round(cl.x), Math.round(cl.y), cl.rx, Math.round(cl.rx * 0.4), 'rgba(40,50,80,0.10)'); }
  if (w === 'rain') for (const d of wx.drops) {
    d.y += d.s * dt; d.x -= d.s * 0.2 * dt;
    if (d.y > H) { d.y = -4; d.x = Math.random() * (W + 30); if (Math.random() < 0.5) parts.push({ type: 'splash', x: d.x, y: 30 + Math.random() * 145, vx: 0, vy: -10, life: 0.2, max: 0.2 }); }
    px(c, d.x, d.y, 1, 3, 'rgba(220,238,255,0.75)');
  }
  if (w === 'snow') for (const f of wx.flakes) {
    f.y += f.s * dt; f.x += Math.sin(G.t + f.p) * 8 * dt;
    if (f.y > H) { f.y = -2; f.x = Math.random() * W; }
    px(c, f.x, f.y, f.big ? 2 : 1, f.big ? 2 : 1, '#ffffff');
  }
  if (w === 'wind') for (const l of wx.leaves) {
    l.x += l.s * dt; l.y += Math.sin(G.t * 3 + l.p) * 20 * dt;
    if (l.x > W) { l.x = -4; l.y = Math.random() * H; }
    px(c, l.x, l.y, 2, 1, l.c); px(c, l.x - 10, l.y + 3, 5, 1, 'rgba(255,255,255,0.35)');
  }
}
function drawTint(c) {
  const s = G.scene, out = s.outdoor;
  const tint = (col, mode = 'multiply') => { c.globalCompositeOperation = mode; c.fillStyle = col; c.fillRect(0, 0, W, H); };
  if (out && G.weather === 'rain') tint('#aab4c4');
  if (out && G.weather === 'cloud') tint('#d6dce4');
  if (out && G.weather === 'snow') { tint('#dfe6ef'); tint('rgba(255,255,255,0.10)', 'screen'); }
  if (G.night) {
    tint(out ? '#5864a8' : '#9690c0');
    c.globalCompositeOperation = 'lighter';
    for (const [x, y, r] of s.lights || []) {
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,196,110,0.42)'); g.addColorStop(1, 'rgba(255,196,110,0)');
      c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }
  c.globalCompositeOperation = 'source-over';
}

// ---------- Kartu kata & gelembung bicara ----------
let cardTimer = null, cardZh = '';
// Hanzi dapat pinyin di atasnya; nama Latin & tanda baca tampil apa adanya.
// Jepang: romaji di atas seluruh kata (kana tidak dipecah per huruf).
function rubyHTML(zh, py) {
  if (LANG === 'ja') return py ? `<ruby class="ja">${zh}<rt>${py}</rt></ruby>` : `<span class="plain">${zh}</span>`;
  const toks = zh.match(/[A-Za-z']+|[㐀-鿿]|[^A-Za-z㐀-鿿\s]/g) || [];
  const syl = py.split(/\s+/).filter(Boolean);
  const need = toks.filter(t => /^[A-Za-z']+$|[㐀-鿿]/.test(t)).length;
  if (need !== syl.length) return `<span class="plain">${zh}</span>` + (/[㐀-鿿]/.test(zh) ? `<span class="plainpy">${py}</span>` : '');
  let i = 0;
  return toks.map(t => {
    if (/^[A-Za-z']+$/.test(t)) { i++; return `<span class="latin">${t}</span>`; }
    if (/[㐀-鿿]/.test(t)) { const s = syl[i++]; return `<ruby>${t}<rt class="t${toneOf(s)}">${s}</rt></ruby>`; }
    return `<span class="punct">${t}</span>`;
  }).join('');
}
function showCard(card, zh) {
  const el = $('card');
  // kartu kata bisa dimatikan di menu orang tua: kata tetap diucapkan, hanya tulisannya tidak tampil
  if (G.cardOff) { cardZh = zh || card.zh; el.hidden = true; return; }
  // kartu Jepang: kana besar, romaji kecil di bawahnya
  $('card-zh').innerHTML = LANG === 'ja' ? `<span class="plain">${card.zh}</span>` + (card.py ? `<span class="plainpy">${card.py}</span>` : '') : rubyHTML(card.zh, card.py);
  const len = [...card.zh].length, lim = { zh: [6, 99], en: [12, 24], ja: [7, 13] }[LANG];
  $('card-zh').classList.toggle('long', len > lim[0]);
  $('card-zh').classList.toggle('xlong', len > lim[1]);
  $('card-id').textContent = card.id;
  cardZh = zh || card.zh;
  el.hidden = false; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  clearTimeout(cardTimer);
  // cadangan bila suara tidak memberi tanda selesai
  cardTimer = setTimeout(hideCard, 2500 + [...cardZh].length * { zh: 450, en: 90, ja: 260 }[LANG]);
}
function hideCard() { if (!$('card').classList.contains('dragging')) $('card').hidden = true; }
// Kartu hilang 0,2 detik setelah kalimat terakhir selesai diucapkan
function hideCardSoon() { clearTimeout(cardTimer); cardTimer = setTimeout(hideCard, 200); }
const bubbles = [];
function bubble(who, text) {
  const el = document.createElement('div');
  el.className = 'bubble'; el.textContent = text;
  $('bubbles').appendChild(el);
  bubbles.push({ el, who, until: G.t + 2.8 });
}
function updateBubbles() {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if (G.t > b.until || G.panel) { b.el.remove(); bubbles.splice(i, 1); continue; }
    const tall = b.who === G.boy || (b.who.look && LOOKS[b.who.look].kid) ? 29 : 36;
    b.el.style.left = (b.who.x / W * 100) + '%';
    b.el.style.top = ((b.who.y - tall) / H * 100) + '%';
  }
}

// list: [{ k: kunci kata } | { card, zh } , opsional by: siapa yang bicara]
// zh = kalimat khusus dalam Mandarin; di mode English diganti lewat tr()
function say(list, done) {
  const items = list.map(it => {
    const card = it.card || word(it.k);
    const zh = it.zh ? (it.card ? (LANG !== 'zh' ? card.zh : it.zh) : tr(it.zh)) : card.zh;
    // stiker untuk kata baru; rekaman keluarga dipakai bila kalimatnya sama dengan katanya
    const rec = it.k && window.hasRec && hasRec(it.k) && sameText(zh, card.zh) ? it.k : null;
    const who = !it.by ? null : it.by === G.boy ? 'me' : it.by.look || it.by.voice || null;
    return { zh, id: card.id, rec, who, onStart: () => { showCard(card, zh); if (it.by) bubble(it.by, zh); if (it.k && window.collectSticker) collectSticker(it.k); } };
  });
  Talk.say(items, () => { hideCardSoon(); if (done) done(); });
}
function sayCount(n, noun, m, mpy) {
  const card = countWord(n, noun, m, mpy);
  const list = [{ card, zh: card.zh }];
  if (n === 10) { list.push({ k: 'great' }); sfx('sparkle'); }
  say(list);
}

// ---------- Siang/malam & cuaca ----------
const WEATHERS = ['sun', 'cloud', 'rain', 'wind', 'snow'];
const WEATHER_WORD = { sun: 'sunny', cloud: 'cloudy', rain: 'rain', wind: 'windy', snow: 'snow' };
function setNight(n, quiet) {
  G.night = n; G.bgDirty = true;
  Snd.mood({ night: n });
  updateIcons();
  if (!quiet) say(n ? [{ k: 'night' }, { k: 'goodevening', by: G.boy }] : [{ k: 'morning' }, { k: 'goodmorning', by: G.boy }]);
}
function setWeather(w) {
  G.weather = w; G.bgDirty = true;
  Snd.mood({ weather: w });
  updateIcons();
  const list = [{ k: WEATHER_WORD[w] }];
  if (G.scene.outdoor && w === 'rain' && !G.outfit.umbrella) list.push({ k: 'umbrella' });
  if (G.scene.outdoor && w === 'snow' && !G.outfit.scarf) list.push({ k: 'scarf' });
  say(list);
}

// ---------- Pindah tempat ----------
function fadeTo(mid, after) { G.fadeDir = 1; G.fadeMid = mid; G.fadeAfter = after || null; }
function updateFade(dt) {
  if (!G.fadeDir) return;
  if (G.fadeDir < 0 && G.fade >= 1 && typeof Skin !== 'undefined' && Skin.waiting()) return;
  G.fade += G.fadeDir * dt * 3;
  if (G.fadeDir > 0 && G.fade >= 1) { G.fade = 1; G.fadeDir = -1; if (G.fadeMid) G.fadeMid(); G.fadeMid = null; }
  if (G.fadeDir < 0 && G.fade <= 0) { G.fade = 0; G.fadeDir = 0; const a = G.fadeAfter; G.fadeAfter = null; if (a) a(); }
}
function enterScene(id, at) {
  const s = G.scene = SCENES[id];
  parts.length = 0;
  G.boy.x = at[0]; G.boy.y = at[1]; G.boy.moving = false; G.boy.cb = null; G.boy.ride = null; G.boy.rideEnd = null; G.boy.soak = false; G.boy.jumpH = 0; G.boy.dogFollow = false; G.dog.trail = [];
  G.dog.x = at[0] + (at[0] > 160 ? 14 : -14); G.dog.y = at[1] + 2;
  G.bgDirty = true;
  const pw = word(s.place);
  $('place').innerHTML = rubyHTML(pw.zh, pw.py);
  $('place').setAttribute('aria-label', 'Nama tempat: ' + pw.id);
  fitPlace();
  Snd.mood({ outdoor: s.outdoor });
  if (s.enter) s.enter();
}
function goScene(id, at) { sfx('door'); fadeTo(() => enterScene(id, at)); }

// ---------- Sentuhan di dunia ----------
let lastTap = { o: null, t: 0 };
function hitOf(o) { return o.hit; }
function inRect(x, y, r) { return r && x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3]; }
cv.addEventListener('pointerdown', e => {
  if (!G.started || G.fadeDir || G.panel) return;
  hideChoice();
  const r = cv.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
  const s = G.scene;
  if (G.boy.hidden) {
    // ketuk saat tidur = percepat pagi
    if (G.boy.inBed) G.sleepT = Math.max(G.sleepT, G.sleepStep === 0 ? 2.9 : 6.9);
    return;
  }
  // sedang di ayunan: ketuk mana saja = turun. Di perosotan: tunggu sampai bawah.
  if (G.boy.ride) { if (G.boy.rideEnd) stopRide(); return; }
  for (const ex of s.exits) if (inRect(x, y, ex.hit)) {
    sfx('tap');
    walkTo(ex.go[0], ex.go[1], () => { if (ex.leave) ex.leave(); goScene(ex.to, ex.at); });
    return;
  }
  let best = null, bestY = -1e9, bestA = 1e9;
  const cands = s.objs.concat([G.dog]);
  for (const o of cands) {
    if (o.hidden || !o.tap) continue;
    const h = hitOf(o);
    if (!inRect(x, y, h)) continue;
    const oy = o.top ? 1e6 : (o.y || 0), a = h[2] * h[3];
    if (oy > bestY + 0.5 || (Math.abs(oy - bestY) <= 0.5 && a < bestA)) { best = o; bestY = oy; bestA = a; }
  }
  if (best) {
    if (lastTap.o === best && G.t - lastTap.t < 0.45) return;
    lastTap = { o: best, t: G.t };
    if (G.giving && best.receive) {
      const to = best, go = to.go || [to.x + (G.boy.x < to.x ? -14 : 14), to.y];
      walkTo(go[0], go[1], () => giveTo(to));
      return;
    }
    best.tap();
    const go = best.go;
    if (go) walkTo(go[0], go[1], best.arrive ? () => {
      const b = G.boy;
      // saat beraksi Russel menghadap samping atau depan, tidak membelakangi layar
      if (best.x != null) b.dir = Math.abs(best.x - b.x) > 4 ? (best.x > b.x ? 'right' : 'left') : 'down';
      best.arrive();
    } : null);
    else if (best === G.dog) walkTo(G.dog.x + (G.boy.x < G.dog.x ? -14 : 14), G.dog.y);
    return;
  }
  sfx('tap');
  G.marker = { x, y, t: 0.5 };
  walkTo(x, y);
});

// ---------- Gambar dunia ----------
function render(dt) {
  // tempat yang sudah memakai gambar desain baru digambar oleh skin.js
  if (typeof Skin !== 'undefined') { if (Skin.use()) { Skin.render(dt); return; } Skin.pixel(); }
  const s = G.scene, c = ctx;
  if (G.bgDirty) { bgCtx.clearRect(0, 0, W, H); s.bg(bgCtx); G.bgDirty = false; }
  c.drawImage(bgCv, 0, 0);
  const t = G.t;
  for (const o of s.objs) if (o.flat && !o.hidden) o.draw(c, t);
  const list = s.objs.filter(o => !o.flat && !o.top && !o.hidden);
  const b = G.boy, d = G.dog;
  const boyE = { y: b.y, draw: cc => {
    if (b.hidden) return;
    const of = effOutfit();
    const bob = b.act === 'rope' ? Math.round(Math.max(0, Math.sin(b.actT * 9)) * 3)
      : b.act === 'hop' ? Math.round(Math.abs(Math.sin(b.actT * 7)) * 7) : Math.round(b.jumpH || 0);
    const opts = { look: 'me', dir: b.dir, frame: b.frame, mood: G.mood, outfit: of, act: b.act, actT: b.actT, umbrella: of.umbrella && !b.act && !b.soak, bob };
    if (b.soak) {
      // berendam: hanya kepala & bahu di atas air, dengan riak
      cc.save(); cc.beginPath(); cc.rect(b.x - 20, b.y - 44, 40, 38); cc.clip();
      drawPerson(cc, b.x, b.y, Object.assign(opts, { noShadow: true, dir: 'down' }));
      cc.restore();
      const w = Math.round(Math.abs(Math.sin(G.t * 3)) * 3);
      px(cc, b.x - 9 - w, b.y - 6, 5, 1, '#ffffff'); px(cc, b.x + 5 + w, b.y - 6, 5, 1, '#ffffff');
      px(cc, b.x - 5, b.y - 5, 10, 1, '#cfefff');
    } else drawPerson(cc, b.x, b.y, opts);
  } };
  const dogE = { y: d.y, draw: cc => drawDogTrick(cc, d.x, d.y, d.dir, d.f, d.state, t) };
  list.push(boyE);
  if (!d.hidden) list.push(dogE);
  list.sort((p, q) => (p.y || 0) - (q.y || 0));
  // Semua yang berdiri digambar di lapisan sendiri lalu diberi garis tepi gelap (gaya stiker)
  lctx.clearRect(0, 0, W, H);
  SHADOW_TO = c;
  for (const o of list) o.draw(lctx, t);
  for (const o of s.objs) if (o.top && !o.hidden) o.draw(lctx, t);
  SHADOW_TO = null;
  sctx.globalCompositeOperation = 'source-over'; sctx.clearRect(0, 0, W, H); sctx.drawImage(layer, 0, 0);
  sctx.globalCompositeOperation = 'source-in'; sctx.fillStyle = 'rgba(46,30,20,0.85)'; sctx.fillRect(0, 0, W, H);
  sctx.globalCompositeOperation = 'source-over';
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) c.drawImage(sil, dx, dy);
  c.drawImage(layer, 0, 0);
  drawParts(c);
  if (s.outdoor) drawWeather(c, dt);
  drawTint(c);
  for (const ex of s.exits) if (ex.arrow) drawArrow(c, ex.arrow[0], ex.arrow[1], ex.arrow[2], t);
  if (G.marker) {
    const m = G.marker, r = Math.round((0.5 - m.t) * 10) + 2;
    c.globalAlpha = Math.max(0, m.t * 2);
    oval(c, Math.round(m.x), Math.round(m.y), r, Math.max(1, Math.round(r / 2)), '#fff2a8');
    oval(c, Math.round(m.x), Math.round(m.y), Math.max(0, r - 1), Math.max(0, Math.round(r / 2) - 1), 'rgba(0,0,0,0)');
    c.globalAlpha = 1;
    m.t -= dt; if (m.t <= 0) G.marker = null;
  }
  // barang yang sedang mau diberikan melayang di atas kepala
  if (G.giving && !b.hidden) {
    const bob = Math.round(Math.abs(Math.sin(G.t * 4)) * 3);
    drawOutlined(c, b.x, b.y - 30 - bob, 1, (cc, x, y) => drawItem(cc, x, y, G.giving));
  }
  if (G.fade > 0) { c.fillStyle = `rgba(20,16,30,${G.fade})`; c.fillRect(0, 0, W, H); }
  present();
}

function frame(now) {
  const dt = Math.min(0.05, (now - (frame.last || now)) / 1000);
  frame.last = now;
  G.t += dt;
  const s = G.scene;
  if (G.moodT > 0) { G.moodT -= dt; if (G.moodT <= 0) G.mood = 'happy'; }
  if (G.giving) { G.givingT -= dt; if (G.givingT <= 0) G.giving = null; }
  updateBoy(dt); updateDog(dt);
  for (const o of s.objs.slice()) if (o.update) o.update(dt);
  if (s.update) s.update(dt);
  updateParts(dt); updateFade(dt);
  render(dt);
  updateBubbles();
  if (G.panel) panelFrame(dt);
  requestAnimationFrame(frame);
}

// ---------- Ikon tombol (piksel) ----------
// Ikon digambar kecil lalu dihaluskan 4× supaya lebih detail
function iconInto(el, size, fn) {
  const src = document.createElement('canvas'); src.width = size; src.height = size;
  fn(src.getContext('2d', { willReadFrequently: true }));
  const up = upscale4(src);
  let c = el.querySelector('canvas');
  if (!c) { c = document.createElement('canvas'); el.prepend(c); }
  c.width = up.width; c.height = up.height;
  c.getContext('2d').drawImage(up, 0, 0);
}
function drawSunIcon(x) { disc(x, 8, 8, 4, '#ffd84a'); for (const [a, b] of [[8, 1], [8, 14], [1, 8], [14, 8], [3, 3], [13, 3], [3, 13], [13, 13]]) px(x, a, b, 1, 1, '#f0a83a'); disc(x, 8, 8, 2, '#fff2a8'); }
function drawCloudIcon(x, col = '#ffffff') { oval(x, 8, 9, 6, 3, col); disc(x, 6, 7, 3, col); disc(x, 10, 6, 3, col); }
function updateIcons() {
  iconInto($('btn-time'), 16, x => {
    if (G.night) { disc(x, 8, 8, 6, '#fff2c0'); disc(x, 11, 6, 5, '#2b3566'); px(x, 13, 12, 1, 1, '#ffffff'); px(x, 3, 3, 1, 1, '#ffffff'); }
    else drawSunIcon(x);
  });
  iconInto($('btn-weather'), 16, x => {
    const w = G.weather;
    if (w === 'sun') { disc(x, 6, 6, 4, '#ffd84a'); disc(x, 6, 6, 2, '#fff2a8'); oval(x, 10, 12, 5, 2, '#ffffff'); disc(x, 9, 10, 2, '#ffffff'); }
    if (w === 'cloud') { drawCloudIcon(x, '#dfe6ee'); oval(x, 6, 12, 4, 2, '#ffffff'); }
    if (w === 'rain') { drawCloudIcon(x, '#c9d4e0'); for (const a of [4, 8, 12]) px(x, a, 12, 1, 3, '#5fb3e0'); }
    if (w === 'wind') { for (const [a, b, l] of [[2, 4, 10], [1, 8, 13], [3, 12, 9]]) { px(x, a, b, l, 1, '#e8f4fa'); px(x, a + l, b - 1, 1, 1, '#e8f4fa'); } px(x, 12, 11, 2, 1, '#7cc85a'); }
    if (w === 'snow') { px(x, 7, 2, 2, 12, '#ffffff'); px(x, 2, 7, 12, 2, '#ffffff'); for (let i = 3; i < 13; i++) { px(x, i, i, 1, 1, '#dff1fb'); px(x, 15 - i, i, 1, 1, '#dff1fb'); } }
  });
  iconInto($('btn-music'), 16, x => {
    drawNote(x, 7, 12, '#fff6e0'); px(x, 8, 6, 4, 1, '#fff6e0'); px(x, 11, 6, 1, 5, '#fff6e0'); px(x, 9, 10, 3, 2, '#fff6e0');
    if (!Snd.on) for (let i = 2; i < 14; i++) px(x, i, i, 2, 1, '#e2483d');
  });
  $('btn-music').setAttribute('aria-pressed', Snd.on ? 'true' : 'false');
  iconInto($('btn-map'), 16, x => {
    px(x, 1, 3, 14, 11, '#f3e3c0'); px(x, 5, 3, 1, 11, '#d9c296'); px(x, 10, 3, 1, 11, '#d9c296');
    px(x, 2, 9, 4, 1, '#5fb3e0'); px(x, 6, 6, 4, 1, '#c9a46a'); px(x, 11, 5, 3, 3, '#58a84a');
    px(x, 7, 9, 2, 2, '#e2483d'); px(x, 7, 8, 1, 1, '#e2483d');
  });
  iconInto($('btn-hud'), 16, x => {
    if (G.hudOff) { for (const yy of [4, 7, 10]) px(x, 3, yy, 10, 2, '#fff6e0'); }
    else { for (let k = 0; k < 5; k++) { px(x, 9 - k, 3 + k, 2, 1, '#fff6e0'); px(x, 9 - k, 12 - k, 2, 1, '#fff6e0'); } px(x, 5, 7, 2, 2, '#fff6e0'); }
  });
  $('btn-hud').setAttribute('aria-expanded', G.hudOff ? 'false' : 'true');
  $('btn-hud').setAttribute('aria-label', G.hudOff ? 'Buka menu' : 'Tutup menu');
  $('box').classList.toggle('hud-off', G.hudOff);
  iconInto($('btn-bag'), 16, x => {
    px(x, 5, 1, 6, 2, '#8a5030'); px(x, 5, 1, 1, 4, '#8a5030'); px(x, 10, 1, 1, 4, '#8a5030');
    px(x, 2, 4, 12, 11, '#d9483b'); px(x, 2, 4, 12, 1, '#f08a7a'); px(x, 2, 14, 12, 1, '#a8352b');
    px(x, 4, 8, 8, 5, '#e8735a'); px(x, 4, 8, 8, 1, '#a8352b'); px(x, 7, 9, 2, 2, '#f4cf3a');
  });
}

$('btn-time').addEventListener('click', () => { if (!G.started || G.boy.inBed) return; sfx('pop'); setNight(!G.night); });
$('btn-weather').addEventListener('click', () => { if (!G.started) return; sfx('pop'); setWeather(WEATHERS[(WEATHERS.indexOf(G.weather) + 1) % WEATHERS.length]); });
$('btn-music').addEventListener('click', () => { Snd.init(); Snd.setMusic(!Snd.on); updateIcons(); save(); syncParentSettings(); });
$('place').addEventListener('click', () => { if (G.started) say([{ k: G.scene.place }]); });
$('btn-map').addEventListener('click', () => { if (!G.started || G.boy.inBed || G.fadeDir) return; Snd.init(); openPanel('map'); say([{ k: 'map' }]); });
$('btn-hud').addEventListener('click', () => { G.hudOff = !G.hudOff; Snd.init(); sfx('tap'); updateIcons(); save(); });
$('btn-bag').addEventListener('click', () => { if (!G.started || G.boy.inBed || G.fadeDir) return; Snd.init(); G.giving = null; openPanel('bag'); say([{ k: 'bag' }]); });

// Kartu kata bisa digeser ke mana saja (posisinya diingat)
function placeCard() {
  const el = $('card');
  if (G.cardPos) { el.style.left = G.cardPos[0] + '%'; el.style.top = G.cardPos[1] + '%'; el.style.bottom = 'auto'; }
  else { el.style.left = ''; el.style.top = ''; el.style.bottom = ''; }
}
(function cardDrag() {
  const el = $('card'); let drag = null;
  el.addEventListener('pointerdown', e => {
    if (e.target.closest('#card-say')) return;
    const r = el.getBoundingClientRect();
    drag = { dx: e.clientX - (r.left + r.width / 2), dy: e.clientY - r.top };
    el.setPointerCapture(e.pointerId); el.classList.add('dragging'); clearTimeout(cardTimer);
    e.preventDefault();
  });
  el.addEventListener('pointermove', e => {
    if (!drag) return;
    const box = $('box').getBoundingClientRect(), r = el.getBoundingClientRect();
    const cx = Math.max(r.width / 2, Math.min(box.width - r.width / 2, e.clientX - drag.dx - box.left));
    const top = Math.max(0, Math.min(box.height - r.height, e.clientY - drag.dy - box.top));
    G.cardPos = [cx / box.width * 100, top / box.height * 100];
    placeCard();
  });
  const end = () => { if (!drag) return; drag = null; el.classList.remove('dragging'); save(); hideCardSoon(); };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
})();
$('card-say').addEventListener('click', () => { const zh = cardZh; if (!zh) return; clearTimeout(cardTimer); Talk.say([{ zh }], hideCardSoon); });

// ---------- Ukuran layar ----------
function fit() {
  const st = $('stage'), box = $('box'), vv = window.visualViewport, plain = vv && vv.scale < 1.01;
  // Pakai ukuran terkecil yang dilaporkan: di iPhone ukuran layar bisa keliru atau terlambat setelah diputar
  st.style.height = '';
  const fullW = Math.min(st.clientWidth, window.innerWidth, plain ? vv.width : Infinity);
  const fullH = Math.min(st.clientHeight, window.innerHeight, plain ? vv.height : Infinity);
  st.style.height = fullH + 'px';
  const cs = getComputedStyle(st);
  const vw = fullW - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const vh = fullH - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const w = Math.max(160, Math.min(vw, vh * 16 / 9));
  box.style.width = w + 'px'; box.style.height = (w * 9 / 16) + 'px';
  box.style.setProperty('--u', (w / 100) + 'px');
  $('rotate').hidden = !(window.innerHeight > window.innerWidth * 1.1);
  fitPlace();
}
window.addEventListener('resize', fit);
// Nama tempat yang panjang (mis. dalam bahasa Jepang) dikecilkan supaya tidak menabrak tombol kanan
function fitPlace() {
  const p = $('place'), r = document.querySelector('.hud-right');
  p.style.fontSize = ''; p.style.maxWidth = ''; p.style.whiteSpace = '';
  if (!r || !r.offsetWidth || !p.offsetWidth) return;
  const room = r.offsetLeft - p.offsetLeft - p.parentElement.offsetLeft - 6;
  for (let s = 2.6, i = 0; p.offsetWidth > room && s > 1.4 && i < 12; i++) { s *= 0.92; p.style.fontSize = 'calc(var(--u) * ' + s.toFixed(2) + ')'; }
  // masih terlalu panjang: boleh turun ke baris kedua
  if (p.offsetWidth > room) { p.style.maxWidth = room + 'px'; p.style.whiteSpace = 'normal'; }
}

// ---------- Mulai ----------
function start() {
  Snd.init(); Talk.pick();
  $('title').hidden = true;
  G.started = true;
  setTimeout(() => {
    doAct(G.boy, 'wave', 1.8);
    say([{ k: 'hello', zh: '你好！我是' + CHILD + '。', by: G.boy }, { k: 'doudou', zh: '这是豆豆！' }], () => { G.dog.happyT = 1.2; });
  }, 350);
}
$('play').addEventListener('click', start);

enterScene('farm', SCENES.farm.spawn);
fit();
updateIcons();
updateBag();
placeCard();
requestAnimationFrame(frame);
