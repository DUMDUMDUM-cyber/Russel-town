// Mode cerita dengan gambar gaya baru: adegan digambar dari tempat-tempat bergaya baru (Skin.sceneShot),
// tajam sesuai layar. Alur cerita, suara, dan tombol tetap dari story.js; gambar lama dipakai bila gaya baru dimatikan.

(function skinStory() {
  const S = Skin, oldPresent = storyPresent, oldList = storyList;

  // pemain di satu halaman (sama dengan storyFrameDraw di story.js)
  function actors(page, k, t) {
    const out = [], kk = ease(k / 0.75);
    page.a.forEach(a => {
      const kind = a[0], opt = (kind === 'p' ? a[6] : kind === 'dog' ? a[5] : kind === 'item' ? a[4] : a[3]) || {};
      const bx = kind === 'p' || kind === 'item' ? a[2] : a[1], by = kind === 'p' || kind === 'item' ? a[3] : a[2];
      const x = opt.to ? lerp(bx, opt.to[0], kk) : bx, y = opt.to ? lerp(by, opt.to[1], kk) : by;
      const moving = opt.to && kk < 1, frame = moving ? [1, 0, 2, 0][Math.floor(t * 8) % 4] : 0;
      if (kind === 'p') out.push({ y, draw: c => drawPerson(c, x, y, { look: a[1], dir: a[4], mood: a[5], frame, act: moving ? null : opt.act, actT: t, umbrella: opt.umbrella, outfit: a[1] === 'me' ? mirrorOutfit() : null }) });
      if (kind === 'dog') out.push({ y, draw: c => drawDogTrick(c, x, y, a[4] || 1, frame, moving ? 'walk' : a[3], t) });
      if (kind === 'crab') out.push({ y, draw: c => drawCrab(c, x, y, t) });
      if (kind === 'item') out.push({ y: 999, draw: c => drawItem(c, x, y, a[1]) });
      if (kind === 'heart') out.push({ y: 999, draw: c => drawHeart(c, x, y) });
      if (kind === 'rainbow') out.push({ y: -1, draw: c => drawRainbow(c, a[1], a[2], a[3]) });
    });
    return out;
  }
  // kamera: perlahan mendekat ke tokoh utama (sama dengan storyPresent lama)
  function shot(c, page, k) {
    const hero = page.a.find(a => a[0] === 'p');
    const fx = hero ? (hero[6] && hero[6].to ? lerp(hero[2], hero[6].to[0], ease(k / 0.75)) : hero[2]) : W / 2, fy = hero ? hero[3] - 20 : H / 2;
    return S.sceneShot(c, page.scene, actors(page, k, G.t), G.t, { night: page.night, weather: page.weather, z: 1 + 0.12 * k, fx, fy });
  }
  function fit(cv) {
    const dpr = window.devicePixelRatio || 1, w = Math.round(Math.min(1920, Math.max(640, (cv.clientWidth || 640) * dpr)));
    if (cv.width !== w) { cv.width = w; cv.height = Math.round(w * 9 / 16); }
    cv.classList.add('hi');
  }
  window.storyPresent = (page, k) => {
    if (!S.on) {
      vcv.classList.remove('hi');
      if (vcv.width !== 640) { vcv.width = 640; vcv.height = 360; }
      return oldPresent(page, k);
    }
    fit(vcv);
    shot(vctx, page, k);
    const fade = Math.max(0, 1 - STO.pt / 0.35, 1 - (STO.dur - STO.pt) / 0.35);
    if (fade > 0) { vctx.fillStyle = `rgba(20,16,30,${Math.min(1, fade)})`; vctx.fillRect(0, 0, vcv.width, vcv.height); }
  };
  // sampul daftar cerita: digambar ulang sampai semua gambar tempatnya siap
  window.storyList = function () {
    oldList();
    if (!S.on) return;
    const covers = [...document.querySelectorAll('#story-list .story-cover canvas')];
    let tries = 0;
    const draw = () => {
      if (G.panel !== 'story' || $('story-list').hidden) return;
      let ok = true;
      covers.forEach((cvs, i) => { cvs.classList.add('hi'); const c = cvs.getContext('2d'); if (!shot(c, STORIES[i].pages[0], 0.6)) ok = false; });
      if (!ok && ++tries < 30) setTimeout(draw, 150);
    };
    draw();
  };
})();
