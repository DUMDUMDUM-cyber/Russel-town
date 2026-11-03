// Fitur tambahan: batas waktu main, kata lama, misi Ibu, petak umpet & merawat Dòudou, burung beo.

// ================= BATAS WAKTU MAIN (dihitung per hari, diatur di menu orang tua) =================
const REST = { on: false, hold: null };
function restStart() {
  REST.on = true; exSave(); closePanel(true); hideChoice();
  G.boy.moving = false; G.boy.cb = null;
  $('rest').hidden = false; sfx('yawn');
  say([{ k: 'sleepy', by: G.boy }, { k: 'resttime' }, { k: 'goodnight' }], () => { if (REST.on && Snd.ctx) Snd.ctx.suspend(); });
}
function restEnd() {
  REST.on = false; $('rest').hidden = true;
  EX.playSec = Math.max(0, EX.limit * 60 - 600); exSave();
  if (Snd.ctx) Snd.ctx.resume();
  sfx('chime'); say([{ k: 'goodmorning', by: G.boy }]);
}
setInterval(() => {
  if (EX.playDay !== today()) { EX.playDay = today(); EX.playSec = 0; }
  if (!G.started || document.hidden || REST.on) return;
  EX.playSec++;
  if (EX.playSec % 20 === 0) exSave();
  if (EX.limit > 0 && EX.playSec >= EX.limit * 60) restStart();
}, 1000);
(function restUI() {
  $('rest-pic').src = stickerCanvas('goodnight');
  $('rest-word').innerHTML = rubyHTML(word('resttime').zh, word('resttime').py);
  const b = $('rest-hold'), stop = () => { clearTimeout(REST.hold); b.classList.remove('holding'); };
  b.addEventListener('pointerdown', () => { b.classList.add('holding'); REST.hold = setTimeout(() => { stop(); restEnd(); }, 3000); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
  $('set-limit').addEventListener('change', e => { EX.limit = +e.target.value; exSave(); });
  $('set-parrot').addEventListener('change', e => { EX.parrotMic = e.target.checked; exSave(); });
  const base = syncParentSettings;
  syncParentSettings = function () { base(); $('set-limit').value = String(EX.limit); $('set-parrot').checked = !!EX.parrotMic; };
})();

// ================= KATA LAMA MUNCUL LAGI: gelembung bergambar untuk kata yang jarang didengar =================
const REVIEW = { t: 45, left: 0, k: null };
function reviewPick() {
  const pool = Object.keys(WORDS).filter(k => ST_ART[k] && !/^(q_|a_|n\d)/.test(k));
  const heard = pool.filter(k => HEARD.has(k)).sort((a, b) => (EX.count[a] || 0) - (EX.count[b] || 0)).slice(0, 8);
  const fresh = pool.filter(k => !HEARD.has(k));
  const list = heard.length && (Math.random() < 0.7 || !fresh.length) ? heard : fresh;
  return list[Math.floor(Math.random() * list.length)] || null;
}
setInterval(() => {
  const el = $('review');
  if (!G.started || G.panel || REST.on || G.boy.inBed || G.fadeDir || document.hidden) { el.hidden = true; return; }
  if (!el.hidden) { if (--REVIEW.left <= 0) el.hidden = true; return; }
  if (--REVIEW.t > 0) return;
  REVIEW.t = 70 + Math.random() * 50;
  REVIEW.k = reviewPick();
  if (!REVIEW.k) return;
  el.innerHTML = `<img src="${stickerCanvas(REVIEW.k)}" alt="">`;
  el.setAttribute('aria-label', word(REVIEW.k).id);
  el.style.left = (14 + Math.random() * 68) + '%'; el.style.top = (26 + Math.random() * 34) + '%';
  el.hidden = false; REVIEW.left = 14; sfx('pop');
}, 1000);
$('review').addEventListener('click', () => { $('review').hidden = true; Snd.init(); sfx('sparkle'); fx('heart', G.boy.x, G.boy.y - 28, 2); say([{ k: REVIEW.k }]); });

// ================= KOIN =================
function addCoins(n, x, y) {
  EX.coins += n; exSave();
  fx('item', x, y, 1, 'coin');
  for (let i = 0; i < n; i++) Snd.tone(1320 + i * 200, 0.14, { gain: 0.08, when: i * 0.12, type: 'triangle' });
}

// ================= MISI IBU: dengar permintaan, cari barangnya, berikan =================
// [kata, kata bantu bilangan, pinyin, nada 一, kata sandang English]
const MISSION_ITEMS = [['bun', '个', 'gè', 'yí', 'a'], ['rice', '碗', 'wǎn', 'yì', 'some'], ['egg', '个', 'gè', 'yí', 'an'], ['milk', '杯', 'bēi', 'yì', 'some'], ['fish', '条', 'tiáo', 'yì', 'a'],
  ['apple', '个', 'gè', 'yí', 'an'], ['tomato', '个', 'gè', 'yí', 'a'], ['carrot', '根', 'gēn', 'yì', 'a'], ['wool', '团', 'tuán', 'yì', 'some'], ['shell', '个', 'gè', 'yí', 'a'], ['wildflower', '朵', 'duǒ', 'yì', 'a']];
const MIS = { cool: 0 };
function missionCard(k) {
  const [, m, mp, yi, art] = MISSION_ITEMS.find(x => x[0] === k), w = WORDS[k], j = WORDS_JA[k];
  return langCard('请给我一' + m + w[0], 'qǐng gěi wǒ ' + yi + ' ' + mp + ' ' + w[1], 'Tolong beri aku ' + w[2], 'Please give me ' + art + ' ' + WORDS_EN[k], [j[0] + 'を ちょうだい', j[1] + ' o chōdai']);
}
function missionUI() {
  const el = $('mission');
  el.hidden = !EX.mission;
  if (!EX.mission) return;
  if (el.dataset.k !== EX.mission) { el.dataset.k = EX.mission; el.innerHTML = `<img src="${stickerCanvas(EX.mission)}" alt="">`; }
  el.setAttribute('aria-label', 'Misi: ' + WORDS[EX.mission][2]);
  el.classList.toggle('ready', G.bag.includes(EX.mission));
}
const momHome = SCENES.home.objs.find(o => o.look === 'mom');
function missionAsk(p) {
  p.talkT = 4; doAct(p, 'wave', 1.4);
  say([{ card: missionCard(EX.mission), by: p }]);
}
function missionDone(p) {
  EX.mission = null; MIS.cool = 25; exSave(); missionUI();
  p.talkT = 5; p.dir = G.boy.x < p.x ? 'left' : 'right'; doAct(p, 'wave', 1.4);
  fx('heart', p.x, p.y - 34, 3); sfx('sparkle'); addCoins(2, p.x, p.y - 30);
  say([{ k: 'giveyou', by: G.boy }, { k: 'thanks', by: p }, { k: 'great' }]);
}
(function missionHooks() {
  const baseTap = momHome.tap, baseDraw = momHome.draw, baseReceive = momHome.receive;
  momHome.tap = function () {
    if (EX.mission) {
      if (G.bag.includes(EX.mission)) { bagTake(EX.mission); missionDone(this); } else missionAsk(this);
    } else if (MIS.cool <= 0) {
      const list = MISSION_ITEMS.map(x => x[0]);
      EX.mission = list[Math.floor(Math.random() * list.length)]; exSave(); missionUI(); missionAsk(this);
    } else baseTap.call(this);
  };
  momHome.receive = function (type) { if (type === EX.mission) missionDone(this); else baseReceive.call(this, type); };
  momHome.skin = 'fn:momMission';
  momHome.draw = function (c, t) {
    baseDraw.call(this, c, t);
    if (EX.mission ? !G.bag.includes(EX.mission) : MIS.cool > 0) return;
    const y = this.y - 42 - Math.round(Math.abs(Math.sin(t * 3)) * 2);
    px(c, this.x - 3, y - 1, 7, 10, '#ffd84a'); px(c, this.x - 1, y + 1, 2, 4, '#a8352b'); px(c, this.x - 1, y + 6, 2, 2, '#a8352b');
  };
  $('mission').addEventListener('click', () => { if (EX.mission) { Snd.init(); sfx('tap'); say([{ card: missionCard(EX.mission) }]); } });
  setInterval(() => { if (MIS.cool > 0) MIS.cool--; missionUI(); }, 1000);
})();

// ================= PETAK UMPET DÒUDOU =================
const HS = { on: false, spot: null, miss: 0 };
const HIDE_SPOTS = { tree: { k: 'behindtree', at: [160, 80] }, table: { k: 'undertable', at: [244, 166] }, box: { k: 'inbox', at: [256, 158] } };
function hideStart() {
  const keys = Object.keys(HIDE_SPOTS);
  fx('dust', G.dog.x, G.dog.y, 5); sfx('whoosh');
  HS.on = true; HS.miss = 0; HS.spot = keys[Math.floor(Math.random() * keys.length)];
  G.dog.hiding = true;
  say([{ k: 'hideseek', by: G.boy }, { k: 'wheredoudou', by: G.boy }]);
}
function hideLook(spot) {
  if (!HS.on) return false;
  if (spot !== HS.spot) { HS.miss++; sfx('tap'); doAct(G.boy, 'wave', 0.6); say([{ k: 'nothere', by: G.boy }]); return true; }
  const d = G.dog; HS.on = false; d.hiding = false;
  [d.x, d.y] = HIDE_SPOTS[spot].at; d.happyT = 2.4; dogLoveUp();
  sfx('sparkle'); fx('heart', d.x, d.y - 20, 3); doAct(G.boy, 'hop', 0.9);
  say([{ k: 'foundyou', by: G.boy }, { k: HIDE_SPOTS[spot].k }, { k: 'woof' }]);
  return true;
}
// ekor mengintip dari tempat sembunyi; makin jelas setelah salah dua kali
function peekTail(c, x, y, t) {
  if (Math.floor(t * 3) % 2 === 0 && HS.miss < 2) return;
  const w = Math.floor(t * 6) % 2;
  px(c, x, y - w, 2, 4, '#d39552'); px(c, x, y - 1 - w, 2, 1, '#9a6332');
  if (HS.miss >= 2 && Math.floor(t * 4) % 2) { px(c, x - 1, y - 7, 1, 3, '#ffd84a'); px(c, x - 2, y - 6, 3, 1, '#ffd84a'); }
}
(function hidePlaces() {
  const farm = SCENES.farm, tree = farm.objs.find(o => o.apples), baseEnter = farm.enter;
  const treeTap = tree.tap, treeArrive = tree.arrive;
  tree.tap = function () { if (HS.on) { sfx('tap'); return; } treeTap.call(this); };
  tree.arrive = function () { if (!hideLook('tree')) treeArrive.call(this); };
  farm.enter = function () { if (baseEnter) baseEnter(); if (HS.on) { HS.on = false; G.dog.hiding = false; } };
  farm.objs.push({ x: 162, y: 63, get hidden() { return !(HS.on && HS.spot === 'tree'); }, draw(c, t) { peekTail(c, 164, 56, t); } });
  farm.blocks.push([208, 152, 28, 8], [262, 146, 20, 8]);
  farm.objs.push({ x: 222, y: 160, hit: [204, 136, 36, 26], go: [222, 170], skin: 'fn:hideTable',
    draw(c, t) {
      shadow(c, 222, 160, 19);
      px(c, 212, 146, 2, 10, '#5f3f25'); px(c, 230, 146, 2, 10, '#5f3f25');
      px(c, 206, 146, 3, 14, PAL.woodD); px(c, 235, 146, 3, 14, PAL.woodD); px(c, 206, 146, 1, 14, PAL.wood); px(c, 235, 146, 1, 14, PAL.wood);
      px(c, 204, 140, 36, 6, PAL.wood); px(c, 204, 140, 36, 1, PAL.woodL);
      for (const sx of [212, 221, 231]) px(c, sx, 141, 1, 5, PAL.woodD);
      px(c, 204, 146, 36, 1, PAL.woodD); px(c, 206, 147, 32, 2, '#8a5f38');
      if (HS.on && HS.spot === 'table') peekTail(c, 238, 154, t);
    },
    tap() { if (!HS.on) say([{ k: 'desk' }]); },
    arrive() { hideLook('table'); } });
  farm.objs.push({ x: 272, y: 154, hit: [260, 130, 24, 26], go: [272, 164], skin: 'fn:hideBox',
    draw(c, t) {
      shadow(c, 272, 154, 13);
      const shake = HS.on && HS.spot === 'box' && Math.floor(t * 2) % 3 === 0 ? 1 : 0, bx = 262 + shake;
      px(c, bx, 138, 20, 16, '#c08a52'); px(c, bx + 16, 141, 4, 13, '#a87444');
      for (const py of [144, 149]) px(c, bx, py, 20, 1, '#8a5a35');
      px(c, bx, 138, 20, 3, '#d9a56a'); px(c, bx, 138, 20, 1, '#ecc48c'); px(c, bx, 141, 20, 1, '#8a5a35');
      for (const sx of [0, 18]) px(c, bx + sx, 141, 2, 13, '#8a5a35');
      for (const py of [143, 148]) { px(c, bx + 1, py, 1, 1, '#d9d4c8'); px(c, bx + 18, py, 1, 1, '#d9d4c8'); }
      if (HS.on && HS.spot === 'box') peekTail(c, 283, 142, t);
    },
    tap() { if (!HS.on) say([{ k: 'box' }]); },
    arrive() { hideLook('box'); } });
})();

// ================= MERAWAT DÒUDOU: mandi, makan, sikat bulu =================
function careHold(sec) { G.dog.trick = 'sit'; G.dog.trickT = sec; G.dog.dir = G.boy.x >= G.dog.x ? 1 : -1; dogLoveUp(); }
function careBath() {
  const d = G.dog; careHold(3.2); d.foamT = 3.2;
  doAct(G.boy, 'wash', 2.8); sfx('water');
  for (let i = 0; i < 6; i++) setTimeout(() => { if (!d.hidden) fx('bubble', d.x, d.y - 14, 2); }, i * 450);
  say([{ k: 'bathdog', by: G.boy }, { k: 'clean' }, { k: 'woof' }]);
}
function careBrush() {
  const d = G.dog; careHold(2.6);
  doAct(G.boy, 'wash', 2.2); sfx('shake');
  for (let i = 0; i < 4; i++) setTimeout(() => { if (!d.hidden) fx('spark', d.x, d.y - 12, 2); }, i * 500);
  fx('heart', d.x, d.y - 20, 2);
  say([{ k: 'brushdog', by: G.boy }, { k: 'goodboy', by: G.boy }]);
}
function careFeed() {
  const d = G.dog; careHold(3); d.bowlT = 3;
  setTimeout(() => sfx('eat'), 600); setTimeout(() => { sfx('eat'); if (!d.hidden) fx('heart', d.x, d.y - 20, 3); }, 1700);
  say([{ k: 'feeddog', by: G.boy }, { k: 'full' }, { k: 'woof' }]);
}
SCENES.farm.objs.push({ top: true, skin: 'fn:dogCare', get hidden() { return G.dog.hidden || !(G.dog.foamT > 0 || G.dog.bowlT > 0); },
  draw(c, t) {
    const d = G.dog, x = Math.round(d.x), y = Math.round(d.y);
    if (d.foamT > 0) [[-6, -6], [-1, -10], [4, -7], [-3, -14], [3, -15], [8, -13], [-7, -11]].forEach(([a, b], i) => disc(c, x + a * (d.dir || 1), y + b - (Math.floor(t * 4 + i) % 2), 2, '#ffffff'));
    if (d.bowlT > 0) { const bx = x + (d.dir || 1) * 12; px(c, bx - 4, y - 3, 9, 3, '#e2483d'); px(c, bx - 3, y - 4, 7, 1, '#8a5a35'); px(c, bx - 4, y - 1, 9, 1, '#a8352b'); }
  },
  update(dt) { const d = G.dog; if (d.foamT > 0) d.foamT -= dt; if (d.bowlT > 0) d.bowlT -= dt; } });
G.dog.tap = function () {
  if (dogLoveUp()) { dogTapBase(); return; }
  const doTrick = tr => { this.trick = tr.st; this.trickT = 2.2; say([{ k: tr.k, by: G.boy }, { k: 'goodboy' }]); fx('heart', this.x, this.y - 20, 3); };
  offerPics(this.x, this.y - 20, [
    picBtn('woof', 'eat', () => dogTapBase()), picBtn('bathdog', 'throw', careBath), picBtn('feeddog', 'take', careFeed), picBtn('brushdog', 'give', careBrush), picBtn('hideseek', 'eat', hideStart),
    ...TRICKS.filter(tr => EX.dogLove >= tr.need).map(tr => picBtn(tr.k, 'give', () => doTrick(tr))),
  ]);
};

// ================= BURUNG BEO: meniru kata terakhir, atau suara anak bila mikrofon diizinkan orang tua =================
// Rekaman hanya ada di memori selama 3 detik + diputar sekali; tidak disimpan dan tidak dikirim.
const PARROT = { st: 'idle', t: 0 };
function parrotCopy() {
  const text = cardZh || word('hello').zh;
  PARROT.st = 'talk';
  bubble(parrotBird, text);
  Talk.say([{ zh: text, who: 'parrot' }], () => { PARROT.st = 'idle'; });
}
function parrotListen() {
  say([{ k: 'saytome', by: parrotBird }], async () => {
    let stream;
    try {
      Snd.init();
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream), chunks = [];
      rec.ondataavailable = e => chunks.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach(tr => tr.stop());
        try {
          const audio = await Snd.ctx.decodeAudioData(await new Blob(chunks).arrayBuffer());
          const src = Snd.ctx.createBufferSource(), g = Snd.ctx.createGain();
          g.gain.value = 1.8; src.buffer = audio; src.playbackRate.value = 1.35;
          src.connect(g); g.connect(Snd.sfxBus);
          PARROT.st = 'talk';
          src.onended = () => { PARROT.st = 'idle'; Snd.duck(false); };
          src.start();
        } catch (e) { Snd.duck(false); parrotCopy(); }
      };
      PARROT.st = 'listen'; Snd.duck(true); rec.start();
      setTimeout(() => rec.stop(), 3000);
    } catch (e) {
      if (stream) stream.getTracks().forEach(tr => tr.stop());
      Snd.duck(false); parrotCopy();
    }
  });
}
const parrotBird = {
  voice: 'parrot', x: 136, y: 106, hit: [124, 72, 24, 36], go: [136, 116], skin: 'fn:parrot',
  draw(c, t) {
    const talk = PARROT.st === 'talk', listen = PARROT.st === 'listen', bob = talk ? Math.floor(t * 8) % 2 : Math.sin(t * 2) > 0.7 ? 1 : 0, y = 83 - bob;
    shadow(c, 136, 106, 6);
    px(c, 135, 84, 2, 22, '#7d5230'); px(c, 130, 104, 12, 2, '#5a3a22'); px(c, 128, 84, 16, 2, '#a8743c');
    px(c, 130, y - 2, 3, 6, '#e2483d'); // ekor
    oval(c, 136, y - 5, 4, 5, '#58a84a'); oval(c, 134, y - 5, 2, 3, '#3d7f33');
    disc(c, 138, y - 11, 3, '#7cc85a'); px(c, 138, y - 12, 2, 2, '#ffffff'); px(c, 139, y - 12, 1, 1, '#2a1d18');
    px(c, 141, y - 11, 2, 1, '#f4b23a'); px(c, 141, y - 10 + (talk && Math.floor(t * 10) % 2 ? 1 : 0), 2, 1, '#d9882a');
    px(c, 136, y - 15, 1, 2, '#e2483d'); px(c, 138, y - 15, 1, 2, '#f4cf3a');
    if (listen) { const r = 2 + Math.floor(t * 5) % 3; px(c, 146, y - 14, 2, 2, '#e2483d'); for (let i = 0; i < 3; i++) px(c, 145 + r, y - 16 + i * 2, 1, 1, '#4f86e0'); }
  },
  tap() { say([{ k: 'parrot' }]); },
  arrive() {
    if (PARROT.st !== 'idle') return;
    if (EX.parrotMic && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) parrotListen();
    else setTimeout(parrotCopy, 300);
  },
};
SCENES.farm.objs.push(parrotBird);

