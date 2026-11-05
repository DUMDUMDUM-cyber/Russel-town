// Gambar gaya baru: desain Claude Design (gaya C, "bulat seperti mainan") dari skin-data.js.
// Tempat yang sudah dipasang (READY) digambar langsung di kanvas resolusi penuh dari SVG; tempat lain tetap piksel.
// Benda lama tetap mengatur posisi, gerak & sentuhan. Gambarnya diganti dengan tiga cara:
//  - o.skin = 'bg'      → benda sudah ada di gambar latar desain, tidak digambar lagi
//  - o.skin = 'obj-…'   → potongan desain dengan id itu, di titik tumpunya, ikut urutan kedalaman o.y
//  - fungsi gambar lama (drawPerson, drawDuck, …) dibelokkan ke gambar baru lewat hook()
// Benda yang belum punya gambar baru tetap digambar piksel (tampak kotak-kotak) supaya tidak hilang.

// pantulan bulan & bintang berkelip di air (malam)
function skinGlints(c, t, x, y, stars) {
  const w = Math.sin(t * 2) * 1.2;
  c.save(); c.fillStyle = 'rgba(255,243,176,0.85)';
  c.beginPath(); c.ellipse(x + w, y - 2, 5.5, 1.6, 0, 0, 7); c.fill();
  c.globalAlpha = 0.6; c.beginPath(); c.ellipse(x - w, y + 2, 4, 0.8, 0, 0, 7); c.ellipse(x + w * 0.5, y + 5, 2.5, 0.6, 0, 0, 7); c.fill();
  c.globalAlpha = 1; c.fillStyle = '#ffffff';
  stars.forEach(([a, b], k) => { if ((Math.floor(t * 2) + k) % 3) { c.beginPath(); c.arc(a, b, 0.6, 0, 7); c.fill(); } });
  c.restore();
}

