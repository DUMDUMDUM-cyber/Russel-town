// Suara: musik generatif yang tenang (tangga nada pentatonik, tanpa melodi berulang),
// suasana alam (hujan, angin, burung, jangkrik), efek kecil, dan suara Mandarin (TTS).

const Snd = {
  ctx: null, on: true, vol: 0.55, night: false, weather: 'sun', outdoor: true,
  melodyIdx: 4, timer: null,

  init() {
    if (this.ctx) { this.wake(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    // iPhone/iPad: tanpa ini musik ikut dibisukan oleh tombol senyap, padahal suara tokoh (TTS) tetap terdengar
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; else this.unlockIOS(); } catch (e) {}
    const c = this.ctx = new AC();
    c.onstatechange = () => { if (c.state !== 'running' && !document.hidden) setTimeout(() => this.wake(), 300); };
    this.master = c.createGain(); this.master.gain.value = 0.9; this.master.connect(c.destination);

    // Musik: kering + gema lembut
    this.music = c.createGain(); this.music.gain.value = 0; this.music.connect(this.master);
    const delay = c.createDelay(2); delay.delayTime.value = 0.43;
    const fb = c.createGain(); fb.gain.value = 0.33;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
    const wet = c.createGain(); wet.gain.value = 0.4;
    this.music.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(wet); wet.connect(this.master);

    this.sfxBus = c.createGain(); this.sfxBus.gain.value = 0.45; this.sfxBus.connect(this.master);
    this.amb = c.createGain(); this.amb.gain.value = 1; this.amb.connect(this.master);

    // Dengung latar sangat pelan (nada dasar & kwint)
    const padF = c.createBiquadFilter(); padF.type = 'lowpass'; padF.frequency.value = 380;
    this.pad = c.createGain(); this.pad.gain.value = 0.02;
    padF.connect(this.pad); this.pad.connect(this.music);
    [73.42, 110, 146.83].forEach((f, i) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = i * 3;
      const g = c.createGain(); g.gain.value = i === 2 ? 0.35 : 1;
      o.connect(g); g.connect(padF); o.start();
    });
    const lfo = c.createOscillator(); lfo.frequency.value = 0.045;
    const lfoG = c.createGain(); lfoG.gain.value = 0.01; lfo.connect(lfoG); lfoG.connect(this.pad.gain); lfo.start();

    // Derau untuk hujan dan angin
    const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    const mk = (type, f, q) => {
      const s = c.createBufferSource(); s.buffer = buf; s.loop = true;
      const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      const g = c.createGain(); g.gain.value = 0;
      s.connect(fl); fl.connect(g); g.connect(this.amb); s.start();
      return { g, fl };
    };
    this.rainN = mk('bandpass', 1400, 0.6);
    this.windN = mk('lowpass', 420, 1);
    const wl = c.createOscillator(); wl.frequency.value = 0.13;
    const wlg = c.createGain(); wlg.gain.value = 180; wl.connect(wlg); wlg.connect(this.windN.fl.frequency); wl.start();

    this.setMusic(this.on);
    this.applyMood();
    this.loop();
  },

  // Lanjutkan suara yang berhenti sendiri (iOS menghentikannya setelah telepon, notifikasi, atau suara TTS)
  wake() {
    const c = this.ctx;
    if (c && c.state !== 'running' && !document.hidden) c.resume().catch(() => {});
  },
  // iOS lama (belum punya navigator.audioSession): audio HTML senyap yang diputar berulang
  // membuat iPhone memperlakukan game seperti pemutar musik, jadi tombol senyap tidak membisukannya
  unlockIOS() {
    const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!ios || this.keepAlive) return;
    const rate = 8000, n = rate / 2, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); str(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    const a = this.keepAlive = document.createElement('audio');
    a.src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    a.loop = true; a.setAttribute('playsinline', ''); a.setAttribute('x-webkit-airplay', 'deny');
    a.play().catch(() => {});
  },

  setMusic(on) {
    this.on = on;
    if (!this.ctx) return;
    this.music.gain.setTargetAtTime(on ? this.vol * 1.1 : 0, this.ctx.currentTime, 0.6);
  },

  duck(d) {
    if (!this.ctx || !this.on) return;
    this.music.gain.setTargetAtTime(this.vol * (d ? 0.4 : 1.1), this.ctx.currentTime, d ? 0.08 : 0.8);
  },

  mood(o) { Object.assign(this, o); this.applyMood(); },

  applyMood() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, out = this.outdoor;
    const rain = this.weather === 'rain' ? (out ? 0.07 : 0.02) : 0;
    const wind = this.weather === 'wind' ? (out ? 0.09 : 0.02) : (this.weather === 'snow' && out ? 0.025 : 0);
    this.rainN.g.gain.setTargetAtTime(rain, t, 0.7);
    this.windN.g.gain.setTargetAtTime(wind, t, 0.9);
  },

  // Melodi berjalan acak di tangga nada pentatonik: tenang, tidak membentuk lagu yang menempel di kepala
  loop() {
    const c = this.ctx;
    if (this.on && c.state === 'running') {
      const scale = [0, 2, 4, 7, 9];
      const base = this.night ? 196 : 293.66;
      const step = [-2, -1, -1, 1, 1, 2, 0][Math.floor(Math.random() * 7)];
      this.melodyIdx = Math.max(0, Math.min(9, this.melodyIdx + step));
      if (Math.random() > 0.18) {
        const semi = scale[this.melodyIdx % 5] + 12 * Math.floor(this.melodyIdx / 5);
        const f = base * Math.pow(2, semi / 12);
        this.bell(f, this.night ? 0.035 : 0.045);
        if (Math.random() < 0.22) {
          const lowIdx = Math.max(0, this.melodyIdx - 2);
          const s2 = scale[lowIdx % 5] + 12 * Math.floor(lowIdx / 5);
          this.bell(base * Math.pow(2, s2 / 12) / 2, 0.025, 0.05);
        }
      }
      if (this.outdoor && this.weather !== 'rain') {
        if (this.night && Math.random() < 0.35) this.cricket();
        if (!this.night && this.weather === 'sun' && Math.random() < 0.18) this.bird();
      }
    }
    const wait = (this.night ? 2.6 : 1.7) + Math.random() * (this.night ? 3.2 : 2.4);
    this.timer = setTimeout(() => this.loop(), wait * 1000);
  },

  bell(f, g, delay = 0) {
    const c = this.ctx, t = c.currentTime + 0.02 + delay;
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = (Math.random() - 0.5) * 8;
    const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2;
    const env = c.createGain(); env.gain.value = 0;
    const g2 = c.createGain(); g2.gain.value = 0.22; // nada atas sedikit lebih kuat supaya terdengar di speaker HP
    o.connect(env); o2.connect(g2); g2.connect(env); env.connect(this.music);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(g, t + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    o.start(t); o2.start(t); o.stop(t + 3.3); o2.stop(t + 3.3);
  },

  bird() {
    const c = this.ctx, n = 2 + Math.floor(Math.random() * 3);
    const f0 = 2600 + Math.random() * 900;
    for (let i = 0; i < n; i++) {
      const t = c.currentTime + i * 0.13;
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.35, t + 0.07);
      const g = c.createGain(); g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.012, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g); g.connect(this.amb); o.start(t); o.stop(t + 0.1);
    }
  },

  cricket() {
    const c = this.ctx;
    for (let i = 0; i < 3; i++) {
      const t = c.currentTime + i * 0.09;
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 4300;
      const g = c.createGain(); g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.006, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(g); g.connect(this.amb); o.start(t); o.stop(t + 0.06);
    }
  },

  tone(f, dur, o = {}) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime + (o.when || 0);
    const osc = c.createOscillator(); osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(o.gain || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(this.sfxBus); osc.start(t); osc.stop(t + dur + 0.02);
  },

  noise(dur, o = {}) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime + (o.when || 0);
    const s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.value = o.f || 1500; f.Q.value = o.q || 0.8;
    if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(o.gain || 0.2, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.sfxBus); s.start(t, Math.random()); s.stop(t + dur);
  },

  sfx(name) {
    if (!this.ctx) return;
    switch (name) {
      case 'tap': this.tone(660, 0.09, { to: 880, gain: 0.12 }); break;
      case 'pop': this.tone(520, 0.12, { to: 1040, type: 'triangle', gain: 0.18 }); break;
      case 'plant': this.tone(190, 0.15, { to: 90, gain: 0.3 }); this.noise(0.12, { f: 600, gain: 0.12 }); break;
      case 'water': this.noise(0.5, { f: 2400, to: 1200, q: 1.2, gain: 0.16 }); break;
      case 'grow': [523, 659, 784].forEach((f, i) => this.tone(f, 0.25, { when: i * 0.09, gain: 0.1, type: 'triangle' })); break;
      case 'harvest': this.tone(660, 0.12, { gain: 0.15 }); this.tone(990, 0.2, { when: 0.1, gain: 0.15 }); break;
      case 'egg': this.tone(880, 0.1, { to: 1320, gain: 0.12 }); break;
      case 'bounce': this.tone(320, 0.14, { to: 160, gain: 0.25 }); break;
      case 'splash': this.noise(0.35, { type: 'lowpass', f: 1800, to: 300, gain: 0.25 }); break;
      case 'eat': this.noise(0.07, { f: 900, gain: 0.25 }); this.noise(0.07, { f: 800, gain: 0.25, when: 0.16 }); this.noise(0.07, { f: 950, gain: 0.25, when: 0.32 }); break;
      case 'sparkle': [1047, 1319, 1568, 2093].forEach((f, i) => this.tone(f, 0.3, { when: i * 0.06, gain: 0.07 })); break;
      case 'horn': this.tone(440, 0.16, { type: 'square', gain: 0.04 }); this.tone(554, 0.16, { type: 'square', gain: 0.04 }); this.tone(440, 0.16, { type: 'square', gain: 0.04, when: 0.22 }); break;
      case 'door': this.tone(150, 0.08, { gain: 0.3 }); this.tone(130, 0.08, { gain: 0.3, when: 0.12 }); break;
      case 'bubbles': for (let i = 0; i < 6; i++) this.tone(900 + Math.random() * 900, 0.06, { when: i * 0.08, gain: 0.05 }); break;
      case 'whoosh': this.noise(0.5, { f: 400, to: 2000, gain: 0.12 }); break;
      case 'shake': this.noise(0.4, { f: 3000, q: 0.5, gain: 0.08 }); break;
      case 'yawn': this.tone(330, 0.6, { to: 220, type: 'triangle', gain: 0.08 }); break;
      case 'chime': [784, 988, 1175].forEach((f, i) => this.tone(f, 0.6, { when: i * 0.12, gain: 0.08 })); break;
    }
  },
};

