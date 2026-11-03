// Isi jendela permainan kecil dengan gambar gaya baru (gaya C). Aturan permainannya tetap di file aslinya;
// Skin.wrapPanel menjalankan aturan itu tanpa gambar piksel, lalu fungsi di sini menggambar keadaan yang sama.
// Satuan: kanvas sumber lama (160×110); vec() memakai satuan desain = 1/4 satuan itu.

(function skinPanels() {
  const S = Skin, vec = S.vec, LINE = 'rgba(58,38,22,0.35)';
  const STAR = 'M0 -14 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4 Z';
  const star = (x, y, s = 1, col = '#ffd23a') => vec(x, y, v => v.fill(STAR, col), { s });
  const grad = (c, y0, y1, a, b) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
  const mix = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
  const cloud = (x, y, s = 1) => vec(x, y, v => v.fill('M-30 6 Q-32 -6 -16 -6 Q-8 -16 8 -12 Q24 -18 32 -4 Q50 -4 48 6 Z', '#ffffff', false), { s });
  const me = (x, y, o) => S.personArt(x, y, Object.assign({ look: 'me', dir: 'down', mood: 'happy', outfit: effOutfit(), noShadow: true }, o));

  // ---------- Berlayar ----------
  function sailboat(x, y, tilt) {
    vec(x, y, v => {
      v.rect(-2, -164, 5, 150, 2, '#9a5a2c');
      v.fill('M4 -160 L76 -44 L4 -44 Z', '#ffffff'); v.line('M10 -120 L40 -70', 'rgba(58,38,22,0.15)', 2);
      v.fill('M-4 -122 L-44 -44 L-4 -44 Z', '#e5443a');
      v.fill('M4 -164 L26 -158 L4 -152 Z', '#ffd23a');
    });
    me(x - 6, y - 3 + tilt, { dir: 'right' });
    vec(x, y, v => { v.fill('M-70 -30 H70 Q66 -6 46 0 H-46 Q-66 -6 -70 -30 Z', '#3f7ee0'); v.rect(-70, -32, 140, 9, 4, '#ffffff'); v.hl(-40, -16, 14, 3); });
  }
  S.wrapPanel('sail', SA, (c, t) => {
    c.fillStyle = grad(c, 0, 36, '#8fd0f2', '#e2f4fc'); c.fillRect(0, 0, 160, 37);
    vec(132, 12, v => { v.ell(0, 0, 24, 24, '#ffd23a'); v.ell(-6, -6, 8, 5, 'rgba(255,255,255,0.6)', false); });
    for (let i = 0; i < 3; i++) cloud(((i * 64 - SA.t * 4) % 200 + 200) % 200 - 20, 12 + i * 6, 0.9);
    c.fillStyle = grad(c, 36, 110, '#4fb4ec', '#2f8fd6'); c.fillRect(0, 36, 160, 74);
    c.strokeStyle = 'rgba(191,229,244,0.8)'; c.lineWidth = 0.7; c.beginPath();
    for (let y = 42; y < 110; y += 8) for (let x = ((y * 13) % 23) - ((SA.t * (10 + y / 6)) % 23); x < 160; x += 23) { c.moveTo(x, y); c.quadraticCurveTo(x + 3, y - 1.2, x + 6, y); }
    c.stroke();
    if (SA.whale > 0 && SA.whale < 8) {
      const wx = 170 - SA.whale * 22;
      S.animal('paus', wx, 48, { flip: true, sx: 0.45, sy: 0.45 });
      if (Math.floor(SA.whale * 3) % 2) vec(wx - 4, 38, v => [-8, 0, 8].forEach(d => v.line(`M0 0 Q${d} -12 ${d * 2} -20`, '#e8f6fc', 3)));
    }
    if (SA.end) {
      const ix = Math.max(104, 190 - SA.end * 30);
      vec(ix + 20, 76, v => {
        v.ell(0, 0, 136, 34, '#f2cb8a'); v.ell(16, -14, 84, 22, '#62c24a');
        v.rect(48, -150, 34, 120, 8, '#ffffff'); [-134, -102, -70].forEach(y => v.rect(48, y, 34, 14, 2, '#e5443a', false));
        v.rect(42, -170, 46, 22, 8, '#47425a'); v.ell(65, -159, 14, 7, Math.floor(t * 3) % 2 ? '#ffd23a' : '#fff3b0', false);
      });
      S.treeArt(ix + 12, 70, 0.6);
    }
    for (const it of SA.items) {
      const y = SA_LANES[it.lane], x = it.x, bob = Math.sin(SA.t * 3 + it.x / 10);
      if (it.type === 'star') { vec(x, y - 6 + bob, v => v.ell(0, 0, 16, 16, 'rgba(255,243,176,0.7)', false)); star(x, y - 6 + bob, 0.9); }
      else if (it.type === 'fish') S.animal('ikan', x, y - Math.max(0, Math.sin(SA.t * 4 + it.x)) * 6, { flip: true, sx: 0.7, sy: 0.7 });
      else if (it.type === 'duck') S.animal('bebek', x, y + bob, { flip: true });
      else vec(x, y, v => {
        v.ell(0, 0, 34, 7, 'rgba(255,255,255,0.75)', false);
        v.fill('M-26 0 Q-30 -14 -16 -22 Q-2 -32 12 -24 Q28 -16 26 0 Z', '#9aa0ab');
        v.fill('M-24 -4 Q0 2 24 -4 Q24 0 22 0 H-22 Z', '#7f8590', false); v.hl(-8, -18, 7, 3.5);
      });
    }
    const tilt = SA.bump > 0 ? Math.sin(SA.bump * 30) : 0, bx = SA.end ? Math.min(90, 30 + SA.end * 15) : 30;
    if (!SA.done) vec(bx - 20, SA.by + 1, v => { for (let i = 0; i < 3; i++) { const k = (SA.t * 1.5 + i / 3) % 1; v.ell(-k * 60, 0, 10 + k * 14, 3, `rgba(255,255,255,${0.8 - k * 0.7})`, false); } });
    sailboat(bx, SA.by + Math.sin(SA.t * 2.5) + tilt, tilt);
    if (SA.done) for (let i = 0; i < 6; i++) { const a = t * 2 + i * 1.05; star(80 + Math.cos(a) * 52, 52 + Math.sin(a) * 30, 0.8, i % 2 ? '#ffd23a' : '#fff3b0'); }
  });

  // ---------- Luncurkan roket ----------
  function rocket(x, y, t, flame) {
    vec(x, y, v => {
      if (flame) { const f = Math.sin(t * 40) * 6; v.fill(`M-22 -12 Q0 ${70 + f} 22 -12 Z`, '#f39a3a', false); v.fill(`M-12 -12 Q0 ${44 + f} 12 -12 Z`, '#ffd23a', false); }
      v.fill('M-28 -104 L-58 -40 Q-60 -26 -46 -28 L-26 -36 Z', '#e5443a'); v.fill('M28 -104 L58 -40 Q60 -26 46 -28 L26 -36 Z', '#e5443a');
      v.rect(-18, -40, 36, 30, 6, '#47425a');
      v.fill('M0 -344 Q36 -300 30 -200 V-36 H-30 V-200 Q-36 -300 0 -344 Z', '#ffffff');
      v.fill('M0 -344 Q26 -312 28 -284 H-28 Q-26 -312 0 -344 Z', '#e5443a');
      v.rect(-30, -110, 60, 14, 0, '#e5443a', false); v.rect(-30, -200, 60, 8, 0, '#3f7ee0', false);
      v.ell(0, -240, 15, 15, '#9aa0ab'); v.ell(0, -240, 10, 10, '#8fd0f2', false); v.hl(-4, -244, 3, 2);
      v.rect(16, -330, 8, 290, 4, 'rgba(58,38,22,0.12)', false); v.rect(-24, -320, 6, 270, 3, 'rgba(255,255,255,0.7)', false);
    });
  }
  S.wrapPanel('launch', LA, (c, t) => {
    const f = LA.fly, up = Math.max(0, f - 0.6) ** 2 * 26, dark = Math.min(1, Math.max(0, (f - 1.2) / 1.6));
    c.fillStyle = grad(c, 0, 110, mix('#8fd0f2', '#0e1226', dark), mix('#e2f4fc', '#1c2450', dark)); c.fillRect(0, 0, 160, 110);
    if (dark > 0.3) {
      c.fillStyle = `rgba(255,255,255,${Math.min(1, (dark - 0.3) * 2)})`;
      for (let i = 0; i < 34; i++) { const h = k => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
        c.beginPath(); c.arc(h(1) * 160, (h(2) * 110 + f * 30) % 110, 0.35 + h(3) * 0.5, 0, 7); c.fill(); }
      c.globalAlpha = Math.min(1, (dark - 0.3) * 1.6);
      vec(126, 26 + f * 4, v => { v.ell(0, 0, 40, 40, '#f2ecd8'); v.ell(-12, -10, 9, 8, '#ddd4bc', false); v.ell(14, 8, 12, 10, '#ddd4bc', false); v.ell(-6, 18, 6, 5, '#ddd4bc', false); });
      c.globalAlpha = 1;
    }
    const gy = 96 + up;
    if (gy < 124) {
      c.fillStyle = '#c9c1b6'; c.fillRect(0, gy, 160, 30); c.fillStyle = '#ddd6cc'; c.fillRect(0, gy, 160, 1.5);
      vec(99, gy, v => { v.rect(-12, -304, 24, 304, 4, '#e5443a'); for (let y = -296; y < -30; y += 32) v.line(`M-10 ${y} L10 ${y + 28}`, '#b8302a', 3); v.rect(-46, -244, 36, 12, 4, '#e5443a'); });
      if (LA.step !== 'fly') { me(44, gy, { dir: 'right', scale: 1.15 }); if (G.boy.helmet) drawHelmet(S.NUL, 44, gy); }
    }
    if (LA.step === 'fly' && f > 0.3) for (let i = 0; i < 10; i++) { const k = (f * 2 + i * 0.1) % 1; vec(76 + Math.sin(i * 2.3) * 20 * k, gy - 2 + k * 6, v => v.ell(0, 0, 12 + k * 24, 12 + k * 24, `rgba(236,236,240,${0.8 - k * 0.6})`, false)); }
    rocket(76, 96 - up + (LA.step === 'fly' && f < 0.6 ? Math.sin(f * 60) : 0), t, LA.step === 'fly');
    if (LA.step === 'count' && Math.floor(t * 2) % 2) star(120, 30, 1.1);
  });

  // ---------- Potong rambut ----------
  S.wrapPanel('haircut', HC, (c, t) => {
    c.fillStyle = '#f8e4ea'; c.fillRect(0, 0, 160, 110);
    c.fillStyle = '#f2d6de'; for (let x = 0; x < 160; x += 12) c.fillRect(x, 0, 6, 110);
    vec(80, 52, v => {
      v.rect(-244, -186, 488, 372, 24, '#e0b878'); v.rect(-228, -170, 456, 340, 16, '#dff1fb');
      v.line('M-170 -150 L-120 -80 M-150 -150 L-110 -94', 'rgba(255,255,255,0.8)', 6);
      for (let x = -216; x <= 216; x += 54) { v.ell(x, -186, 9, 9, '#fff3b0'); v.ell(x - 2, -188, 3, 3, '#ffffff', false); }
    });
    const cx = 80, by = 106, s = 2.6;
    me(cx, by, { scale: s });
    vec(cx, by, v => {
      v.fill('M-20 -54 Q0 -60 20 -54 Q30 -46 31 -24 L33 6 H-33 L-31 -24 Q-30 -46 -20 -54 Z', '#3f7ee0');
      v.line('M-14 -44 Q-17 -20 -19 6 M0 -46 V6 M14 -44 Q17 -20 19 6', 'rgba(44,96,184,0.8)', 2); v.hl(-20, -40, 4, 8);
      v.fill('M-8 -56 Q0 -50 8 -56 L0 -47 Z', '#ffffff');
    }, { s });
    const head = (dx, dy, fn) => vec(cx + dx * s / 4, by + dy * s / 4, fn, { s });
    if (HC.step === 'wash' || (HC.step === 'style' && HC.n === 0)) {
      head(0, 0, v => [[-12, -90, 10], [-2, -96, 12], [10, -92, 10], [-18, -80, 8], [16, -80, 8]].forEach(([a, b, r]) => { v.ell(a, b, r, r, '#ffffff'); v.hl(a - 3, b - 3, r * 0.3, r * 0.2); }));
      if (HC.fx > 0) for (let i = 0; i < 4; i++) head(-24 + i * 16, -110 - HC.fx * 24, v => v.ell(0, 0, 4, 4, '#cfefff', false));
    }
    if (HC.step === 'cut') {
      const a = Math.floor(t * 8) % 2 ? 0.32 : 0.08;
      head(34, -84 + Math.sin(t * 4) * 8, v => {
        for (const s of [-1, 1]) {
          const tx = -26 * Math.cos(a), ty = -26 * Math.sin(a) * s;
          v.fill(`M3 ${-2 * s} L${tx} ${ty} L${tx + 2} ${ty + 4 * s} L2 ${3 * s} Z`, '#c9d0d8');
          v.line(`M0 0 L${12} ${7 * s}`, '#e5443a', 3.5);
          v.c.lineWidth = 3; v.c.strokeStyle = '#e5443a'; v.c.beginPath(); v.c.arc(17, 9 * s, 5, 0, 7); v.c.stroke();
        }
        v.ell(0, 0, 2.5, 2.5, '#47425a', false);
      });
    }
    if (HC.step === 'dry') head(40, -88, v => {
      v.rect(-4, -12, 30, 18, 7, '#e5443a'); v.rect(14, 4, 9, 22, 4, '#b8302a'); v.hl(4, -8, 6, 2);
      for (let i = 0; i < 3; i++) { const k = (t * 3 + i / 3) % 1; v.line(`M${-8 - k * 24} ${-6 + i * 5} h-8`, '#8fd0f2', 2.5); }
    });
    c.strokeStyle = '#5e3720'; c.lineWidth = 0.9;
    for (const b of HC.bits) { const x = b.x * 3, y = b.y * 3 + 30, w = Math.sin(b.life * 9) * 0.8; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 1.3, y + w, x + 2.6, y + 0.4); c.stroke(); }
    if (HC.step === 'done') for (let i = 0; i < 6; i++) { const a = t * 2 + i * 1.05; star(80 + Math.cos(a) * 46, 48 + Math.sin(a) * 30, 0.8, i % 2 ? '#ffd23a' : '#fff3b0'); }
    if ((HC.step === 'wash' || HC.step === 'cut' || HC.step === 'dry') && Math.floor(t * 2.5) % 2) star(128, 20, 1.1);
  });

  // ---------- Mesin tiket ----------
  function ticketArt(x, y, dest) {
    vec(x, y, v => {
      v.rect(-76, 0, 152, 80, 10, '#fff6d8'); v.rect(-76, 0, 152, 18, 8, '#e5443a', false);
      v.line('M24 24 V76', '#c9a873', 3); v.line('M-64 32 H-36 M-64 46 H-28 M-64 60 H-40', '#c9a873', 4);
    });
    const im = dest && S.stickerImg(dest);
    if (im) S.ctx.drawImage(im, x + 6, y + 6, 13, 13);
  }
  S.wrapPanel('ticket', TK, (c, t) => {
    c.fillStyle = '#efe8d8'; c.fillRect(0, 0, 160, 84);
    c.strokeStyle = '#e2d9c4'; c.lineWidth = 0.4; c.beginPath();
    for (let y = 0; y < 84; y += 14) { c.moveTo(0, y); c.lineTo(160, y); for (let x = (y / 14 % 2) * 10; x < 160; x += 20) { c.moveTo(x, y); c.lineTo(x, y + 14); } }
    c.stroke();
    c.fillStyle = '#dcd6cc'; c.fillRect(0, 84, 160, 26);
    vec(80, 101, v => {
      v.ell(0, 0, 184, 16, 'rgba(58,38,22,0.18)', false);
      v.rect(-172, -392, 344, 392, 22, '#3f7ee0'); v.rect(-160, -380, 14, 360, 7, 'rgba(255,255,255,0.4)', false);
      v.rect(-136, -360, 240, 144, 14, '#2e3d4a'); v.rect(-128, -352, 224, 128, 10, TK.dest ? '#e8f6fc' : '#cfe8f5', false);
      v.rect(24, -196, 88, 52, 10, '#2c60b8'); v.rect(28, -192, 80, 44, 8, '#d9dfe8', false); v.rect(64, -186, 8, 32, 3, '#2e3d4a', false);
      v.rect(-136, -116, 272, 88, 12, '#2e3d4a'); v.rect(-120, -100, 240, 10, 4, '#1f2830', false);
    });
    if (TK.dest) { const im = S.stickerImg(TK.dest); if (im) c.drawImage(im, 61, 14, 30, 30); }
    else { c.fillStyle = Math.floor(t * 2) % 2 ? '#3f7ee0' : '#2c60b8'; c.font = 'bold 26px Andika, sans-serif'; c.textAlign = 'center'; c.fillText('?', 76, 39); }
    if (TK.step === 'coin') { if (Math.floor(t * 2.5) % 2) vec(75, 58, v => v.ell(0, 0, 28, 28, 'rgba(255,243,176,0.8)', false)); vec(75, 58, v => { v.ell(0, 0, 20, 20, '#ffd23a'); v.line('M0 -10 V10', '#e8b02a', 4); v.hl(-6, -6, 5, 3); }); }
    if (TK.step === 'take' && TK.t < 0.5) { const p = TK.t / 0.5; vec(75 + p * 22, 58, v => v.ell(0, 0, 16, 16, '#ffd23a')); }
    if (TK.step === 'take') {
      const p = Math.min(1, Math.max(0, (TK.t - 0.4) / 0.7));
      ticketArt(80, 56 + p * 19, TK.dest);
      vec(80, 101, v => v.rect(-136, -116, 272, 12, 6, '#2e3d4a', false));
      if (p >= 1 && Math.floor(t * 3) % 2) { star(110, 72); star(52, 80); }
    }
  });

  // ---------- umum ----------
  const tapHint = (x, y, t) => { if (Math.floor(t * 2) % 2) vec(x, y, v => v.fill('M-7 -22 H7 V-8 H15 L0 8 L-15 -8 H-7 Z', '#ffd23a')); };
  const starRing = (t, cx, cy, rx, ry, n = 6) => { for (let i = 0; i < n; i++) { const a = t * 2 + i * Math.PI * 2 / n; star(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 0.8, i % 2 ? '#ffd23a' : '#fff3b0'); } };
  const plate = (x, y, w, col = '#ffffff') => vec(x, y, v => { v.ell(0, 0, w * 4, w * 1.1, col); v.ell(0, -1, w * 3.1, w * 0.62, col === '#ffffff' ? '#e8eef2' : '#ffffff', false); });
  const lines = (c, col, w, segs) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (const [x0, y0, x1, y1] of segs) { c.moveTo(x0, y0); c.lineTo(x1, y1); } c.stroke(); };

  // ---------- Memasak ----------
  function kitchenBg(c) {
    c.fillStyle = '#f6ecd6'; c.fillRect(0, 0, 160, 74);
    const tiles = [];
    for (let y = 0; y < 74; y += 12) { tiles.push([0, y, 160, y]); for (let x = (y / 12 % 2) * 6; x < 160; x += 12) tiles.push([x, y, x, y + 12]); }
    lines(c, '#e6d8bc', 0.4, tiles);
    vec(31, 36, v => {
      v.rect(-76, -120, 152, 120, 8, '#9a5a2c');
      v.rect(-68, -112, 136, 104, 4, G.night ? '#26305e' : '#8fd0f2', false);
      if (!G.night) { v.fill('M-68 -30 Q-30 -48 10 -34 Q40 -44 68 -36 V-8 H-68 Z', '#7cc85a', false); v.ell(36, -84, 10, 10, '#ffd23a', false); v.ell(-28, -88, 18, 5, '#ffffff', false); }
      else v.ell(36, -84, 8, 8, '#fff3b0', false);
      v.rect(-4, -112, 8, 104, 2, '#9a5a2c', false); v.rect(-68, -64, 136, 8, 2, '#9a5a2c', false);
      v.rect(-84, -8, 168, 10, 4, '#c98a4a');
      v.fill('M-80 -126 H-42 Q-46 -92 -58 -60 Q-70 -64 -80 -60 Z', '#e8735a'); v.fill('M80 -126 H42 Q46 -92 58 -60 Q70 -64 80 -60 Z', '#e8735a');
      v.line('M-70 -122 Q-72 -92 -72 -64 M-58 -122 Q-58 -96 -64 -64 M70 -122 Q72 -92 72 -64 M58 -122 Q58 -96 64 -64', 'rgba(180,70,50,0.5)', 2);
      v.rect(-88, -130, 176, 8, 4, '#9a5a2c');
    });
    vec(128, 25, v => {
      v.rect(-96, -6, 192, 10, 3, '#9a5a2c');
      [[-72, '#e5443a'], [-24, '#ffd23a'], [24, '#46b04a'], [72, '#3f7ee0']].forEach(([x, k]) => { v.rect(x - 14, -44, 28, 38, 8, k); v.rect(x - 10, -52, 20, 10, 3, '#fff6e0'); v.hl(x - 6, -30, 3, 7); });
    });
    c.fillStyle = 'rgba(60,35,20,0.16)'; c.fillRect(0, 71, 160, 3);
    c.fillStyle = '#b27a45'; c.fillRect(0, 74, 160, 36); c.fillStyle = '#d39b5f'; c.fillRect(0, 74, 160, 2.5);
    lines(c, 'rgba(122,74,34,0.35)', 0.5, [[8, 84, 34, 84], [46, 92, 80, 92], [96, 86, 118, 86], [126, 96, 150, 96], [18, 100, 48, 100], [80, 101, 100, 101]]);
  }
  function pot(x, y, col) {
    vec(x, y, v => {
      v.ell(0, 4, 120, 12, 'rgba(58,38,22,0.2)', false);
      v.rect(-120, -66, 26, 12, 6, '#47425a'); v.rect(94, -66, 26, 12, 6, '#47425a');
      v.fill('M-96 -80 H96 V-18 Q96 0 78 0 H-78 Q-96 0 -96 -18 Z', '#9aa0ab');
      v.rect(-84, -66, 14, 56, 7, 'rgba(255,255,255,0.35)', false); v.rect(64, -66, 20, 58, 9, 'rgba(58,38,22,0.12)', false);
      v.rect(-102, -88, 204, 14, 7, '#c6d0da');
      v.ell(0, -80, 88, 7, col, false);
    });
  }
  const BIT = { tomato: '#e5443a', carrot: '#f39a3a', apple: '#ff9a8a', egg: '#fff3b0', water: '#cfefff' };
  S.wrapPanel('cook', CK, (c, t) => {
    kitchenBg(c);
    if (!CK.rec) { S.personArt(80, 98, { look: 'mom', dir: 'down', mood: 'happy', noShadow: true, scale: 1.25 }); pot(122, 98, '#f6d35a'); return; }
    const r = COOK[CK.rec], step = r.steps[CK.i], A = r.ing[0], B = r.ing[1] || r.ing[0];
    if (CK.done > 0) {
      if (CK.rec !== 'tomatoegg') plate(80, 94, 34);
      S.drawPic(CK.rec, 80, CK.rec === 'tomatoegg' ? 96 : 92, 30);
      starRing(t, 80, 50, 46, 24);
      return;
    }
    if (step === 'washveg') {
      vec(80, 98, v => { v.ell(0, 0, 140, 36, '#c9d0d8'); v.ell(0, -6, 122, 26, '#5fb3e0', false); v.hl(-60, -12, 18, 4); });
      S.drawPic(A, 66, 92 - (CK.flash > 0 ? 6 : 0), 20); S.drawPic(B, 96, 92, 20);
      vec(80, 36, v => { v.rect(-24, -40, 52, 14, 6, '#9aa0ab'); v.rect(14, -34, 12, 26, 5, '#9aa0ab'); v.ell(-18, -44, 8, 5, '#e5443a'); });
      c.fillStyle = '#7cc4f0'; for (let i = 0; i < 8; i++) { c.beginPath(); c.ellipse(83 + (i % 3) * 1.2, 38 + ((t * 70 + i * 7) % 46), 0.7, 1.6, 0, 0, 7); c.fill(); }
      if (CK.flash > 0) for (let i = 0; i < 5; i++) vec(58 + i * 11, 82 - i % 2 * 6, v => v.ell(0, 0, 5, 5, '#e2f6ff'));
    } else if (step === 'cut') {
      vec(80, 99, v => { v.rect(-164, -50, 328, 50, 12, '#e0bf8e'); v.rect(-150, -42, 300, 6, 3, 'rgba(255,255,255,0.35)', false); v.ell(140, -25, 7, 7, '#c49a64', false); });
      if (CK.n === 0) S.drawPic(A, 72, 94, 22);
      else for (let i = 0; i <= CK.n; i++) S.drawPic(A, 50 + i * 20, 94, 14, { rot: (i % 2 ? 0.2 : -0.15) });
      const ky = CK.flash > 0 ? 62 : 44, kx = 63 + CK.n * 20;
      vec(kx, ky, v => { v.rect(-8, -50, 16, 50, 6, '#9a5a2c'); v.fill('M-6 0 H8 Q12 70 -6 104 Z', '#e8eef2'); v.line('M4 6 Q6 60 -4 96', 'rgba(255,255,255,0.9)', 2); });
    } else if (step === 'stir' || step === 'boil') {
      const boil = step === 'boil', col = CK.rec === 'carrotsoup' ? '#f39a3a' : CK.rec === 'applejuice' ? '#f4c23a' : '#f6d35a';
      if (boil) {
        vec(80, 107, v => { v.rect(-150, -44, 300, 44, 8, '#47425a'); v.rect(-140, -40, 280, 6, 3, '#6a6478', false); });
        const fl = CK.wait > 0 ? 1 : 0.5;
        for (let i = 0; i < 8; i++) { const h = (5 + Math.sin(t * 14 + i * 2) * 2) * fl; vec(52 + i * 8, 97, v => { v.fill(`M-7 0 Q-8 ${-h * 2} 0 ${-h * 4} Q8 ${-h * 2} 7 0 Z`, '#f39a3a', false); v.fill(`M-4 0 Q-4 ${-h * 1.2} 0 ${-h * 2.4} Q4 ${-h * 1.2} 4 0 Z`, '#ffd23a', false); }); }
      }
      const py = boil ? 94 : 100;
      pot(80, py, col);
      const by = py - 20, turn = t * 2 + CK.n * 2;
      for (let i = 0; i < 6; i++) { const a = turn + i * 1.05, kind = i % 2 ? A : B; vec(80 + Math.cos(a) * 16, by + Math.sin(a) * 1.4, v => v.ell(0, 0, 6, 4, BIT[kind] || '#ffffff')); }
      if (!boil) { const sx = 80 + Math.cos(turn) * 12; vec(sx, by, v => { v.line('M0 0 L6 -150', '#c98a4a', 7); v.ell(0, 2, 9, 6, '#a8743c'); }); }
      if (boil) for (let i = 0; i < 4; i++) { const k = (t * 0.7 + i / 4) % 1; c.globalAlpha = 0.8 * (1 - k); vec(64 + i * 10, by - 6 - k * 26, v => v.line('M0 0 Q-6 -8 0 -16 Q6 -24 0 -32', '#ffffff', 3)); c.globalAlpha = 1; }
      if (CK.wait > 0) for (let i = 0; i < 5; i++) { const k = (t * 1.6 + i / 5) % 1; vec(64 + i * 8, by - k * 3, v => v.ell(0, 0, 3 + k * 3, 3 + k * 3, 'rgba(255,255,255,0.8)', false)); }
    } else {
      if (CK.rec !== 'tomatoegg') plate(80, 96, 28);
      S.drawPic(CK.rec, 80, CK.rec === 'tomatoegg' ? 98 : 94, 24);
    }
    if (!CK.wait && CK.done <= 0) tapHint(142, 46, t);
  });

  // ---------- Kamar Russel ----------
  // hiasan kamar (juga dipakai stiker & pasar lewat drawDecor)
  const DECOR_ART = {
    bear: v => {
      v.ell(-16, -6, 8, 6, '#a8743c'); v.ell(16, -6, 8, 6, '#a8743c');
      v.ell(0, -20, 18, 18, '#c98a4a'); v.ell(0, -16, 10, 9, '#e8c49a', false);
      v.ell(-19, -24, 6, 9, '#a8743c'); v.ell(19, -24, 6, 9, '#a8743c');
      v.ell(-14, -64, 7, 7, '#a8743c'); v.ell(14, -64, 7, 7, '#a8743c'); v.ell(-14, -64, 3.5, 3.5, '#e8c49a', false); v.ell(14, -64, 3.5, 3.5, '#e8c49a', false);
      v.ell(0, -50, 19, 17, '#c98a4a'); v.ell(0, -44, 8, 6, '#e8c49a', false);
      v.ell(-7, -54, 2, 2.4, '#3a2616', false); v.ell(7, -54, 2, 2.4, '#3a2616', false); v.ell(0, -47, 2.5, 2, '#3a2616', false);
      v.fill('M0 -34 L-10 -40 V-28 Z M0 -34 L10 -40 V-28 Z', '#e5443a'); v.hl(-8, -60, 4, 2.5);
    },
    toytrain: v => {
      v.rect(-36, -30, 56, 22, 5, '#e5443a'); v.rect(-38, -50, 24, 24, 4, '#b8302a'); v.rect(-33, -45, 13, 10, 2, '#fff3dc', false);
      v.rect(6, -44, 8, 14, 2, '#47425a'); v.rect(20, -20, 6, 8, 2, '#ffd23a');
      for (const wx of [-24, 8]) { v.ell(wx, -8, 8, 8, '#47425a'); v.ell(wx, -8, 3, 3, '#d6ccbe', false); }
    },
    toyrobot: v => {
      v.rect(-12, -10, 8, 10, 2, '#47425a'); v.rect(4, -10, 8, 10, 2, '#47425a');
      v.rect(-16, -34, 32, 24, 6, '#c9d4e0'); v.rect(-8, -28, 16, 8, 3, '#3f7ee0', false);
      v.rect(-16, -58, 32, 24, 6, '#e8eef2'); v.rect(-12, -54, 24, 13, 3, '#2e3d4a', false); v.ell(-5, -48, 2.5, 2.5, '#7cf0c4', false); v.ell(5, -48, 2.5, 2.5, '#7cf0c4', false);
      v.line('M0 -58 V-68', '#8f99a6', 2.5); v.ell(0, -70, 3.5, 3.5, '#e5443a');
    },
    lamp: v => {
      v.rect(-28, -40, 56, 40, 6, '#a8743c'); v.rect(-32, -44, 64, 9, 4, '#d39b5f'); v.ell(0, -22, 4, 4, '#ffd23a', false);
      v.line('M0 -44 V-74', '#5a3a22', 3);
      if (G.night) v.ell(0, -84, 40, 30, 'rgba(255,232,140,0.35)', false);
      v.fill('M-12 -102 H12 L28 -72 H-28 Z', '#ffd23a'); v.hl(-10, -88, 3, 8);
    },
    rug: v => { v.ell(0, -20, 104, 28, '#e5443a'); v.ell(0, -20, 86, 20, '#ffd23a', false); v.ell(0, -20, 66, 12, '#3f7ee0', false); },
    painting: v => {
      v.rect(-44, -68, 88, 68, 5, '#9a5a2c'); v.rect(-36, -60, 72, 52, 2, '#8fd0f2', false);
      v.fill('M-36 -8 L-10 -40 L8 -20 L18 -30 L36 -12 V-8 Z', '#46b04a', false); v.rect(-36, -16, 72, 8, 0, '#7cc85a', false);
      v.ell(20, -48, 7, 7, '#ffd23a', false);
    },
    potplant: v => {
      v.ell(0, -60, 20, 18, '#3fa83a'); v.ell(-16, -48, 12, 11, '#46b04a'); v.ell(16, -48, 12, 11, '#2f8a2c'); v.hl(-6, -68, 5, 3);
      v.fill('M-20 -32 H20 L16 0 H-16 Z', '#c9673a'); v.rect(-24, -38, 48, 9, 3, '#e08a5a');
    },
  };
  S.hook('drawDecor', (x, y, k, t) => (DECOR_ART[k] ? vec(x, y, DECOR_ART[k]) : false));
  function decorArt(k, x, y, t) {
    if (k === 'toyrobot') y -= Math.floor(t * 6) % 2;
    if (DECOR_ART[k]) vec(x, y, DECOR_ART[k]);
  }
  S.wrapPanel('room', RM, (c, t) => {
    c.fillStyle = '#cfe8f0'; c.fillRect(0, 0, 160, 58);
    c.fillStyle = '#c2e0ea'; for (let i = 6; i < 160; i += 12) c.fillRect(i, 0, 2, 48);
    c.fillStyle = '#f4f7f2'; c.fillRect(0, 48, 160, 8); c.fillStyle = '#ffffff'; c.fillRect(0, 48, 160, 0.8);
    c.fillStyle = '#a8865a'; c.fillRect(0, 56, 160, 2);
    c.fillStyle = '#dbb26c'; c.fillRect(0, 58, 160, 32);
    const pl = [];
    for (let y = 58, row = 0; y < 90; y += 7, row++) { pl.push([0, y, 160, y]); for (let x = (row % 2) * 17; x < 160; x += 34) pl.push([x, y, x, y + 7]); }
    lines(c, '#c29a56', 0.5, pl);
    c.fillStyle = 'rgba(50,30,15,0.16)'; c.fillRect(0, 58, 160, 1.5);
    if (!G.night) { c.fillStyle = 'rgba(255,244,205,0.28)'; c.beginPath(); c.moveTo(76, 60); c.lineTo(102, 60); c.lineTo(110, 82); c.lineTo(84, 82); c.fill(); }
    vec(88, 32, v => {
      v.rect(-64, -96, 128, 96, 8, '#9a5a2c'); v.rect(-56, -88, 112, 80, 4, G.night ? '#26305e' : '#8fd0f2', false);
      if (!G.night) { v.fill('M-56 -30 Q-10 -46 56 -28 V-8 H-56 Z', '#7cc85a', false); v.ell(-20, -72, 16, 4, '#ffffff', false); }
      else { v.ell(30, -66, 7, 7, '#fff3b0', false); [[-30, -70], [-6, -50], [10, -76]].forEach(([a, b]) => v.ell(a, b, 1.6, 1.6, '#ffffff', false)); }
      v.rect(-4, -88, 8, 80, 2, '#9a5a2c', false); v.rect(-56, -52, 112, 8, 2, '#9a5a2c', false);
      v.rect(-72, -2, 144, 8, 4, '#c98a4a');
      v.fill('M-74 -104 H-42 Q-44 -70 -56 -40 Q-66 -44 -74 -40 Z', '#f6a8c8'); v.fill('M74 -104 H42 Q44 -70 56 -40 Q66 -44 74 -40 Z', '#f6a8c8');
      v.rect(-80, -108, 160, 8, 4, '#9a5a2c');
    });
    vec(22, 70, v => {
      v.rect(-72, -104, 144, 40, 10, '#9a5a2c'); v.rect(-64, -96, 128, 6, 3, '#c98a4a', false);
      v.rect(-64, -80, 128, 72, 8, '#fbf8f0');
      v.rect(-52, -82, 104, 22, 10, '#ffffff');
      v.fill('M-66 -56 H66 V-10 Q66 -4 60 -4 H-60 Q-66 -4 -66 -10 Z', '#3f7ee0');
      v.rect(-66, -58, 132, 8, 4, '#dfe9fa', false);
      for (let yy = -42; yy < -6; yy += 14) for (let xx = -54 + (yy % 28 ? 14 : 0); xx < 60; xx += 28) v.ell(xx, yy, 5, 5, '#7aa4ea', false);
      v.rect(-72, -12, 144, 14, 6, '#9a5a2c');
    });
    Object.keys(DECOR).filter(k => DECOR[k].flat && roomHas(k)).forEach(k => decorArt(k, DECOR[k].at[0], DECOR[k].at[1], t));
    const back = [], front = [];
    Object.keys(DECOR).filter(k => !DECOR[k].flat && roomHas(k)).forEach(k => { const [x, y] = decorPos(k, t); (y < 76 ? back : front).push([k, x, y]); });
    back.forEach(([k, x, y]) => decorArt(k, x, y, t));
    me(76, 77, { frame: 0 });
    front.forEach(([k, x, y]) => decorArt(k, x, y, t));
  });

  // ---------- Membuat sushi ----------
  const PLATE_NEW = { salmon: '#3f7ee0', tuna: '#e5443a', shrimp: '#ffd23a', eggsushi: '#46b04a', cucumber: '#f6a8c8', gunkan: '#9b7fe0', tamagoroll: '#f39a3a' };
  S.wrapPanel('sushi', SU, (c, t) => {
    c.fillStyle = '#dcbc8c'; c.fillRect(0, 0, 160, 66);
    lines(c, '#c4a070', 0.5, [11, 33, 55, 77, 99, 121, 143].map(x => [x, 0, x, 66]));
    vec(80, 14, v => {
      v.rect(-184, -60, 368, 60, 4, '#2f4a7a'); v.rect(-184, -60, 368, 8, 4, '#24395e', false);
      for (let x = -112; x <= 112; x += 72) v.line(`M${x} -24 V0`, '#24395e', 3);
      [-96, 0, 96].forEach(x => { v.fill(`M${x - 18} -30 Q${x} -44 ${x + 14} -30 L${x + 22} -38 V-22 L${x + 14} -30 Q${x} -16 ${x - 18} -30 Z`, '#ffffff', false); v.ell(x - 8, -31, 2, 2, '#2f4a7a', false); });
    });
    [16, 144].forEach(x => vec(x, 26, v => {
      v.rect(-10, -40, 20, 8, 3, '#47425a'); v.rect(-10, 32, 20, 8, 3, '#47425a');
      v.ell(0, 0, 30, 34, '#e5443a'); v.line('M-28 -10 Q0 -14 28 -10 M-28 10 Q0 14 28 10', '#b8302a', 2.5); v.hl(-12, -14, 6, 9);
    }));
    c.fillStyle = 'rgba(60,35,20,0.22)'; c.fillRect(0, 64, 160, 2);
    c.fillStyle = '#a87c50'; c.fillRect(0, 66, 160, 44); c.fillStyle = '#c49868'; c.fillRect(0, 66, 160, 2.5);
    vec(80, 89, v => {
      v.rect(-176, -60, 352, 120, 6, '#a8c060');
      for (let x = -168; x < 176; x += 12) v.line(`M${x} -58 V58`, '#8aa848', 2);
      v.rect(-176, -60, 352, 7, 3, '#6f8a3a', false); v.rect(-176, 53, 352, 7, 3, '#6f8a3a', false);
    });
    vec(80, 92, v => v.ell(0, 0, 100, 22, 'rgba(30,40,10,0.22)', false));
    const k = SU.kind, done = suDone(), has = a => done.includes(a), last = done[done.length - 1], fresh = SU.drop;
    const full = !!k && done.length === suSteps().length - 1, now = SU.step === 'make' ? suSteps()[SU.i] : null;
    // satu bagian sushi di tikar; bagian terbaru masuk dengan jatuh ('drop') atau muncul pelan ('fade')
    const part = (fn, a, mode, alpha = 1) => {
      const isNew = a === last && fresh > 0, dy = isNew && mode === 'drop' ? -fresh * fresh * 60 : 0;
      c.globalAlpha = alpha * (isNew && mode === 'fade' ? 1 - fresh : 1);
      vec(80, 90, v => fn(v, dy), { s: 2.6 });
      c.globalAlpha = 1;
    };
    if (SU.step === 'done') plate(80, 94, 36, PLATE_NEW[k] || '#ffffff');
    if (now === 'rice' && SU.n === 1) [[-8, -2], [0, -4], [8, -2], [-4, -7], [4, -7]].forEach(([a, b]) => vec(80 + a, 88 + b, v => { v.ell(0, 0, 18, 16, '#ffffff'); v.ell(-6, -4, 3, 1.6, '#ece8da', false); v.ell(5, 3, 3, 1.6, '#ece8da', false); }));
    if (k === 'cucumber' || k === 'tamagoroll') {
      // digulung: gambar sebelum digulung pelan-pelan berganti menjadi gulungan
      const sheet = v => v.rect(-46, -10, 92, 10, 3, '#1f3a2a'), riceLayer = v => v.rect(-42, -15, 84, 7, 3, '#ffffff');
      const omelet = (v, dy) => { v.ell(0, -5 + dy, 40, 8, '#ffd23a'); v.hl(-14, -8 + dy, 8, 2); };
      if (full) {
        if (fresh > 0) part(v => { if (k === 'cucumber') { sheet(v); riceLayer(v); v.rect(-34, -21, 68, 7, 3.5, '#58bb44'); } else omelet(v, 0); }, null, null, fresh);
        part(v => SUSHI_PARTS_FULL(v, k), last, 'fade');
      } else if (k === 'cucumber') {
        if (has('seaweed')) part(sheet, 'seaweed', 'fade');
        if (has('rice')) part(riceLayer, 'rice', 'fade');
      } else if (has('egg')) part(omelet, 'egg', 'drop');
    } else if (k) {
      if (has('rice')) part(v => { v.ell(0, -9, 26, 10, '#ffffff'); v.ell(-10, -8, 3, 1.5, '#ece8da', false); v.ell(8, -6, 3, 1.5, '#ece8da', false); }, 'rice', 'fade');
      if (has('egg')) part((v, dy) => { v.rect(-28, -30 + dy, 56, 14, 4, '#ffd23a'); v.hl(-18, -26 + dy, 5, 1.6); }, 'egg', 'drop');
      if (has('seaweed') && k === 'eggsushi') part(v => v.rect(-6, -32, 12, 30, 2, '#1f3a2a'), 'seaweed', 'fade');
      if (has('seaweed') && k === 'gunkan') part(v => { v.rect(-24, -28, 48, 28, 6, '#1f3a2a'); v.rect(-20, -26, 5, 24, 2, '#35574a', false); v.ell(0, -28, 22, 5, '#ffffff', false); }, 'seaweed', 'fade');
      if (has('gunkan')) part((v, dy) => [[-14, -31], [-6, -33], [2, -31], [10, -33], [16, -30], [-10, -36], [6, -37], [-2, -39]].forEach(([a, b]) => v.ell(a, b + dy, 4, 4, '#f39a3a')), 'gunkan', 'drop');
      if (['salmon', 'tuna', 'shrimp'].includes(k) && has(k)) part((v, dy) => FISH_TOP(v, k, dy), k, 'drop');
    }
    // bahan untuk langkah berikutnya menunggu di sisi tikar
    if (now === 'rice') vec(34, 96, v => { v.rect(-40, -26, 80, 26, 8, '#c98a4a'); v.line('M-40 -14 H40', '#9a5a2c', 3); v.ell(0, -26, 36, 8, '#ffffff'); }, { s: 1.4 });
    else if (now === 'seaweed') vec(34, 96, v => { v.rect(-30, -8, 60, 8, 2, '#1f3a2a'); v.rect(-28, -14, 60, 7, 2, '#2a4a36'); }, { s: 1.4 });
    else if (now === 'egg') S.drawPic('egg', 34, 96, 12);
    else if (now === 'gunkan') vec(34, 96, v => { v.fill('M-24 -16 H24 Q22 0 0 0 Q-22 0 -24 -16 Z', '#ffffff'); [[-10, -18], [-2, -20], [6, -18], [12, -20], [2, -16]].forEach(([a, b]) => v.ell(a, b, 4, 4, '#f39a3a')); }, { s: 1.4 });
    else if (now === 'cucumber') vec(34, 96, v => { v.rect(-34, -8, 68, 8, 4, '#58bb44'); v.rect(-30, -6, 60, 3, 1.5, '#c8eab0', false); }, { s: 1.4 });
    else if (['salmon', 'tuna', 'shrimp'].includes(now)) vec(34, 100, v => FISH_TOP(v, now, 0), { s: 1.3 });
    else if (now === 'plate') plate(34, 96, 13, PLATE_NEW[k] || '#ffffff');
    if (SU.step === 'make' && Math.floor(t * 2.5) % 2) star(118, 74, 1.1);
    if (SU.step === 'done') starRing(t, 80, 62, 52, 26);
    vec(132, 106, v => { v.line('M0 0 L-2 -104', '#7d5230', 7); v.line('M14 0 L12 -104', '#a8743c', 7); });
  });
  // ikan di atas nasi (sama dengan gambar sushi di skin.js)
  const FISH_COL = { salmon: ['#f59a6a', 'rgba(255,230,210,0.9)'], tuna: ['#e5443a', null], shrimp: ['#f7a27a', 'rgba(255,245,235,0.95)'] };
  function FISH_TOP(v, k, dy) {
    const [top, line] = FISH_COL[k];
    if (k === 'shrimp') v.fill(`M28 ${dy - 16} L40 ${dy - 26} L38 ${dy - 12} Z`, '#e5443a');
    v.fill(`M-30 ${dy - 12} Q-28 ${dy - 27} 0 ${dy - 27} Q28 ${dy - 27} 30 ${dy - 12} Q14 ${dy - 17} 0 ${dy - 17} Q-14 ${dy - 17} -30 ${dy - 12} Z`, top);
    if (line) v.line(`M-16 ${dy - 24} l6 6 M-4 ${dy - 26} l6 7 M8 ${dy - 25} l6 6`, line, 2);
    v.hl(-12, dy - 23, 5, 1.6);
  }
  // gulungan jadi (sama dengan gambar sushi di skin.js)
  function SUSHI_PARTS_FULL(v, k) {
    if (k === 'cucumber') for (const dx of [-16, 16]) { v.ell(dx, -15, 15, 15, '#1f3a2a'); v.ell(dx, -15, 11, 11, '#ffffff', false); v.ell(dx, -15, 5, 5, '#58bb44', false); }
    else for (const a of [-14, 14]) { v.ell(a, -14, 13, 13, '#ffd23a'); v.ell(a, -14, 8, 8, '#f2b23a', false); v.ell(a, -14, 3.5, 3.5, '#ffe87a', false); }
  }

  // ---------- Robot buatan Russel ----------
  const RT = { red: '#e5443a', blue: '#3f7ee0', yellow: '#ffd23a', green: '#46b04a', pink: '#f6a8c8', orange: '#f39a3a' };
  const RM_ = '#b9c2cc', RMD = '#8f99a6', RML = '#dfe6ee', RK = '#47425a', SCR = '#2e3d4a', OFF = '#6a7480', EYE = '#7cf0c4';
  const RB_LEGH = { rwheel: 6, rleg: 8, rtrack: 6 }, RB_BOD = { rbbox: [16, 12], rbround: [14, 14], rbtall: [12, 15] };
  // (x, y) = alas robot; ukuran sama dengan robot piksel lama (s = 2 di jendela rakit)
  function robotArt(x, y, cfg, t, o = {}, s = 1) {
    const col = RT[cfg.color] || '#c9d4e0', on = !!o.awake, act = o.act;
    const bob = act === 'jump' ? Math.abs(Math.sin((o.actT || 0) * 6)) * 9 : act === 'dance' ? (Math.floor(t * 6) % 2 ? 2 : 0) : o.moving && Math.floor(t * 8) % 2 ? 1 : 0;
    const dir = act === 'spin' ? (Math.floor((o.actT || 0) * 8) % 2 ? 1 : -1) : (o.dir || 0);
    const drop = key => (o.dropKey === key ? -o.drop * o.drop * 34 : 0) * 4;
    const pose = act === 'dance' ? 'alt' : act === 'jump' ? 'up' : act === 'hello' ? 'wave' : 'down';
    const led = on ? (Math.floor(t * 3) % 2 ? EYE : '#ffd23a') : OFF, led2 = on ? (Math.floor(t * 3) % 2 ? '#ffd23a' : EYE) : OFF;
    const B = RB_BOD[cfg.body], moving = o.moving || act === 'spin';
    return vec(x, y, v => {
      if (!o.noShadow) v.shadow(44, 8);
      const ly = -bob * 4 + drop('leg');
      if (cfg.leg === 'rwheel') {
        v.rect(-26, ly - 22, 52, 9, 4, RMD);
        for (const wx of [-20, 20]) { const a = moving ? t * 8 : 0.8; v.ell(wx, ly - 12, 12, 12, RK); v.ell(wx, ly - 12, 6, 6, RML, false); v.ell(wx + Math.cos(a) * 8, ly - 12 + Math.sin(a) * 8, 2.5, 2.5, '#ffd23a', false); }
      } else if (cfg.leg === 'rleg') {
        const st = moving ? Math.floor(t * 8) % 2 : 0;
        [[-5, st], [2, moving ? 1 - st : 0]].forEach(([lx, lift]) => { v.rect(lx * 4, ly - 33, 12, (6 - lift) * 4 + 2, 4, RM_); v.rect(lx * 4 - 5, ly - 10 - lift * 4, 22, 10, 4, RK); });
      } else if (cfg.leg === 'rtrack') {
        v.rect(-44, ly - 24, 88, 24, 12, RK);
        const off = moving ? (t * 40) % 8 : 0;
        for (let xx = -36 + off; xx < 38; xx += 8) v.line(`M${xx} ${ly - 23} v3 M${xx} ${ly - 4} v3`, OFF, 2);
        for (const rx of [-30, -10, 10, 30]) v.ell(rx, ly - 12, 6, 6, RMD);
      }
      if (!B) return;
      const yb = (-(RB_LEGH[cfg.leg] || 0) - bob) * 4, ybb = yb + drop('body');
      if (cfg.body === 'rbbox') {
        v.rect(-32, ybb - 48, 64, 48, 9, col); v.rect(18, ybb - 44, 10, 40, 5, 'rgba(58,38,22,0.14)', false);
        v.rect(-21, ybb - 41, 36, 24, 5, SCR); v.ell(-13, ybb - 34, 3, 3, led, false); v.rect(-6, ybb - 36, 12, 4, 2, led2, false); v.rect(-15, ybb - 26, 26, 3, 1.5, on ? '#3f7ee0' : OFF, false);
        v.ell(-13, ybb - 9, 3, 3, '#ffd23a', false); v.ell(-3, ybb - 9, 3, 3, led, false); v.hl(-22, ybb - 43, 6, 2.5);
      } else if (cfg.body === 'rbround') {
        v.ell(0, ybb - 28, 28, 28, col); v.ell(0, ybb - 28, 12, 12, SCR); v.ell(0, ybb - 28, 6, 6, led, false); v.hl(-12, ybb - 42, 7, 4);
      } else {
        v.rect(-24, ybb - 60, 48, 60, 9, col); v.rect(12, ybb - 56, 8, 52, 4, 'rgba(58,38,22,0.14)', false);
        for (let i = 0; i < 3; i++) { v.rect(-16, ybb - 53 + i * 16, 24, 12, 3, SCR); v.rect(-12, ybb - 49 + i * 16, 16, 4, 2, i === 1 ? led2 : led, false); }
        v.hl(-16, ybb - 57, 5, 2);
      }
      if (cfg.arm) {
        const ys = yb - B[1] * 4 + 12 + drop('arm'), hw = B[0] / 2;
        for (const sd of [-1, 1]) {
          const up = pose === 'up' || (pose === 'alt' && (sd < 0) === (Math.floor(t * 6) % 2 === 0)) || (pose === 'wave' && sd > 0 && Math.floor(t * 5) % 2 === 0);
          const ax = (sd < 0 ? -hw - 2 : hw) * 4, y0 = up ? ys - 24 : ys;
          if (cfg.arm === 'raball') { v.rect(ax, y0, 8, 28, 4, RMD); for (let i = 0; i < 4; i++) v.ell(ax + 4, y0 + 4 + i * 7, 3, 2.5, RML, false); }
          else v.rect(ax, y0, 8, 28, 4, RM_);
          const hx = ax + 4, hy = up ? y0 - 2 : y0 + 30, dy = up ? -1 : 1;
          if (cfg.arm === 'raclaw') v.line(`M${hx - 9} ${hy} H${hx + 9} M${hx - 8} ${hy} v${dy * 9} M${hx + 8} ${hy} v${dy * 9}`, RK, 4);
          else if (cfg.arm === 'raball') v.ell(hx, hy + dy * 6, 9, 9, col);
          else { v.ell(hx, hy + dy * 8, 12, 12, col); v.ell(hx + sd * 11, hy + dy * 4, 4.5, 6, col); }
        }
      }
      if (cfg.head) {
        const yh = yb - B[1] * 4 + drop('head'), dx = dir * 4, tip = on ? (Math.floor(t * 2) % 2 ? '#e5443a' : '#ff9a8a') : OFF;
        const blink = Math.floor(t * 2) % 7 === 0;
        const eyes = (e1, e2, ey) => {
          if (!on || blink) { v.line(`M${e1 - 4} ${ey} h8 M${e2 - 4} ${ey} h8`, on ? EYE : OFF, 3); return; }
          for (const ex of [e1, e2]) { v.ell(ex, ey, 4.5, 4.5, EYE, false); v.ell(ex - 1.5, ey - 1.5, 1.5, 1.5, '#ffffff', false); }
        };
        v.rect(-8, yh - 5, 16, 7, 2, RMD);
        if (cfg.head === 'rhround') {
          for (const ax of [-12, 12]) { v.line(`M${ax} ${yh - 50} V${yh - 62}`, RMD, 3); v.ell(ax, yh - 65, 4, 4, tip); }
          v.rect(-33, yh - 34, 6, 12, 3, RMD); v.rect(27, yh - 34, 6, 12, 3, RMD);
          v.ell(0, yh - 28, 28, 28, col); v.ell(0, yh - 24, 20, 12, SCR, false); eyes(-8 + dx, 8 + dx, yh - 25); v.hl(-14, yh - 44, 7, 4);
        } else {
          if (cfg.head === 'rhears') for (const ex of [-24, 24]) { v.ell(ex, yh - 48, 12, 12, col); v.ell(ex, yh - 48, 5, 5, '#ffb8c8', false); }
          else { v.line(`M0 ${yh - 48} V${yh - 60}`, RMD, 3); v.ell(0, yh - 64, 4, 4, tip); v.rect(-33, yh - 32, 6, 12, 3, RMD); v.rect(27, yh - 32, 6, 12, 3, RMD); }
          v.rect(-28, yh - 48, 56, 44, 10, col); v.rect(-20, yh - 40, 40, 24, 6, SCR, false);
          eyes(-12 + dx, 8 + dx, yh - 32);
          v.rect(-4 + dx, yh - 24, 8, 3, 1.5, on ? (cfg.head === 'rhears' ? '#ffb8c8' : EYE) : OFF, false); v.hl(-20, yh - 44, 6, 2.5);
        }
      }
    }, { s });
  }
  S.hook('drawMyRobot', (x, y, cfg, t, o) => robotArt(x, y, cfg || {}, t, o || {}));
  S.wrapPanel('robot', RB, (c, t) => {
    c.fillStyle = '#d3dfe6'; c.fillRect(0, 0, 160, 80);
    lines(c, '#c4d2da', 0.5, [20, 40, 60, 80, 100, 120, 140].map(x => [x, 0, x, 74]));
    c.fillStyle = '#7d8a98'; c.fillRect(0, 74, 160, 6); c.fillStyle = '#a9b6c4'; c.fillRect(0, 74, 160, 0.8);
    vec(28, 40, v => {
      v.rect(-80, -120, 160, 120, 6, '#3f7ee0'); for (let i = 1; i < 5; i++) v.line(`M-80 ${-120 + i * 24} H80 M${-80 + i * 32} -120 V0`, 'rgba(255,255,255,0.18)', 2);
      v.line('M-24 -100 H24 V-64 H-24 Z M-12 -88 h0.1 M12 -88 h0.1 M-28 -56 H28 V-24 H-28 Z M-20 -24 V-6 M20 -24 V-6 M-28 -48 H-44 M28 -48 H44', '#dfeaff', 4);
      v.rect(-80, -120, 160, 120, 6, 'rgba(0,0,0,0)');
    });
    vec(135, 9, v => { v.rect(-68, 0, 136, 10, 3, '#9a5a2c'); v.ell(-44, -8, 8, 8, '#46b04a'); v.rect(-20, -20, 20, 20, 4, '#e5443a'); v.ell(36, -12, 12, 12, '#ffd23a'); });
    c.fillStyle = '#a7adb6'; c.fillRect(0, 80, 160, 30);
    const fl = []; for (let x = 0; x < 160; x += 16) fl.push([x, 80, x, 110]); for (let y = 88; y < 110; y += 10) fl.push([0, y, 160, y]);
    lines(c, '#969ca6', 0.5, fl);
    vec(80, 96, v => {
      v.ell(0, 8, 176, 36, '#5f6c7a'); v.ell(0, 0, 176, 36, '#8f99a6'); v.ell(0, -4, 160, 28, '#c9d4e0', false); v.ell(0, -4, 136, 20, '#e8eef2', false);
      for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + (RB.done ? t : 0); v.ell(Math.cos(a) * 164, Math.sin(a) * 32, 5, 3, i % 2 ? '#ffd23a' : '#47425a', false); }
    });
    robotArt(80, 94, RB.cfg, t, { noShadow: true, awake: RB.power > 0, act: RB.act, actT: RB.actT, dropKey: RB.drop > 0 ? RB.dropKey : null, drop: RB.drop, dir: 0 }, 2);
    if (RB.batt > 0) { const p = 1 - RB.batt; vec((70 - p * 28) * 2 + 7, 64, v => { v.rect(-14, -8, 28, 16, 4, '#47425a'); v.rect(-14, -8, 12, 16, 4, '#ffd23a', false); v.rect(14, -4, 4, 8, 2, '#c9d4e0'); }); }
    if (RB.flash > 0 || RB.wake > 0) starRing(t, 80, 54, 56, 34, 8);
    if (!RB.done && RB_STEPS[RB.step].key === 'button') {
      const pr = Math.floor(t * 2.5) % 2;
      vec(139, 90 + pr, v => { v.rect(-44, -4, 88, 32, 8, '#47425a'); v.ell(0, -4, 34, 14, '#b8302a'); v.ell(0, -8 + pr * 4, 30, 11, '#e5443a'); v.hl(-10, -12 + pr * 4, 9, 3); });
    }
  });

  // ---------- Berhitung ----------
  S.wrapPanel('fn:countDraw', CT, c => {
    c.fillStyle = '#dff0f8'; c.fillRect(0, 0, 160, 80);
    lines(c, '#cfe4ef', 0.5, [[0, 44, 160, 44]]);
    for (const it of CT.items) {
      const bo = it.b > 0 ? Math.sin(it.b / 0.35 * Math.PI) * 5 : 0;
      vec(it.x, it.y - 1, v => v.ell(0, 0, 50, 12, it.n ? '#bfe3a0' : '#efe4cc', false));
      S.drawPic(CT.type.k, it.x, it.y - bo, 24);
    }
  }, 1);

  // ---------- Cermin ----------
  // titik ketuk cermin (satuan 40×40) diganti mengikuti bentuk Russel yang baru
  const HOT_OLD = HOT.map(h => h[1]);
  const HOT_NEW = {
    nose: [[18.8, 21.4, 2.4, 1.4]], eyes: [[16, 19, 8, 3.2]], mouth: [[17.5, 22.8, 5, 2.2]], ears: [[12, 18, 3, 4.5], [25, 18, 3, 4.5]],
    hand: [[13, 28.5, 4, 5], [23, 28.5, 4, 5]], tummy: [[16.5, 26, 7, 7]], foot: [[15.5, 35.5, 9, 3.5]], hair: [[13.5, 12.5, 13, 6]], head: [[13, 12.5, 14, 13]],
  };
  const hotSet = on => HOT.forEach((h, i) => { h[1] = on ? HOT_NEW[h[0]] || HOT_OLD[i] : HOT_OLD[i]; });
  MI.cv.addEventListener('pointerdown', () => hotSet(S.on), true);
  S.wrapPanel('fn:mirrorDraw', MI, (c, t) => {
    hotSet(true);
    c.fillStyle = grad(c, 0, 40, '#cfe9f8', '#eef8fd'); c.fillRect(0, 0, 40, 40);
    c.fillStyle = '#d6ecf6'; c.fillRect(0, 36, 40, 4);
    lines(c, 'rgba(255,255,255,0.9)', 0.6, [[3, 12, 11, 3], [5, 14, 14, 4]]);
    me(20, 38.5, { mood: G.mood, outfit: mirrorOutfit(), umbrella: G.outfit.umbrella, scale: 1.12 });
    if (MI.hlT > 0 && Math.floor(G.t * 6) % 2 === 0) {
      const h = HOT.find(x => x[0] === MI.hl);
      if (h) { c.fillStyle = 'rgba(255,232,110,0.5)'; h[1].forEach(r => { c.beginPath(); c.ellipse(r[0] + r[2] / 2, r[1] + r[3] / 2, r[2] / 2 + 0.6, r[3] / 2 + 0.6, 0, 0, 7); c.fill(); }); }
    }
  }, 8);

  // ---------- Bunga besar ----------
  function leaf(v, x0, y0, x1, y1, w, col, dark) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L * w, ny = dx / L * w, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    v.fill(`M${x0} ${y0} Q${mx + nx} ${my + ny} ${x1} ${y1} Q${mx - nx} ${my - ny} ${x0} ${y0} Z`, col);
    v.line(`M${x0} ${y0} Q${mx + nx * 0.15} ${my + ny * 0.15} ${x1 - dx * 0.15} ${y1 - dy * 0.15}`, dark, 1.5);
  }
  function flowerGround(soil = '#8a5a35') {
    const c = S.ctx;
    c.fillStyle = grad(c, 0, 41, '#cfe8f8', '#eaf6fc'); c.fillRect(0, 0, 48, 41);
    vec(9, 8, v => { v.ell(0, 0, 20, 5, '#ffffff', false); v.ell(8, -3, 10, 5, '#ffffff', false); });
    c.fillStyle = soil; c.fillRect(0, 41, 48, 15); c.fillStyle = 'rgba(50,25,10,0.14)'; c.fillRect(0, 50, 48, 6);
    vec(0, 0, v => {
      for (let i = 0; i < 18; i++) v.ell(((i * 13) % 46) * 4 + 3, (43.5 + (i * 7) % 12) * 4, 3, 1.5, i % 3 ? '#7a4c2c' : '#a0704a', false);
      [[6, 47], [40, 45], [34, 53], [12, 53]].forEach(([a, b]) => { v.ell(a * 4, b * 4, 6, 4, '#a9a6a0'); v.ell(a * 4 - 2, b * 4 - 2, 3, 1.5, '#d6d3cc', false); });
      v.fill('M0 158 Q96 152 192 158 V168 H0 Z', '#62b047', false);
      for (let i = 0; i < 24; i++) v.line(`M${i * 8 + 3} 160 l${i % 2 ? 2 : -2} -7`, '#46a03a', 2);
    });
  }
  function flowerArt(col, hl, t, stage) {
    const blink = Math.floor(t * 6) % 2 === 0, C = (part, base) => (hl === part && blink ? '#fff7b0' : base);
    flowerGround(C('root', '#8a5a35'));
    if (stage >= 1 && stage <= 2) vec(24, 44, v => { v.ell(0, 0, 12, 8, C('seed', '#c9a24a')); v.hl(-3, -3, 4, 1.5); });
    if (stage >= 2) vec(24, 42, v => {
      const R = C('root', '#f0dcae');
      [[0, 0, -20, 36, 4, 3], [0, 0, 20, 36, -4, 3], [0, 0, -8, 48, 1.6, 2.4], [0, 0, 8, 48, -1.6, 2.4], [-12, 20, -32, 44, 2.4, 1.6], [12, 20, 32, 44, -2.4, 1.6]]
        .forEach(([x0, y0, x1, y1, b, w]) => v.line(`M${x0} ${y0} Q${(x0 + x1) / 2 + b * 4} ${(y0 + y1) / 2} ${x1} ${y1}`, R, w));
    });
    if (stage >= 3) vec(24, 41, v => { v.line('M0 0 Q-2 -40 0 -84', C('stem', '#3f8a3a'), 8); if (hl !== 'stem' || !blink) v.line('M-2 -4 Q-3 -40 -2 -80', '#58bb44', 2); });
    if (stage >= 4) vec(0, 0, v => {
      leaf(v, 92, 128, 44, 120, 11, C('leaf', '#46b04a'), C('leaf', '#2f7a2c'));
      leaf(v, 100, 112, 148, 104, 11, C('leaf', '#46b04a'), C('leaf', '#2f7a2c'));
    });
    if (stage >= 5) vec(24, 15, v => {
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 - Math.PI / 2; v.ell(Math.cos(a) * 26, Math.sin(a) * 26, 22, 15, C('petal', col[2]), true, a); }
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 - Math.PI / 2; v.ell(Math.cos(a) * 24, Math.sin(a) * 24 - 2, 18, 12, C('petal', col[1]), false, a); v.line(`M${Math.cos(a) * 12} ${Math.sin(a) * 12 - 2} L${Math.cos(a) * 34} ${Math.sin(a) * 34 - 2}`, 'rgba(58,38,22,0.12)', 1.5); }
    });
    if (stage >= 6) vec(24, 15, v => {
      const y = col[0] === 'yellow';
      v.ell(0, 0, 16, 16, C('pistil', y ? '#8a5a35' : '#ffd23a')); v.ell(0, 0, 10, 10, C('pistil', y ? '#6b4226' : '#f2b23a'), false);
      for (let k = 0; k < 8; k++) v.ell(Math.cos(k * 0.785) * 12.5, Math.sin(k * 0.785) * 12.5, 1.6, 1.6, '#fff3b0', false);
      v.hl(-5, -5, 3, 2);
    });
  }
  // ---------- Proses bunga (fotosintesis, penyerbukan, biji) ----------
  const sunArt = (x, y) => vec(x, y, v => {
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; v.line(`M${Math.cos(a) * 26} ${Math.sin(a) * 26} L${Math.cos(a) * 34} ${Math.sin(a) * 34}`, '#f39a3a', 3); }
    v.ell(0, 0, 20, 20, '#ffd23a'); v.ell(-4, -4, 11, 11, '#fff3b0', false);
  });
  const beeArt = (x, y, t, dusted) => {
    const up = Math.floor(t * 14) % 2;
    vec(x, y, v => {
      v.ell(-4, -10 - up * 3, 7, 5, 'rgba(232,246,252,0.95)'); v.ell(5, -10 - (1 - up) * 3, 7, 5, 'rgba(255,255,255,0.95)');
      v.ell(0, 0, 13, 9, '#ffd23a'); v.line('M-4 -8 V8 M4 -8 V8', '#3a2616', 3);
      v.ell(13, -1, 5.5, 5.5, '#3a2616'); v.ell(14.5, -2.5, 1.5, 1.5, '#ffffff', false); v.line('M-13 0 L-17 1', '#3a2616', 2);
      if (dusted) [[-10, 6], [0, 9], [8, 8], [-8, -4]].forEach(([a, b]) => v.ell(a, b, 2.2, 2.2, '#ffe98a', false));
    });
  };
  const glowLeaves = () => vec(0, 0, v => { leaf(v, 92, 128, 44, 120, 12, '#a6e36e', '#58a84a'); leaf(v, 100, 112, 148, 104, 12, '#a6e36e', '#58a84a'); });
  const miniFlower = (x, col) => vec(x + 1, 41, v => {
    v.line('M0 0 V-60', '#3f8a3a', 7);
    leaf(v, -2, -24, -26, -30, 6, '#46b04a', '#2f7a2c'); leaf(v, 2, -36, 26, -42, 6, '#46b04a', '#2f7a2c');
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; v.ell(Math.cos(a) * 20, -84 + Math.sin(a) * 20, 12, 12, col[1]); }
    v.ell(0, -84, 12, 12, col[0] === 'yellow' ? '#8a5a35' : '#ffd23a'); v.ell(0, -84, 6, 6, col[0] === 'yellow' ? '#6b4226' : '#f2b23a', false);
  });
  const pod = (x, y, r, col, dark) => vec(x, y, v => { v.ell(0, 0, r * 4, r * 4, col); v.ell(r * 1.2, r * 1.4, r * 2.2, r * 2, dark, false); v.hl(-r * 1.6, -r * 1.6, r, r * 0.6); });
  const dot = (x, y, r, col, rot = 0, sy = 1) => vec(x, y, v => v.ell(0, 0, r * 4, r * 4 * sy, col, false, rot));
  const sparkle = (x, y, s = 1) => vec(x, y, v => v.fill('M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z', '#fff3b0', false), { s });
  const PROC_ART = {
    photo(col, s, t) {
      flowerArt(col, null, G.t, 6);
      if (s === 3 || (s === 0 && Math.floor(t * 3) % 2)) glowLeaves();
      sunArt(41, 7);
      if (s === 0 || s === 3) for (let i = 0; i < 4; i++) {
        const p = loop(t, 0.6, i, 4);
        dot(38 + (32 - 38) * p, 12 + (26 - 12) * p, 1, '#ffc93a', 1.2, 0.5); dot(36 + (18 - 36) * p, 11 + (30 - 11) * p, 1, '#ffc93a', 0.8, 0.5);
      }
      if (s === 1 || s === 3) {
        [[17, 49, 2], [31, 50, 2], [21, 53, 1.4]].forEach(([x, y, r]) => dot(x, y, r, '#4fa0cf', 0, 0.4));
        for (let i = 0; i < 5; i++) {
          const p = loop(t, 0.35, i, 5), y = 52 - 24 * p, side = i % 2 ? 1 : -1, x = p < 0.8 ? 24 : 24 + side * (p - 0.8) * 30;
          vec(x, y, v => { v.fill('M0 -6 Q5 1 0 4 Q-5 1 0 -6 Z', '#3f8fe0'); v.ell(-1.5, 0, 1, 1.4, '#ffffff', false); });
        }
      }
      if (s === 2 || s === 3) for (let i = 0; i < 4; i++) {
        const p = loop(t, 0.4, i, 4);
        vec(1 + 14 * p, 20 + i * 3 + (31 - 20 - i * 3) * p, v => v.ell(0, 0, 4.5, 4.5, '#c9d0d8'));
        vec(47 - 13 * p, 18 + i * 3 + (27 - 18 - i * 3) * p, v => v.ell(0, 0, 4.5, 4.5, '#c9d0d8'));
      }
      if (s === 3) for (let i = 0; i < 6; i++) { const p = loop(t, 0.8, i, 6); if (p < 0.5) { sparkle(12 + i * 2, 29 + (i % 3), 0.4); sparkle(27 + i * 2, 25 + (i % 3), 0.4); } }
      if (s === 4) for (let i = 0; i < 6; i++) {
        const p = loop(t, 0.3, i, 6), x = (i % 2 ? 31 : 17) + Math.sin(t * 2 + i) * 2;
        vec(x, (i % 2 ? 24 : 28) - 24 * p, v => { v.ell(0, 0, 5, 5, 'rgba(127,208,245,0.55)'); v.ell(-1.6, -1.6, 1.4, 1.4, '#ffffff', false); });
      }
    },
    pollen(col, s, t) {
      if (s < 3) {
        flowerArt(col, null, G.t, 6);
        if (s === 0) { const p = Math.min(1, t / 1.6); beeArt(46 - 18 * p, 4 + 4 * p + Math.sin(t * 5) * 2, t, false); return; }
        if (s === 1) for (let i = 0; i < 3; i++) { const p = loop(t, 0.8, i, 3); dot(23 + i, 16 - 4 * p, 0.6, '#f39a3a'); }
        if (s === 2) for (let i = 0; i < 6; i++) { const p = loop(t, 0.9, i, 6); dot(21.5 + i, 17 - 6 * p, 0.55, '#ffe24a'); }
        beeArt(24 + Math.sin(t * 8), 10 + Math.abs(Math.sin(t * 4)), t, s === 2);
        return;
      }
      flowerGround(); miniFlower(11, col); miniFlower(33, col);
      if (s === 3) {
        const p = Math.min(1, t / 2.4);
        for (let i = 1; i < 5; i++) { const q = Math.max(0, p - i * 0.07); dot(12 + 22 * q, 15 - Math.sin(q * Math.PI) * 9, 0.55, '#ffe24a'); }
        beeArt(12 + 22 * p, 13 - Math.sin(p * Math.PI) * 9, t, true);
      } else {
        for (let i = 0; i < 5; i++) { const p = loop(t, 0.9, i, 5); dot(32 + i, 16 + 4 * p, 0.55, '#ffe24a'); }
        beeArt(34 + Math.sin(t * 8), 14 + Math.abs(Math.sin(t * 4)), t, true);
        if (t > 1.5 && Math.floor(t * 4) % 2) { sparkle(28.5, 12.5, 0.5); sparkle(41.5, 16.5, 0.5); }
      }
    },
    seed(col, s, t) {
      const mid = col[0] === 'yellow' ? '#8a5a35' : '#ffd23a';
      if (s === 0) {
        flowerArt(col, null, G.t, 4);
        for (let k = 0; k < 6; k++) {
          const a = k / 6 * Math.PI * 2 - Math.PI / 2, fall = Math.max(0, t * 16 - k * 5);
          const x = 24 + Math.cos(a) * 8 + Math.sin(fall / 6 + k) * (fall ? 3 : 0), y = Math.min(39, 15 + Math.sin(a) * 8 + fall);
          vec(x, y, v => v.ell(0, 0, fall ? 10 : 18, fall ? 7 : 12, col[1], true, fall ? fall / 4 : a));
        }
        vec(24, 15, v => v.ell(0, 0, 16, 16, mid));
      } else if (s === 1) {
        flowerArt(col, null, G.t, 4);
        const r = 4 + Math.min(4, t * 2);
        pod(24, 16, r, '#8fd16a', 'rgba(88,168,74,0.35)');
        vec(24, 16 - r, v => v.rect(-3, -5, 6, 7, 2, '#c9a24a'));
      } else if (s === 2) {
        flowerArt(col, null, G.t, 4);
        vec(24, 16, v => {
          v.ell(0, 0, 36, 36, '#58a84a'); v.ell(0, 0, 29, 29, '#eef6cf', false);
          [[21, 13], [26, 13], [19, 17], [24, 17], [28, 17], [22, 20], [26, 20]].forEach(([x, y]) => { v.ell((x - 24) * 4, (y - 16) * 4, 4, 7, '#7d5230'); v.ell((x - 24) * 4 - 1, (y - 16) * 4 - 3, 1.4, 2, '#a8743c', false); });
        });
        if (Math.floor(t * 3) % 2) sparkle(36.5, 9.5, 0.5);
      } else if (s === 3) {
        flowerArt(col, null, G.t, 4);
        pod(24, 16, 7, '#c9a26a', 'rgba(138,106,58,0.35)');
        vec(24, 20, v => v.fill('M-12 0 Q0 10 12 0 Q0 4 -12 0 Z', '#6b4a2a'));
        [[12, 0], [19, 0.4], [30, 0.8], [37, 1.2]].forEach(([tx, d]) => {
          const p = Math.min(1, Math.max(0, (t - d) / 1.2));
          vec(24 + (tx - 24) * p, 21 + 24 * p * p, v => v.ell(0, 0, 4, 7, '#7d5230'));
        });
      } else if (s === 4) {
        flowerGround();
        const h = Math.min(12, t * 6), root = Math.min(6, t * 4);
        vec(24, 46, v => {
          v.line(`M0 0 V${root * 4}`, '#f0dcae', 4);
          if (root > 3) v.line('M0 10 Q-6 14 -10 16 M0 14 Q6 18 10 20', '#f0dcae', 2.5);
          v.ell(0, -2, 12, 8, '#c9a24a'); v.hl(-4, -5, 4, 1.5);
          if (t > 0.5) v.line(`M0 -4 Q-2 ${-4 - h * 2} 0 ${-4 - h * 4}`, '#3f8a3a', 6);
          if (h >= 6) { leaf(v, 0, -4 - h * 4, -18, -8 - h * 4, 5, '#58bb44', '#2f7a2c'); leaf(v, 0, -6 - h * 4, 18, -12 - h * 4, 5, '#58bb44', '#2f7a2c'); }
        });
      } else {
        const stage = Math.min(6, 3 + Math.floor(t * 1.4));
        flowerArt(col, null, G.t, stage);
        if (stage === 6 && Math.floor(t * 4) % 2) { sparkle(9.5, 9.5, 0.6); sparkle(39.5, 13.5, 0.6); }
      }
    },
  };
  // ---------- Bagian bunga dari dekat ----------
  function detailArt(part, col, t) {
    const c = S.ctx;
    if (part === 'root') {
      c.fillStyle = grad(c, 0, 56, '#94603a', '#74482a'); c.fillRect(0, 0, 48, 56);
      lines(c, 'rgba(60,34,18,0.35)', 0.4, [9, 18, 27, 36, 45, 54].map(y => [0, y, 48, y + 1]));
      vec(0, 0, v => {
        for (let i = 0; i < 14; i++) v.ell(((i * 17) % 46) * 4 + 4, (8 + (i * 11) % 46) * 4, 4, 2, '#6b4226', false);
        [[8, 20], [38, 14], [12, 44], [40, 40]].forEach(([a, b]) => { v.ell(a * 4, b * 4, 8, 5, '#a9a6a0'); v.ell(a * 4 - 2, b * 4 - 2, 3, 1.5, '#d6d3cc', false); });
        v.rect(0, 0, 192, 16, 0, '#62b047', false); for (let i = 0; i < 24; i++) v.line(`M${i * 8 + 3} 2 l${i % 2 ? 2 : -2} -7`, '#46a03a', 2);
        v.rect(88, -4, 16, 20, 4, '#3f8a3a');
        const branch = (x0, y0, a, len, d) => {
          let x = x0, y = y0, p = `M${x * 4} ${y * 4}`;
          for (let i = 0; i < len; i++) { x += Math.cos(a); y += Math.sin(a); a += Math.sin(i * 0.7 + d) * 0.08; p += ` L${x * 4} ${y * 4}`; }
          v.line(p, '#f0dcae', 1.5 + d * 1.6);
          if (d > 0) { branch(x, y, a - 0.6, len * 0.6, d - 1); branch(x, y, a + 0.6, len * 0.6, d - 1); }
        };
        branch(24, 3, Math.PI / 2, 18, 3);
      });
      for (let k = 0; k < 4; k++) { const yy = 50 - ((t * 10 + k * 13) % 44); vec(14.5 + k * 7, yy, v => v.fill('M0 -5 Q4 1 0 4 Q-4 1 0 -5 Z', '#8fd0f2', false)); }
      return;
    }
    c.fillStyle = grad(c, 0, 56, '#d2ebf9', '#eef8fd'); c.fillRect(0, 0, 48, 56);
    vec(0, 0, v => { for (let i = 0; i < 5; i++) v.ell((6 + i * 9) * 4, (50.5 - (i % 2) * 3) * 4, 8, 2.5, '#ffffff', false); });
    if (part === 'leaf') {
      let top = 'M16 112', bot = '';
      for (let x = 4; x <= 44; x += 1) { const h = Math.sin(Math.PI * (x - 4) / 40) * 15; top += ` L${x * 4} ${(28 - h) * 4}`; bot = ` L${x * 4} ${(28 + h) * 4}` + bot; }
      vec(0, 0, v => {
        v.line('M0 113 H20', '#3d7f33', 8);
        v.fill(top + bot + ' Z', '#58bb44');
        let hi = 'M16 112'; for (let x = 4; x <= 44; x += 2) hi += ` L${x * 4} ${(28 - Math.sin(Math.PI * (x - 4) / 40) * 15) * 4}`; v.fill(hi + ' L176 112 Z', 'rgba(124,200,90,0.6)', false);
        v.line('M16 113 Q96 110 176 112', '#3d7f33', 3);
        for (let i = 9; i < 40; i += 6) { const h = Math.sin(Math.PI * (i + 3 - 4) / 40) * 15 - 3; v.line(`M${i * 4} 112 Q${(i + 2) * 4} ${(28 - h * 0.5) * 4} ${(i + h * 0.45) * 4} ${(28 - h) * 4} M${i * 4} 113 Q${(i + 2) * 4} ${(28 + h * 0.5) * 4} ${(i + h * 0.45) * 4} ${(28 + h) * 4}`, '#3d7f33', 1.6); }
        v.ell(120, 76, 8, 8, 'rgba(207,239,255,0.9)'); v.ell(117, 73, 2.5, 2.5, '#ffffff', false);
      });
    } else if (part === 'stem') {
      vec(0, 0, v => {
        leaf(v, 84, 58, 24, 52, 10, '#58bb44', '#3d7f33'); leaf(v, 108, 146, 168, 140, 10, '#58bb44', '#3d7f33');
        v.rect(84, -8, 24, 240, 0, '#3f8a3a'); v.rect(88, -8, 7, 240, 0, '#58bb44', false); v.rect(102, -8, 4, 240, 0, '#2f6e26', false);
        for (const ny of [64, 152]) v.rect(80, ny, 32, 8, 4, '#2f6e26');
        for (let i = 2; i < 56; i += 5) { v.ell(82, i * 4, 1.5, 1.5, '#7cc85a', false); v.ell(110, i * 4 + 8, 1.5, 1.5, '#7cc85a', false); }
        for (let k = 0; k < 4; k++) { const yy = (54 - ((t * 14 + k * 14) % 56)) * 4; v.rect(94, yy, 5, 12, 2.5, '#8fd0f2', false); }
      });
    } else if (part === 'petal') {
      const wOf = y => { const k = (y - 4) / 48; return Math.pow(Math.sin(Math.PI * Math.min(1, k * 1.15)), 0.7) * 17 * (1 - k * 0.55); };
      let L = '', R = '';
      for (let y = 4; y <= 52; y += 1) { const w = wOf(y); L += ` L${(24 - w) * 4} ${y * 4}`; R = ` L${(24 + w) * 4} ${y * 4}` + R; }
      vec(0, 0, v => {
        v.fill('M96 16' + L + R + ' Z', col[1]);
        for (const a of [-0.5, -0.25, 0, 0.25, 0.5]) { const ex = (24 + Math.sin(a) * 20) * 4, ey = (48 - Math.cos(a) * 26) * 4; v.line(`M96 194 Q${(96 + ex) / 2 + a * 8} ${(194 + ey) / 2 + 10} ${ex} ${ey}`, col[2], 1.8); }
        v.line('M66 44 Q58 80 64 112', 'rgba(255,255,255,0.75)', 6);
      });
    } else if (part === 'pistil') {
      const center = col[0] === 'yellow' ? '#8a5a35' : '#ffd23a';
      vec(24, 28, v => {
        for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; v.line(`M${Math.cos(a) * 40} ${Math.sin(a) * 40} L${Math.cos(a) * 74} ${Math.sin(a) * 74}`, '#e8c86a', 4); }
        for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; v.ell(Math.cos(a) * 76, Math.sin(a) * 76, 5, 5, '#f4b23a'); }
        v.ell(0, 0, 40, 40, center); v.ell(0, 0, 28, 28, col[0] === 'yellow' ? '#6b4226' : '#f2b23a', false);
        for (let k = 0; k < 20; k++) v.ell(Math.cos(k * 2.4) * (k % 7) * 4, Math.sin(k * 2.4) * (k % 7) * 4, 2, 2, '#fff3b0', false);
        v.hl(-12, -14, 8, 5);
      });
      beeArt(24 + Math.cos(t * 1.4) * 20, 10 + Math.sin(t * 2.8) * 4, t, false);
    }
  }
  S.wrapPanel('fn:flowerDraw', FL, (c, t) => {
    const col = FLOWER_COLORS[FL.ci];
    if (FL.mode === 'process') {
      PROC_ART[PR.id](col, PR.i, PR.t);
      if (PR.t > 2.5 && Math.floor(PR.t * 2) % 2) vec(44.5, 50, v => v.fill('M-5 -12 H5 V-4 H10 L0 7 L-10 -4 H-5 Z', '#ffd23a'));
      return;
    }
    if (FL.detail) { detailArt(FL.detail, col, G.t); return; }
    flowerArt(col, FL.hl, G.t, FL.stage);
    if (FL.mode === 'grow' && FL.stage < 6) {
      const b = Math.abs(Math.sin(G.t * 4)) * 2;
      vec(38, 36 - b, v => {
        v.line('M-8 -8 L-26 2', '#3f7ee0', 5); v.ell(-27, 3, 4, 3, '#2c60b8');
        v.rect(-10, -16, 26, 18, 5, '#3f7ee0'); v.line('M-2 -16 Q6 -28 14 -14', '#2c60b8', 3); v.hl(-4, -10, 4, 2);
        for (let i = 0; i < 3; i++) { const k = (G.t * 2 + i / 3) % 1; v.ell(-30 - i * 2, 8 + k * 16, 1.6, 2.6, '#8fd0f2', false); }
      });
    }
  }, 8);
})();