const Skin = (() => {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const READY = new Set(['village', 'farm', 'home', 'barn', 'school', 'classroom', 'office', 'mountain', 'beach', 'station', 'trainride', 'sushibar',
    'carnival', 'zoo', 'church', 'salon', 'workshop', 'rocketbase', 'moon']);
  // per tempat: props templat, pieces = potongan yang digambar oleh kode (bukan bagian latar),
  // hide = bagian desain yang dibuang (diganti gambar yang berubah-ubah), prep = penyesuaian lain
  const CFG = {
    village: { props: { gaya: 'C' }, pieces: ['obj-perahu-naga'], hide: ['obj-bebek-1', 'obj-bebek-2', 'obj-bebek-3'] },
    farm: {
      pieces: ['obj-pagar-depan', 'obj-gerbang-kandang', 'obj-pohon-apel', 'obj-burung-beo', 'obj-pot-bunga', 'obj-peti', 'obj-meja-kayu',
        'obj-bunga-merah', 'obj-bunga-kuning', 'obj-bunga-biru', 'obj-bunga-pink', 'obj-bunga-ungu', 'obj-bunga-oranye', 'obj-bunga-putih'],
      hide: ['obj-tomat', 'obj-kupukupu', 'obj-sarang-telur'],
      // apel digambar sendiri supaya bisa dipetik
      prep(doc) {
        const tree = doc.getElementById('obj-pohon-apel');
        tree.querySelectorAll('[id^="obj-apel-"]').forEach(n => n.remove());
        tree.querySelectorAll('g[fill="#ffffff"]').forEach(n => { if (n.querySelector('circle')) n.remove(); });
      },
    },
    home: {
      pieces: ['obj-jendela', 'obj-kasur', 'obj-tanda-misi', 'obj-nasi', 'obj-mi', 'obj-pangsit', 'obj-bakpao', 'obj-telur', 'obj-susu', 'obj-ikan-goreng'],
      // kaca jendela dibuat bening: langit & cuaca digambar sendiri di belakangnya
      prep(doc) {
        const w = doc.getElementById('obj-jendela');
        w.querySelectorAll('rect[fill="#8fd0f2"]').forEach(n => n.setAttribute('fill', 'none'));
        w.querySelectorAll('circle[fill="#ffd23a"]').forEach(n => n.remove());
      },
    },
  };
  // telur di rak sarang digambar sendiri (jumlahnya berubah)
  CFG.barn = { prep(doc) { doc.querySelectorAll('[id^="obj-telur-"] ellipse').forEach(n => n.remove()); } };
  // bendera, tali & dudukan ayunan, dan bola bergerak: digambar sendiri
  CFG.school = {
    pieces: ['obj-ayunan'], hide: ['obj-bendera', 'obj-bola'],
    prep(doc) { const a = doc.getElementById('obj-ayunan'); a.querySelectorAll('#obj-ayunan-merah,#obj-ayunan-biru,g[stroke="#47425a"]').forEach(n => n.remove()); },
  };
  // kursi dipisah dari meja (Russel duduk di antaranya); pensil & krayon bisa diambil
  CFG.classroom = {
    prep(doc) {
      for (let k = 1; k <= 6; k++) {
        const d = doc.getElementById('obj-meja-' + k);
        if (!d) continue;
        const ch = doc.createElementNS(SVGNS, 'g');
        ch.setAttribute('id', 'obj-kursi-' + k); ch.setAttribute('transform', d.getAttribute('transform'));
        ch.appendChild(d.firstElementChild); d.parentNode.insertBefore(ch, d);
        d.querySelectorAll('path').forEach(p => p.remove());
      }
    },
  };
  CFG.office = { pieces: ['obj-mesin-kopi'] };
  // jamur & bunga liar bisa dipetik (digambar sendiri); garis air terjun bergerak
  CFG.mountain = {
    pieces: ['obj-pinus-'], hide: ['obj-jamur-1', 'obj-jamur-2', 'obj-jamur-3', 'obj-bunga-1', 'obj-bunga-2', 'obj-bunga-3'],
    prep(doc) { doc.querySelectorAll('#obj-air-terjun g[stroke="#ffffff"]').forEach(n => n.remove()); },
  };
  // buih ombak bergerak (digambar sendiri); kerang & bintang laut bisa dipungut
  CFG.beach = {
    pieces: ['obj-perahu-naga', 'obj-matahari', 'obj-gundukan-pasir', 'obj-pohon-kelapa-'],
    hide: ['obj-bintang-laut-1', 'obj-bintang-laut-2', 'obj-kerang-1', 'obj-kerang-2'],
    prep(doc) { doc.querySelectorAll('#bg path[fill="#ffffff"]').forEach(n => { if (/^M-10 396/.test(n.getAttribute('d'))) n.remove(); }); },
  };
  // atap & tiang peron berdiri di depan kereta: dipindah ke potongan sendiri
  CFG.station = {
    pieces: ['obj-atap', 'obj-papan-jadwal', 'obj-bintang-misi', 'obj-mesin-tiket'],
    prep(doc) {
      const g = doc.createElementNS(SVGNS, 'g'), bg = doc.getElementById('bg');
      g.setAttribute('id', 'obj-atap');
      bg.querySelectorAll('rect[y="60"][height="350"],rect[y="398"][x="1124"],rect[y="28"]').forEach(n => g.appendChild(n));
      bg.parentNode.insertBefore(g, bg.nextSibling);
    },
  };
  // pemandangan jendela digambar sendiri (bergerak); bingkai & pegangan di depannya
  CFG.trainride = {
    pieces: ['obj-bingkai', 'obj-pegangan-', 'obj-pintu'], hide: ['obj-pemandangan'],
    prep(doc) {
      const g = doc.createElementNS(SVGNS, 'g'), f = doc.getElementById('bingkai-jendela');
      g.setAttribute('id', 'obj-bingkai'); f.parentNode.insertBefore(g, f);
      g.appendChild(f); const sill = doc.querySelector('rect[x="48"][y="368"]'); if (sill) g.appendChild(sill);
    },
  };
  // garis ban berjalan digambar bergerak
  CFG.sushibar = {
    pieces: ['obj-meja-konter', 'obj-meja-makan', 'obj-sushi-'],
    prep(doc) { doc.querySelectorAll('#obj-meja-konter g[stroke="#4c5464"]').forEach(n => n.remove()); },
  };
  // roda bianglala dipisah dari kakinya (supaya bisa berputar); komidi putar dipisah lantai & atapnya, kuda digambar sendiri
  CFG.carnival = {
    pieces: ['obj-kabin-', 'obj-roda', 'obj-bianglala', 'obj-komidi-lantai', 'obj-komidi-atap', 'obj-gula-kapas', 'obj-popcorn', 'obj-kios-gula-kapas', 'obj-kios-popcorn'],
    prep(doc) {
      const w = doc.getElementById('obj-bianglala'), roda = doc.createElementNS(SVGNS, 'g'), inner = doc.createElementNS(SVGNS, 'g');
      roda.setAttribute('id', 'obj-roda'); roda.setAttribute('transform', 'translate(290,282)'); inner.setAttribute('transform', 'translate(0,170)');
      roda.appendChild(inner);
      [...w.children].forEach(n => { if (n.tagName === 'circle' || (n.tagName === 'g' && !n.id)) inner.appendChild(n); });
      w.parentNode.insertBefore(roda, w.nextSibling);
      const k = doc.getElementById('obj-komidi-putar'), lantai = doc.createElementNS(SVGNS, 'g');
      k.querySelectorAll('g[fill="#ffd23a"]').forEach(n => { if (n.querySelector('rect')) n.remove(); });
      lantai.setAttribute('id', 'obj-komidi-lantai'); lantai.setAttribute('transform', k.getAttribute('transform'));
      [...k.children].slice(0, 3).forEach(n => lantai.appendChild(n));
      k.parentNode.insertBefore(lantai, k); k.setAttribute('id', 'obj-komidi-atap');
    },
  };
  // nyala lilin digambar sendiri (bisa dinyalakan/dimatikan); cahaya kaca patri hanya siang hari
  CFG.church = {
    pieces: ['obj-lilin', 'obj-tali-lonceng'],
    prep(doc) {
      doc.querySelectorAll('#obj-lilin g[fill="#ffd23a"]').forEach(n => n.remove());
      if (G.night) { const c = doc.getElementById('cahaya'); if (c) c.remove(); }
    },
  };
  CFG.workshop = { pieces: ['obj-robot-tikus', 'obj-meja-kerja'] };
  CFG.rocketbase = { pieces: ['obj-mobil-bulan'] };
  // batu bulan bisa dipungut (digambar sendiri); helm Russel dipakai lewat drawHelmet
  CFG.moon = { pieces: ['obj-roket'], hide: ['obj-batu-1', 'obj-batu-2', 'obj-batu-3', 'obj-batu-4', 'obj-helm-russel'] };
  const HORSE_COL = [['#ffffff', '#c9d4e0'], ['#f6c9a3', '#c08a52'], ['#fcd0e2', '#e88ab4'], ['#bfe3f2', '#7aa4ea'], ['#fff2a8', '#d9b02a'], ['#c8e8a8', '#7cc85a']];
  const SUSHI_PIECE = { gunkan: 'obj-sushi-1', salmon: 'obj-sushi-2', tuna: 'obj-sushi-3', shrimp: 'obj-sushi-4', eggsushi: 'obj-sushi-5', cucumber: 'obj-sushi-6' };
  const FOOD_PIECE = { rice: 'obj-nasi', noodles: 'obj-mi', dumpling: 'obj-pangsit', bun: 'obj-bakpao', egg: 'obj-telur', milk: 'obj-susu', fish: 'obj-ikan-goreng' };
  const ARROW_FILL = '#ffe7a3';
  const INHERIT = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linejoin', 'stroke-linecap', 'stroke-dasharray'];

  const X = { on: true, ctx: null, K: 4, RS: 1, drew: false, missing: new Set() };
  try { X.on = localStorage.getItem('anan-skin-off') !== '1'; } catch (e) {}

  // ---------- Konteks kosong: gambar piksel lama tidak muncul, tapi ketahuan kalau ada ----------
  let pxHit = false;
  const markPx = () => { pxHit = true; return NUL; };
  const MARK = new Set(['fillRect', 'strokeRect', 'drawImage', 'putImageData', 'fill', 'stroke', 'fillText', 'strokeText']);
  const NUL = new Proxy(function () {}, {
    get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : MARK.has(k) ? markPx : NUL),
    set: () => true,
    apply: () => NUL,
  });

  // ---------- Templat ----------
  // Penyesuaian kecil pada templat komponen: bayangan bisa dimatikan, kaki orang bisa melangkah
  (function patch() {
    const sub = (name, a, b) => { const T = SKIN_TPL[name]; if (!T || T.svg[0].indexOf(a) < 0) { console.warn('skin: templat berubah', name, a); return; } T.svg[0] = T.svg[0].replace(a, b); };
    sub('Russel', '<ellipse cx="0" cy="0" rx="20" ry="5"', '<ellipse display="{{bayang}}" cx="0" cy="0" rx="20" ry="5"');
    sub('Orang', '<ellipse cx="0" cy="0" rx="22" ry="5"', '<ellipse display="{{bayang}}" cx="0" cy="0" rx="22" ry="5"');
    sub('Orang', '<rect x="{{g.kakiKiriX}}"', '<rect transform="translate(0,{{lk}})" x="{{g.kakiKiriX}}"');
    sub('Orang', '<rect x="2" y="{{g.kakiY}}"', '<rect transform="translate(0,{{lr}})" x="2" y="{{g.kakiY}}"');
    sub('Orang', '<ellipse cx="-8" cy="-3" rx="8" ry="4"', '<ellipse transform="translate(0,{{lk}})" cx="-8" cy="-3" rx="8" ry="4"');
    sub('Orang', '<ellipse cx="8" cy="-3" rx="8" ry="4"', '<ellipse transform="translate(0,{{lr}})" cx="8" cy="-3" rx="8" ry="4"');
  })();
  const pick = (v, path) => { for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; } return v; };
  const fill = (str, vals) => str.replace(/\{\{\s*([^}]*?)\s*\}\}/g, (m, k) => {
    const v = pick(vals, k);
    return v != null ? String(v) : /^-?\d|^(true|false)$/.test(k) ? k : '';
  });
  function expand(name, props, extra) {
    const T = SKIN_TPL[name], p = Object.assign({}, T.def, props || {});
    const vals = T.vals ? T.vals(p) : {};
    if (extra) extra(vals, p);
    return T.svg.map(s => fill(s, vals));
  }
  const inner = s => s.slice(s.indexOf('>') + 1, s.lastIndexOf('</svg>'));
  const viewBox = s => /viewBox="([^"]+)"/.exec(s)[1].trim().split(/[\s,]+/).map(Number);
  const wrap = (vb, body, defs = '') => `<svg xmlns="${SVGNS}" viewBox="${vb.join(' ')}" width="${Math.ceil(vb[2] * X.RS)}" height="${Math.ceil(vb[3] * X.RS)}">${defs}${body}</svg>`;
  const ser = n => new XMLSerializer().serializeToString(n);

  // ---------- Gambar jadi (SVG → Image) ----------
  const imgs = new Map();
  function raster(key, markup) {
    let e = imgs.get(key);
    if (e) { imgs.delete(key); imgs.set(key, e); return e; }
    e = { ok: false, img: new Image() };
    e.img.onload = () => { e.ok = true; };
    e.img.onerror = () => { e.bad = true; console.warn('skin: gagal menggambar', key); };
    e.img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
    imgs.set(key, e);
    while (imgs.size > 600) imgs.delete(imgs.keys().next().value);
    return e;
  }
  // vb dalam satuan desain (1280×720); (x,y) titik tumpu dalam satuan game (320×180)
  function put(e, vb, x, y, o = {}) {
    if (!e || !e.ok) return false;
    const c = X.ctx, K = X.K;
    c.save();
    c.translate(Math.round(x * K) / K, Math.round((y + (o.dy || 0)) * K) / K);
    if (o.rot) c.rotate(o.rot);
    if (o.flip || o.sx || o.sy) c.scale((o.flip ? -1 : 1) * (o.sx || 1), o.sy || 1);
    if (o.alpha != null) c.globalAlpha *= o.alpha;
    c.drawImage(e.img, vb[0] / 4, vb[1] / 4, vb[2] / 4, vb[3] / 4);
    c.restore();
    X.drew = true;
    return true;
  }

  // Komponen (Russel, Orang, Hewan, Dòudou) dan gambar buatan sendiri; gambar terakhir yang siap dipakai selama yang baru dimuat
  const comps = new Map(), lastOk = new Map();
  function compHit(key, make) {
    let h = comps.get(key);
    if (!h) {
      const s = make();
      let vb = viewBox(s);
      vb = [vb[0] - 10, vb[1] - 14, vb[2] + 20, vb[3] + 24];
      h = { vb, e: raster(key, wrap(vb, inner(s))) };
      comps.set(key, h);
      if (comps.size > 600) comps.delete(comps.keys().next().value);
    }
    return h;
  }
  function drawHit(id, h, x, y, o) {
    let use = h;
    if (h.e.ok) lastOk.set(id, h); else { use = lastOk.get(id); X.pending = true; }
    X.drew = true;
    if (use) put(use.e, use.vb, x, y, o);
    return true;
  }
  function drawComp(id, name, props, x, y, o, extra) {
    const key = name + '|' + JSON.stringify(props) + '|' + X.RS;
    return drawHit(id, compHit(key, () => expand(name, props, extra)[0]), x, y, o);
  }
  function drawArt(id, key, svg, x, y, o) {
    return drawHit(id, compHit('art|' + key + '|' + X.RS, () => svg), x, y, o);
  }

  // ---------- Tempat ----------
  const BASE = { grass: '#62c24a', grassDark: '#4fae3a', leaf: '#3fa83a', leafDark: '#2f8a2c', leafLight: '#58bb44' };
  const SEASON_COL = {
    spring: { grass: '#7ccf5a', grassDark: '#68bd48', leaf: '#58c04a', leafDark: '#3f9a36', leafLight: '#8fdc6a' },
    autumn: { grass: '#c2b84a', grassDark: '#a89f3a', leaf: '#e8892e', leafDark: '#c96a1c', leafLight: '#f2b23a' },
    winter: { grass: '#e4eef5', grassDark: '#c9dcef', leaf: '#4f8f6a', leafDark: '#3a7052', leafLight: '#6aa680' },
  };
  const season = () => (typeof EX !== 'undefined' && EX.season) || 'summer';
  // pemandangan jendela kereta per musim (tempat ini di dalam ruangan, jadi diwarnai sendiri)
  const RIDE_SEASON = {
    summer: { hill: '#8fc8a0', field: '#7ccf5a', grass: '#62c24a', tuft: '#4fae3a', leaf: '#3fa83a' },
    spring: { hill: '#a6d6a0', field: '#8fdc6a', grass: '#7ccf5a', tuft: '#68bd48', leaf: '#58c04a', dots: '#f6b4cf', fall: ['#f6b4cf', '#fcd8e8'] },
    autumn: { hill: '#c9b878', field: '#d2c25a', grass: '#c2b84a', tuft: '#a89f3a', leaf: '#e8892e', fall: ['#e8873a', '#c9622a', '#f4c23a'] },
    winter: { hill: '#cfdbe6', field: '#eef4fa', grass: '#e4eef5', tuft: '#c9dcef', leaf: '#4f8f6a', dots: '#ffffff', fall: ['#ffffff'] },
  };
  function palette(S) {
    const m = {}, s = S.outdoor && SEASON_COL[season()];
    if (s) for (const k in s) m[BASE[k]] = s[k];
    if (G.night) { m['#bfe5f4'] = S.outdoor ? '#ffd86a' : '#3a4a7a'; m['#f6f1e2'] = '#fff3b0'; m['#8fd0f2'] = '#33407a'; }
    return m;
  }
  const recolor = (str, map) => str.replace(/#[0-9a-fA-F]{6}\b/g, h => map[h.toLowerCase()] || h);

  let meas = null;
  function measure(g) {
    if (!meas) {
      meas = document.createElementNS(SVGNS, 'svg');
      meas.setAttribute('width', '10'); meas.setAttribute('height', '10');
      meas.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none';
      document.body.appendChild(meas);
    }
    meas.appendChild(g);
    const b = g.getBBox();
    meas.removeChild(g);
    return b;
  }
  // Memotong satu grup jadi gambar sendiri. world: koordinat tetap (tanpa titik tumpu), mis. lapisan fg
  function cut(el, defs, key, world) {
    let ax = 0, ay = 0, rest = el.getAttribute('transform') || '';
    const m = /^\s*translate\(\s*([-\d.e]+)[\s,]+([-\d.e]+)\s*\)\s*(.*)$/.exec(rest);
    if (m && !world) { ax = +m[1]; ay = +m[2]; rest = m[3]; }
    const w = document.createElementNS(SVGNS, 'g');
    for (let p = el.parentNode; p && p.getAttribute; p = p.parentNode) {
      for (const a of INHERIT) if (!w.hasAttribute(a) && p.hasAttribute(a)) w.setAttribute(a, p.getAttribute(a));
    }
    const g = document.importNode(el, true);
    g.removeAttribute('id');
    for (let p = el.parentNode; !world && p && p.getAttribute; p = p.parentNode) {
      const mm = /^\s*translate\(\s*([-\d.e]+)[\s,]+([-\d.e]+)\s*\)\s*$/.exec(p.getAttribute('transform') || '');
      if (mm) { ax += +mm[1]; ay += +mm[2]; }
    }
    if (rest) g.setAttribute('transform', rest); else g.removeAttribute('transform');
    w.appendChild(g);
    const b = measure(w), pad = 6;
    const vb = [Math.floor(b.x - pad), Math.floor(b.y - pad), Math.ceil(b.width + pad * 2), Math.ceil(b.height + pad * 2)];
    return { vb, ax: ax / 4, ay: ay / 4, e: raster(key, wrap(vb, ser(w), defs)) };
  }
  const builds = new Map();
  let lastBg = null;
  // id potongan yang dipakai benda; 'obj-…-' (berakhir '-') dan 'near:…' = semua id berawalan itu.
  // Yang paling dalam dipotong lebih dulu supaya tidak ikut di potongan induknya.
  function claims(id, docs, byId) {
    const set = new Set(), add = k => { if (k.endsWith('-')) docs.forEach(d => d.querySelectorAll(`[id^="${k}"]`).forEach(n => set.add(n.id))); else set.add(k); };
    ((CFG[id] && CFG[id].pieces) || []).forEach(add);
    for (const o of SCENES[id].objs) {
      if (typeof o.skin !== 'string') continue;
      if (o.skin.startsWith('obj-')) add(o.skin); else if (o.skin.startsWith('near:')) add(o.skin.slice(5));
    }
    const depth = k => { let d = 0; for (let n = byId(k); n; n = n.parentNode) d++; return d; };
    return [...set].sort((a, b) => depth(b) - depth(a));
  }
  function nearest(prefix, x, y) {
    let best = null, bd = 1e9;
    for (const k in cur.sprites) if (k.startsWith(prefix)) { const s = cur.sprites[k], d = (s.ax - x) ** 2 + (s.ay - y) ** 2; if (d < bd) { bd = d; best = k; } }
    return best;
  }
  const near = (o, prefix) => {
    if (!o.__near || o.__near.k !== cur.key) o.__near = { k: cur.key, id: nearest(prefix, o.x, o.y) };
    return o.__near.id;
  };
  function build(id) {
    const S = SCENES[id], cf = CFG[id] || {}, key = id + '|' + season() + '|' + (G.night ? 1 : 0) + '|' + X.RS;
    let b = builds.get(key);
    if (b) return b;
    b = { key, id, sprites: {}, fg: [] };
    const map = palette(S);
    const strs = expand(id, cf.props).map(s => recolor(s, map));
    // dokumen kedua (bila ada) = lapisan di depan orang yang duduk/berdiri di belakang meja
    const docs = strs.map(s => new DOMParser().parseFromString(s, 'image/svg+xml'));
    const doc = docs[0], root = doc.documentElement;
    const defs = docs.map(d => { const e = d.documentElement.querySelector('defs'); return e ? ser(e) : ''; }).join('');
    const byId = k => { for (const d of docs) { const n = d.getElementById(k); if (n) return n; } return null; };
    const strip = r => r.querySelectorAll(`[id^="karakter-"],[id^="panah"],[fill="url(#kertas)"],[fill="${ARROW_FILL}"],[stroke="${ARROW_FILL}"]`).forEach(n => n.remove());
    docs.forEach(d => strip(d.documentElement));
    for (const hid of cf.hide || []) { const n = byId(hid); if (n) n.remove(); else console.warn('skin: tidak ada', id, hid); }
    if (cf.prep) cf.prep(doc, docs[1]);
    for (const sid of claims(id, docs, byId)) {
      const el = byId(sid);
      if (!el) { console.warn('skin: tidak ada', id, sid); continue; }
      b.sprites[sid] = cut(el, defs, key + '|' + sid);
      el.remove();
    }
    const hasShape = n => !!n.querySelector('path,rect,circle,ellipse,line,polygon,polyline');
    const fg = doc.getElementById('fg');
    if (fg && hasShape(fg)) b.fg.push(cut(fg, defs, key + '|fg', true));
    if (fg) fg.remove();
    if (docs[1]) {
      const d2 = docs[1].documentElement, g = docs[1].createElementNS(SVGNS, 'g');
      for (const a of INHERIT) if (d2.hasAttribute(a)) g.setAttribute(a, d2.getAttribute(a));
      [...d2.childNodes].forEach(n => { if (n.nodeName !== 'defs') g.appendChild(n); });
      d2.appendChild(g);
      if (hasShape(g)) b.fg.push(cut(g, defs, key + '|fg2', true));
    }
    root.setAttribute('width', Math.ceil(1280 * X.RS)); root.setAttribute('height', Math.ceil(720 * X.RS));
    root.removeAttribute('style');
    b.bg = raster(key + '|bg', ser(root));
    builds.set(key, b);
    while (builds.size > 6) builds.delete(builds.keys().next().value);
    return b;
  }
  let cur = null;
  let late = null; // gambar yang ditunda sampai sesudah warna malam (kembang api)
  const flushLate = () => { const L = late || []; late = null; L.forEach(f => f()); };
  // potongan desain; tanpa x,y digambar di titik tumpu aslinya
  function piece(sid, x, y, o) {
    const sp = cur && cur.sprites[sid];
    if (!sp) return false;
    X.drew = true;
    put(sp.e, sp.vb, x == null ? sp.ax : x, y == null ? sp.ay : y, o);
    return true;
  }

  // ---------- Gambar vektor kecil gaya C (bagian yang berubah-ubah) ----------
  // fn menggambar dalam satuan desain (1280×720) dengan titik (0,0) di (x,y) satuan game
  const P2 = new Map();
  const path = d => { let p = P2.get(d); if (!p) { if (P2.size > 400) P2.clear(); p = new Path2D(d); P2.set(d, p); } return p; };
  const LINE = 'rgba(58,38,22,0.35)';
  function vec(x, y, fn, o = {}) {
    const c = X.ctx, s = 0.25 * (o.s || 1);
    c.save(); c.translate(x, y + (o.dy || 0)); if (o.rot) c.rotate(o.rot); c.scale(o.flip ? -s : s, s);
    c.lineJoin = 'round'; c.lineCap = 'round';
    const v = {
      c,
      fill(d, col, line = true) { const p = typeof d === 'string' ? path(d) : d; c.fillStyle = col; c.fill(p); if (line) { c.strokeStyle = LINE; c.lineWidth = 2; c.stroke(p); } },
      line(d, col, w) { c.strokeStyle = col; c.lineWidth = w; c.stroke(typeof d === 'string' ? path(d) : d); },
      ell(cx, cy, rx, ry, col, line = true, rot = 0) { const p = new Path2D(); p.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); v.fill(p, col, line); },
      rect(x0, y0, w, h, r, col, line = true) { const p = new Path2D(); p.moveTo(x0 + r, y0); p.arcTo(x0 + w, y0, x0 + w, y0 + h, r); p.arcTo(x0 + w, y0 + h, x0, y0 + h, r); p.arcTo(x0, y0 + h, x0, y0, r); p.arcTo(x0, y0, x0 + w, y0, r); p.closePath(); v.fill(p, col, line); },
      hl: (cx, cy, rx, ry) => v.ell(cx, cy, rx, ry, 'rgba(255,255,255,0.65)', false),
      shadow: (rx, ry = 5) => v.ell(0, 0, rx, ry, 'rgba(58,38,22,0.18)', false),
    };
    fn(v);
    c.restore();
    X.drew = true;
    return true;
  }
  function treeArt(x, y, s = 1, leaf = '#3fa83a', dots) {
    vec(x, y, v => {
      v.rect(-5, -30, 10, 30, 4, '#9a5a2c'); v.ell(0, -50, 30, 26, leaf);
      if (dots) [[-14, -56], [6, -64], [16, -46], [-4, -40], [-18, -42], [12, -58]].forEach(([a, b]) => v.ell(a, b, 4, 4, dots, false));
      v.hl(-10, -62, 9, 4);
    }, { s });
  }
  function houseArt(x, y, roof, w = 48, h = 34) {
    vec(x, y, v => {
      v.rect(-w * 2 + 8, -h * 4 + 40, w * 4 - 16, h * 4 - 40, 6, '#fbf0d4');
      v.fill(`M${-w * 2} ${-h * 4 + 44} L${-w * 2 + 24} ${-h * 4} H${w * 2 - 24} L${w * 2} ${-h * 4 + 44} Z`, roof);
      v.rect(-14, -48, 28, 48, 5, '#b5713a'); v.rect(-w * 2 + 22, -h * 4 + 58, 26, 22, 4, '#bfe5f4'); v.rect(w * 2 - 48, -h * 4 + 58, 26, 22, 4, '#bfe5f4');
    });
  }
  function tailArt(x, y, t, miss) {
    vec(x, y, v => {
      v.fill('M-2 6 Q-14 -2 -10 -18 Q-2 -14 4 -2 Z', '#d9a066');
      if (miss >= 2 && Math.floor(t * 4) % 2) v.fill('M0 -40 L4 -32 L12 -31 L6 -26 L8 -18 L0 -22 L-8 -18 L-6 -26 L-12 -31 L-4 -32 Z', '#ffd23a');
    }, { rot: Math.sin(t * 12) * 0.35 });
  }
  function appleArt(x, y) {
    vec(x, y, v => { v.line('M0 -8 Q1 -13 4 -15', '#9a5a2c', 2.5); v.ell(5, -13, 5, 2.5, '#58bb44', true, -0.5); v.ell(0, 0, 9, 9, '#e5443a'); v.hl(-3, -3, 3, 2.4); });
  }
  function cropArt(x0, y0, type, stage, t, wet) {
    const cx = x0 + 9, by = y0 + 12;
    if (wet) vec(cx, by, v => v.rect(-36, -46, 72, 54, 6, 'rgba(40,20,8,0.32)', false));
    if (stage === 1) return vec(cx, by, v => { v.ell(0, -6, 22, 7, '#7a4a2a', false); [[-9, -8], [0, -11], [9, -7]].forEach(([a, b]) => v.ell(a, b, 3.2, 2.4, '#f0dcae')); });
    if (stage === 2 || stage === 3) return vec(cx, by, v => {
      v.line('M0 -2 V-22', '#3fa83a', 4); v.ell(-9, -22, 9, 5, '#58bb44', true, 0.4); v.ell(9, -26, 9, 5, '#58bb44', true, -0.4);
      if (stage === 3) { v.ell(-12, -34, 9, 5, '#46b04a', true, 0.5); v.ell(12, -38, 9, 5, '#46b04a', true, -0.5); }
    });
    if (stage !== 4) return;
    const sw = Math.sin(t * 2 + cx) * 0.05;
    if (type === 'carrot') vec(cx, by, v => {
      v.ell(-9, -28, 5, 13, '#46b04a', true, -0.45); v.ell(9, -28, 5, 13, '#46b04a', true, 0.45); v.ell(0, -32, 5.5, 15, '#58bb44');
      v.fill('M-11 -2 Q-12 -16 0 -18 Q12 -16 11 -2 Q0 5 -11 -2 Z', '#f39a3a'); v.line('M-6 -9 h5 M2 -12 h5', '#c96a1a', 2); v.hl(-5, -13, 3, 1.6);
    }, { rot: sw });
    if (type === 'tomato') vec(cx, by, v => {
      v.line('M0 0 V-54 M0 -30 L-14 -40 M0 -40 L14 -50', '#3fa83a', 4); v.ell(-8, -46, 7, 3.5, '#58bb44', true, 0.5); v.ell(9, -36, 7, 3.5, '#58bb44', true, -0.5);
      [[-12, -36, 9], [9, -26, 9], [2, -54, 8]].forEach(([a, b, r]) => { v.ell(a, b, r, r, '#e5443a'); v.hl(a - 3, b - 3, 2.6, 2); });
    }, { rot: sw });
    if (type === 'watermelon') vec(cx, by, v => {
      v.line('M-34 -4 Q-24 -12 -18 -6', '#3fa83a', 3); v.ell(22, -24, 10, 6, '#58bb44', true, -0.3);
      v.ell(0, -14, 24, 16, '#2f8a2c'); v.line('M-14 -27 Q-19 -14 -12 -1 M0 -30 V2 M14 -27 Q19 -14 12 -1', '#1f6a24', 3.5); v.hl(-9, -22, 6, 3);
    });
    if (type === 'corn') vec(cx, by, v => {
      v.rect(-3, -52, 6, 52, 3, '#3fa83a'); v.line('M0 -18 Q-20 -24 -26 -12', '#46b04a', 5); v.line('M0 -30 Q20 -38 24 -26', '#46b04a', 5);
      v.ell(9, -36, 7, 14, '#ffd23a'); v.line('M5 -44 h8 M5 -37 h8 M5 -30 h8', '#d9a520', 1.8); v.fill('M2 -26 Q9 -16 16 -26 Q9 -21 2 -26 Z', '#7ccf5a');
      v.line('M0 -52 L-6 -60 M0 -52 L0 -62 M0 -52 L6 -60', '#e0b878', 2.5);
    }, { rot: sw });
  }
  function nestArt(x, y, n) {
    vec(x, y, v => {
      v.shadow(36);
      [[-12, -18, 9, 11], [6, -20, 9, 11], [18, -16, 8, 10]].slice(0, n).forEach(([a, b, rx, ry]) => { v.ell(a, b, rx, ry, '#fbf6ec'); v.hl(a - 3, b - 4, 2.5, 3); });
      v.fill('M-34 0 Q-36 -16 0 -16 Q36 -16 34 0 Z', '#e0b878'); v.line('M-24 -6 L-14 -10 M0 -12 L10 -8 M18 -10 L26 -5', '#c9a04a', 2.5);
    });
  }
  const FLOWER_IDS = ['obj-bunga-merah', 'obj-bunga-kuning', 'obj-bunga-biru', 'obj-bunga-pink', 'obj-bunga-ungu', 'obj-bunga-oranye', 'obj-bunga-putih'];
  // gambar untuk benda dengan o.skin = 'fn:nama'
  const ART = {
    farmGate(o) { piece('obj-pagar-depan'); if (!o.open) piece('obj-gerbang-kandang'); },
    nest(o) { nestArt(215.5, 88, o.eggs); },
    appleTree(o, t) {
      const s = o.shake > 0 ? Math.sin(t * 50) * 0.8 : 0;
      piece('obj-pohon-apel', 150.5 + s, 63.5);
      [[-34, -130], [2, -118], [40, -96], [-16, -90], [22, -148]].forEach(([a, b], i) => { if (o.has[i]) appleArt(150.5 + s + a / 4, 63.5 + b / 4); });
    },
    crop(o, t) { cropArt(o.x - 9, o.y - 14, o.type, o.stage, t, o.wet); },
    flower(o, t) { piece(FLOWER_IDS[o.ci], null, null, { rot: Math.sin(t * 1.5 + o.ci) * 0.05 }); },
    hideTable(o, t) { piece('obj-meja-kayu'); if (HS.on && HS.spot === 'table') tailArt(238, 154, t, HS.miss); },
    hideBox(o, t) {
      const shake = HS.on && HS.spot === 'box' && Math.floor(t * 2) % 3 === 0 ? 0.6 : 0;
      piece('obj-peti', 272 + shake, 155.5);
      if (HS.on && HS.spot === 'box') tailArt(284, 143, t, HS.miss);
    },
    parrot(o, t) {
      const talk = PARROT.st === 'talk', listen = PARROT.st === 'listen', bob = talk ? Math.floor(t * 8) % 2 : Math.sin(t * 2) > 0.7 ? 0.6 : 0;
      piece('obj-burung-beo', null, null, { dy: -bob });
      if (listen) vec(140, 68, v => { const r = Math.floor(t * 5) % 3; for (let i = 0; i <= r; i++) v.line(`M${14 + i * 7} -10 Q${20 + i * 7} 0 ${14 + i * 7} 10`, '#3f7ee0', 3); });
    },
    homeWindow(o, t) {
      piece('obj-jendela');
      vec(160, 36.5, v => {
        const c = v.c, sky = G.night ? '#26305e' : { rain: '#8a9aaa', cloud: '#a9c4d8', snow: '#c9d6e2' }[G.weather] || '#8fd0f2';
        c.save(); c.beginPath(); c.rect(-94, -120, 188, 108); c.clip();
        c.fillStyle = sky; c.fillRect(-94, -120, 188, 108);
        if (G.night) {
          v.ell(46, -92, 16, 16, '#fff2c0', false); v.ell(54, -97, 13, 13, sky, false);
          [[-70, -100], [-40, -70], [-10, -104], [-60, -30], [20, -40], [70, -36]].forEach(([a, b], i) => v.ell(a, b, 2.5, 2.5, Math.floor(t * 2 + i) % 3 ? '#ffffff' : '#fff2a8', false));
        } else if (G.weather === 'sun' || G.weather === 'wind') { v.ell(-46, -92, 18, 18, '#ffd23a'); v.ell(-46, -92, 11, 11, '#fff2a8', false); }
        if (!G.night && G.weather !== 'sun') { v.ell(30 + Math.sin(t * 0.3) * 16, -86, 34, 11, '#f4f7fa', false); v.ell(-34, -56, 26, 8, '#eef2f6', false); }
        if (G.weather === 'rain') for (let i = 0; i < 10; i++) { const a = -94 + (i * 29 + t * 160) % 188, b = -120 + (i * 43 + t * 240) % 108; v.line(`M${a} ${b} l-2 9`, '#d8eefa', 2.5); }
        if (G.weather === 'snow') for (let i = 0; i < 10; i++) v.ell(-94 + (i * 37 + t * 30) % 188, -120 + (i * 53 + t * 50) % 108, 3, 3, '#ffffff', false);
        if (G.weather === 'wind') for (let i = 0; i < 3; i++) v.ell(-94 + (i * 67 + t * 200) % 188, -96 + i * 28, 6, 3, '#58bb44', false, 0.5);
        c.restore();
        v.line('M0 -120 V-12 M-94 -66 H94', '#b5713a', 8);
        v.line('M30 -110 l-20 30 M50 -110 l-30 46', 'rgba(255,255,255,0.5)', 5);
      });
    },
    bed() {
      piece('obj-kasur');
      if (!G.boy.inBed) return;
      // kepala Russel tidur di bantal, badannya di bawah selimut
      const c = X.ctx;
      c.save(); c.beginPath(); c.rect(0, 0, W, 69.5); c.clip();
      personArt(33.25, 79, { look: 'me', dir: 'down', mood: 'sleepy', noShadow: true, outfit: effOutfit() });
      c.restore();
    },
    tableFood(o) { if (o.gone <= 0) piece(FOOD_PIECE[o.food]); },
    schoolFlag(o, t) {
      vec(273, 63, v => {
        const w = k => Math.sin(t * 4 - k) * 5;
        v.fill(`M6 -232 Q40 ${-244 + w(1)} 76 ${-228 + w(2)} V${-200 + w(2)} Q40 ${-214 + w(1)} 6 -204 Z`, '#e5443a');
        v.fill(`M6 -204 Q40 ${-214 + w(1)} 76 ${-200 + w(2)} V${-172 + w(2)} Q40 ${-186 + w(1)} 6 -176 Z`, '#ffffff');
      });
    },
    swing(o) {
      piece('obj-ayunan');
      vec(183.75, 101, v => [[-68, o.o, '#e5443a'], [48, o.o2, '#3f7ee0']].forEach(([cx, off, col]) => {
        const d = off * 4;
        v.line(`M${cx - 20} -132 L${cx - 20 + d} -44 M${cx + 20} -132 L${cx + 20 + d} -44`, '#47425a', 3);
        v.rect(cx - 28 + d, -46, 56, 12, 5, col);
      }));
    },
    jumpRope(o, t) {
      const ph = Math.sin(t * 9), jump = o.talkT <= 0, bob = jump ? Math.max(0, ph) * 3 : 0, x = o.x, y = o.y, c = X.ctx, hy = y - 8 - bob;
      const rope = apex => { c.save(); c.strokeStyle = '#e5443a'; c.lineWidth = 0.8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 5.5, hy); c.quadraticCurveTo(x, 2 * apex - hy, x + 5.5, hy); c.stroke(); c.restore(); };
      if (jump && ph <= 0) rope(y + 1.5);
      personArt(x, y, { look: 'xiaoyu', dir: o.dir, mood: 'happy', bob });
      if (jump && ph > 0) rope(y - 30 - bob);
      X.drew = true;
    },
    ball(o) {
      vec(o.x, o.y, v => v.shadow(14, 3.5));
      vec(o.x, o.y - o.h, v => { v.ell(0, -14, 14, 14, '#ffffff'); v.ell(0, -14, 4.5, 4.5, '#e5443a', false); v.line('M-12 -19 Q0 -10 12 -19', '#e5443a', 2); v.hl(-5, -21, 3.5, 2.2); });
    },
    drumKit(o) { piece('obj-drum', null, null, { dy: o.hitT > 0 ? -0.6 : 0 }); },
    deskItem(o) {
      vec(o.x, o.y, v => {
        if (o.kind === 'pencil') { v.line('M14 -30 L40 -54', '#ffd23a', 5); v.line('M38 -52 L44 -58', '#f6a8c8', 5); v.line('M12 -28 L16 -32', '#3a2616', 3); }
        else v.line('M14 -30 L40 -54', '#e5443a', 6);
      });
    },
    phoneRing(o, t) {
      if (o.ring <= 0) return;
      vec(74, 88, v => { const s = Math.sin(t * 40) * 2; v.line(`M${-22 + s} -10 Q${-30 + s} 0 ${-22 + s} 10 M${22 - s} -10 Q${30 - s} 0 ${22 - s} 10`, '#e5443a', 3); });
    },
    coffeeMachine(o, t) {
      piece('obj-mesin-kopi');
      if (o.brewing && Math.floor(t * 6) % 2) vec(216.5, 37, v => v.line('M0 0 V8', '#7a4a2a', 3));
    },
    mtnNight(o, t) {
      vec(60, 18, v => { v.ell(0, 0, 28, 28, '#fff2c0'); v.ell(12, -8, 24, 24, '#33407a', false); });
      [[96, 10], [120, 26], [200, 8], [270, 20], [24, 30], [176, 30]].forEach(([a, b], k) => { if ((Math.floor(t * 2) + k) % 3) vec(a, b, v => v.fill('M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z', '#ffffff', false)); });
    },
    cloud(o) { vec(o.x, o.y, v => { v.ell(-16, -10, 16, 14, '#ffffff'); v.ell(14, -8, 13, 12, '#ffffff'); v.ell(0, 0, 46, 14, '#ffffff'); v.ell(-16, -10, 15, 13, '#ffffff', false); v.ell(14, -8, 12, 11, '#ffffff', false); }); },
    pine(o) { piece(near(o, 'obj-pinus-'), null, null, { rot: o.sway > 0 ? Math.sin(G.t * 40) * 0.05 : 0 }); },
    waves(o, t) {
      vec(0, 0, v => {
        const off = Math.sin(t * 1.3) * 10;
        let d = 'M-10 414';
        for (let x = -10; x <= 1290; x += 20) d += ` L${x} ${(398 + off + Math.sin(x / 36 + t * 2) * 5).toFixed(1)}`;
        v.fill(d + ' L1290 414 Z', '#ffffff', false);
        for (let k = 0; k < 8; k++) if ((Math.floor(t * 3) + k) % 4) v.ell((k * 164 + t * 24) % 1280, 176 + k * 24, 8, 2, 'rgba(255,255,255,0.8)', false);
      });
    },
    beachSun() {
      if (!G.night) { piece('obj-matahari'); return; }
      vec(272.5, 14.5, v => { v.ell(0, 0, 28, 28, '#fff2c0'); v.ell(12, -8, 24, 24, '#33407a', false); });
    },
    palm(o, t) { piece(near(o, 'obj-pohon-kelapa-'), null, null, { rot: Math.sin(t * 1.5 + o.x) * 0.025 }); },
    sandcastle(o) {
      piece('obj-gundukan-pasir');
      if (o.lvl < 2) return;
      vec(150.75, 158, v => {
        v.rect(-24, -40, 48, 34, 4, '#f2cb8a');
        [-24, -8, 8].forEach(x => v.rect(x, -48, 10, 10, 2, '#f2cb8a'));
        v.fill('M-6 -6 V-18 Q0 -26 6 -18 V-6 Z', '#c4884f');
        if (o.lvl < 3) return;
        v.rect(-12, -70, 24, 30, 3, '#f6dca4'); v.line('M0 -70 V-92', '#9a5a2c', 2.5); v.fill('M0 -92 L16 -86 L0 -80 Z', '#e5443a');
      });
    },
    stationRoof(o, t) {
      piece('obj-atap'); piece('obj-papan-jadwal');
      const on = G.ticket ? Math.floor(t * 3) % 4 : Math.floor(t * 1.5) % 4;
      vec(160, 45, v => v.rect(-92 + on * 48, -62, 32, 10, 5, G.ticket ? '#ffd23a' : '#5fe0b0', false));
    },
    ticketMachine(o, t) { piece('obj-mesin-tiket'); if (!G.ticket && Math.floor(t * 2) % 2) piece('obj-bintang-misi'); },
    stationTrain(o, t) {
      o.draw(NUL, t);
      if (o.type === 'freight') return;
      const dx = o.doorX, top = o.y - 39, h = 28, open = o.door * 7, col = o.type === 'bullet' ? '#eef2f6' : '#46b04a';
      vec(dx, top, v => {
        v.rect(-32, -4, 64, h * 4 + 4, 6, o.type === 'bullet' ? '#9aa0ab' : '#2f8a2c');
        v.rect(-28, 0, 56, h * 4, 4, '#3a3040', false);
        if (open < 7) { v.rect(-28, 0, 28 - open * 4, h * 4, 4, col); v.rect(open * 4, 0, 28 - open * 4, h * 4, 4, col); }
      });
      if (o.st === 'stop' && G.ticket) arrowHi(X.ctx, dx, o.y + 10, 'up', t);
    },
    rideView(o, t) {
      const c = X.ctx, s = RD.s, N = G.night, dest = RD.dest, sx = wx => RX1 + (wx - s), Wd = RX1 - RX0;
      // warna pemandangan mengikuti musim (siang); malam memakai warna gelap
      const ss = season(), SV = RIDE_SEASON[ss] || RIDE_SEASON.summer;
      const V = N ? { hill: ss === 'winter' ? '#6a7896' : '#34583e', field: ss === 'winter' ? '#7c8aa8' : '#3f6a48', grass: ss === 'winter' ? '#6a7896' : '#34583e', tuft: ss === 'winter' ? '#5a6886' : '#2a4a34', leaf: SV.leaf } : SV;
      c.save(); c.beginPath(); c.rect(RX0, RY0, Wd, RY1 - RY0); c.clip();
      const g = c.createLinearGradient(0, RY0, 0, 66);
      g.addColorStop(0, N ? '#26305e' : '#8fd0f2'); g.addColorStop(1, N ? '#3a4a7a' : '#e2f4fc');
      c.fillStyle = g; c.fillRect(RX0, RY0, Wd, 40);
      if (N) [[40, 40], [90, 36], [150, 44], [210, 38], [260, 46]].forEach(([a, b], k) => { if ((Math.floor(t * 2) + k) % 3) vec(a, b, v => v.ell(0, 0, 2.5, 2.5, '#ffffff', false)); });
      else for (let i = 0; i < 4; i++) {
        const cx = RX0 + ((i * 96 - s * 0.05) % 340 + 340) % 340 - 30;
        vec(cx, 40 + i * 3, v => v.fill('M-30 6 Q-32 -6 -16 -6 Q-8 -16 8 -12 Q24 -18 32 -4 Q50 -4 48 6 Z', '#ffffff', false));
      }
      if (dest === 'mountain') for (let i = 0; i < 4; i++) {
        const p0 = RX1 + (i * 110 - (s - 300) * 0.3), h = (26 + (i % 2) * 8) * 4, w = h * 1.1, sn = 28;
        if (p0 > RX0 - 60 && p0 < RX1 + 60) vec(p0, 66, v => { v.fill(`M${-w} 0 L0 ${-h} L${w} 0 Z`, N ? '#4a4f7a' : '#8f94b6'); v.fill(`M${-sn * 1.1} ${-h + sn} L0 ${-h} L${sn * 1.1} ${-h + sn} Q0 ${-h + sn - 8} ${-sn * 1.1} ${-h + sn} Z`, '#ffffff'); });
      }
      c.beginPath(); c.moveTo(RX0, 70);
      for (let x = RX0; x <= RX1; x += 3) c.lineTo(x, 66 - (8 + Math.sin((x + s * 0.15) / 34) * 5 + Math.sin((x + s * 0.15) / 13) * 2));
      c.lineTo(RX1, 70); c.fillStyle = V.hill; c.fill();
      if (dest === 'school' || dest === 'office') for (let i = 0; i < 8; i++) {
        const bx = RX1 + (620 + i * 44 - s) * 0.6, bh = 16 + (i * 7) % 16;
        if (bx > RX0 - 30 && bx < RX1 + 10) vec(bx + 13, 66, v => {
          v.rect(-52, -bh * 4, 104, bh * 4, 6, ['#c9d4e0', '#dfe6ee', '#f2dcb4'][i % 3]);
          for (let wy = -bh * 4 + 12; wy < -12; wy += 20) for (let wx = -40; wx < 40; wx += 24) v.rect(wx, wy, 12, 12, 3, N ? '#ffd86a' : '#bfe5f4', false);
        });
      }
      c.fillStyle = V.field; c.fillRect(RX0, 64, Wd, 18);
      if (dest === 'beach' || dest === 'sushibar') {
        const xs = RX1 + (640 - s) * 0.6;
        if (xs < RX1) {
          c.fillStyle = '#f6dca4'; c.fillRect(xs - 4, 64, RX1 - xs + 4, 18);
          c.fillStyle = N ? '#2a4f7a' : '#4fb4ec'; c.fillRect(xs, 62, RX1 - xs, 16);
          for (let i = 0; i < 12; i++) { const span = RX1 - xs + 40, wx = xs + ((i * 37 - s * 0.2) % span + span) % span; vec(wx, 64 + (i % 4) * 3, v => v.line('M0 0 h28', N ? '#3a6a9a' : '#bfe5f4', 3)); }
        }
      }
      c.fillStyle = V.grass; c.fillRect(RX0, 80, Wd, 12);
      for (let x = RX0 - (s % 16); x < RX1; x += 16) vec(x, 86, v => v.ell(0, 0, 8, 2.5, V.tuft, false));
      if (RD.bridge) {
        const xa = sx(RD.bridge[0]), xb = sx(RD.bridge[1]);
        if (xb > RX0 && xa < RX1) {
          c.fillStyle = N ? '#2a4f7a' : '#4fb4ec'; c.fillRect(xa, 64, xb - xa, 28);
          c.fillStyle = '#8a8696'; c.fillRect(xa, 75, xb - xa, 2.5); c.fillRect(xa, 58, xb - xa, 2);
          c.strokeStyle = '#9aa0ab'; c.lineWidth = 1.2; c.beginPath();
          for (let x = xa; x < xb; x += 14) { c.moveTo(x, 58); c.lineTo(x, 76); c.moveTo(x, 60); c.lineTo(x + 14, 75); }
          c.stroke();
        }
      }
      RD.items.forEach(([k, wx]) => {
        const x = sx(wx);
        if (x < RX0 - 40 || x > RX1 + 40) return;
        if (k === 'tree') treeArt(x, 86, 0.9, V.leaf, SV.dots);
        else if (k === 'cow') animal('sapi', x, 86, { flip: true });
        else if (k === 'sheep') animal('domba', x, 86, { flip: true });
        else if (k === 'bird') animal('burung', x, 49, { dy: Math.sin(t * 10) * 0.5 });
        else if (k === 'school') houseArt(x, 84, '#2fa0a0');
        else if (k === 'sushibar') houseArt(x, 84, '#2c4a8a', 44, 30);
        else if (k === 'office') vec(x, 86, v => { v.rect(-56, -200, 112, 200, 8, '#c9d4e0'); for (let wy = -184; wy < -12; wy += 24) for (let wx = -44; wx < 44; wx += 28) v.rect(wx, wy, 16, 16, 3, N ? '#ffd86a' : '#bfe5f4', false); });
        else if (k === 'zoo') { animal('gajah', x - 26, 86); animal('jerapah', x + 8, 84, { flip: true }); vec(x - 8, 86, v => { v.line('M-152 -24 H120', '#9a5a2c', 8); for (let f = -152; f <= 120; f += 24) v.line(`M${f} -32 V0`, '#9a5a2c', 6); }); }
        else if (k === 'carnival') vec(x, 86, v => {
          v.line('M-30 0 L0 -96 L30 0', '#9aa0ab', 6); v.ell(0, -96, 72, 72, 'rgba(0,0,0,0)'); v.line('M0 -168 V-24 M-72 -96 H72', '#c9ccd4', 3);
          for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.5; v.rect(Math.cos(a) * 72 - 10, -96 + Math.sin(a) * 72 - 8, 20, 16, 4, ['#e5443a', '#ffd23a', '#3f7ee0', '#46b04a'][i % 4]); }
        });
      });
      for (let x = RX0 - (s % 130) + 40; x < RX1 + 10; x += 130) vec(x, 92, v => { v.rect(-4, -232, 8, 232, 3, '#8a5a3a', false); v.rect(-24, -226, 48, 6, 3, '#8a5a3a', false); });
      // kelopak, daun, atau salju yang lewat di depan jendela
      if (SV.fall) {
        const Hh = RY1 - RY0, n = ss === 'winter' ? 26 : 16;
        for (let i = 0; i < n; i++) {
          const x = RX0 + (((i * 53 - s * 0.6 - t * 6) % Wd) + Wd) % Wd, y = RY0 + ((i * 37 + t * (9 + (i % 3) * 3)) % Hh);
          const col = SV.fall[i % SV.fall.length], a = t * 3 + i;
          if (ss === 'winter') vec(x, y, v => v.ell(0, 0, i % 4 ? 1.6 : 2.6, i % 4 ? 1.6 : 2.6, col, false));
          else vec(x, y, v => v.ell(0, 0, ss === 'autumn' ? 5 : 4, ss === 'autumn' ? 2.6 : 2.4, col, false, Math.sin(a) * 1.2));
        }
      }
      if (RD.tunnel) {
        const xa = sx(RD.tunnel[0]), xb = sx(RD.tunnel[1]);
        if (xb > RX0 && xa < RX1) {
          c.fillStyle = '#20242e'; c.fillRect(xa, RY0, xb - xa, RY1 - RY0);
          for (let wx = RD.tunnel[0] + 30; wx < RD.tunnel[1]; wx += 50) vec(sx(wx), 45, v => v.rect(0, -4, 32, 8, 4, '#ffd86a', false));
          c.fillStyle = '#9aa0ab'; c.fillRect(xa - 8, RY0, 8, RY1 - RY0); c.fillRect(xb, RY0, 8, RY1 - RY0);
        }
      }
      c.restore();
    },
    rideFrame() { piece('obj-bingkai'); for (const k in cur.sprites) if (k.startsWith('obj-pegangan-')) piece(k); },
    rideDoor(o, t) {
      if (RD.st !== 'stop') { piece('obj-pintu'); return; }
      vec(305, 144, v => { v.rect(-46, -474, 90, 474, 8, '#2c4a5a'); v.rect(-38, -464, 74, 456, 6, '#cfe8f5', false); v.rect(-38, -90, 74, 82, 6, '#c9c6c0', false); });
      arrowHi(X.ctx, 304, 112, 'right', t);
    },
    sushiCounter(o, t) {
      piece('obj-meja-konter');
      vec(0, 0, v => { let d = ''; for (let x = 70 + (t * 48) % 60; x < 1186; x += 60) if (x > 96) d += `M${x.toFixed(1)} 340 V384 `; v.line(d, '#4c5464', 3); });
      const n = SCENES.sushibar.plates;
      for (let i = 0; i < n; i++) vec(40, 82 - i * 2, v => { v.ell(0, 0, 26, 5, '#ffffff'); v.ell(0, 3, 24, 2.5, ['#3f7ee0', '#e5443a', '#ffd23a', '#46b04a', '#f6a8c8'][i % 5], false); });
    },
    sushiTable(o, t) { piece('obj-meja-makan'); if (Math.floor(t * 2) % 2) vec(264, 128, v => v.fill('M0 -14 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4 Z', '#ffd23a')); },
    waiterRobot(o) {
      animal('robot', o.x, o.y, { flip: o.dir < 0, sx: 1.05, sy: 1.05 });
      vec(o.x, o.y - 11, v => { v.rect(-26, -4, 52, 8, 3, '#b5713a'); v.rect(-18, -18, 12, 14, 3, '#ffffff'); v.rect(4, -16, 12, 12, 3, '#58745a'); });
    },
    ferris(o) {
      piece('obj-bianglala');
      piece('obj-roda', 72.5, 70.5, { rot: o.a });
      for (let i = 0; i < 8; i++) {
        const a = o.a + i / 8 * Math.PI * 2, cx = 72.5 + Math.cos(a) * 37.5, cy = 70.5 + Math.sin(a) * 37.5;
        if (o.riding && o.cab === i) personArt(cx, cy + 6, { look: 'me', dir: 'down', mood: 'happy', outfit: effOutfit(), noShadow: true, frame: 0 });
        piece('obj-kabin-' + (i + 1), cx, cy);
      }
    },
    carousel(o) {
      piece('obj-komidi-lantai');
      const list = [0, 1, 2, 3, 4, 5].map(i => { const a = o.a + i / 6 * Math.PI * 2; return { i, x: 244.5 + Math.cos(a) * 34, y: 99 + Math.sin(a) * 8, depth: Math.sin(a), dir: -Math.sin(a) > 0 ? 1 : -1 }; })
        .sort((p, q) => p.depth - q.depth);
      const horse = h => {
        const y = h.y + Math.sin(o.a * 3 + h.i * 2) * 2;
        vec(h.x, 0, v => v.line(`M0 ${58 * 4} V${(y - 12) * 4}`, '#ffd23a', 6));
        animalCol('kuda', { '#c98a4a': HORSE_COL[h.i][0], '#ffd23a': HORSE_COL[h.i][1] }, h.x, y, { flip: h.dir < 0, sx: 0.55, sy: 0.55 });
        if (o.riding && o.horse === h.i) personArt(h.x, y - 9, { look: 'me', dir: h.dir > 0 ? 'right' : 'left', mood: 'happy', outfit: effOutfit(), noShadow: true, frame: 0 });
      };
      list.filter(h => h.depth < 0).forEach(horse);
      piece('obj-komidi-atap');
      list.filter(h => h.depth >= 0).forEach(horse);
    },
    heldBalloon(o, t) {
      const b = G.boy, sw = Math.sin(t * 1.6) * 2, col = newCol(b.balloon);
      vec(b.x + 7, b.y - 18, v => { v.line(`M0 0 Q${sw * 2} -40 ${sw * 4} -72`, '#47425a', 1.6); v.ell(sw * 4, -92, 20, 23, col); v.hl(sw * 4 - 7, -100, 5, 7); });
    },
    carnivalStall(o) { const g = o.x < 250; piece(g ? 'obj-kios-gula-kapas' : 'obj-kios-popcorn'); if (o.gone <= 0) piece(g ? 'obj-gula-kapas' : 'obj-popcorn'); },
    bellRope(o) { piece('obj-tali-lonceng', null, null, { dy: Math.sin(o.pull * 12) * 3 * Math.min(1, Math.max(0, o.pull)) * 0.6 }); },
    candles(o, t) {
      piece('obj-lilin');
      if (o.lit) vec(222.5, 93, v => [[-28, -88], [0, -96], [28, -88]].forEach(([a, b], i) => {
        const f = Math.sin(t * 14 + i * 2) * 1.5;
        v.ell(a, b - 2, 5, 9 + f, '#ffd23a', false); v.ell(a, b, 2.5, 5, '#f39a3a', false);
      }));
    },
    workbench(o, t) {
      piece('obj-meja-kerja');
      if (!EX.robot) animalCol('robot', { '#dfe6ee': '#c9ccd4', '#3f7ee0': '#9aa0ab', '#2e3d4a': '#5a5f6a', '#5fe0d0': '#7d8796', '#f6a8c8': '#9aa0ab' }, 160, 92, { sx: 0.8, sy: 0.8 });
      if (Math.floor(t * 2) % 2) vec(160, EX.robot ? 76 : 50, v => v.fill('M0 -14 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4 Z', '#ffd23a'));
    },
    mouseBot(o) { piece('obj-robot-tikus', o.x, o.y, { flip: o.dir < 0 }); },
    rover(o) { piece('obj-mobil-bulan', o.x, o.y, { flip: o.dir < 0 }); },
    moonRocket(o, t) { piece('obj-roket'); if (Math.floor(t * 2) % 2) arrowHi(X.ctx, 240, 136, 'right', t); },
    moonStars(o, t) {
      [[120, 20], [190, 12], [250, 30], [300, 16]].forEach(([a, b]) => { if (Math.floor(t * 2 + a) % 3) vec(a, b, v => v.fill('M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-10 -3 L-3 -3 Z', '#fff2a8', false)); });
    },
    barnEggs(o) { [252, 275, 299].slice(0, o.eggs).forEach(x => vec(x, 47, v => { v.ell(0, 0, 10, 13, '#fbf6ec'); v.hl(-3, -5, 3, 4); })); },
    milkPail(o, t) {
      vec(90, 112, v => {
        v.shadow(26, 4); v.fill('M-22 -30 H22 L18 -2 Q17 2 12 2 H-12 Q-17 2 -18 -2 Z', '#c9d4e0'); v.ell(0, -30, 22, 6, '#ffffff');
        v.line('M-20 -30 Q0 -58 20 -30', '#9aa0ab', 3); v.hl(-12, -18, 3, 7);
        if (Math.floor(t * 8) % 2) v.line('M0 -56 V-40', '#ffffff', 3);
      });
    },
    // orang yang bisa memberi misi (Ibu, Bu Guru, Ayah, Kakak): tanda "!" kuning di atas kepala
    missionNpc(o, t) {
      o.draw(NUL, t);
      if (!missionMark(o)) return;
      const bob = Math.abs(Math.sin(t * 3)) * 2;
      if (o.look === 'mom' && piece('obj-tanda-misi', o.x + 0.5, o.y - 32 - bob)) return;
      vec(o.x + 0.5, o.hit[1] - 2 - bob, v => { v.rect(-13, -40, 26, 38, 9, '#ffd23a'); v.rect(-3.5, -33, 7, 18, 3.5, '#e5443a', false); v.ell(0, -9, 4, 4, '#e5443a', false); v.hl(-7, -34, 3, 4); });
    },
    dogCare(o, t) {
      const d = G.dog, dir = d.dir || 1;
      if (d.foamT > 0) vec(d.x, d.y, v => [[-6, -6], [-1, -10], [4, -7], [-3, -14], [3, -15], [8, -13], [-7, -11]].forEach(([a, b], i) => {
        const y = (b - (Math.floor(t * 4 + i) % 2)) * 4; v.ell(a * dir * 4, y, 8, 8, '#ffffff'); v.hl(a * dir * 4 - 2, y - 3, 2.5, 2);
      }));
      if (d.bowlT > 0) vec(d.x + dir * 12, d.y, v => { v.fill('M-18 -12 H18 L14 0 H-14 Z', '#e5443a'); v.ell(0, -12, 18, 4, '#9a5a2c'); });
    },
  };

  // ---------- Kanvas ----------
  function sizeHi() {
    const box = document.getElementById('box'), cw = (box && box.clientWidth) || 1280;
    const w = Math.max(1280, Math.min(2560, Math.round(cw * (window.devicePixelRatio || 1) / 16) * 16)), h = w * 9 / 16;
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    X.K = cv.width / W; X.RS = X.K / 4; X.ctx = outCtx;
  }
  function sizePixel() { if (cv.width !== W * 4 || cv.height !== H * 4) { cv.width = W * 4; cv.height = H * 4; } }

  // ---------- Karakter ----------
  const anak = o => Object.assign({ dewasa: false, bajuJenis: 'kaos', dasi: '', celana: '#3a6fd0', sepatu: '#5a3826', warnaRambut: '#3a2a22' }, o);
  const dws = o => Object.assign({ dewasa: true, bajuJenis: 'kaos', dasi: '', celana: '#3e4258', sepatu: '#4a3022', warnaRambut: '#3a2a22' }, o);
  const LOOK_CFG = {
    dad: dws({ baju: '#ffffff', bajuJenis: 'kemeja', dasi: '#3f7ee0' }),
    mom: dws({ rambut: 'panjang', warnaRambut: '#6b3f22', baju: '#ef8fae', bajuJenis: 'gaun', celemek: '#fff3dc', sepatu: '#b8302a' }),
    grandpa: dws({ rambut: 'botak', warnaRambut: '#d9d4cc', kumis: true, kacamata: true, baju: '#8a6a4a', celana: '#4a4a52' }),
    grandma: dws({ rambut: 'sanggul', warnaRambut: '#cfc8c0', baju: '#8f7fd0', bajuJenis: 'gaun' }),
    gege: anak({ rambut: 'pendek', warnaRambut: '#2a201a', baju: '#3aa0a0', celana: '#3e4258', sepatu: '#ffffff' }),
    meimei: anak({ rambut: 'kuncir', pita: '#e5443a', baju: '#f39a3a', celana: '#f39a3a', sepatu: '#e5443a' }),
    lele: anak({ rambut: 'pendek', warnaRambut: '#22201e', kulit: '#e8b48a', baju: '#4aa0e8', celana: '#3e4258' }),
    tiantian: anak({ rambut: 'pendek', topi: 'cap', warnaTopi: '#46b04a', baju: '#ffd23a', celana: '#3e4258', sepatu: '#e5443a' }),
    xiaoyu: anak({ rambut: 'bob', warnaRambut: '#5e3720', jepit: '#46b04a', baju: '#f6a8c8', bajuJenis: 'gaun', sepatu: '#ffffff' }),
    kid1: anak({ rambut: 'bob', jepit: '#ffd23a', baju: '#58bb44', celana: '#ffffff', sepatu: '#ffffff' }),
    kid2: anak({ rambut: 'pendek', kulit: '#e0a878', baju: '#f39a3a', celana: '#3a6fd0' }),
    kid3: anak({ rambut: 'kuncir', pita: '#f6a8c8', baju: '#9b7fe0', celana: '#9b7fe0', sepatu: '#e5443a' }),
    kid4: anak({ rambut: 'jambul', warnaRambut: '#6b3f22', baju: '#3aa0c0', celana: '#3e4258' }),
    teacher: dws({ rambut: 'bob', warnaRambut: '#22201e', kacamata: true, jepit: '#f6a8c8', baju: '#3aa0a0' }),
    uncle: dws({ rambut: 'pendek', topi: 'cap', warnaTopi: '#2a6ae0', baju: '#7fb6f2', keranjang: '#9a5a2c' }),
    auntie: dws({ rambut: 'sanggul', warnaRambut: '#6b3f22', baju: '#46b04a', bajuJenis: 'gaun', keranjang: '#ffd23a' }),
    colleague: dws({ rambut: 'panjang', warnaRambut: '#6b3f22', baju: '#9b6fd8' }),
    rider: dws({ rambut: 'pendek', warnaRambut: '#5e3720', baju: '#e0a640' }),
    hiker: dws({ rambut: 'pendek', topi: 'cap', warnaTopi: '#e5443a', baju: '#f39a3a', celana: '#5a4a3a' }),
    engineer: dws({ rambut: 'pendek', topi: 'helm', warnaTopi: '#ffd23a', baju: '#f39a3a' }),
    stationmaster: dws({ rambut: 'pendek', topi: 'stasiun', warnaTopi: '#2c4a8a', baju: '#3a5aa0', bajuJenis: 'jas', dasi: '#e5443a', celana: '#2c3a6a' }),
    chef: dws({ rambut: 'pendek', topi: 'koki', warnaTopi: '#ffffff', baju: '#fbf6ec' }),
    astronaut: dws({ topi: 'astronaut', warnaTopi: '#f4f6f8', baju: '#eef2f6', celana: '#dfe6ee', sepatu: '#8a8696' }),
    hairdresser: dws({ rambut: 'panjang', warnaRambut: '#9a3a2a', baju: '#2e2a36', celemek: '#ef8fae' }),
    pastor: dws({ rambut: 'pendek', baju: '#2e2a36', bajuJenis: 'jas', kerah: true, celana: '#2e2a36' }),
    zookeeper: dws({ rambut: 'pendek', topi: 'safari', warnaTopi: '#c9a56a', baju: '#5a8a5a', celana: '#7a6a4a' }),
  };
  // warna lama → warna palet baru
  const NEWCOL = { '#d9483b': '#e5443a', '#e2483d': '#e5443a', '#4f86e0': '#3f7ee0', '#f4cf3a': '#ffd23a', '#58a84a': '#46b04a', '#f39ac0': '#f6a8c8',
    '#f08a32': '#f39a3a', '#9b6bd6': '#9b7fe0', '#3f6fb5': '#3a6fd0', '#4f8a3a': '#46b04a', '#c9473a': '#e5443a', '#d9a82a': '#f2b23a', '#ffffff': '#ffffff' };
  const newCol = c => NEWCOL[(c || '').toLowerCase()] || c;
  const MOOD = { happy: 'senang', sad: 'sedih', angry: 'marah', scared: 'takut', sleepy: 'mengantuk' };
  const HAIR = { boy: 'jambul', bowl: 'mangkuk', dad: 'rapi' };
  const KOSTUM = { tiger: 'harimau', dragon: 'naga', cowboy: 'koboi' };
  function personArt(x, y, o) {
    const look = o.look || 'me', dir = o.dir || 'down', side = dir === 'left' || dir === 'right', f = o.frame || 0, sc = o.scale || 1;
    y -= o.bob || 0;
    if (look === 'me') {
      const L = lookWith(o), of = o.outfit || {}, kostum = KOSTUM[of.costume] || 'tidak';
      const eks = o.act === 'eat' ? 'makan' : o.act === 'wave' && dir === 'down' ? 'melambai' : MOOD[o.mood] || 'senang';
      const props = { arah: side ? 'samping' : dir === 'up' ? 'belakang' : 'depan', langkah: String(f), ekspresi: eks, rambut: HAIR[L.style] || 'jambul',
        kostum, payung: !!o.umbrella, syal: !!of.scarf, kaos: newCol(L.shirt), celana: newCol(L.pants), bayang: !o.noShadow };
      return drawComp('me', 'Russel', props, x, y, { flip: dir === 'left', sx: sc, sy: sc }, (v, p) => { if (kostum === 'tidak') v.celana = p.celana; v.bayang = p.bayang ? 'inline' : 'none'; });
    }
    const cfg = LOOK_CFG[look];
    if (!cfg) return false;
    const step = side || dir === 'up' ? f : 0;
    return drawComp('o:' + look, 'Orang', { cfg, lk: step === 1 ? -3 : 0, lr: step === 2 ? -3 : 0, bayang: !o.noShadow }, x, y - (step ? 0.4 : 0), { sx: sc, sy: sc },
      (v, p) => { v.lk = p.lk; v.lr = p.lr; v.bayang = p.bayang ? 'inline' : 'none'; });
  }
  function dogArt(x, y, dir, f, state, t) {
    let arah = 'samping', eks = 'senang', o = { flip: dir < 0 }, langkah = String(state === 'walk' || state === 'happy' ? f || 0 : 0);
    if (state === 'sleep') { arah = 'depan'; eks = 'mengantuk'; langkah = '0'; o = {}; }
    if (state === 'sit') { arah = 'depan'; o = {}; }
    if (state === 'happy') { eks = 'gembira'; o.dy = Math.sin(t * 20) > 0 ? -2 : 0; langkah = String(Math.floor(t * 10) % 3); }
    if (state === 'roll') { const ph = Math.floor(t * 8) % 4; o.rot = ph * Math.PI / 2; o.dy = -6; }
    if (state === 'shake') { arah = 'depan'; o = { dy: Math.sin(t * 10) > 0 ? -1 : 0 }; eks = 'gembira'; }
    return drawComp('dog', 'Doudou', { arah, langkah, ekspresi: eks }, x, y, o);
  }
  const animal = (jenis, x, y, o = {}) => drawComp('h:' + jenis, 'Hewan', { jenis }, x, y, o);
  // hewan dengan warna lain (mis. kuda komidi putar): warna templat diganti
  const animalCol = (jenis, map, x, y, o = {}) => {
    const k = jenis + JSON.stringify(map);
    return drawHit('hc:' + k, compHit('Hewan|' + k + '|' + X.RS, () => recolor(expand('Hewan', { jenis })[0], map)), x, y, o);
  };

  // ---------- Kendaraan (gambar baru buatan sendiri, gaya C) ----------
  const OL = 'stroke="#3a2616" stroke-opacity="0.35" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
  const SH = 'fill="#3a2616" opacity="0.26" stroke="none"', HL = 'fill="#ffffff" opacity="0.65" stroke="none"';
  const shadowEl = (rx, ry = 8) => `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="#3a2616" opacity="0.18" stroke="none"/>`;
  const wheel = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#47425a"/><circle cx="${cx}" cy="${cy}" r="${Math.round(r * 0.42)}" fill="#d6ccbe"/>`;
  const head = (cx, cy, hair) => `<circle cx="${cx}" cy="${cy}" r="11" fill="#f7cfa6"/><path d="M${cx - 12} ${cy - 1} Q${cx - 12} ${cy - 14} ${cx} ${cy - 14} Q${cx + 12} ${cy - 14} ${cx + 12} ${cy - 1} Q${cx + 5} ${cy - 7} ${cx} ${cy - 6} Q${cx - 6} ${cy - 7} ${cx - 12} ${cy - 1} Z" fill="${hair}"/><g stroke="none" fill="#3a2616"><circle cx="${cx - 4}" cy="${cy + 1}" r="1.7"/><circle cx="${cx + 4}" cy="${cy + 1}" r="1.7"/></g>`;
  const HAIRS = ['#3a2a22', '#e8e2da', '#6b3f22', '#22201e', '#9a5a2c'];
  const svg = (vb, body) => `<svg xmlns="${SVGNS}" viewBox="${vb}"><g ${OL}>${body}</g></svg>`;
  const CAR = col => svg('-100 -110 200 120', shadowEl(94, 9) +
    `<path d="M-56 -58 L-42 -94 Q-38 -104 -26 -104 H28 Q40 -104 46 -94 L66 -58 Z" fill="${col}"/>` +
    `<path d="M-40 -62 L-30 -92 H-4 V-62 Z" fill="#bfe5f4"/><path d="M4 -62 V-92 H30 Q36 -92 40 -86 L52 -62 Z" fill="#bfe5f4"/>` + head(22, -74, '#3a2a22') +
    `<path d="M-34 -88 L-30 -90 H-16 L-26 -68 Z" ${HL}/>` +
    `<rect x="-92" y="-66" width="184" height="48" rx="20" fill="${col}"/><path d="M-90 -38 H90 V-34 Q90 -18 72 -18 H-72 Q-90 -18 -90 -34 Z" ${SH}/>` +
    `<rect x="-78" y="-60" width="80" height="7" rx="3.5" ${HL}/><path d="M0 -64 V-24" fill="none"/><rect x="8" y="-54" width="16" height="5" rx="2.5" fill="#3a2616" opacity="0.4" stroke="none"/>` +
    `<circle cx="86" cy="-48" r="7" fill="#fff3b0"/><rect x="-96" y="-54" width="8" height="14" rx="4" fill="#e5443a"/>` + wheel(-52, -18, 19) + wheel(52, -18, 19));
  const BUS = svg('-152 -146 304 156', shadowEl(146, 10) +
    `<rect x="-144" y="-140" width="288" height="120" rx="24" fill="#ffd23a"/>` +
    [0, 1, 2, 3, 4].map(i => `<rect x="${-128 + i * 44}" y="-124" width="34" height="38" rx="8" fill="#bfe5f4"/>` + (i !== 1 ? head(-111 + i * 44, -100, HAIRS[i]) : '')).join('') +
    `<rect x="100" y="-124" width="34" height="62" rx="8" fill="#bfe5f4"/>` + head(117, -100, '#22201e') +
    `<rect x="-144" y="-76" width="288" height="12" fill="#e5443a" stroke="none"/><rect x="60" y="-84" width="32" height="62" rx="6" fill="#f2b23a"/><path d="M76 -82 V-24" fill="none"/>` +
    `<path d="M-142 -46 H142 V-40 Q142 -22 124 -22 H-124 Q-142 -22 -142 -40 Z" ${SH}/><rect x="-128" y="-134" width="140" height="7" rx="3.5" ${HL}/>` +
    `<circle cx="138" cy="-48" r="7" fill="#fff3b0"/><rect x="-148" y="-56" width="8" height="14" rx="4" fill="#e5443a"/>` + wheel(-88, -22, 22) + wheel(88, -22, 22));
  const BIKE = svg('-56 -70 112 80', shadowEl(46, 6) +
    `<circle cx="-32" cy="-20" r="19" fill="none" stroke="#47425a" stroke-width="6" stroke-opacity="1"/><circle cx="32" cy="-20" r="19" fill="none" stroke="#47425a" stroke-width="6" stroke-opacity="1"/>` +
    `<circle cx="-32" cy="-20" r="4" fill="#d6ccbe"/><circle cx="32" cy="-20" r="4" fill="#d6ccbe"/>` +
    `<path d="M-32 -20 L-6 -46 H22 L32 -20 M-6 -46 L2 -20 L22 -46 M2 -20 H-32" fill="none" stroke="#3f7ee0" stroke-width="6" stroke-opacity="1"/>` +
    `<path d="M-16 -52 H2" stroke="#47425a" stroke-width="7" stroke-opacity="1"/><path d="M22 -46 L20 -62 M12 -64 H28" fill="none" stroke="#47425a" stroke-width="5" stroke-opacity="1"/>`);
  // kereta: x = ujung depan, y = rel; menghadap kanan
  function trainCar(bx, col, n) {
    let s = `<rect x="${bx}" y="-164" width="240" height="124" rx="14" fill="${col}"/><rect x="${bx - 6}" y="-176" width="252" height="18" rx="8" fill="#47425a"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${bx + 18 + i * 56}" y="-146" width="42" height="42" rx="9" fill="#fff3dc"/>` + ((i + n) % 3 !== 1 ? head(bx + 39 + i * 56, -122, HAIRS[(i + n * 2) % 5]) : '');
    return s + `<rect x="${bx + 4}" y="-62" width="232" height="12" rx="6" ${SH}/><rect x="${bx + 14}" y="-158" width="100" height="6" rx="3" ${HL}/>` +
      `<rect x="${bx + 240}" y="-60" width="26" height="9" rx="4" fill="#47425a"/>` + wheel(bx + 44, -22, 17) + wheel(bx + 196, -22, 17);
  }
  const TRAIN = {
    steam: svg('-920 -206 940 216', trainCar(-912, '#3f7ee0', 1) + trainCar(-656, '#46b04a', 0) +
      `<rect x="-392" y="-132" width="114" height="92" rx="12" fill="#47425a"/><path d="M-386 -132 Q-370 -152 -350 -140 Q-334 -156 -316 -140 Q-300 -150 -284 -132 Z" fill="#2a2630"/>` + wheel(-364, -22, 17) + wheel(-306, -22, 17) +
      `<rect x="-276" y="-188" width="96" height="150" rx="12" fill="#b8302a"/><rect x="-288" y="-200" width="120" height="18" rx="8" fill="#47425a"/><rect x="-258" y="-170" width="56" height="46" rx="9" fill="#fff3dc"/>` + head(-230, -146, '#22201e') +
      `<rect x="-188" y="-134" width="176" height="86" rx="34" fill="#e5443a"/><rect x="-148" y="-133" width="10" height="84" fill="#ffd23a" stroke="none"/><rect x="-92" y="-133" width="10" height="84" fill="#ffd23a" stroke="none"/>` +
      `<rect x="-170" y="-126" width="120" height="7" rx="3.5" ${HL}/><rect x="-186" y="-66" width="172" height="16" rx="8" ${SH}/>` +
      `<path d="M-124 -132 Q-124 -152 -108 -152 Q-92 -152 -92 -132 Z" fill="#ffd23a"/><path d="M-70 -132 L-74 -176 H-34 L-38 -132 Z" fill="#47425a"/><rect x="-82" y="-188" width="56" height="16" rx="7" fill="#47425a"/>` +
      `<rect x="-22" y="-130" width="16" height="78" rx="7" fill="#47425a"/><circle cx="-10" cy="-112" r="9" fill="#fff3b0"/><path d="M-30 -48 H-4 L10 -14 H-30 Z" fill="#47425a"/>` +
      `<rect x="-280" y="-54" width="276" height="14" rx="6" fill="#47425a"/>` + wheel(-232, -28, 28) + wheel(-160, -28, 28) + wheel(-88, -28, 28) +
      `<path d="M-232 -28 H-88" stroke="#d6ccbe" stroke-width="5" stroke-opacity="1"/>`),
    bullet: svg('-880 -184 900 194', [0, 1].map(n => {
      const bx = -576 - n * 290;
      let s = `<rect x="${bx}" y="-146" width="282" height="110" rx="16" fill="#fbfbfb"/><rect x="${bx + 12}" y="-126" width="258" height="30" rx="9" fill="#2c4a8a"/>`;
      for (let i = 0; i < 6; i++) s += `<rect x="${bx + 20 + i * 42}" y="-122" width="32" height="22" rx="6" fill="#bfe5f4" stroke="none"/>` + (i % 2 === n % 2 ? `<circle cx="${bx + 36 + i * 42}" cy="-108" r="8" fill="#f7cfa6" stroke="none"/><path d="M${bx + 27 + i * 42} -109 Q${bx + 36 + i * 42} -122 ${bx + 45 + i * 42} -109 Z" fill="${HAIRS[(i + n) % 5]}" stroke="none"/>` : '');
      s += `<rect x="${bx}" y="-62" width="282" height="10" fill="#3f7ee0" stroke="none"/><rect x="${bx}" y="-40" width="282" height="12" rx="4" fill="#9aa0ab"/><rect x="${bx + 14}" y="-140" width="120" height="6" rx="3" ${HL}/>`;
      if (n === 0) s += `<path d="M${bx + 120} -146 L${bx + 140} -172 L${bx + 160} -146 M${bx + 124} -174 H${bx + 156}" fill="none" stroke="#47425a" stroke-width="4" stroke-opacity="1"/>`;
      return s + [36, 70, 212, 246].map(d => wheel(bx + d, -22, 12)).join('');
    }).join('') +
      `<path d="M-286 -146 H-120 Q-30 -142 -2 -64 Q4 -40 -22 -36 H-286 Z" fill="#fbfbfb"/><path d="M-270 -126 H-128 Q-84 -124 -58 -96 H-270 Z" fill="#2c4a8a"/>` +
      [0, 1, 2].map(i => `<rect x="${-262 + i * 42}" y="-122" width="32" height="22" rx="6" fill="#bfe5f4" stroke="none"/>`).join('') + head(-90, -108, '#22201e') +
      `<path d="M-286 -62 H-12 Q-8 -56 -14 -52 H-286 Z" fill="#3f7ee0" stroke="none"/><rect x="-286" y="-40" width="270" height="12" rx="4" fill="#9aa0ab"/><circle cx="-30" cy="-60" r="6" fill="#fff3b0"/>` +
      `<path d="M-270 -138 H-130 Q-84 -136 -60 -118" fill="none" stroke="#ffffff" stroke-width="6" stroke-opacity="0.8"/>` + [-232, -196, -96].map(d => wheel(d, -22, 12)).join('')),
    freight: svg('-920 -200 940 210', ['#e5443a', '#3f7ee0', '#46b04a'].map((col, n) => {
      const bx = -456 - n * 232;
      return `<rect x="${bx}" y="-52" width="224" height="16" rx="6" fill="#47425a"/><rect x="${bx + 6}" y="-150" width="212" height="100" rx="10" fill="${col}"/>` +
        `<path d="${[38, 80, 122, 164].map(d => `M${bx + d} -146 V-56`).join(' ')}" fill="none" stroke-opacity="0.3"/><rect x="${bx + 16}" y="-144" width="90" height="6" rx="3" ${HL}/>` +
        `<rect x="${bx + 10}" y="-66" width="204" height="12" rx="6" ${SH}/><rect x="${bx + 224}" y="-50" width="12" height="8" rx="3" fill="#47425a"/>` + wheel(bx + 36, -22, 17) + wheel(bx + 188, -22, 17);
    }).join('') +
      `<rect x="-212" y="-190" width="88" height="44" rx="10" fill="#e09a22"/><rect x="-198" y="-182" width="56" height="30" rx="7" fill="#bfe5f4"/>` + head(-168, -164, '#6b3f22') +
      `<rect x="-212" y="-156" width="196" height="116" rx="16" fill="#f2b23a"/><rect x="-196" y="-150" width="100" height="7" rx="3.5" ${HL}/><rect x="-210" y="-66" width="192" height="14" rx="7" ${SH}/>` +
      [0, 1, 2, 3].map(i => `<rect x="-30" y="${-142 + i * 22}" width="18" height="14" rx="4" fill="${i % 2 ? '#47425a' : '#ffd23a'}"/>`).join('') + `<circle cx="-12" cy="-122" r="7" fill="#fff3b0"/>` +
      `<rect x="-212" y="-52" width="200" height="14" rx="6" fill="#47425a"/>` + wheel(-180, -24, 20) + wheel(-124, -24, 20) + wheel(-60, -24, 20)),
  };
  // pesawat dilihat dari atas, menghadap kanan
  const PLANE = svg('-160 -134 324 268',
    `<path d="M-20 -14 L-60 -118 Q-62 -126 -52 -126 H-34 L22 -14 Z" fill="#eef2f6"/><path d="M-20 14 L-60 118 Q-62 126 -52 126 H-34 L22 14 Z" fill="#eef2f6"/>` +
    `<path d="M-60 -118 Q-62 -126 -52 -126 H-34 L-38 -114 H-58 Z" fill="#e5443a"/><path d="M-60 118 Q-62 126 -52 126 H-34 L-38 114 H-58 Z" fill="#e5443a"/>` +
    `<rect x="-24" y="-80" width="36" height="16" rx="8" fill="#c9ccd2"/><rect x="-24" y="64" width="36" height="16" rx="8" fill="#c9ccd2"/>` +
    `<path d="M-128 -10 L-152 -52 H-134 L-104 -10 Z" fill="#eef2f6"/><path d="M-128 10 L-152 52 H-134 L-104 10 Z" fill="#eef2f6"/>` +
    `<rect x="-154" y="-18" width="306" height="36" rx="18" fill="#ffffff"/><path d="M118 -16 Q152 -14 156 0 Q152 14 118 16 Z" fill="#3f7ee0"/>` +
    `<g stroke="none" fill="#bfe5f4">${[...Array(9)].map((_, i) => `<circle cx="${-110 + i * 24}" cy="-5" r="4.5"/>`).join('')}</g>` +
    `<rect x="-150" y="5" width="268" height="5" fill="#e5443a" stroke="none"/><rect x="-136" y="-14" width="120" height="5" rx="2.5" ${HL}/>`);

  // ---------- Membelokkan fungsi gambar lama ----------
  function hook(name, art) {
    const old = window[name];
    if (typeof old !== 'function') { console.warn('skin: tidak ada fungsi', name); return; }
    window[name] = function (c, ...a) {
      if (c === NUL) { if (X.mute) return; if (art(...a) !== false) return; }
      return old.call(this, c, ...a);
    };
  }
  hook('drawPerson', (x, y, o) => personArt(x, y, o || {}));
  hook('drawDog', (x, y, dir, f, state, t) => dogArt(x, y, dir, f, state, t));
  hook('drawDogTrick', (x, y, dir, f, state, t) => dogArt(x, y, dir, f, state, t));
  hook('drawDuck', (x, y, dir, t, swim) => animal('bebek', x, y, { flip: dir < 0, dy: swim ? Math.round(Math.sin(t * 3)) * 0.5 : 0 }));
  hook('drawPanda', (x, y) => animal('panda', x, y));
  hook('drawCow', (x, y, dir) => animal('sapi', x, y, { flip: dir < 0 }));
  hook('drawCowBig', (x, y, dir) => animal('sapi', x, y, { flip: dir < 0 }));
  hook('drawSheep', (x, y, dir, t, shorn) => animal(shorn ? 'domba-cukur' : 'domba', x, y, { flip: dir < 0 }));
  hook('drawSheepBig', (x, y, dir, t, shorn) => animal(shorn ? 'domba-cukur' : 'domba', x, y, { flip: dir < 0 }));
  hook('drawChicken', (x, y, dir, f, peck) => animal('ayam', x, y, { flip: dir < 0, dy: f ? -0.6 : 0, rot: peck ? (dir < 0 ? -0.35 : 0.35) : 0 }));
  hook('drawCat', (x, y) => animal('kucing', x, y));
  hook('drawButterfly', (x, y, t) => animal('kupukupu', x, y + 4, { sx: 0.55 + 0.45 * Math.abs(Math.sin(t * 12)) }));
  hook('drawApple', (x, y) => appleArt(x, y));
  hook('drawElephant', (x, y, dir, t, spray) => {
    animal('gajah', x, y, { flip: dir < 0 });
    if (spray) vec(x + dir * 17, y - 9, v => { for (let i = 0; i < 6; i++) { const k = (t * 3 + i / 6) % 1; v.ell(dir * k * 40, -k * 60 + k * k * 40, 4, 4, '#a9d4f5', false); } });
    return true;
  });
  hook('drawGiraffe', (x, y, dir) => animal('jerapah', x, y, { flip: dir < 0 }));
  hook('drawLion', (x, y, dir, t, roar) => {
    const s = roar ? 1 + Math.abs(Math.sin(t * 12)) * 0.06 : 1;
    animal('singa', x, y, { flip: dir < 0, sx: s, sy: s });
    if (roar) vec(x + dir * 18, y - 14, v => [10, 20, 30].forEach(r => v.line(`M${dir * r} -${r * 0.6} Q${dir * (r + 8)} 0 ${dir * r} ${r * 0.6}`, '#e5443a', 2.5)));
    return true;
  });
  hook('drawMonkey', (x, y, t) => animal('monyet', x, 168, { rot: Math.sin(t * 2) * 0.06 }));
  hook('drawPenguin', (x, y, dir, t, swim) => animal('penguin', x, y, swim ? { flip: dir < 0, rot: (dir < 0 ? -1 : 1) * 1.2, dy: -2 } : { flip: dir < 0, rot: Math.sin(t * 4) * 0.08 }));
  hook('drawFoodBit', (x, y, k) => vec(x, y, v => {
    if (k === 'banana') v.fill('M-12 -6 Q0 6 12 -10 Q4 -2 -10 -10 Z', '#ffd23a');
    else if (k === 'grass') v.line('M-8 0 L-10 -16 M-3 0 L-3 -18 M3 0 L4 -16 M8 0 L10 -14', '#46b04a', 3);
    else if (k === 'leaf') v.ell(0, -6, 12, 6, '#58bb44', true, -0.3);
    else if (k === 'bamboo') { v.rect(-3, -32, 6, 32, 2, '#7ccf5a'); v.ell(8, -30, 8, 3, '#58bb44', true, -0.4); }
    else if (k === 'fish') { v.ell(0, -6, 10, 5, '#8fb8d8'); v.fill('M8 -6 L16 -12 L16 0 Z', '#8fb8d8'); }
  }));
  // helm kaca astronaut di kepala Russel
  hook('drawHelmet', (x, y) => vec(x, y, v => {
    v.ell(0, -68, 32, 31, 'rgba(207,232,245,0.28)'); v.line('M-32 -68 A32 31 0 1 1 32 -68 A32 31 0 1 1 -32 -68', 'rgba(255,255,255,0.9)', 3);
    v.fill('M-20 -92 Q-12 -100 -2 -100 Q-12 -94 -16 -84 Z', 'rgba(255,255,255,0.8)', false); v.rect(-22, -44, 44, 8, 4, '#c9d4e0');
  }));
  hook('drawSeagull', (x, y, t, flying) => animal('camar', x, y + 3, { sy: flying ? 0.7 + 0.3 * Math.abs(Math.sin(t * 6)) : 1 }));
  hook('drawCrab', (x, y, t) => animal('kepiting', x + Math.sin(t * 20) * 0.3, y));
  hook('drawBird', (x, y, t) => animal('burung', x, y + 3, { dy: Math.sin(t * 10) * 0.5 }));
  hook('drawRabbit', (x, y, dir, t, hop) => animal('kelinci', x, y, { flip: dir < 0, dy: hop ? -Math.abs(Math.sin(t * 12)) * 3 : 0 }));
  hook('drawSquirrel', (x, y, dir) => animal('tupai', x, y, { flip: dir < 0 }));
  hook('drawGoldfish', (x, y, t) => { const dir = Math.cos(t * 0.9) > 0 ? 1 : -1; return animal('ikan', x + Math.sin(t * 0.9) * 10, y + 3, { flip: dir < 0, sx: 0.6, sy: 0.6 }); });
  hook('drawRobot', (x, y, dir, t, carry, moving, dance) => {
    const bob = dance ? -Math.abs(Math.sin(t * 6)) * 3 : moving ? -Math.abs(Math.sin(t * 10)) * 0.8 : 0;
    animal('robot', x, y, { flip: dir < 0, dy: bob, rot: dance ? Math.sin(t * 6) * 0.12 : 0, sx: 1.3, sy: 1.3 });
    if (carry) vec(x + (dir < 0 ? -7 : 7), y - 12 + bob, v => { v.rect(-7, -16, 14, 16, 3, '#fbf6ec'); v.ell(0, -16, 7, 2.5, carry === 'milk' ? '#ffffff' : '#7a4a2a'); });
    return true;
  });
  hook('drawWaterfall', (x, y, w, h, t) => {
    const c = X.ctx;
    c.save(); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 0.7; c.lineCap = 'round'; c.beginPath();
    for (let i = 1.5; i < w; i += 3) for (let j = (t * 30 + i * 7) % 12 - 4; j < h - 2; j += 12) { c.moveTo(x + i, y + Math.max(0, j)); c.lineTo(x + i, y + Math.min(h - 2, j + 3.5)); }
    c.stroke();
    c.fillStyle = '#ffffff'; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(x + 2 + ((i * 5 + t * 9) % w), y + h + 1, 1.4, 0, 7); c.fill(); }
    c.restore(); X.drew = true; return true;
  });
  // benda kecil di tanah yang bisa dipungut
  const ITEM_ART = {
    mushroom: v => { v.rect(-4, -14, 8, 14, 3, '#fbf6ec'); v.fill('M-16 -12 Q-16 -30 0 -30 Q16 -30 16 -12 Z', '#e5443a'); v.ell(-6, -22, 3, 3, '#ffffff', false); v.ell(6, -18, 2.5, 2.5, '#ffffff', false); },
    wildflower: v => { v.line('M0 0 V-16', '#3fa83a', 3); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; v.ell(Math.cos(a) * 6, -20 + Math.sin(a) * 6, 4.5, 4.5, '#f6a8c8'); } v.ell(0, -20, 4, 4, '#ffd23a'); },
    shell: v => { v.fill('M-12 0 Q-14 -16 0 -18 Q14 -16 12 0 Z', '#f6dcd0'); v.line('M-6 -1 L-3 -15 M0 -1 V-17 M6 -1 L3 -15', '#e0a890', 1.5); },
    starfish: v => v.fill('M0 -20 L4 -9 L15 -8 L6 -1 L9 10 L0 4 L-9 10 L-6 -1 L-15 -8 L-4 -9 Z', '#f39a3a'),
    coin: v => { v.ell(0, -8, 8, 8, '#ffd23a'); v.line('M0 -12 V-4', '#e8b02a', 2); },
    moonrock: v => { v.ell(0, -10, 20, 12, '#b9c2cc'); v.ell(-7, -12, 4, 3, '#8f99a6', false); v.ell(8, -9, 3, 2, '#8f99a6', false); v.hl(-10, -17, 5, 2); },
    // bahan & masakan dapur Ibu
    tomato: v => { v.ell(0, -14, 17, 14, '#e5443a'); v.fill('M0 -30 L4 -25 L12 -27 L7 -21 L-7 -21 L-12 -27 L-4 -25 Z', '#46b04a'); v.hl(-7, -19, 4, 3); },
    egg: v => { v.fill('M0 -32 Q13 -32 14 -12 Q14 0 0 0 Q-14 0 -14 -12 Q-13 -32 0 -32 Z', '#f8ecd2'); v.hl(-5, -22, 3, 4.5); },
    carrot: v => { v.fill('M-6 -30 L-10 -42 L-2 -34 L0 -44 L3 -34 L10 -42 L6 -30 Z', '#58bb44'); v.fill('M-9 -31 Q0 -35 9 -31 L2 -2 Q0 2 -2 -2 Z', '#f39a3a'); v.line('M-6 -23 h4 M2 -15 h3 M-4 -9 h3', '#c96a1a', 1.5); },
    apple: v => { v.line('M0 -24 Q1 -29 4 -31', '#9a5a2c', 2.5); v.ell(6, -29, 6, 3, '#58bb44', true, -0.5); v.fill('M0 -24 C-8 -30 -16 -24 -15 -13 C-14 -3 -7 2 0 -1 C7 2 14 -3 15 -13 C16 -24 8 -30 0 -24 Z', '#e5443a'); v.hl(-7, -17, 3.5, 2.5); },
    water: v => { v.fill('M-11 -32 H11 L9 -2 Q9 0 7 0 H-7 Q-9 0 -9 -2 Z', '#eef8fd'); v.fill('M-10 -20 H10 L9 -2 Q9 0 7 0 H-7 Q-9 0 -9 -2 Z', '#8fd0f2', false); v.rect(-7, -28, 3, 20, 1.5, 'rgba(255,255,255,0.8)', false); },
    tomatoegg: v => {
      v.ell(0, -4, 30, 8, '#ffffff'); v.ell(0, -5, 23, 5, '#e8eef2', false);
      v.fill('M-20 -6 Q-22 -16 -12 -17 Q-6 -24 4 -20 Q14 -22 18 -14 Q24 -8 16 -4 Q0 -1 -20 -6 Z', '#ffd23a');
      [[-10, -12, 5, 3], [6, -15, 4, 2.5], [10, -8, 4, 2.5]].forEach(([x, y, a, b]) => v.ell(x, y, a, b, '#ffe87a', false));
      [[-6, -11], [9, -11], [-14, -8], [2, -16], [14, -7]].forEach(([x, y]) => { v.ell(x, y, 4, 3.2, '#e5443a', false); v.ell(x - 1, y - 1, 1.5, 1, '#ff9a8a', false); });
    },
    carrotsoup: v => {
      v.fill('M-22 -18 H22 Q20 0 0 0 Q-20 0 -22 -18 Z', '#ffffff'); v.ell(0, -18, 22, 5, '#f39a3a');
      [[-8, -18], [4, -19], [12, -17], [-2, -16]].forEach(([x, y]) => v.ell(x, y, 3, 1.8, '#d8701e', false));
      v.line('M-8 -28 Q-12 -34 -8 -40 M4 -28 Q0 -34 4 -40', 'rgba(255,255,255,0.9)', 2);
    },
    applejuice: v => {
      v.fill('M-10 -34 H10 L8 -2 Q8 0 6 0 H-6 Q-8 0 -8 -2 Z', '#eef8fd'); v.fill('M-9.5 -26 H9.5 L8 -2 Q8 0 6 0 H-6 Q-8 0 -8 -2 Z', '#f4c23a', false);
      v.line('M1 -6 L5 -40 L12 -44', '#e5443a', 2.5); v.rect(-6, -22, 3, 16, 1.5, 'rgba(255,255,255,0.6)', false);
    },
    // hari raya
    redpacket: v => { v.rect(-13, -38, 26, 38, 4, '#e5443a'); v.fill('M-13 -34 Q-13 -38 -9 -38 H9 Q13 -38 13 -34 V-27 Q0 -19 -13 -27 Z', '#c9372e'); v.ell(0, -21, 5, 5, '#ffd23a'); v.rect(-3, -12, 6, 6, 1, '#ffd23a', false); },
    mooncake: v => {
      for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; v.ell(Math.cos(a) * 15, -15 + Math.sin(a) * 12, 4.5, 4, '#b8763a'); }
      v.ell(0, -15, 16, 13, '#c98a4b'); v.ell(0, -16, 10, 8, '#e8b06a', false);
      v.line('M0 -22 V-10 M-6 -16 H6 M-4 -20 L4 -12 M4 -20 L-4 -12', '#a8743c', 1.5);
    },
  };
  // sushi tanpa piring (alas di y = oy); dipakai di luar restoran dan di jendela membuat sushi
  const nigiri = (top, line) => (v, oy) => {
    v.ell(0, oy - 9, 26, 10, '#ffffff'); v.ell(-10, oy - 8, 3, 1.5, '#ece8da', false); v.ell(8, oy - 6, 3, 1.5, '#ece8da', false);
    v.fill(`M-30 ${oy - 12} Q-28 ${oy - 27} 0 ${oy - 27} Q28 ${oy - 27} 30 ${oy - 12} Q14 ${oy - 17} 0 ${oy - 17} Q-14 ${oy - 17} -30 ${oy - 12} Z`, top);
    if (line) v.line(`M-16 ${oy - 24} l6 6 M-4 ${oy - 26} l6 7 M8 ${oy - 25} l6 6`, line, 2);
    v.hl(-12, oy - 23, 5, 1.6);
  };
  const SUSHI_ART = {
    salmon: nigiri('#f59a6a', 'rgba(255,230,210,0.9)'),
    tuna: nigiri('#e5443a', null),
    shrimp: (v, oy) => { nigiri('#f7a27a', 'rgba(255,245,235,0.95)')(v, oy); v.fill(`M28 ${oy - 16} L40 ${oy - 26} L38 ${oy - 12} Z`, '#e5443a'); },
    eggsushi: (v, oy) => { v.ell(0, oy - 9, 26, 10, '#ffffff'); v.rect(-28, oy - 30, 56, 14, 4, '#ffd23a'); v.rect(-6, oy - 32, 12, 30, 2, '#1f3a2a'); v.hl(-18, oy - 26, 5, 1.6); },
    cucumber: (v, oy) => { for (const dx of [-16, 16]) { v.ell(dx, oy - 15, 15, 15, '#1f3a2a'); v.ell(dx, oy - 15, 11, 11, '#ffffff', false); v.ell(dx, oy - 15, 5, 5, '#58bb44', false); } },
    gunkan: (v, oy) => {
      v.rect(-24, oy - 28, 48, 28, 6, '#1f3a2a'); v.rect(-20, oy - 26, 5, 24, 2, '#35574a', false);
      v.ell(0, oy - 28, 22, 5, '#ffffff', false);
      [[-14, -31], [-6, -33], [2, -31], [10, -33], [16, -30], [-10, -36], [6, -37], [-2, -39]].forEach(([a, b]) => v.ell(a, oy + b, 4, 4, '#f39a3a'));
    },
    tamagoroll: (v, oy) => { for (const a of [-14, 14]) { v.ell(a, oy - 14, 13, 13, '#ffd23a'); v.ell(a, oy - 14, 8, 8, '#f2b23a', false); v.ell(a, oy - 14, 3.5, 3.5, '#ffe87a', false); } },
  };
  const PLATE_COL = { salmon: '#3f7ee0', tuna: '#e5443a', shrimp: '#ffd23a', eggsushi: '#46b04a', cucumber: '#f6a8c8', gunkan: '#9b7fe0', tamagoroll: '#f39a3a' };
  hook('drawItem', (x, y, type) => {
    if (SUSHI_PIECE[type] && piece(SUSHI_PIECE[type], x, y + 1)) return true;
    if (SUSHI_ART[type]) return vec(x, y, v => { v.ell(0, -4, 38, 9, PLATE_COL[type]); v.ell(0, -6, 31, 5.5, '#ffffff', false); SUSHI_ART[type](v, -6); });
    return ITEM_ART[type] ? vec(x, y, ITEM_ART[type]) : false;
  });
  hook('drawSushi', (x, y, k) => (SUSHI_ART[k] ? vec(x, y, v => SUSHI_ART[k](v, 0)) : false));
  // ---------- Hari raya, hati, pelangi ----------
  hook('drawHangingLantern', (x, y, t) => vec(x, y - 6, v => {
    if (G.night) v.ell(0, 32, 34, 34, 'rgba(255,200,120,0.25)', false);
    v.line('M0 0 V14', '#5a3a22', 2); v.rect(-12, 12, 24, 6, 3, '#ffd23a');
    v.ell(0, 32, 18, 20, '#e5443a'); v.line('M-8 15 Q-15 32 -8 49 M8 15 Q15 32 8 49 M0 13 V51', '#b8302a', 1.5); v.hl(-8, 24, 3, 7);
    v.rect(-12, 46, 24, 6, 3, '#ffd23a'); v.line('M0 52 V68', '#ffd23a', 3); v.line('M-3 66 L0 70 L3 66', '#f2b23a', 2);
  }, { rot: Math.sin(t * 1.5 + x) * 0.08 }));
  hook('drawLionDance', (x, y, t) => {
    const hop = Math.abs(Math.sin(t * 4)) * 16, tilt = Math.sin(t * 2) > 0 ? 3 : -3, hy = -88 - hop;
    return vec(x, y, v => {
      v.shadow(64, 8);
      [-40, -20, 16, 36].forEach((lx, i) => { v.rect(lx, -26 - (i % 2 ? 0 : 4), 8, 26, 3, '#ffd23a'); v.rect(lx - 4, -5, 15, 6, 3, '#3a2616'); });
      v.fill('M-58 -52 Q-74 -60 -70 -44 Q-66 -50 -58 -46 Z', '#ffd23a');
      v.rect(-58, -68, 84, 44, 14, '#e5443a'); v.rect(-58, -68, 84, 9, 4, '#ffd23a', false);
      for (let i = 0; i < 7; i++) v.ell(-50 + i * 12, -26, 6, 5, '#ffd23a', false);
      v.ell(-30, -48, 6, 6, '#ffd23a', false); v.ell(-6, -46, 6, 6, '#ffd23a', false);
      v.line(`M36 ${hy - 28} V${hy - 40}`, '#ffd23a', 3); v.ell(36, hy - 43, 5, 5, '#46b04a');
      v.rect(8, hy - 28, 56, 56, 16, '#e5443a');
      v.fill(`M6 ${hy + 16} Q36 ${hy + 44} 66 ${hy + 16} Q60 ${hy + 34} 36 ${hy + 34} Q12 ${hy + 34} 6 ${hy + 16} Z`, '#ffffff');
      v.rect(4, hy - 32, 64, 12, 6, '#ffd23a');
      v.ell(24, hy - 6, 9, 9, '#ffffff'); v.ell(48, hy - 6, 9, 9, '#ffffff');
      v.ell(24 + tilt, hy - 5, 4.5, 4.5, '#3a2616', false); v.ell(48 + tilt, hy - 5, 4.5, 4.5, '#3a2616', false);
      v.rect(26, hy + 9, 20, 8, 4, '#46b04a'); v.hl(14, hy - 18, 4, 2.5);
    });
  });
  // kembang api digambar sesudah warna malam (lihat render), supaya tetap terang
  hook('drawFirework', (x, y, k, col) => {
    if (late) { late.push(() => fireworkArt(x, y, k, col)); return true; }
    return fireworkArt(x, y, k, col);
  });
  function fireworkArt(x, y, k, col) {
    const c = X.ctx, a0 = c.globalAlpha, op = c.globalCompositeOperation;
    c.globalAlpha = Math.max(0, 1 - k); c.globalCompositeOperation = 'lighter';
    vec(x, y, v => {
      v.ell(0, 0, k * 70, k * 70, 'rgba(255,240,200,0.12)', false);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r1 = k * 34, r2 = k * 72; v.line(`M${Math.cos(a) * r1} ${Math.sin(a) * r1} L${Math.cos(a) * r2} ${Math.sin(a) * r2}`, col, 4); v.ell(Math.cos(a) * r2, Math.sin(a) * r2, 3.5, 3.5, '#ffffff', false); }
      v.ell(0, 0, 5, 5, '#ffffff', false);
    });
    c.globalAlpha = a0; c.globalCompositeOperation = op;
    return true;
  }
  hook('drawCake', (x, y, lit, t) => vec(x, y, v => {
    v.ell(0, -4, 44, 8, '#e8eef2');
    v.rect(-32, -34, 64, 30, 8, '#f6a8c8'); v.fill('M-32 -26 Q-32 -34 -24 -34 H24 Q32 -34 32 -26 Q24 -20 16 -26 Q8 -20 0 -26 Q-8 -20 -16 -26 Q-24 -20 -32 -26 Z', '#ffffff');
    [-24, -8, 8, 24].forEach(dx => v.ell(dx, -16, 3, 3, '#e5443a', false));
    v.rect(-20, -54, 40, 22, 6, '#fbf0dc'); v.rect(-20, -54, 40, 5, 3, '#ffffff', false);
    [-12, 0, 12].forEach(dx => {
      v.rect(dx - 2, -70, 4, 16, 2, '#3f7ee0');
      if (lit) { const f = Math.floor(t * 8 + dx) % 2; v.ell(dx, -76 - f, 6, 7, 'rgba(255,220,120,0.35)', false); v.ell(dx, -75 - f, 3, 5, '#ffd23a', false); v.ell(dx, -74 - f, 1.5, 2.5, '#fff3b0', false); }
    });
  }));
  hook('drawBalloons', (x, y, t) => vec(x, y, v => {
    const B = [['#e5443a', -6, -30], ['#3f7ee0', 0, -36], ['#ffd23a', 6, -31], ['#f6a8c8', -2, -24], ['#46b04a', 5, -24]];
    B.forEach(([k, dx, dy], i) => { const bx = (dx + Math.sin(t * 1.5 + i) * 1.5) * 4, by = dy * 4; v.line(`M0 -6 Q${bx * 0.3} ${by * 0.5} ${bx} ${by + 16}`, '#b9b4ac', 1.5); });
    B.forEach(([k, dx, dy], i) => { const bx = (dx + Math.sin(t * 1.5 + i) * 1.5) * 4, by = dy * 4; v.ell(bx, by, 12, 16, k); v.fill(`M${bx - 3} ${by + 19} L${bx} ${by + 15} L${bx + 3} ${by + 19} Z`, k, false); v.hl(bx - 4, by - 7, 3, 5); });
    v.rect(-6, -8, 12, 8, 3, '#9a5a2c');
  }));
  const HEART_D = 'M0 8 C-14 -2 -13 -14 -5 -14 C-2 -14 0 -12 0 -9 C0 -12 2 -14 5 -14 C13 -14 14 -2 0 8 Z';
  hook('drawHeart', (x, y, col) => vec(x + 0.5, y - 0.5, v => { v.fill(HEART_D, !col || col === '#ef5a7a' ? '#f2607e' : col); v.hl(-6, -8, 3, 2); }));
  hook('drawRainbow', (cx, cy, r) => {
    const c = X.ctx;
    c.save(); c.globalAlpha = 0.75; c.lineWidth = 2.1; c.lineCap = 'butt';
    ['#e5443a', '#f39a3a', '#ffd23a', '#46b04a', '#3f7ee0', '#9b7fe0'].forEach((k, i) => { c.beginPath(); c.arc(cx, cy, r - i * 2, Math.PI, Math.PI * 2); c.strokeStyle = k; c.stroke(); });
    c.restore(); X.drew = true; return true;
  });
  // bulan besar Festival Kue Bulan: bendanya menggambar langsung dengan disc, jadi diberi gambar sendiri,
  // diletakkan menutupi bulan sabit malam di gambar tempat (titik ketuknya ikut pindah)
  [['mountain', 61, 17], ['beach', 274, 15]].forEach(([id, mx, my]) => SCENES[id] && SCENES[id].objs.forEach(o => {
    if (!(o.top && o.hit && o.hit[0] === 128 && o.hit[1] === 2)) return;
    const hit = o.hit, hitNew = [mx - 22, my - 18, 44, 36];
    Object.defineProperty(o, 'hit', { get: () => (X.on ? hitNew : hit), configurable: true });
    o.skin = () => vec(mx, my, v => {
      v.ell(0, 0, 80, 80, 'rgba(255,242,192,0.16)', false); v.ell(0, 0, 58, 58, '#fff2c0');
      v.ell(-16, -16, 12, 11, '#f4e2a0', false); v.ell(24, 16, 9, 8, '#f4e2a0', false); v.ell(4, 28, 6, 5, '#f4e2a0', false); v.hl(-26, -30, 8, 5);
    });
  }));
  const sushiArt = (k, x, y, s = 1) => (SUSHI_ART[k] ? vec(x, y, v => SUSHI_ART[k](v, 0), { s }) : false);
  hook('peekTail', (x, y, t) => tailArt(x + 1, y + 4, t, HS.miss));
  hook('drawSunflowerPot', (x, y, stage, t) => {
    const px0 = 179, py0 = 101, h = [0, 0, 20, 56, 96, 120][stage] || 0, sw = Math.sin(t * 1.5) * 4;
    vec(px0, py0, v => {
      if (stage === 1) [[-8, -60], [2, -62], [10, -59]].forEach(([a, b]) => v.ell(a, b, 3, 2.2, '#f0dcae'));
      if (stage >= 2) v.line(`M0 -52 Q${sw / 2} ${-52 - h / 2} ${sw} ${-52 - h}`, '#3f8a3a', 5);
      if (stage === 2) { v.ell(-8, -70, 8, 4, '#58bb44', true, 0.4); v.ell(8, -72, 8, 4, '#58bb44', true, -0.4); }
      if (stage >= 3) { v.ell(-14, -80, 14, 5, '#3fa83a', true, 0.3); v.ell(16, -96, 14, 5, '#3fa83a', true, -0.3); }
      if (stage >= 4) v.ell(-14, -124, 14, 5, '#3fa83a', true, 0.3);
      if (stage === 4) { v.ell(sw, -62 - h, 12, 12, '#46b04a'); v.ell(sw, -70 - h, 8, 4, '#ffd23a'); }
      if (stage === 5) {
        const fx = sw, fy = -64 - h;
        for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; v.ell(fx + Math.cos(a) * 26, fy + Math.sin(a) * 26, 10, 6, '#ffd23a', true, a); }
        v.ell(fx, fy, 18, 18, '#9a5a2c'); v.ell(fx, fy, 12, 12, '#6b4024', false);
        v.ell(fx - 6, fy - 3, 2.2, 2.6, '#3a2616', false); v.ell(fx + 6, fy - 3, 2.2, 2.6, '#3a2616', false);
        v.line(`M${fx - 5} ${fy + 5} Q${fx} ${fy + 9} ${fx + 5} ${fy + 5}`, '#3a2616', 2);
      }
    });
    piece('obj-pot-bunga', px0, py0);
    return vec(px0, py0, v => { for (let i = 0; i < stage; i++) v.ell(28 + i * 5, -58, 2, 2, '#e8b02a', false); });
  });
  hook('drawHotAirBalloon', (x, y0, t) => {
    const y = y0 + Math.sin(t) * 2, c = X.ctx;
    c.save(); c.globalAlpha = 0.12; c.fillStyle = '#3a2616'; c.beginPath(); c.ellipse(x, 150, 12, 3, 0, 0, 7); c.fill(); c.restore();
    const ENV = 'M0 -152 C50 -152 66 -110 58 -84 C50 -60 24 -46 16 -34 H-16 C-24 -46 -50 -60 -58 -84 C-66 -110 -50 -152 0 -152 Z';
    return vec(x, y, v => {
      v.line('M-14 -30 L-16 10 M14 -30 L16 10', '#7a5a3a', 2.5);
      v.ell(0, 2, 9, 9, '#f7cfa6'); v.fill('M-10 0 Q-10 -10 0 -10 Q10 -10 10 0 Q4 -5 0 -4 Q-5 -5 -10 0 Z', '#3a2a22');
      v.rect(-20, 8, 40, 26, 6, '#b5713a'); v.line('M-20 20 H20 M-7 8 V34 M7 8 V34', '#8a4f22', 2);
      v.fill(ENV, '#e5443a', false);
      v.fill('M0 -152 C-20 -122 -18 -72 -7 -34 H7 C18 -72 20 -122 0 -152 Z', '#ffd23a', false);
      v.fill('M-30 -144 C-48 -116 -40 -70 -18 -40 L-13 -38 C-28 -70 -34 -116 -30 -144 Z', '#ffd23a', false);
      v.fill('M30 -144 C48 -116 40 -70 18 -40 L13 -38 C28 -70 34 -116 30 -144 Z', '#ffd23a', false);
      v.line(ENV, LINE, 2);
      v.rect(-18, -38, 36, 8, 3, '#b8302a');
      v.hl(-30, -118, 7, 16);
      if (Math.floor(t * 6) % 3 === 0) v.ell(0, -24, 4, 6, '#ffd23a', false);
    });
  });
  hook('drawDragonBoat', (x, y, dir, t) => piece('obj-perahu-naga', x, y, { flip: dir > 0, dy: Math.sin(t * 2) * 0.6 }));
  const CAR_COL = { '#e2483d': '#e5443a', '#4f86e0': '#3f7ee0', '#f4cf3a': '#ffd23a', '#58a84a': '#46b04a', '#ffffff': '#ffffff', '#f39ac0': '#f6a8c8' };
  hook('drawVehicle', (x, y, type, dir, t, col) => {
    const bump = t ? (Math.floor(t * 10) % 2) * -0.25 : 0;
    if (type === 'car') { const k = CAR_COL[col] || col; return drawArt('car' + k, 'car' + k, CAR(k), x, y, { flip: dir < 0, dy: bump }); }
    if (type === 'bus') return drawArt('bus', 'bus', BUS, x, y, { flip: dir < 0, dy: bump });
    if (type === 'bike') {
      drawArt('bike', 'bike', BIKE, x, y, { flip: dir < 0 });
      personArt(x - dir * 2, y - 10, { look: 'rider', dir: dir > 0 ? 'right' : 'left', frame: 1 + (Math.floor(t * 6) % 2), noShadow: true });
      return true;
    }
    return false;
  });
  hook('drawTrain', (x, y, type) => (TRAIN[type] ? drawArt('train' + type, 'train' + type, TRAIN[type], x, y) : false));
  hook('drawBigPlane', (x, y, dir) => {
    const c = X.ctx;
    c.save(); c.globalAlpha = 0.14; c.fillStyle = '#3a2616'; c.beginPath(); c.ellipse(Math.round(x) + 24, 128, 34, 5, 0, 0, Math.PI * 2); c.fill(); c.restore();
    return drawArt('plane', 'plane', PLANE, x, y, { flip: dir < 0 });
  });

  // ---------- Partikel, cuaca, warna langit, panah (vektor) ----------
  const HEART = new Path2D('M0 1.6 C-3.2 -0.6 -2.6 -3.4 -0.9 -3.2 C-0.4 -3.15 0 -2.8 0 -2.3 C0 -2.8 0.4 -3.15 0.9 -3.2 C2.6 -3.4 3.2 -0.6 0 1.6 Z');
  const ARROW = new Path2D('M0 -22 L18 -4 H8 V18 H-8 V-4 H-18 Z');
  function drawPartsHi(c) {
    for (const p of parts) {
      const a = Math.min(1, p.life / p.max * 2.2), x = p.x, y = p.y, k = 1 - p.life / p.max;
      c.save(); c.globalAlpha = a; c.translate(x, y);
      switch (p.type) {
        case 'heart': c.fillStyle = '#f2607e'; c.fill(HEART); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(-1.2, -2.2, 0.7, 0.4, -0.5, 0, 7); c.fill(); break;
        case 'note': c.fillStyle = '#4a3a8a'; c.beginPath(); c.ellipse(-0.6, 0, 1.4, 1.1, -0.4, 0, 7); c.fill(); c.fillRect(0.5, -5, 0.6, 5); c.fillRect(0.5, -5, 2, 0.8); break;
        case 'spark': c.fillStyle = '#fff2a8'; c.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 0.6 : 2, an = i * Math.PI / 4; c.lineTo(Math.cos(an) * r, Math.sin(an) * r); } c.fill(); break;
        case 'bubble': c.strokeStyle = '#ffffff'; c.lineWidth = 0.5; c.beginPath(); c.arc(0, 0, 1.8, 0, 7); c.stroke(); break;
        case 'drop': c.fillStyle = '#8fd0f2'; c.beginPath(); c.ellipse(0, 0.6, 0.6, 1.1, 0, 0, 7); c.fill(); break;
        case 'z': c.strokeStyle = '#ffffff'; c.lineWidth = 0.7; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-2, -2.5); c.lineTo(2, -2.5); c.lineTo(-2, 1.5); c.lineTo(2, 1.5); c.stroke(); break;
        case 'dust': c.fillStyle = '#e6d6ae'; c.beginPath(); c.arc(0, 0, 1.2, 0, 7); c.fill(); break;
        case 'smoke': c.fillStyle = '#ececec'; c.beginPath(); c.arc(0, 0, 2 + k * 3, 0, 7); c.fill(); break;
        case 'steam': c.globalAlpha = a * 0.6; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(0, 0, 1 + k * 2, 0, 7); c.fill(); break;
        case 'splash': c.fillStyle = '#d8f0fc'; c.beginPath(); c.arc(0, 0, 0.8, 0, 7); c.fill(); break;
        case 'item': c.translate(-x, -y); drawItem(c, Math.round(x), Math.round(y), p.item); break;
      }
      c.restore();
    }
  }
  function weatherHi(c, dt) {
    const w = G.weather;
    if (w === 'cloud' || w === 'rain' || w === 'snow') for (const cl of wx.clouds) {
      cl.x += dt * 6; if (cl.x - cl.rx > W) cl.x = -cl.rx;
      c.fillStyle = 'rgba(40,50,80,0.08)'; c.beginPath(); c.ellipse(cl.x, cl.y, cl.rx, cl.rx * 0.4, 0, 0, 7); c.fill();
    }
    if (w === 'rain') {
      c.strokeStyle = 'rgba(169,212,245,0.85)'; c.lineWidth = 0.4; c.lineCap = 'round'; c.beginPath();
      for (const d of wx.drops) {
        d.y += d.s * dt; d.x -= d.s * 0.2 * dt;
        if (d.y > H) { d.y = -4; d.x = Math.random() * (W + 30); if (Math.random() < 0.5) parts.push({ type: 'splash', x: d.x, y: 30 + Math.random() * 145, vx: 0, vy: -10, life: 0.2, max: 0.2 }); }
        c.moveTo(d.x, d.y); c.lineTo(d.x - 0.7, d.y + 3.5);
      }
      c.stroke();
    }
    if (w === 'snow') {
      c.fillStyle = '#ffffff'; c.beginPath();
      for (const f of wx.flakes) {
        f.y += f.s * dt; f.x += Math.sin(G.t + f.p) * 8 * dt;
        if (f.y > H) { f.y = -2; f.x = Math.random() * W; }
        const r = f.big ? 1 : 0.6; c.moveTo(f.x + r, f.y); c.arc(f.x, f.y, r, 0, 7);
      }
      c.fill();
    }
    if (w === 'wind') for (const l of wx.leaves) {
      l.x += l.s * dt; l.y += Math.sin(G.t * 3 + l.p) * 20 * dt;
      if (l.x > W) { l.x = -4; l.y = Math.random() * H; }
      c.fillStyle = l.c === '#7cc85a' ? '#58bb44' : '#ffd23a'; c.beginPath(); c.ellipse(l.x, l.y, 1.6, 0.8, Math.sin(G.t * 4 + l.p), 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 0.4; c.beginPath(); c.moveTo(l.x - 10, l.y + 3); c.lineTo(l.x - 5, l.y + 3); c.stroke();
    }
  }
  function tintHi(c, s) {
    const out = s.outdoor, w = G.weather;
    const veil = (col, a) => { c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.globalAlpha = 1; };
    if (out && w === 'cloud') veil('#8fa3b8', 0.2);
    if (out && w === 'rain') veil('#5b6f86', 0.25);
    if (out && w === 'snow') veil('#e8f0f8', 0.12);
    if (G.night) {
      veil('#24305e', out ? 0.45 : 0.3);
      c.globalCompositeOperation = 'lighter';
      for (const [x, y, r] of s.lights || []) {
        const g = c.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,216,106,0.42)'); g.addColorStop(1, 'rgba(255,216,106,0)');
        c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
      }
      c.globalCompositeOperation = 'source-over';
    }
  }
  function arrowHi(c, x, y, dir, t) {
    const o = Math.sin(t * 4) * 1.2;
    c.save();
    c.translate(x + (dir === 'right' ? o : dir === 'left' ? -o : 0), y + (dir === 'down' ? o : dir === 'up' ? -o : 0));
    c.rotate({ up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 }[dir]);
    c.scale(0.25, 0.25);
    c.fillStyle = ARROW_FILL; c.fill(ARROW);
    c.strokeStyle = 'rgba(58,38,22,0.6)'; c.lineWidth = 3; c.lineJoin = 'round'; c.stroke(ARROW);
    c.restore();
  }

  // ---------- Menggambar satu bingkai ----------
  function drawObj(o, t) {
    if (o.skin === 'bg') return;
    if (typeof o.skin === 'string') {
      if (o.skin.startsWith('fn:')) ART[o.skin.slice(3)](o, t);
      else if (o.skin.startsWith('near:')) piece(near(o, o.skin.slice(5)));
      else piece(o.skin);
      return;
    }
    if (typeof o.skin === 'function') { o.skin(X.ctx, t); return; }
    if (o.__px) { o.draw(X.ctx, t); return; }
    pxHit = false; X.drew = false;
    try { o.draw(NUL, t); } catch (e) { pxHit = true; }
    if (pxHit && !X.drew) {
      // belum ada gambar baru: tetap tampil sebagai piksel
      o.__px = true;
      X.missing.add(G.scene.id + ': ' + (o.look || o.type || (o.draw + '').slice(0, 60)));
      o.draw(X.ctx, t);
    }
  }
  function render(dt) {
    sizeHi();
    const s = G.scene, t = G.t, c = X.ctx, K = X.K;
    const b = cur = build(s.id);
    G.bgDirty = false;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.imageSmoothingEnabled = true;
    if (b.bg.ok) { c.drawImage(b.bg.img, 0, 0, cv.width, cv.height); lastBg = { id: s.id, e: b.bg }; }
    else if (lastBg && lastBg.id === s.id) c.drawImage(lastBg.e.img, 0, 0, cv.width, cv.height);
    else { c.fillStyle = '#62c24a'; c.fillRect(0, 0, cv.width, cv.height); }
    c.setTransform(K, 0, 0, K, 0, 0);
    SHADOW_TO = null;
    late = [];
    for (const o of s.objs) if (o.flat && !o.hidden) drawObj(o, t);
    const list = s.objs.filter(o => !o.flat && !o.top && !o.hidden);
    const bo = G.boy, d = G.dog;
    list.push({ y: bo.y, draw: cc => {
      if (bo.hidden) return;
      const of = effOutfit();
      const bob = bo.act === 'rope' ? Math.round(Math.max(0, Math.sin(bo.actT * 9)) * 3)
        : bo.act === 'hop' ? Math.round(Math.abs(Math.sin(bo.actT * 7)) * 7) : Math.round(bo.jumpH || 0);
      const opts = { look: 'me', dir: bo.dir, frame: bo.frame, mood: G.mood, outfit: of, act: bo.act, actT: bo.actT, umbrella: of.umbrella && !bo.act && !bo.soak, bob };
      if (bo.soak) {
        // berendam: hanya kepala & bahu di atas air
        c.save(); c.beginPath(); c.rect(bo.x - 20, bo.y - 44, 40, 38); c.clip();
        personArt(bo.x, bo.y, Object.assign(opts, { noShadow: true, dir: 'down' }));
        c.restore();
        const w = Math.abs(Math.sin(G.t * 3)) * 3;
        c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(bo.x - 7 - w, bo.y - 5.5, 2.5, 0.6, 0, 0, 7); c.ellipse(bo.x + 7 + w, bo.y - 5.5, 2.5, 0.6, 0, 0, 7); c.fill();
        X.drew = true;
      } else drawPerson(cc, bo.x, bo.y, opts);
    } });
    if (!d.hidden) list.push({ y: d.y, draw: cc => drawDogTrick(cc, d.x, d.y, d.dir, d.f, d.state, t) });
    list.sort((p, q) => (p.y || 0) - (q.y || 0));
    for (const o of list) drawObj(o, t);
    for (const o of s.objs) if (o.top && !o.hidden) drawObj(o, t);
    for (const f of b.fg) put(f.e, f.vb, 0, 0);
    drawPartsHi(c);
    if (s.outdoor) weatherHi(c, dt);
    tintHi(c, s);
    flushLate();
    for (const ex of s.exits) if (ex.arrow) arrowHi(c, ex.arrow[0], ex.arrow[1], ex.arrow[2], t);
    if (G.marker) {
      const m = G.marker, r = (0.5 - m.t) * 10 + 2;
      c.globalAlpha = Math.max(0, m.t * 2); c.strokeStyle = '#fff2a8'; c.lineWidth = 1;
      c.beginPath(); c.ellipse(m.x, m.y, r, Math.max(0.5, r / 2), 0, 0, 7); c.stroke(); c.globalAlpha = 1;
      m.t -= dt; if (m.t <= 0) G.marker = null;
    }
    if (G.giving && !bo.hidden) {
      const bob = Math.round(Math.abs(Math.sin(G.t * 4)) * 3);
      drawOutlined(c, bo.x, bo.y - 30 - bob, 1, (cc, x, y) => drawItem(cc, x, y, G.giving));
    }
    if (G.fade > 0) { c.fillStyle = `rgba(20,16,30,${G.fade})`; c.fillRect(0, 0, W, H); }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
  // Satu adegan tempat lain di kanvas lain (mode cerita). actors: [{ y, draw(cc) }].
  // o: { night, weather, z (zoom), fx, fy (titik tengah zoom) }. Hasil: false bila gambar belum semuanya siap.
  function sceneShot(c, sid, actors, t, o = {}) {
    const s = SCENES[sid], keep = { ctx: X.ctx, K: X.K, cur, scene: G.scene, night: G.night, weather: G.weather };
    G.scene = s; G.night = !!o.night; G.weather = o.weather || 'sun';
    let ready = true;
    try {
      const b = cur = build(sid), z = o.z || 1, vw = W / z, vh = H / z;
      const sx = Math.max(0, Math.min(W - vw, (o.fx == null ? W / 2 : o.fx) - vw / 2)), sy = Math.max(0, Math.min(H - vh, (o.fy == null ? H / 2 : o.fy) - vh / 2));
      const k = c.canvas.width / W * z;
      Object.assign(X, { ctx: c, K: k, pending: false });
      c.setTransform(k, 0, 0, k, -sx * k, -sy * k);
      c.imageSmoothingEnabled = true; c.lineJoin = 'round'; c.lineCap = 'round';
      if (b.bg.ok) c.drawImage(b.bg.img, 0, 0, W, H); else { ready = false; c.fillStyle = '#62c24a'; c.fillRect(0, 0, W, H); }
      late = [];
      for (const ob of s.objs) if (ob.flat && !ob.hidden) drawObj(ob, t);
      const list = s.objs.filter(ob => !ob.flat && !ob.top && !ob.hidden).concat(actors);
      list.sort((p, q) => (p.y || 0) - (q.y || 0));
      for (const ob of list) drawObj(ob, t);
      for (const ob of s.objs) if (ob.top && !ob.hidden) drawObj(ob, t);
      for (const f of b.fg) put(f.e, f.vb, 0, 0);
      if (G.weather === 'rain' && s.outdoor) {
        c.strokeStyle = 'rgba(200,228,250,0.85)'; c.lineWidth = 0.4; c.beginPath();
        for (let i = 0; i < 70; i++) { const x = (i * 47 + t * 40) % W, y = (i * 31 + t * 160) % H; c.moveTo(x, y); c.lineTo(x - 0.7, y + 3.5); }
        c.stroke();
      }
      tintHi(c, s);
      flushLate();
      if (X.pending) ready = false;
    } finally {
      late = null;
      c.setTransform(1, 0, 0, 1, 0, 0);
      Object.assign(X, { ctx: keep.ctx, K: keep.K }); cur = keep.cur;
      G.scene = keep.scene; G.night = keep.night; G.weather = keep.weather;
    }
    return ready;
  }

  // ---------- Stiker kata gaya baru ----------
  // Aturan desain: lingkaran putih bergaris tipis, satu benda mengisi ±70%, sama dengan gambar di dunia.
  // Gambar stiker lama (ST_ART) dijalankan lewat konteks kosong: orang, hewan, kendaraan, makanan dll.
  // yang sudah punya gambar baru ikut tergambar halus. Yang belum, memakai gambar piksel lama di dalam lingkaran.
  const stCache = new Map(), stSrc = document.createElement('canvas'), stOld = document.createElement('canvas');
  stSrc.width = stSrc.height = 512; stOld.width = stOld.height = 48;
  function stickerBox(c, size) {
    const d = c.getImageData(0, 0, size, size).data, st = size > 100 ? 2 : 1;
    let x0 = size, y0 = size, x1 = -1, y1 = -1;
    for (let y = 0; y < size; y += st) for (let x = 0; x < size; x += st) if (d[(y * size + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    x0 = Math.max(0, x0 - st); y0 = Math.max(0, y0 - st); x1 = Math.min(size - 1, x1 + st); y1 = Math.min(size - 1, y1 + st);
    return [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
  }
  function stickerCompose(src, box, gray, maxUp) {
    // 192 px: cukup tajam untuk tombol & kartu, dan cepat dibuat
    // kanvas di memori biasa (bukan kartu grafis): toDataURL tidak perlu menunggu kartu grafis
    const out = document.createElement('canvas');
    out.width = out.height = 192;
    const o = out.getContext('2d', { willReadFrequently: true });
    o.scale(0.75, 0.75);
    o.beginPath(); o.arc(128, 128, 118, 0, Math.PI * 2);
    o.fillStyle = gray ? '#f4f4f6' : '#ffffff'; o.fill();
    o.lineWidth = 8; o.strokeStyle = gray ? 'rgba(58,38,22,0.28)' : 'rgba(58,38,22,0.35)';
    if (gray) o.setLineDash([16, 12]);
    o.stroke(); o.setLineDash([]);
    const [x0, y0, w, h] = box, s = Math.min(168 / w, 168 / h, maxUp), dw = w * s, dh = h * s;
    let img = src;
    if (gray) {
      img = document.createElement('canvas'); img.width = w; img.height = h;
      const t = img.getContext('2d'); t.drawImage(src, x0, y0, w, h, 0, 0, w, h);
      t.globalCompositeOperation = 'source-in'; t.fillStyle = '#c9ccd4'; t.fillRect(0, 0, w, h);
      o.drawImage(img, 128 - dw / 2, 134 - dh / 2, dw, dh);
    } else {
      o.imageSmoothingQuality = 'high';
      o.drawImage(src, x0, y0, w, h, 128 - dw / 2, 134 - dh / 2, dw, dh);
    }
    return out.toDataURL();
  }
  // 25 stiker contoh dari desain (kotak 44): [[path isi, warna]...], garis detail, warna garis
  const ring = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  const ST_ICON = {
    apple: [[['M22 14 C14 8 6 14 7 24 C8 34 15 40 22 37 C29 40 36 34 37 24 C38 14 30 8 22 14 Z', '#e5443a'], ['M24 10 Q32 2 36 8 Q30 14 24 10 Z', '#58bb44']], 'M22 14 Q22 9 24 6 M13 19 h0.1', '#9a5a2c'],
    carrot: [[['M10 14 L30 10 Q36 12 32 18 L12 36 Q8 38 8 34 Z', '#f39a3a'], ['M30 10 L33 2 L36 9 L42 6 L37 14 Z', '#58bb44']], 'M14 22 l5 2 M12 28 l4 2 M20 18 l4 2', '#c96a1a'],
    watermelon: [[['M2 16 Q22 50 42 16 Z', '#46b04a'], ['M7 17 Q22 42 37 17 Z', '#e5443a']], 'M16 23 h0.1 M22 28 h0.1 M28 23 h0.1', '#3a2616'],
    rice: [[['M8 22 Q10 6 22 6 Q34 6 36 22 Z', '#ffffff'], ['M5 21 H39 Q38 40 22 40 Q6 40 5 21 Z', '#ffffff'], ['M6 27 H38 L37 31 H7 Z', '#3f7ee0']], 'M14 14 h0.1 M22 11 h0.1 M29 15 h0.1', '#d8d0c4'],
    bun: [[['M6 30 Q4 12 22 10 Q40 12 38 30 Q38 36 22 36 Q6 36 6 30 Z', '#fbf6ec']], 'M15 16 Q22 11 29 16 M22 10 V15', '#c9b49a'],
    milk: [[['M12 12 Q12 8 16 8 H28 Q32 8 32 12 V38 Q32 40 30 40 H14 Q12 40 12 38 Z', '#ffffff'], ['M14 18 H30 V26 H14 Z', '#8fd0f2']], 'M16 30 V36', '#d8d0c4'],
    fish: [[['M6 22 Q16 10 30 18 L38 12 V32 L30 26 Q16 34 6 22 Z', '#f39a3a']], 'M13 20 h0.1 M20 16 Q22 22 20 28', '#3a2616'],
    egg: [[['M22 6 Q34 6 36 24 Q36 40 22 40 Q8 40 8 24 Q10 6 22 6 Z', '#f8ecd2']], 'M15 16 Q16 12 19 11', '#ffffff'],
    sun: [[[ring(22, 22, 11), '#ffd23a']], 'M22 2 V7 M22 37 V42 M2 22 H7 M37 22 H42 M8 8 L11 11 M33 33 L36 36 M8 36 L11 33 M33 11 L36 8', '#f39a3a'],
    rain: [[['M8 26 Q2 26 3 20 Q4 14 11 15 Q13 7 21 8 Q29 8 30 16 Q38 15 39 21 Q40 26 34 26 Z', '#dfe6ee']], 'M12 32 V38 M22 32 V38 M32 32 V38', '#3f7ee0'],
    snow: [[], 'M22 4 V40 M6 13 L38 31 M6 31 L38 13 M18 6 L22 10 L26 6 M18 38 L22 34 L26 38', '#6cc0ee'],
    tree: [[['M19 28 H25 V40 H19 Z', '#9a5a2c'], ['M6 22 C2 8 14 2 22 3 C32 2 42 10 38 22 C36 30 8 30 6 22 Z', '#3fa83a']], 'M12 12 Q16 8 20 9', '#ffffff'],
    flower: [[['M21 22 H23 V40 H21 Z', '#3fa83a'], ['M22 32 Q14 28 12 22 Q20 24 22 32 Z', '#58bb44'], [ring(22, 14, 9), '#e5443a'], [ring(22, 14, 3.5), '#ffd23a']], ''],
    car: [[['M4 28 Q4 20 10 20 L14 12 Q16 10 20 10 H28 Q32 10 34 14 L36 20 Q40 20 40 26 V30 H4 Z', '#e5443a'], ['M16 13 H22 V20 H13 Z M24 13 H30 L33 20 H24 Z', '#bfe5f4'], [ring(13, 31, 5), '#47425a'], [ring(31, 31, 5), '#47425a']], ''],
    train: [[['M4 14 Q4 10 8 10 H22 V30 H4 Z M22 18 H38 Q40 18 40 20 V30 H22 Z', '#e5443a'], ['M8 14 H18 V20 H8 Z', '#bfe5f4'], ['M28 10 H34 V18 H28 Z', '#47425a'], [ring(11, 32, 5), '#47425a'], [ring(31, 32, 5), '#47425a']], ''],
    rocket: [[['M14 30 L8 38 H18 Z M30 30 L36 38 H26 Z', '#e5443a'], ['M22 2 Q32 10 30 26 V34 H14 V26 Q12 10 22 2 Z', '#ffffff'], ['M16 7 Q22 0 28 7 Z', '#e5443a'], [ring(22, 17, 3.5), '#8fd0f2'], ['M18 36 Q22 44 26 36 Z', '#ffd23a']], ''],
    ball: [[[ring(22, 22, 16), '#ffffff'], [ring(15, 15, 5), '#e5443a'], [ring(30, 27, 4), '#3f7ee0'], ['M13 29 h7 v4 h-7 Z', '#46b04a']], ''],
    book: [[['M4 8 H22 V38 H4 Z', '#ffffff'], ['M22 8 H40 V38 H22 Z', '#ffd23a']], 'M22 8 V38 M8 16 H18 M8 22 H18 M8 28 H18 M26 16 H36 M26 22 H36 M26 28 H36', '#9a5a2c'],
    umbrella: [[['M4 22 Q4 6 22 6 Q40 6 40 22 Q35 18 31 22 Q26 18 22 22 Q18 18 13 22 Q9 18 4 22 Z', '#e5443a']], 'M22 22 V36 Q22 40 18 40 Q15 40 15 37', '#5a3826'],
    star: [[['M22 4 L27 16 L40 17 L30 26 L33 39 L22 32 L11 39 L14 26 L4 17 L17 16 Z', '#ffd23a']], 'M16 18 Q18 15 20 15', '#ffffff'],
    church: [[['M8 22 H36 V40 H8 Z', '#ffffff'], ['M4 24 L22 12 L40 24 Z', '#c8382f'], ['M17 4 H27 V16 H17 Z', '#ffffff'], ['M19 40 V32 Q22 28 25 32 V40 Z', '#9a5a2c']], 'M22 0 V4', '#ffd23a'],
    sailing: [[['M22 4 V28 H38 Z', '#ffffff'], ['M20 8 L8 28 H20 Z', '#e5443a'], ['M4 30 H40 L36 38 H8 Z', '#3f7ee0']], 'M21 4 V30', '#9a5a2c'],
    piano: [[['M4 12 H40 V36 H4 Z', '#3a2a2a'], ['M7 22 H37 V33 H7 Z', '#ffffff'], ['M10 22 h3 v6 h-3 Z M16 22 h3 v6 h-3 Z M26 22 h3 v6 h-3 Z M32 22 h3 v6 h-3 Z', '#2a2020']], 'M13 28 V33 M19 28 V33 M25 28 V33 M31 28 V33', '#3a2a2a'],
    moon: [[['M28 6 A16 16 0 1 0 38 30 A13 13 0 1 1 28 6 Z', '#fbe7a0']], 'M18 24 h0.1 M14 16 h0.1', '#c9b47a'],
    home: [[['M8 20 H36 V38 H8 Z', '#f8ecd2'], ['M4 22 L22 6 L40 22 Z', '#e5443a'], ['M18 38 V28 H26 V38 Z', '#9a5a2c'], ['M28 25 H34 V31 H28 Z', '#bfe5f4']], ''],
  };
  function stickerIcon(k, gray) {
    const [parts, detail, dc] = ST_ICON[k];
    const out = document.createElement('canvas');
    out.width = out.height = 192;
    const o = out.getContext('2d', { willReadFrequently: true });
    o.scale(0.75, 0.75);
    o.beginPath(); o.arc(128, 128, 118, 0, Math.PI * 2); o.fillStyle = gray ? '#f4f4f6' : '#ffffff'; o.fill();
    o.lineWidth = 8; o.strokeStyle = gray ? 'rgba(58,38,22,0.28)' : 'rgba(58,38,22,0.35)'; if (gray) o.setLineDash([16, 12]); o.stroke(); o.setLineDash([]);
    o.translate(128 - 22 * 3.9, 130 - 22 * 3.9); o.scale(3.9, 3.9); o.lineJoin = 'round'; o.lineCap = 'round';
    for (const [d, col] of parts) { const p = new Path2D(d); o.fillStyle = gray ? '#c9ccd4' : col; o.fill(p); if (!gray) { o.strokeStyle = 'rgba(58,38,22,0.35)'; o.lineWidth = 1.4; o.stroke(p); } }
    if (detail) { o.strokeStyle = gray ? '#c9ccd4' : dc; o.globalAlpha = gray ? 1 : 0.8; o.lineWidth = 2; o.stroke(new Path2D(detail)); o.globalAlpha = 1; }
    if (!gray) { o.fillStyle = 'rgba(255,255,255,0.65)'; o.beginPath(); o.ellipse(15, 15, 3, 2, -0.5, 0, Math.PI * 2); o.fill(); }
    return out.toDataURL();
  }
  function sticker(k, gray) {
    const id = k + (gray ? '-g' : '');
    if (stCache.has(id)) return stCache.get(id);
    if (ST_ICON[k]) { const u = stickerIcon(k, gray); stCache.set(id, u); return u; }
    const r = stickerSrc(k);
    if (!r) { stCache.set(id, null); return null; }
    const url = stickerCompose(r.src, r.box, gray, r.maxUp);
    if (!r.pending) stCache.set(id, url);
    return url;
  }
  // isi stiker tanpa lingkaran: { src, box, maxUp, pending } (src bisa berubah, langsung dipakai)
  function stickerSrc(k) {
    const fn = ST_ART[k];
    if (!fn) return null;
    const keepSeason = EX.season; EX.season = 'summer';
    try {
      // 1) coba gambar halus: 64 satuan stiker di kanvas 512 px
      const c = stSrc.getContext('2d', { willReadFrequently: true }), keep = { ctx: X.ctx, K: X.K, RS: X.RS };
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 512, 512);
      Object.assign(X, { ctx: c, K: 8, RS: 2, drew: false, pending: false });
      c.setTransform(8, 0, 0, 8, 0, 0);
      pxHit = false;
      let ok = true;
      try { fn(NUL, 32, 54); } catch (e) { ok = false; }
      const drew = X.drew;
      let pending = X.pending;
      Object.assign(X, keep);
      if (ok && drew) {
        let box = stickerBox(c, 512);
        // benda kecil (apel, koin…) digambar ulang lebih besar supaya tetap tajam
        if (box && Math.max(box[2], box[3]) < 280) {
          const z = Math.min(4, 336 / Math.max(box[2], box[3])), K2 = 8 * z;
          const cx = (box[0] + box[2] / 2) / 8, cy = (box[1] + box[3] / 2) / 8;
          c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 512, 512);
          Object.assign(X, { ctx: c, K: K2, RS: K2 / 4, drew: false, pending: false });
          c.setTransform(K2, 0, 0, K2, 256 - cx * K2, 256 - cy * K2);
          pxHit = false;
          try { fn(NUL, 32, 54); } catch (e) {}
          pending = pending || X.pending;
          Object.assign(X, keep);
          box = stickerBox(c, 512);
        }
        if (box) return { src: stSrc, box, maxUp: 1.4, pending };
      }
      // 2) gambar piksel lama
      const p = stOld.getContext('2d', { willReadFrequently: true });
      p.setTransform(1, 0, 0, 1, 0, 0); p.clearRect(0, 0, 48, 48);
      drawOutlined(p, 24, 45, 1, fn);
      const box = stickerBox(p, 48);
      if (!box) return null;
      const crop = document.createElement('canvas'); crop.width = box[2] + 2; crop.height = box[3] + 2;
      crop.getContext('2d').drawImage(stOld, box[0], box[1], box[2], box[3], 1, 1, box[2], box[3]);
      const up = upscale4(crop);
      return { src: up, box: [0, 0, up.width, up.height], maxUp: 2.6, pending: false, pixel: true };
    } catch (e) {
      return null;
    } finally { EX.season = keepSeason; }
  }
  // benda sebagai gambar lepas (tanpa lingkaran) untuk jendela permainan: kanvas terpotong pas, dasar = alas benda
  const picCache = new Map();
  function itemPic(k) {
    if (picCache.has(k)) return picCache.get(k);
    let out = null, pending = false;
    if (ST_ICON[k]) {
      const [parts, detail, dc] = ST_ICON[k];
      out = document.createElement('canvas'); out.width = out.height = 184;
      const o = out.getContext('2d'); o.translate(4, 4); o.scale(4, 4); o.lineJoin = 'round'; o.lineCap = 'round';
      for (const [d, col] of parts) { const p = new Path2D(d); o.fillStyle = col; o.fill(p); o.strokeStyle = 'rgba(58,38,22,0.35)'; o.lineWidth = 1.4; o.stroke(p); }
      if (detail) { o.strokeStyle = dc; o.globalAlpha = 0.8; o.lineWidth = 2; o.stroke(new Path2D(detail)); o.globalAlpha = 1; }
    } else {
      const r = stickerSrc(k);
      if (r) {
        const [x0, y0, w, h] = r.box;
        out = document.createElement('canvas'); out.width = w; out.height = h;
        const o = out.getContext('2d'); o.imageSmoothingQuality = 'high'; o.drawImage(r.src, x0, y0, w, h, 0, 0, w, h);
        pending = r.pending;
      }
    }
    if (out && out.width === 184) {
      const b = stickerBox(out.getContext('2d', { willReadFrequently: true }), 184);
      if (b) { const t = document.createElement('canvas'); t.width = b[2]; t.height = b[3]; t.getContext('2d').drawImage(out, b[0], b[1], b[2], b[3], 0, 0, b[2], b[3]); out = t; }
    }
    if (!pending) picCache.set(k, out);
    return out;
  }
  // gambar benda: (x, y) = tengah bawah, h = tinggi dalam satuan permainan
  function drawPic(k, x, y, h, o = {}) {
    const p = itemPic(k);
    if (!p) return false;
    const c = X.ctx, w = h * p.width / p.height;
    c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.alpha != null) c.globalAlpha *= o.alpha;
    c.imageSmoothingQuality = 'high'; c.drawImage(p, -w / 2, -h, w, h); c.restore();
    X.drew = true; return true;
  }
  // memuat lebih dulu gambar orang & hewan yang dipakai stiker (supaya stiker langsung halus saat pertama tampil)
  function stickerWarm(keys) {
    const list = keys.slice();
    const step = () => {
      const c = stSrc.getContext('2d'), keep = { ctx: X.ctx, K: X.K, RS: X.RS };
      Object.assign(X, { ctx: c, K: 8, RS: 2 });
      try { for (let i = 0; i < 12 && list.length; i++) { const k = list.shift(); try { ST_ART[k](NUL, 32, 54); } catch (e) {} } }
      finally { Object.assign(X, keep); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 512, 512); }
      if (list.length) setTimeout(step, 30);
    };
    setTimeout(step, 400);
  }

  // ---------- Jendela permainan kecil ----------
  // Aturan permainan (hook lama) tetap dijalankan dengan gambar piksel dibisukan, lalu render() menggambar
  // ulang isinya dengan halus memakai keadaan yang sama. obj = { sctx, ctx, cv } milik permainan itu.
  // unit = piksel kanvas lama per satuan permainan; kanvas dibuat setajam layar, ketukan tetap dihitung
  // dalam ukuran lama (lihat cvPoint di bawah).
  function panelRes(cv, unit, on) {
    if (!cv.__bw) { cv.__bw = cv.width; cv.__bh = cv.height; }
    const w = cv.__bw / unit, h = cv.__bh / unit, dpr = window.devicePixelRatio || 1;
    const k = !on ? unit : Math.min(12, Math.max(unit, Math.ceil((cv.clientWidth ? cv.clientWidth * dpr : w * 8) / w)));
    if (cv.width !== Math.round(w * k)) { cv.width = Math.round(w * k); cv.height = Math.round(h * k); }
    cv.classList.toggle('hi', on);
    return k;
  }
  // name: nama di PANEL_HOOK, atau 'fn:namaFungsi' untuk fungsi gambar global (bunga, cermin, berhitung).
  // when(): boleh dikosongkan; kalau mengembalikan false, gambar lama yang dipakai (bagian yang belum digambar ulang).
  function wrapPanel(name, obj, render, unit = 4, when) {
    const fn = name.startsWith('fn:') ? name.slice(3) : null, base = fn ? window[fn] : PANEL_HOOK[name];
    if (typeof base !== 'function') { console.warn('skin: tidak ada permainan', name); return; }
    if (!cvPoint.__skin) {
      const old = cvPoint;
      window.cvPoint = (c, e) => { const p = old(c, e); return c.__bw ? [p[0] * c.__bw / c.width, p[1] * c.__bh / c.height] : p; };
      window.cvPoint.__skin = true;
    }
    const wrapped = dt => {
      const on = X.on && (!when || when() !== false), scale = panelRes(obj.cv, unit, on);
      if (!on) return base(dt);
      const ks = obj.sctx, kc = obj.ctx;
      // perbesaran piksel lama tidak dipakai, jadi dilewati selama aturan permainan berjalan
      const u4 = window.upscale4, u8 = window.upscale8, db = window.drawBig, same = s => s;
      if (ks) obj.sctx = NUL;
      obj.ctx = NUL; X.mute = true; window.upscale4 = window.upscale8 = same; window.drawBig = () => {};
      try { base(dt); } finally { if (ks) obj.sctx = ks; obj.ctx = kc; X.mute = false; window.upscale4 = u4; window.upscale8 = u8; window.drawBig = db; }
      const c = kc, keep = { ctx: X.ctx, K: X.K, RS: X.RS };
      Object.assign(X, { ctx: c, K: scale, RS: scale / 4 });
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, obj.cv.width, obj.cv.height);
      c.setTransform(scale, 0, 0, scale, 0, 0); c.lineJoin = 'round'; c.lineCap = 'round';
      try { render(c, G.t, dt); } catch (e) { console.warn('skin: gambar permainan', name, e); }
      finally { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; Object.assign(X, keep); }
    };
    if (fn) window[fn] = wrapped; else PANEL_HOOK[name] = wrapped;
  }
  // stiker sebagai gambar siap pakai di kanvas (dimuat sekali)
  const stImgs = new Map();
  function stickerImg(k) {
    let im = stImgs.get(k);
    if (!im) { im = new Image(); const u = window.stickerCanvas && stickerCanvas(k); if (u) im.src = u; stImgs.set(k, im); }
    return im.complete && im.naturalWidth ? im : null;
  }

  return Object.assign(X, {
    NUL,
    sticker,
    stickerWarm,
    wrapPanel, stickerImg, itemPic, drawPic, hook, sushiArt, sceneShot, vec, personArt, animal, animalCol, dogArt, treeArt, appleArt, arrowHi,
    dbg: () => cur,
    use: () => X.on && !!G.scene && READY.has(G.scene.id) && !!SKIN_TPL[G.scene.id],
    render,
    pixel: sizePixel,
    // layar tetap gelap sebentar sampai gambar tempat baru siap (paling lama 1,5 detik)
    waiting() {
      if (!X.use()) return false;
      sizeHi();
      const b = build(G.scene.id);
      if (b.bg.ok) { X.waitT = 0; return false; }
      X.waitT = (X.waitT || 0) + 1;
      return X.waitT < 90;
    },
    set(on) { X.on = !!on; try { localStorage.setItem('anan-skin-off', on ? '0' : '1'); } catch (e) {} G.bgDirty = true; },
  });
})();
