// Tampilan menu gaya baru (desain Claude Design: Panduan 3, UI Panel, UI Judul).
// Gaya CSS-nya ada di index.html (:root.skin-new …); file ini memasang kelas itu, ikon SVG tombol atas,
// stiker di kartu kata, dan peta bergambar halus. Semua kembali ke gaya lama bila "gambar gaya baru" dimatikan.

(function skinUI() {
  const L = 'stroke="#3a2616" stroke-opacity="0.35" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
  const HL = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity="0.65"/>`;
  const svg = body => `<svg viewBox="0 0 44 44" aria-hidden="true">${body}</svg>`;
  const CLOUD = 'M8 34 Q2 34 3 28 Q4 22 11 23 Q13 15 21 16 Q29 16 30 24 Q38 23 39 29 Q40 34 34 34 Z';
  const SEASON_LEAF = { spring: '#7ccf5a', summer: '#3fa83a', autumn: '#e8892e', winter: '#4f8f6a' };
  const ICON = {
    day: svg(`<g stroke="#e09a58" stroke-width="4" stroke-linecap="round"><path d="M22 3 V8 M22 36 V41 M3 22 H8 M36 22 H41 M8.6 8.6 L12 12 M32 32 L35.4 35.4 M8.6 35.4 L12 32 M32 12 L35.4 8.6"/></g><circle cx="22" cy="22" r="11" fill="#ffd23a" ${L}/>${HL(18, 18, 4, 2.5)}`),
    night: svg(`<path d="M26 5 A17 17 0 1 0 39 30 A13 13 0 1 1 26 5 Z" fill="#fbe7a0" ${L}/><path d="M33 8 L34.5 11.5 L38 13 L34.5 14.5 L33 18 L31.5 14.5 L28 13 L31.5 11.5 Z" fill="#ffd23a"/>${HL(14, 16, 3, 2)}`),
    sun: svg(`<circle cx="28" cy="14" r="9" fill="#ffd23a" ${L}/><path d="${CLOUD}" fill="#ffffff" ${L}/>`),
    cloud: svg(`<path d="M30 20 Q30 12 22 12 Q16 12 15 17" fill="none" stroke="#c9d4e0" stroke-width="5" stroke-linecap="round"/><path d="${CLOUD}" fill="#ffffff" ${L}/>`),
    rain: svg(`<path d="M8 28 Q2 28 3 22 Q4 16 11 17 Q13 9 21 10 Q29 10 30 18 Q38 17 39 23 Q40 28 34 28 Z" fill="#dfe6ee" ${L}/><path d="M12 33 V39 M22 33 V41 M32 33 V39" stroke="#3f7ee0" stroke-width="3.5" stroke-linecap="round"/>`),
    wind: svg(`<g fill="none" stroke="#7fb6f2" stroke-width="4" stroke-linecap="round"><path d="M4 16 H26 Q32 16 32 11 Q32 6 27 7"/><path d="M4 24 H34 Q40 24 40 29 Q40 34 35 33"/><path d="M8 32 H20"/></g><ellipse cx="14" cy="9" rx="5" ry="3" fill="#58bb44" ${L} transform="rotate(-25 14 9)"/>`),
    snow: svg(`<g stroke="#6cc0ee" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M22 4 V40 M6 13 L38 31 M6 31 L38 13 M17 7 L22 11 L27 7 M17 37 L22 33 L27 37"/></g>`),
    season: s => svg(`<rect x="19" y="26" width="6" height="14" rx="2.5" fill="#9a5a2c" ${L}/><path d="M7 22 C3 9 15 3 22 4 C31 3 41 10 37 22 C35 30 9 30 7 22 Z" fill="${SEASON_LEAF[s] || '#3fa83a'}" ${L}/>` +
      (s === 'spring' ? '<g fill="#f6a8c8"><circle cx="14" cy="14" r="2.5"/><circle cx="27" cy="11" r="2.5"/><circle cx="30" cy="20" r="2.5"/></g>' : '') +
      (s === 'winter' ? '<path d="M8 17 C10 8 18 5 22 5 C30 5 36 10 36 17 Q22 11 8 17 Z" fill="#ffffff"/>' : '') +
      (s === 'autumn' ? '<ellipse cx="36" cy="36" rx="3.5" ry="2" fill="#e5443a" transform="rotate(30 36 36)"/>' : '') + HL(15, 12, 4, 2)),
    music: svg(`<path d="M16 32 V9 L36 5 V28" fill="none" stroke="#3f7ee0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="11" cy="33" rx="7" ry="5.5" fill="#3f7ee0" ${L}/><ellipse cx="31" cy="29" rx="7" ry="5.5" fill="#3f7ee0" ${L}/>${HL(9, 31, 2.5, 1.5)}`),
    mute: '<path d="M6 6 L38 38" stroke="#e5443a" stroke-width="5" stroke-linecap="round"/>',
    map: svg(`<path d="M4 10 L15 6 L29 10 L40 6 V34 L29 38 L15 34 L4 38 Z" fill="#bfe5f4" ${L}/><path d="M15 6 V34 M29 10 V38" stroke="#3a2616" stroke-opacity="0.35" stroke-width="2"/><path d="M7 26 Q14 18 22 24 T37 16" fill="none" stroke="#e5443a" stroke-width="2.5" stroke-dasharray="3 4" stroke-linecap="round"/><circle cx="34" cy="18" r="3.5" fill="#e5443a"/>`),
    bag: svg(`<path d="M15 15 Q15 5 22 5 Q29 5 29 15" fill="none" stroke="#9a5a2c" stroke-width="4" stroke-linecap="round"/><path d="M8 17 Q8 13 12 13 H32 Q36 13 36 17 L38 35 Q38 40 33 40 H11 Q6 40 6 35 Z" fill="#e09a58" ${L}/><rect x="17" y="21" width="10" height="7" rx="3" fill="#ffd23a"/>${HL(13, 19, 3, 1.8)}`),
    menu: svg('<g fill="#9a5a2c"><rect x="7" y="9" width="30" height="6" rx="3"/><rect x="7" y="19" width="30" height="6" rx="3"/><rect x="7" y="29" width="30" height="6" rx="3"/></g>'),
    fold: svg('<path d="M28 8 L14 22 L28 36" fill="none" stroke="#9a5a2c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'),
    camera: svg(`<rect x="4" y="13" width="36" height="25" rx="7" fill="#dfe6ee" ${L}/><path d="M14 13 L17 7 H27 L30 13 Z" fill="#9aa0ab" ${L}/><circle cx="22" cy="25" r="8.5" fill="#3f7ee0" ${L}/><circle cx="22" cy="25" r="4" fill="#bfe5f4"/><rect x="31" y="17" width="5" height="3.5" rx="1.5" fill="#e5443a"/>${HL(19, 22, 2.5, 1.6)}`),
    story: svg(`<path d="M4 10 Q14 6 22 12 V38 Q14 32 4 36 Z" fill="#ffffff" ${L}/><path d="M40 10 Q30 6 22 12 V38 Q30 32 40 36 Z" fill="#ffd23a" ${L}/><path d="M9 17 H17 M9 23 H17 M27 17 H35 M27 23 H35" stroke="#9a5a2c" stroke-width="2" stroke-linecap="round"/>`),
    star: svg(`<path d="M22 4 L27 16 L40 17 L30 26 L33 39 L22 32 L11 39 L14 26 L4 17 L17 16 Z" fill="#ffd23a" ${L}/>${HL(17, 17, 3, 2)}`),
    close: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6" stroke="#e5443a" stroke-width="2.2" stroke-linecap="round"/></svg>',
  };
  // ikon tombol atas diganti SVG (canvas piksel lama dibuang); lencana jumlah tetap
  function setIcon(id, html) {
    const el = $(id);
    if (!el) return;
    el.querySelectorAll(':scope > canvas, :scope > svg').forEach(n => n.remove());
    el.insertAdjacentHTML('afterbegin', html);
  }
  const _updateIcons = updateIcons;
  updateIcons = function () {
    _updateIcons();
    const on = typeof Skin !== 'undefined' && Skin.on;
    document.documentElement.classList.toggle('skin-new', on);
    if (!on) { restoreRightIcons(); return; }
    setIcon('btn-time', G.night ? ICON.night : ICON.day);
    setIcon('btn-weather', ICON[G.weather] || ICON.sun);
    setIcon('btn-season', ICON.season(EX.season));
    setIcon('btn-music', Snd.on ? ICON.music : ICON.music.replace('</svg>', ICON.mute + '</svg>'));
    setIcon('btn-map', ICON.map);
    setIcon('btn-bag', ICON.bag);
    setIcon('btn-hud', G.hudOff ? ICON.menu : ICON.fold);
    setIcon('btn-camera', ICON.camera);
    setIcon('btn-story', ICON.story);
    setIcon('btn-stickers', ICON.star);
  };
  // tombol kanan atas aslinya SVG piksel kecil: simpan supaya bisa dikembalikan
  const RIGHT = ['btn-camera', 'btn-story', 'btn-stickers'], rightOrig = {};
  RIGHT.forEach(id => { const s = $(id) && $(id).querySelector('svg'); if (s) rightOrig[id] = s.outerHTML; });
  function restoreRightIcons() { RIGHT.forEach(id => { if (rightOrig[id]) setIcon(id, rightOrig[id]); }); }

  // tombol tutup di semua jendela: X merah
  const closeOrig = new Map();
  function styleClose(on) {
    document.querySelectorAll('.close').forEach(b => {
      if (!closeOrig.has(b)) closeOrig.set(b, b.innerHTML);
      b.innerHTML = on ? ICON.close : closeOrig.get(b);
    });
  }

  // stiker kata gaya baru (lingkaran putih; isi halus bila benda itu sudah punya gambar baru)
  const _sticker = stickerCanvas;
  stickerCanvas = function (k, gray) {
    if (typeof Skin !== 'undefined' && Skin.on) { const u = Skin.sticker(k, gray); if (u) return u; }
    return _sticker(k, gray);
  };
  if (Skin.on) Skin.stickerWarm(Object.keys(ST_ART));

  // kartu kata: stiker kata di sebelah kiri
  const _showCard = showCard;
  showCard = function (card, zh) {
    _showCard(card, zh);
    const pic = $('card-pic');
    if (!pic) return;
    const src = typeof Skin !== 'undefined' && Skin.on && card && card.key && window.stickerCanvas ? stickerCanvas(card.key) : null;
    pic.hidden = !src;
    if (src) pic.src = src;
  };

  // ---------- Peta gaya baru (dunia peta 160×90, digambar halus di kanvas 1280×720) ----------
  const MAP_ICON = {
    home: ['M8 20 L22 8 L36 20 V36 H8 Z', '#f8ecd2', 'M6 21 L22 7 L38 21 M18 36 V26 H26 V36', '#e5443a'],
    farm: ['M22 20 Q10 20 10 8 Q22 8 22 20 Z M22 20 Q34 20 34 10 Q22 10 22 20 Z', '#58bb44', 'M22 20 V36 M10 36 H34'],
    village: ['M4 22 L12 14 L20 22 V36 H4 Z M22 18 L31 10 L40 18 V36 H22 Z', '#f2cb8a', 'M10 36 V30 H14 V36 M29 36 V28 H33 V36'],
    school: ['M6 20 H38 V38 H6 Z M14 20 L22 10 L30 20 Z', '#ffd23a', 'M22 10 V4 L28 6 L22 8 M18 38 V30 H26 V38'],
    office: ['M10 6 H34 V38 H10 Z', '#bfe5f4', 'M16 12 h4 M24 12 h4 M16 20 h4 M24 20 h4 M16 28 h4 M24 28 h4 M20 38 V32 H24 V38'],
    mountain: ['M2 38 L16 12 L24 24 L30 16 L42 38 Z', '#9aa0c8', 'M12 20 L16 12 L20 20'],
    beach: ['M2 30 Q22 24 42 30 V40 H2 Z M8 14 Q22 0 36 14 Z', '#f2cb8a', 'M22 28 V12'],
    station: ['M8 10 Q8 6 12 6 H32 Q36 6 36 10 V32 H8 Z', '#3f7ee0', 'M12 12 H32 V20 H12 Z M14 32 L10 38 M30 32 L34 38'],
    carnival: ['M4 18 L22 6 L40 18 Z', '#e5443a', 'M8 18 V36 M36 18 V36 M22 18 V36 M4 36 H40'],
    zoo: ['M9 22 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 Z', '#f39a3a', 'M15 22 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M20 25 Q22 27 24 25'],
    workshop: ['M8 12 Q8 10 10 10 H34 Q36 10 36 12 V32 Q36 34 34 34 H10 Q8 34 8 32 Z', '#dfe6ee', 'M22 10 V4 M16 20 h0.1 M28 20 h0.1 M16 27 H28 M12 34 V40 M32 34 V40'],
    rocketbase: ['M22 2 Q32 10 30 26 L34 34 H10 L14 26 Q12 10 22 2 Z', '#ffffff', 'M19 14 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M18 34 Q22 44 26 34'],
    salon: ['M6 30 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z M26 30 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z', '#e5443a', 'M15 25 L32 4 M29 25 L12 4'],
    sushibar: ['M8 22 a14 9 0 1 0 28 0 a14 9 0 1 0 -28 0 Z', '#ffffff', 'M14 22 a8 5 0 1 0 16 0 a8 5 0 1 0 -16 0 M8 22 V30 Q22 40 36 30 V22'],
    church: ['M8 22 H36 V40 H8 Z M4 24 L22 12 L40 24 Z M17 4 H27 V16 H17 Z', '#ffffff', 'M22 0 V4 M19 40 V32 Q22 28 25 32 V40'],
  };
  const ROADS = [['mountain', 'farm'], ['home', 'farm'], ['farm', 'village'], ['village', 'school'], ['school', 'office'], ['village', 'beach'],
    ['village', 'station'], ['village', 'salon'], ['office', 'workshop'], ['beach', 'sushibar'], ['school', 'carnival'], ['mountain', 'rocketbase'], ['village', 'church'], ['carnival', 'zoo']];
  const P = new Map(), path = d => { let p = P.get(d); if (!p) { p = new Path2D(d); P.set(d, p); } return p; };
  function mapArt(c, cur, t) {
    const cv = c.canvas;
    if (cv.width !== 1280) { cv.width = 1280; cv.height = 720; }
    const k = cv.width / 160, line = 'rgba(58,38,22,0.35)';
    c.setTransform(k, 0, 0, k, 0, 0); c.lineJoin = 'round'; c.lineCap = 'round';
    const fill = (d, col, w = 0.25) => { const p = typeof d === 'string' ? path(d) : d; c.fillStyle = col; c.fill(p); if (w) { c.strokeStyle = line; c.lineWidth = w; c.stroke(p); } };
    c.fillStyle = '#8fdc6a'; c.fillRect(0, 0, 160, 90);
    c.fillStyle = '#7ccf5a';
    [[30, 20, 16, 6], [70, 80, 20, 6], [140, 30, 14, 5], [20, 50, 10, 4], [90, 60, 12, 4]].forEach(([x, y, rx, ry]) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); });
    // sungai
    let d = 'M', d2 = '';
    for (let y = 0; y <= 90; y += 3) d += `${(112 + Math.sin(y / 14) * 6 - y * 0.5).toFixed(2)} ${y} L`;
    for (let y = 90; y >= 0; y -= 3) d2 += `${(118 + Math.sin(y / 14) * 6 - y * 0.5).toFixed(2)} ${y} L`;
    fill((d + d2).replace(/ L$/, ' Z'), '#4fb4ec');
    // laut di pojok kanan bawah
    fill('M160 62 Q140 66 128 78 Q120 86 118 90 H160 Z', '#f2cb8a');
    fill('M160 67 Q146 70 136 80 Q130 86 129 90 H160 Z', '#4fb4ec');
    for (let i = 0; i < 4; i++) { const y = 74 + i * 4; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 0.5; c.beginPath(); c.moveTo(146 + i * 2 + Math.sin(t + i) * 1.5, y); c.lineTo(151 + i * 2 + Math.sin(t + i) * 1.5, y); c.stroke(); }
    // jalan
    const S = MAP_SPOTS;
    c.lineWidth = 3.4; c.strokeStyle = '#d9a960'; c.beginPath(); ROADS.forEach(([a, b]) => { c.moveTo(...S[a]); c.lineTo(...S[b]); }); c.stroke();
    c.lineWidth = 2.4; c.strokeStyle = '#f2cb8a'; c.stroke();
    // pohon kecil
    [[44, 68], [76, 6], [118, 6], [44, 82], [78, 74], [154, 28], [8, 46]].forEach(([a, b]) => {
      c.fillStyle = 'rgba(58,38,22,0.18)'; c.beginPath(); c.ellipse(a, b + 0.4, 2.6, 0.8, 0, 0, 7); c.fill();
      fill(`M${a - 0.6} ${b} V${b - 2.5} H${a + 0.6} V${b} Z`, '#9a5a2c', 0.15);
      const crown = new Path2D(); crown.arc(a, b - 4, 3, 0, 7); fill(crown, '#3fa83a', 0.2);
    });
    // ikon tempat: lingkaran putih berbingkai kayu
    for (const [key, [x, y]] of Object.entries(S)) {
      const ic = MAP_ICON[key];
      c.fillStyle = 'rgba(58,38,22,0.18)'; c.beginPath(); c.ellipse(x, y + 5.2, 5, 1.2, 0, 0, 7); c.fill();
      c.beginPath(); c.arc(x, y - 1, 6, 0, 7); c.fillStyle = '#ffffff'; c.fill(); c.lineWidth = 0.7; c.strokeStyle = '#9a5a2c'; c.stroke();
      if (!ic) continue;
      c.save(); c.translate(x - 4.4, y - 5.4); c.scale(8.8 / 44, 8.8 / 44);
      c.fillStyle = ic[1]; c.fill(path(ic[0])); c.strokeStyle = 'rgba(58,38,22,0.5)'; c.lineWidth = 2; c.stroke(path(ic[0]));
      if (ic[2]) { c.strokeStyle = ic[3] || 'rgba(58,38,22,0.75)'; c.lineWidth = 2.4; c.stroke(path(ic[2])); }
      c.restore();
    }
    // penanda Russel: kepala kecil di atas tempat sekarang
    if (S[cur]) {
      const [x, y] = S[cur], b = Math.abs(Math.sin(t * 4)) * 1.5;
      c.save(); c.translate(x + 5, y - 9 - b);
      c.fillStyle = '#e5443a'; c.beginPath(); c.moveTo(0, 4); c.lineTo(-2.2, 0.5); c.lineTo(2.2, 0.5); c.closePath(); c.fill();
      c.beginPath(); c.arc(0, -1, 3.2, 0, 7); c.fillStyle = '#f7cfa6'; c.fill(); c.lineWidth = 0.3; c.strokeStyle = line; c.stroke();
      c.beginPath(); c.moveTo(-3.3, -1); c.quadraticCurveTo(-3.4, -4.6, 0, -4.6); c.quadraticCurveTo(3.4, -4.6, 3.3, -1); c.quadraticCurveTo(1.6, -2.6, 0, -2.2); c.quadraticCurveTo(-1.6, -2.6, -3.3, -1); c.fillStyle = '#5e3720'; c.fill();
      c.fillStyle = '#3a2616'; c.beginPath(); c.arc(-1, -0.8, 0.45, 0, 7); c.arc(1, -0.8, 0.45, 0, 7); c.fill();
      c.restore();
    }
  }
  const _drawMap = drawMap;
  drawMap = function (c, cur, t) {
    if (typeof Skin !== 'undefined' && Skin.on) return mapArt(c, cur, t);
    if (c.canvas.width !== 320) { c.canvas.width = 320; c.canvas.height = 180; }
    c.setTransform(1, 0, 0, 1, 0, 0);
    return _drawMap(c, cur, t);
  };
  // bintang kejutan hari ini di peta
  if (typeof mapExtra === 'function') {
    const _mapExtra = mapExtra;
    mapExtra = function (c, t) {
      if (!(typeof Skin !== 'undefined' && Skin.on)) return _mapExtra(c, t);
      if (EX.foundDay === today()) return;
      const [x, y] = MAP_SPOTS[todaySurprise().scene], b = Math.abs(Math.sin(t * 3)) * 1.5;
      c.save(); c.translate(x + 6, y - 9 - b); c.scale(0.22, 0.22);
      c.fillStyle = Math.floor(t * 4) % 2 ? '#ffd23a' : '#fff2a8'; c.fill(path('M0 -14 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4 Z'));
      c.strokeStyle = 'rgba(58,38,22,0.4)'; c.lineWidth = 2; c.stroke(path('M0 -14 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4 Z'));
      c.restore();
    };
  }

  // gaya baru dinyalakan/dimatikan dari menu orang tua → menu ikut berubah
  const _set = Skin.set;
  Skin.set = function (on) { _set(on); styleClose(!!on); updateIcons(); };
  styleClose(Skin.on);
  updateIcons();
})();
