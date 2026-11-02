// Tambahan khusus versi aplikasi (PWA); isi game tetap sama dengan versi di folder game/.

// Mode tanpa internet. Versi baru diunduh diam-diam: kalau game belum dimulai langsung dipakai,
// kalau sedang bermain baru dipakai saat aplikasi dibuka berikutnya.
if ('serviceWorker' in navigator) {
  const hadWorker = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadWorker || reloaded || G.started) return;
    reloaded = true; location.reload();
  });
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}

// iPad/iPhone hanya mengizinkan suara yang dimulai dari ketukan: ucapan kosong saat tombol mulai ditekan
$('play').addEventListener('click', () => {
  if (!Talk.supported) return;
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
});

// Saat aplikasi ditinggalkan, musik dan suara ikut berhenti; lanjut lagi saat dibuka kembali
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { Talk.cancel(); if (Snd.ctx) Snd.ctx.suspend(); }
  else if (Snd.ctx) Snd.ctx.resume();
});

// Tahan lama pada gambar tidak memunculkan menu "simpan gambar"
document.addEventListener('contextmenu', e => e.preventDefault());

// iPhone kadang melaporkan ukuran layar terlambat (setelah diputar atau dibuka lagi): ukur ulang beberapa kali
function refit() { fit(); [100, 350, 800].forEach(ms => setTimeout(fit, ms)); }
window.addEventListener('orientationchange', refit);
window.addEventListener('pageshow', refit);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refit(); });
if (window.visualViewport) visualViewport.addEventListener('resize', fit);
refit();

// Keterangan kecil di menu orang tua, untuk memastikan versi aplikasi & ukuran layar saat ada masalah tampilan
(function screenInfo() {
  const p = document.createElement('p');
  p.className = 'set-note';
  document.querySelector('#p-parent .settings').appendChild(p);
  const show = () => {
    const b = $('box').getBoundingClientRect(), vv = window.visualViewport;
    p.textContent = `Versi aa78108733 · layar ${innerWidth}×${innerHeight}` + (vv ? ` · terlihat ${Math.round(vv.width)}×${Math.round(vv.height)}` : '') +
      ` · game ${Math.round(b.width)}×${Math.round(b.height)} mulai y ${Math.round(b.top)}`;
  };
  setInterval(() => { if (G.panel === 'parent') show(); }, 1000);
})();