// ================= GAMBAR STIKER =================
const stHide = (c, x, y) => { px(c, x - 12, y - 10, 24, 10, '#c08a52'); px(c, x - 12, y - 10, 24, 2, '#d9a56a'); };
Object.assign(ST_ART, {
  hideseek: (c, x, y) => { drawTree(c, x - 4, y, { r: 9 }); px(c, x + 6, y - 8, 2, 4, '#d39552'); drawZ(c, x + 12, y - 22, '#4f86e0'); },
  wheredoudou: (c, x, y) => { drawDog(c, x - 4, y, 1, 0, 'sit', 0); px(c, x + 11, y - 22, 5, 2, '#4f86e0'); px(c, x + 15, y - 21, 2, 4, '#4f86e0'); px(c, x + 12, y - 17, 3, 2, '#4f86e0'); px(c, x + 12, y - 13, 3, 2, '#4f86e0'); },
  nothere: (c, x, y) => { for (let k = -6; k <= 6; k++) { px(c, x + k, y - 8 + k, 2, 2, '#e2483d'); px(c, x + k, y - 8 - k, 2, 2, '#e2483d'); } },
  foundyou: (c, x, y) => { drawPerson(c, x - 8, y, { look: 'me', dir: 'right', mood: 'happy', noShadow: true }); drawDog(c, x + 9, y, -1, 0, 'happy', 0); drawHeart(c, x, y - 24); },
  behindtree: (c, x, y) => { drawTree(c, x - 3, y, { r: 9 }); drawDog(c, x + 9, y, -1, 0, 'sit', 0); },
  undertable: (c, x, y) => { drawDog(c, x, y, 1, 0, 'sit', 0); px(c, x - 15, y - 22, 30, 4, '#b27a45'); px(c, x - 14, y - 18, 2, 18, '#7d5230'); px(c, x + 12, y - 18, 2, 18, '#7d5230'); },
  inbox: (c, x, y) => { drawDog(c, x, y - 6, 1, 0, 'sit', 0); stHide(c, x, y); },
  box: (c, x, y) => { stHide(c, x, y); px(c, x - 1, y - 10, 2, 10, '#8a5a35'); px(c, x - 12, y - 6, 24, 1, '#8a5a35'); },
  bathdog: (c, x, y) => { drawDog(c, x, y - 2, 1, 0, 'sit', 0); [[-8, -14], [8, -18], [0, -22], [-5, -6], [9, -7]].forEach(([a, b]) => disc(c, x + a, y + b, 2, '#cfefff')); px(c, x - 12, y - 3, 24, 3, '#4fa0cf'); },
  brushdog: (c, x, y) => { drawDog(c, x - 3, y, 1, 0, 'sit', 0); px(c, x + 7, y - 16, 7, 3, '#e2483d'); for (let i = 0; i < 4; i++) px(c, x + 7 + i * 2, y - 13, 1, 2, '#3a2616'); },
  feeddog: (c, x, y) => { drawDog(c, x - 5, y, 1, 0, 'sit', 0); px(c, x + 5, y - 5, 10, 5, '#e2483d'); px(c, x + 6, y - 6, 8, 1, '#8a5a35'); },
  clean: (c, x, y) => { drawDog(c, x - 2, y, 1, 0, 'happy', 0); for (const [a, b] of [[-11, -20], [10, -22], [12, -10]]) { px(c, x + a, y + b - 1, 1, 3, '#ffd84a'); px(c, x + a - 1, y + b, 3, 1, '#ffd84a'); } },
  full: (c, x, y) => { drawDog(c, x - 3, y, 1, 0, 'happy', 0); drawHeart(c, x + 11, y - 18); },
  parrot: (c, x, y) => { oval(c, x, y - 8, 5, 7, '#58a84a'); disc(c, x + 2, y - 17, 4, '#7cc85a'); px(c, x + 3, y - 18, 2, 2, '#ffffff'); px(c, x + 4, y - 18, 1, 1, '#2a1d18'); px(c, x + 6, y - 17, 3, 2, '#f4b23a'); px(c, x - 5, y - 4, 3, 6, '#e2483d'); px(c, x, y - 1, 2, 2, '#a8743c'); },
  saytome: (c, x, y) => { ST_ART.parrot(c, x + 6, y); drawNote(c, x - 11, y - 6, '#8f62c9'); drawNote(c, x - 7, y - 16, '#e2483d'); },
  resttime: (c, x, y) => { drawHead(c, x, y - 11, LOOKS.me, 'down', { mood: 'sleepy' }); drawZ(c, x + 11, y - 15, '#4f86e0'); },
});
missionUI();