// Warna suara tiap tokoh: tinggi nada & kecepatan; m = pakai suara laki-laki kalau perangkat punya
const VOICE_ROLE = {
  me: { pitch: 1.45, rate: 1.04 }, gege: { pitch: 1.25, m: 1 }, meimei: { pitch: 1.6, rate: 1.05 }, xiaoyu: { pitch: 1.5 }, lele: { pitch: 1.4, rate: 1.06 }, tiantian: { pitch: 1.35, rate: 1.03 },
  kid1: { pitch: 1.55 }, kid2: { pitch: 1.4 }, kid3: { pitch: 1.5 }, kid4: { pitch: 1.35 },
  dad: { pitch: 0.82, m: 1 }, uncle: { pitch: 0.75, m: 1 }, hiker: { pitch: 0.9, rate: 1.05, m: 1 }, grandpa: { pitch: 0.65, rate: 0.9, m: 1 },
  mom: { pitch: 1.12 }, teacher: { pitch: 1.03, rate: 0.97 }, auntie: { pitch: 0.98 }, colleague: { pitch: 0.92 }, grandma: { pitch: 0.88, rate: 0.88 },
  robot: { pitch: 0.45, rate: 0.92 }, parrot: { pitch: 1.95, rate: 1.1 },
};
const MALE_VOICE = /\bmale\b|yunxi|yunyang|yunjian|yunxia|kangkang|keita|daichi|naoki|ichiro|otoya|hattori|guy|david|mark|davis|tony|andrew|brian|christopher|eric|roger|steffan|alex|daniel|fred|aaron|arthur/i;

