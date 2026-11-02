// Fitur supaya anak betah: buku stiker, foto, suara keluarga, trik Dòudou, kostum,
// bunga matahari antar hari, kejutan harian, dan hari raya. Semua tersimpan di perangkat ini.

const EX_KEY = 'anan-extras-v1';
const EX = { heard: [], dogLove: 0, sun: { stage: 0, waterDay: null }, fest: 'auto', bday: '', foundDay: -1, cakeT: 0,
  count: {}, limit: 0, playDay: -1, playSec: 0, parrotMic: false, mission: null, coins: 3, room: { owned: [], off: [] }, robot: null, season: 'summer' };
(function () { try { Object.assign(EX, JSON.parse(localStorage.getItem(EX_KEY) || '{}')); } catch (e) {} })();
const HEARD = new Set(EX.heard.filter(k => WORDS[k]));
function exSave() { EX.heard = [...HEARD]; try { localStorage.setItem(EX_KEY, JSON.stringify(EX)); } catch (e) {} }
const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
const sameText = (a, b) => a.replace(/[，。！？、\s]/g, '') === b.replace(/[，。！？、\s]/g, '');

// ================= 1. BUKU STIKER =================
const THEME_COLS = ['#e2483d', '#f08a32', '#e8b02a', '#58a84a', '#3fa0b8', '#4f86e0', '#8f62c9', '#e8739a'];
function collectSticker(k) {
  if (!WORDS[k]) return;
  EX.count[k] = (EX.count[k] || 0) + 1; // dipakai untuk memunculkan lagi kata yang jarang didengar
  if (HEARD.has(k)) { exSave(); return; }
  HEARD.add(k); exSave(); updateStickerCount();
  const b = $('btn-stickers'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  Snd.tone(1568, 0.18, { gain: 0.06 }); Snd.tone(2093, 0.22, { gain: 0.05, when: 0.08 });
  for (const cs of Object.values(COSTUMES)) if (HEARD.size === cs.need) setTimeout(() => say([{ k: cs.word }, { k: 'costume' }]), 2600);
}
function updateStickerCount() { $('sticker-count').textContent = HEARD.size; }
const ST = { page: 0, tab: 'stickers' };
function stickerPage() {
  const th = THEMES[ST.page], got = th.words.filter(k => HEARD.has(k)).length, col = THEME_COLS[ST.page % THEME_COLS.length];
  $('st-title').innerHTML = `${th.name}<small>${got}/${th.words.length}</small>`;
  const g = $('st-grid'); g.innerHTML = '';
  th.words.forEach(k => {
    const w = word(k), b = document.createElement('button'), got = HEARD.has(k), pic = stickerCanvas(k, !got);
    b.type = 'button'; b.style.setProperty('--c', col);
    if (got) {
      b.className = 'stk' + (pic ? ' pic' : [...w.zh].length > 3 ? ' long' : '');
      b.innerHTML = pic ? `<img src="${pic}" alt="">`
        : `<span class="stk-zh">${w.zh}</span><span class="stk-py">${w.py.split(' ').length > 4 ? '' : w.py.replace(/ /g, '')}</span>`;
      b.setAttribute('aria-label', w.zh + ' – ' + w.id);
      b.addEventListener('click', () => { sfx('pop'); say([{ k }]); });
    } else {
      b.className = 'stk empty';
      if (pic) b.innerHTML = `<img src="${pic}" alt="">`; else b.textContent = '?';
      b.setAttribute('aria-label', 'Belum terkumpul'); b.disabled = true;
    }
    g.appendChild(b);
  });
  $('st-total').textContent = `${HEARD.size} / ${Object.keys(WORDS).length}`;
}
function stickerTab(tab) {
  ST.tab = tab;
  document.querySelectorAll('#p-stickers [data-stab]').forEach(b => b.setAttribute('aria-selected', b.dataset.stab === tab ? 'true' : 'false'));
  $('st-pages').hidden = tab !== 'stickers'; $('ph-pages').hidden = tab !== 'photos'; $('ph-view').hidden = true;
  if (tab === 'stickers') stickerPage(); else photoGrid();
}
$('st-prev').addEventListener('click', () => { ST.page = (ST.page + THEMES.length - 1) % THEMES.length; sfx('tap'); stickerPage(); });
$('st-next').addEventListener('click', () => { ST.page = (ST.page + 1) % THEMES.length; sfx('tap'); stickerPage(); });
document.querySelectorAll('#p-stickers [data-stab]').forEach(b => b.addEventListener('click', () => { sfx('tap'); stickerTab(b.dataset.stab); say([{ k: b.dataset.stab === 'photos' ? 'photo' : 'stickerbook' }]); }));
PANELS.stickers = $('p-stickers');
PANELS.stickers.addEventListener('pointerdown', e => { if (e.target === PANELS.stickers) closePanel(); });
$('btn-stickers').addEventListener('click', () => { if (!G.started) return; Snd.init(); openPanel('stickers'); stickerTab(ST.tab); say([{ k: 'stickerbook' }]); });

// ================= 9. KAMERA FOTO =================
const PH_KEY = 'anan-photos-v1';
let PHOTOS = [];
try { PHOTOS = JSON.parse(localStorage.getItem(PH_KEY) || '[]'); } catch (e) {}
function savePhotos() {
  while (PHOTOS.length) { try { localStorage.setItem(PH_KEY, JSON.stringify(PHOTOS)); return; } catch (e) { PHOTOS.pop(); } }
  try { localStorage.removeItem(PH_KEY); } catch (e) {}
}
$('btn-camera').addEventListener('click', () => {
  if (!G.started || G.panel) return;
  Snd.init();
  say([{ k: 'cheese', zh: '茄子！', by: G.boy }]);
  doAct(G.boy, 'wave', 1.2);
  setTimeout(() => {
    const t = document.createElement('canvas'); t.width = 480; t.height = 270;
    t.getContext('2d').drawImage(cv, 0, 0, 480, 270);
    PHOTOS.unshift({ url: t.toDataURL('image/jpeg', 0.82), d: Date.now() }); PHOTOS = PHOTOS.slice(0, 12); savePhotos();
    const f = $('flash'); f.hidden = false; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    setTimeout(() => { f.hidden = true; }, 500);
    Snd.noise(0.06, { f: 3000, gain: 0.3 }); Snd.noise(0.05, { f: 1500, gain: 0.25, when: 0.08 });
    const b = $('btn-stickers'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }, 700);
});
function photoGrid() {
  const g = $('ph-grid'); g.innerHTML = '';
  $('ph-empty').hidden = PHOTOS.length > 0;
  PHOTOS.forEach((p, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'ph';
    b.innerHTML = `<img alt="Foto ${i + 1}" src="${p.url}">`;
    b.addEventListener('click', () => { sfx('tap'); $('ph-img').src = p.url; $('ph-view').hidden = false; $('ph-pages').hidden = true; $('ph-view').dataset.i = i; });
    g.appendChild(b);
  });
}
$('ph-back').addEventListener('click', () => { sfx('tap'); $('ph-view').hidden = true; $('ph-pages').hidden = false; });
$('ph-del').addEventListener('click', () => { PHOTOS.splice(+$('ph-view').dataset.i, 1); savePhotos(); sfx('tap'); $('ph-view').hidden = true; $('ph-pages').hidden = false; photoGrid(); });

// ================= 7. SUARA KELUARGA (rekaman orang tua) =================
const VOICE = new Set();
let vdb = null;
try {
  const r = indexedDB.open('anan-voices', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('rec');
  r.onsuccess = () => { vdb = r.result; const q = vdb.transaction('rec').objectStore('rec').getAllKeys(); q.onsuccess = () => { q.result.forEach(k => VOICE.add(k)); renderVoiceList(); }; };
} catch (e) {}
// rekaman disimpan per bahasa: rekaman Mandarin tidak diputar di mode English/Jepang, dan sebaliknya
const recKey = k => (LANG === 'zh' ? '' : LANG + ':') + k;
function hasRec(k) { return VOICE.has(recKey(k)); }
function vReq(mode, fn) { return new Promise(res => { if (!vdb) return res(null); try { const q = fn(vdb.transaction('rec', mode).objectStore('rec')); q.onsuccess = () => res(q.result === undefined ? true : q.result); q.onerror = () => res(null); } catch (e) { res(null); } }); }
Talk.playRec = (k, tok, done, fallback) => {
  vReq('readonly', s => s.get(recKey(k))).then(blob => {
    if (tok !== Talk.token) return;
    if (!(blob instanceof Blob)) return fallback();
    const url = URL.createObjectURL(blob), a = new Audio(url);
    let fin = false;
    const end = ok => { if (fin) return; fin = true; URL.revokeObjectURL(url); if (tok !== Talk.token) return; if (ok) setTimeout(done, 150); else fallback(); };
    Talk.audio = a; a.onended = () => end(true); a.onerror = () => end(false);
    a.play().catch(() => end(false));
    setTimeout(() => end(true), 9000);
  });
};
(function voiceSelect() {
  const sel = $('voice-word');
  THEMES.forEach(th => {
    const og = document.createElement('optgroup'); og.label = th.name;
    th.words.forEach(k => { const w = word(k), o = document.createElement('option'); o.value = k; o.textContent = w.py ? `${w.zh}  ${w.py}  (${w.id})` : `${w.zh}  (${w.id})`; og.appendChild(o); });
    sel.appendChild(og);
  });
})();
function renderVoiceList() {
  const pre = LANG === 'zh' ? '' : LANG + ':';
  const ks = [...VOICE].filter(r => (pre ? r.startsWith(pre) : !/^[a-z]{2}:/.test(r))).map(r => r.slice(pre.length));
  $('voice-list').textContent = ks.length ? 'Sudah direkam: ' + ks.map(k => WORDS[k] ? word(k).zh : k).join(', ') : 'Belum ada rekaman.';
}
$('voice-file').addEventListener('change', async e => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const k = $('voice-word').value;
  const ok = await vReq('readwrite', s => s.put(f, recKey(k)));
  if (ok) { VOICE.add(recKey(k)); renderVoiceList(); $('voice-msg').textContent = 'Tersimpan untuk ' + word(k).zh + '.'; say([{ k }]); }
  else $('voice-msg').textContent = 'Rekaman tidak bisa disimpan di browser ini.';
  e.target.value = '';
});
$('voice-play').addEventListener('click', () => { Snd.init(); say([{ k: $('voice-word').value }]); });
$('voice-del').addEventListener('click', async () => {
  const k = $('voice-word').value;
  await vReq('readwrite', s => s.delete(recKey(k))); VOICE.delete(recKey(k)); renderVoiceList(); $('voice-msg').textContent = 'Rekaman ' + word(k).zh + ' dihapus; kembali ke suara komputer.';
});

// ================= 3. TRIK DÒUDOU =================
const TRICKS = [{ k: 'sitdown', need: 3, st: 'sit' }, { k: 'shakehand', need: 6, st: 'shake' }, { k: 'rollover', need: 10, st: 'roll' }];
const dogTapBase = G.dog.tap.bind(G.dog), dogRecBase = G.dog.receive.bind(G.dog);
function dogLoveUp() {
  EX.dogLove++; exSave();
  const tr = TRICKS.find(x => x.need === EX.dogLove);
  if (tr) setTimeout(() => {
    const w = word(tr.k);
    G.dog.trick = tr.st; G.dog.trickT = 2.2; sfx('sparkle'); fx('spark', G.dog.x, G.dog.y - 14, 8);
    say([{ card: langCard('豆豆学会了' + w.zh + '！', 'dòu dou xué huì le ' + w.py, 'Dòudou sudah bisa ' + w.id + '!', 'Doudou learned to ' + w.zh + '!',
      ['ドウドウ、「' + w.zh + '」 できたね！', 'Dōdō, "' + w.py + '" dekita ne!']) }]);
  }, 1800);
  return !!tr;
}
G.dog.receive = function (type) { dogLoveUp(); dogRecBase(type); };
G.dog.tap = function () {
  const known = TRICKS.filter(tr => EX.dogLove >= tr.need);
  if (dogLoveUp() || !known.length) { dogTapBase(); return; }
  const doTrick = tr => { this.trick = tr.st; this.trickT = 2.2; say([{ k: tr.k, by: G.boy }, { k: 'goodboy' }]); fx('heart', this.x, this.y - 20, 3); };
  offerChoice(this.x, this.y - 20, known.map(tr => ({ act: 'give', html: `<span>${rubyHTML(word(tr.k).zh, word(tr.k).py)}</span>`, fn: () => doTrick(tr) }))
    .concat([{ act: 'eat', html: `<span>${rubyHTML(word('woof').zh, word('woof').py)}</span>`, fn: () => dogTapBase() }]));
};

// ================= 5. KOSTUM (dibuka dari jumlah stiker) =================
function costumeTiles(g) {
  const o = G.outfit;
  Object.entries(COSTUMES).forEach(([key, cs]) => {
    const open = HEARD.size >= cs.need;
    const t = tile(cs.word, {
      icon: x => { if (open) drawHead(x, 8, 4, LOOKS.me, 'down', { mood: 'happy', outfit: { costume: key } }); else { px(x, 4, 7, 8, 7, '#8a7a6a'); px(x, 5, 3, 1, 4, '#8a7a6a'); px(x, 10, 3, 1, 4, '#8a7a6a'); px(x, 6, 2, 4, 1, '#8a7a6a'); px(x, 7, 9, 2, 3, '#f4cf3a'); } },
      pressed: o.costume === key,
      onClick: () => {
        if (!open) { sfx('tap'); say([{ k: 'sticker' }]); return; }
        o.costume = o.costume === key ? null : key; sfx('pop'); say([{ k: cs.word }]); save(); mirrorTab('clothes');
      },
    });
    if (!open) { t.classList.add('locked'); t.insertAdjacentHTML('beforeend', `<small class="need">${HEARD.size}/${cs.need}</small>`); }
    g.appendChild(t);
  });
}

// ================= 4. BUNGA MATAHARI (tumbuh satu tahap per hari setelah disiram) =================
function growSun() {
  const s = EX.sun;
  if (s.stage >= 1 && s.stage < 5 && s.waterDay != null && s.waterDay < today()) { s.stage++; s.waterDay = null; exSave(); return true; }
  return false;
}
SCENES.farm.blocks.push([168, 92, 16, 8]);
SCENES.farm.objs.push({
  // Russel berdiri di samping pot supaya potnya tidak tertutup
  x: 176, y: 100, hit: [164, 52, 26, 50], go: [158, 100],
  draw(c, t) { drawSunflowerPot(c, this.x, this.y, EX.sun.stage, t); },
  tap() { growSun(); const st = EX.sun.stage; say([{ k: st >= 5 ? 'sunflower' : st === 4 ? 'bud' : st >= 2 ? 'sprout' : 'seed' }]); },
  arrive() {
    G.boy.dir = 'right';
    growSun();
    const s = EX.sun, td = today();
    if (s.stage === 0) { s.stage = 1; s.waterDay = null; exSave(); sfx('plant'); doAct(G.boy, 'wash', 0.8); say([{ k: 'seed' }, { k: 'sunflower' }]); return; }
    if (s.stage >= 5) { sfx('sparkle'); fx('spark', this.x, this.y - 42, 6); say([{ k: 'bloom' }, { k: 'sunflower' }, { k: 'pretty' }]); return; }
    if (s.waterDay === td) { say([{ k: 'growtomorrow' }, { k: 'seeyoutomorrow' }]); return; }
    s.waterDay = td; exSave(); sfx('water'); doAct(G.boy, 'wash', 1.2); fx('drop', this.x, this.y - 12, 8);
    say([{ k: 'watering' }, { k: 'growtomorrow' }]);
  },
});

// ================= 2. KEJUTAN HARIAN =================
const SURPRISES = [
  { k: 'panda', scene: 'village' }, { k: 'rainbow', scene: 'mountain' }, { k: 'balloon', scene: 'school' },
  { k: 'kite', scene: 'beach' }, { k: 'hotairballoon', scene: 'farm' }, { k: 'goldfish', scene: 'office' },
];
const todaySurprise = () => SURPRISES[((today() % SURPRISES.length) + SURPRISES.length) % SURPRISES.length];
function surpriseFound(o) {
  const first = EX.foundDay !== today();
  EX.foundDay = today(); exSave();
  say(first ? [{ k: 'surprise' }, { k: o.k }] : [{ k: o.k }]);
  sfx('sparkle'); fx('spark', o.fx, o.fy, 10);
}
function surprise(k, extra) {
  const sp = SURPRISES.find(s => s.k === k);
  const o = { k, get hidden() { return todaySurprise() !== sp; }, tap() { surpriseFound(this); } };
  Object.defineProperties(o, Object.getOwnPropertyDescriptors(extra)); // getter tetap hidup
  SCENES[sp.scene].objs.push(o);
}
// ganti getter "hidden" pada objek yang sudah ada (Object.assign tidak bisa menimpa getter)
function withHidden(o, fn) { Object.defineProperty(o, 'hidden', { get: fn, configurable: true }); return o; }
surprise('panda', { x: 64, y: 130, fx: 64, fy: 110, hit: [52, 104, 26, 28], go: [84, 132], draw(c, t) { drawPanda(c, 64, 130, t); } });
surprise('rainbow', { flat: true, y: 0.5, fx: 210, fy: 30, hit: [150, 8, 120, 34], go: [210, 100], draw(c) { drawRainbow(c, 210, 64, 58); } });
surprise('balloon', { x: 128, y: 112, fx: 128, fy: 80, hit: [118, 72, 22, 42], go: [140, 116], draw(c, t) { drawBalloons(c, 128, 112, t); } });
surprise('kite', { top: true, y: 30, fx: 220, fy: 30, get hit() { return [204, 12, 34, 34]; }, draw(c, t) { drawKite(c, 220, 26, t); } });
surprise('hotairballoon', { top: true, x: 0, y: 60, t0: 0, get fx() { return this.x; }, fy: 40, get hit() { return [this.x - 16, 20, 32, 50]; },
  draw(c, t) { drawHotAirBalloon(c, this.x, 58, t); oval(SHADOW_TO || c, Math.round(this.x), 150, 12, 3, 'rgba(30,45,20,0.12)'); },
  update(dt) { this.t0 += dt; this.x = 160 + Math.sin(this.t0 * 0.12) * 120; } });
surprise('goldfish', { x: 282, y: 172.5, fx: 282, fy: 146, hit: [262, 134, 40, 26], go: [282, 178], draw(c, t) { drawGoldfish(c, 282, 148, t); } });
// bintang di peta pada tempat kejutan hari ini
function mapExtra(c, t) {
  if (EX.foundDay === today()) return;
  const [x, y] = MAP_SPOTS[todaySurprise().scene], b = Math.round(Math.abs(Math.sin(t * 3)) * 2);
  drawStar(c, x + 12, y - 14 - b, Math.floor(t * 4) % 2 ? '#ffd84a' : '#fff2a8');
}

// ================= 6. HARI RAYA =================
const FEST_DATES = {
  cny: ['2026-02-17', '2027-02-06', '2028-01-26', '2029-02-13', '2030-02-03'],
  midautumn: ['2026-09-25', '2027-09-15', '2028-10-03', '2029-09-22', '2030-09-12'],
};
const dayOf = s => { const [y, m, d] = s.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86400000); };
let festMemo = { at: -1, v: null };
function festival() {
  if (EX.fest && EX.fest !== 'auto') return EX.fest === 'none' ? null : EX.fest;
  const td = today();
  if (festMemo.at === td) return festMemo.v;
  let v = null;
  if (FEST_DATES.cny.some(s => td - dayOf(s) >= -3 && td - dayOf(s) <= 10)) v = 'cny';
  else if (FEST_DATES.midautumn.some(s => td - dayOf(s) >= -5 && td - dayOf(s) <= 3)) v = 'midautumn';
  else if (EX.bday) { const [m, d] = EX.bday.split('-').map(Number), n = new Date(); if (n.getMonth() + 1 === m && n.getDate() === d) v = 'birthday'; }
  festMemo = { at: td, v };
  return v;
}
const isFest = f => festival() === f;
const lanternFest = () => isFest('cny') || isFest('midautumn');
// lampion merah (Imlek & Kue Bulan)
[['farm', [[30, 72], [90, 72]]], ['village', [[100, 96], [240, 96], [45, 42], [258, 42]]], ['home', [[70, 12], [250, 12]]], ['school', [[110, 64], [210, 64]]]].forEach(([s, pts]) =>
  SCENES[s].objs.push({ top: true, get hidden() { return !lanternFest(); }, draw(c, t) { pts.forEach(([x, y]) => drawHangingLantern(c, x, y, t)); } }));
// barongsai di desa
SCENES.village.objs.push({ x: 196, y: 130, get hidden() { return !isFest('cny'); }, hit: [178, 98, 36, 34], go: [170, 132],
  draw(c, t) { drawLionDance(c, 196, 130, t); },
  tap() { say([{ k: 'liondance' }, { k: 'happynewyear', zh: '新年快乐！' }, { k: 'gongxi', zh: '恭喜发财！' }]); Snd.sfx('horn'); } });
// kembang api malam hari
['village', 'farm', 'beach', 'mountain'].forEach(s => SCENES[s].objs.push({ top: true, bursts: [], tt: 0,
  get hidden() { return !(isFest('cny') || isFest('birthday')) || !G.night; },
  update(dt) {
    if (this.hidden) return;
    this.tt -= dt; if (this.tt <= 0) { this.tt = rand(0.6, 1.6); this.bursts.push({ x: rand(40, 280), y: rand(14, 50), k: 0, col: ['#ff6a5a', '#ffd84a', '#7cc4f0', '#bfe3a0', '#f39ac0'][Math.floor(Math.random() * 5)] }); }
    this.bursts.forEach(b => { b.k += dt * 1.2; }); this.bursts = this.bursts.filter(b => b.k < 1);
  },
  draw(c) { this.bursts.forEach(b => { c.globalAlpha = 1 - b.k; drawFirework(c, Math.round(b.x), Math.round(b.y), b.k, b.col); c.globalAlpha = 1; }); } }));
// angpao (Imlek) & kue bulan (Festival Kue Bulan) di meja makan
SCENES.home.objs.push(withHidden(pickup('redpacket', 116, 116, { respawn: 60 }), function () { return this.gone > 0 || !isFest('cny'); }));
[[116, 116], [224, 116]].forEach(([x, y]) => SCENES.home.objs.push(withHidden(pickup('mooncake', x, y, { respawn: 40 }), function () { return this.gone > 0 || !isFest('midautumn'); })));
// kue ulang tahun
SCENES.home.objs.push({ x: 222, y: 112, get hidden() { return !isFest('birthday'); }, hit: [212, 90, 20, 22], go: [222, 134],
  draw(c, t) { drawCake(c, 222, 110, EX.cakeT <= Date.now(), t); },
  tap() { say([{ k: 'cake' }]); },
  arrive() {
    if (EX.cakeT > Date.now()) { say([{ k: 'happybirthday' }]); return; }
    EX.cakeT = Date.now() + 20000; exSave();
    doAct(G.boy, 'eat', 1); Snd.noise(0.5, { type: 'lowpass', f: 700, gain: 0.2 });
    fx('spark', 222, 92, 14); sfx('chime');
    say([{ k: 'blowcandles' }, { k: 'happybirthday', zh: '生日快乐，' + CHILD + '！' }]);
  } });
SCENES.home.objs.push({ y: 150, get hidden() { return !isFest('birthday'); }, draw(c, t) { drawBalloons(c, 120, 150, t); drawBalloons(c, 204, 150, t + 1); } });
SCENES.school.objs.push({ y: 100, get hidden() { return !isFest('birthday'); }, draw(c, t) { drawBalloons(c, 92, 100, t); } });
// bulan besar saat Festival Kue Bulan (malam)
['mountain', 'beach'].forEach(s => SCENES[s].objs.push({ top: true, get hidden() { return !isFest('midautumn') || !G.night; }, hit: [128, 2, 44, 36],
  draw(c) { disc(c, 150, 20, 14, '#fff2c0'); disc(c, 146, 16, 3, '#f4e2a0'); disc(c, 156, 24, 2, '#f4e2a0'); },
  tap() { say([{ k: 'moon' }, { k: 'happymidautumn', zh: '中秋节快乐！' }]); } }));

// sapaan hari raya & kejutan saat mulai main
$('play').addEventListener('click', () => {
  updateStickerCount();
  setTimeout(() => {
    const f = festival(), list = [];
    if (f === 'cny') list.push({ k: 'happynewyear', zh: '新年快乐！' }, { k: 'gongxi', zh: '恭喜发财！' });
    if (f === 'midautumn') list.push({ k: 'happymidautumn', zh: '中秋节快乐！' });
    if (f === 'birthday') list.push({ k: 'happybirthday', zh: '生日快乐，' + CHILD + '！' });
    if (EX.foundDay !== today()) list.push({ k: 'todaysurprise' });
    if (list.length) say(list);
  }, 4200);
});

// pengaturan hari raya & ulang tahun di menu orang tua
$('set-fest').value = EX.fest || 'auto';
$('set-bday').value = EX.bday ? '2026-' + EX.bday : '';
$('set-fest').addEventListener('change', e => { EX.fest = e.target.value; festMemo.at = -1; exSave(); G.bgDirty = true; });
$('set-bday').addEventListener('change', e => { EX.bday = e.target.value ? e.target.value.slice(5) : ''; festMemo.at = -1; exSave(); });
updateStickerCount();