// Setiap sentuhan menghidupkan lagi musik yang dihentikan iPhone/iPad (setelah telepon, notifikasi, atau TTS)
['pointerup', 'touchend', 'keydown'].forEach(ev => document.addEventListener(ev, () => Snd.wake(), { capture: true, passive: true }));

// Suara Mandarin / English / Jepang memakai mesin suara perangkat (Web Speech).
const Talk = {
  supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  zh: null, en: null, ja: null, idv: null, alsoId: false, token: 0,

  pick() {
    if (!this.supported) return;
    const vs = speechSynthesis.getVoices();
    const zh = vs.filter(v => /^zh[-_]?(CN|Hans)?/i.test(v.lang) && !/HK|TW|yue/i.test(v.lang));
    const score = v => (/natural|online/i.test(v.name) ? 4 : 0) + (/xiaoxiao|xiaoyi|tingting|google/i.test(v.name) ? 2 : 0) + (/CN/i.test(v.lang) ? 1 : 0);
    zh.sort((a, b) => score(b) - score(a));
    this.zh = zh[0] || vs.find(v => /^zh/i.test(v.lang)) || null;
    // English: utamakan suara natural yang lembut (US/GB)
    const enScore = v => (/natural|online/i.test(v.name) ? 4 : 0) + (/aria|jenny|ana|samantha|google us|libby|sonia|karen|zira/i.test(v.name) ? 2 : 0) + (/US|GB/i.test(v.lang) ? 1 : 0);
    const ens = vs.filter(v => /^en[-_]/i.test(v.lang)).sort((a, b) => enScore(b) - enScore(a));
    this.en = ens[0] || null;
    const jaScore = v => (/natural|online|enhanced|premium/i.test(v.name) ? 4 : 0) + (/nanami|kyoko|haruka|ayumi|google/i.test(v.name) ? 2 : 0);
    const jas = vs.filter(v => /^ja[-_]?/i.test(v.lang)).sort((a, b) => jaScore(b) - jaScore(a));
    this.ja = jas[0] || null;
    const ids = vs.filter(v => /^id/i.test(v.lang)).sort((a, b) => score(b) - score(a));
    this.idv = ids[0] || null;
    this.male = { zh: zh.find(v => MALE_VOICE.test(v.name)) || null, en: ens.find(v => MALE_VOICE.test(v.name)) || null, ja: jas.find(v => MALE_VOICE.test(v.name)) || null };
  },

  // suara untuk bahasa yang sedang dipelajari
  get main() { return this[LANG]; },

  status() {
    if (!this.supported) return { ok: false, text: 'Browser ini tidak punya fitur suara. Coba Chrome, Edge, atau Safari terbaru.' };
    if (LANG === 'en') {
      if (this.en) return { ok: true, text: 'Suara English: ' + this.en.name };
      return { ok: false, text: 'Suara English belum ditemukan di perangkat ini. Tulisan tetap muncul. Coba browser Chrome atau Edge.' };
    }
    if (LANG === 'ja') {
      if (this.ja) return { ok: true, text: 'Suara Jepang: ' + this.ja.name };
      return { ok: false, text: 'Suara Jepang belum ditemukan di perangkat ini. Tulisan tetap muncul. Di Android/iPad biasanya sudah ada; di Windows pakai browser Edge, atau pasang bahasa "Japanese" di Pengaturan > Waktu & bahasa > Bahasa.' };
    }
    if (this.zh) return { ok: true, text: 'Suara Mandarin: ' + this.zh.name };
    return { ok: false, text: 'Suara Mandarin belum ditemukan di perangkat ini. Tulisan tetap muncul. Di Android/iPad biasanya sudah ada; di Windows pakai browser Edge, atau pasang bahasa "Chinese (Simplified)" di Pengaturan > Waktu & bahasa > Bahasa.' };
  },

  cancel() { this.token++; if (this.supported) speechSynthesis.cancel(); Snd.duck(false); },

  // items: [{ zh, id, onStart }]
  say(items, done) {
    const tok = ++this.token;
    if (this.supported) speechSynthesis.cancel();
    if (this.audio) { this.audio.pause(); this.audio = null; }
    let i = 0;
    const next = () => {
      if (tok !== this.token) return;
      if (i >= items.length) { Snd.duck(false); if (done) done(); return; }
      const it = items[i++];
      if (it.onStart) it.onStart();
      const after = () => { if (this.alsoId && it.id) this.one(it.id, 'id', tok, next); else next(); };
      // rekaman suara keluarga dipakai bila ada; kalau gagal kembali ke suara komputer
      if (it.rec && this.playRec) this.playRec(it.rec, tok, after, () => this.one(it.zh, LANG, tok, after, it.who));
      else this.one(it.zh, LANG, tok, after, it.who);
    };
    Snd.duck(true);
    setTimeout(next, this.supported ? 60 : 0);
  },

  one(text, lang, tok, done, who) {
    let fired = false, tm;
    const fin = () => { if (fired) return; fired = true; clearTimeout(tm); if (tok === this.token) setTimeout(done, 220); };
    const est = 600 + text.length * ({ zh: 430, en: 75, ja: 230 }[lang] || 90);
    if (this.supported && !this.main) this.pick();
    const role = (lang !== 'id' && VOICE_ROLE[who]) || {};
    const v = lang === 'id' ? this.idv : (role.m && this.male && this.male[lang]) || this[lang];
    // Tanpa suara bahasa yang cocok, jangan biarkan suara bahasa lain membacanya: cukup tampilkan kartu
    if (!this.supported || !v) { tm = setTimeout(fin, est); return; }
    tm = setTimeout(fin, est + 2500);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = v.lang || { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP', id: 'id-ID' }[lang];
    u.voice = v;
    u.rate = ({ zh: 0.78, en: 0.82, ja: 0.85 }[lang] || 0.95) * (role.rate || 1);
    u.pitch = role.pitch || 1.1;
    u.onend = fin; u.onerror = fin;
    speechSynthesis.speak(u);
  },
};

function showVoiceHint() {
  const el = document.getElementById('voice-hint');
  if (el) el.hidden = !!Talk.main;
}
if (Talk.supported) {
  Talk.pick();
  speechSynthesis.onvoiceschanged = () => { Talk.pick(); showVoiceHint(); };
}
setTimeout(showVoiceHint, 1200);
