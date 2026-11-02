// Kakak laki-laki, hewan besar (1,5×), dan gambar untuk setiap stiker.

LOOKS.gege = { teen: 1, skin: '#f6cba6', hair: '#2a1d18', hairL: '#4a3a30', style: 'dad', shirt: '#4fa3a0', shirtD: '#367d7a', pants: '#3f4a6a', shoes: '#ffffff' };

// ---------- Sapi & domba besar: digambar langsung pada ukuran aslinya, ukuran pikselnya sama dengan tokoh lain ----------
function drawCowBig(c, x, y, dir, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 21);
  const W1 = '#fbf8f0', W2 = '#e4dccc', K = '#3a3230', K2 = '#544a46', PK = '#f3a6b0', PD = '#d97f8e', HF = '#5a4638';
  const chew = Math.sin(t * 5) > 0 ? 1 : 0, blink = Math.sin(t * 0.9) > 0.97;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, col) => px(c, dx, y + dy, w, h, col);
    // kaki sisi jauh
    P(-13, -11, 4, 10, W2); P(-13, -2, 4, 2, HF); P(4, -11, 4, 10, W2); P(4, -2, 4, 2, HF);
    // ekor
    P(-21, -23, 1, 8, W2); P(-22, -16, 3, 4, K); P(-22, -13, 3, 1, K2);
    // badan: punggung membulat, perut berbayang
    P(-17, -25, 25, 1, W1); P(-19, -24, 29, 2, W1); P(-20, -22, 31, 9, W1); P(-19, -13, 29, 2, W2); P(-17, -11, 25, 1, W2);
    // bercak hitam
    P(-17, -24, 8, 4, K); P(-19, -21, 7, 4, K); P(-15, -17, 4, 2, K); P(-16, -23, 3, 1, K2);
    P(-5, -22, 8, 5, K); P(-3, -17, 5, 2, K); P(-6, -20, 1, 2, K); P(-4, -21, 3, 1, K2);
    P(6, -25, 4, 3, K); P(8, -22, 2, 2, K);
    // ambing
    P(-11, -11, 7, 3, PK); P(-11, -11, 7, 1, PD); P(-10, -8, 1, 2, PD); P(-6, -8, 1, 2, PD);
    // kaki sisi dekat
    P(-19, -13, 5, 12, W1); P(-19, -2, 5, 2, HF); P(-15, -12, 1, 10, W2);
    P(0, -13, 5, 12, W1); P(0, -2, 5, 2, HF); P(4, -12, 1, 10, W2);
    // leher & kepala
    P(7, -26, 7, 13, W1); P(7, -14, 6, 1, W2);
    P(11, -34, 10, 11, W1); P(10, -33, 12, 9, W1); P(19, -25, 2, 2, W2);
    P(10, -33, 5, 5, K); P(11, -34, 3, 1, K);
    // tanduk & telinga
    P(12, -36, 2, 2, '#efe2b8'); P(18, -36, 2, 2, '#efe2b8'); P(12, -36, 1, 1, '#fff6d8'); P(18, -36, 1, 1, '#fff6d8');
    P(7, -32, 3, 3, K); P(8, -31, 2, 1, PK);
    // mata
    if (blink) P(16, -30, 3, 1, K); else { P(16, -31, 3, 3, K); P(16, -31, 1, 1, '#ffffff'); }
    // moncong: rahang bawah naik turun saat mengunyah
    P(13, -26, 10, 4, PK); P(13, -26, 10, 1, '#f8c4cb'); P(16, -24, 1, 1, PD); P(20, -24, 1, 1, PD);
    P(14, -22 + chew, 8, 2, PD); P(14, -22, 8, 1, PK);
    // kalung lonceng
    P(8, -18, 6, 1, '#e2483d'); P(9, -17, 4, 3, '#c99a1c'); P(9, -17, 3, 2, '#f4cf3a');
  });
}
// shorn = sudah dicukur: badan lebih kecil & merah muda
function drawSheepBig(c, x, y, dir, t, shorn) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 15);
  const Wl = shorn ? '#f8e0d2' : '#faf6ec', Wd = shorn ? '#e8c6b2' : '#d9d1c0', Wm = shorn ? '#f0d2c0' : '#ece6d8', K = '#4a3f3a', K2 = '#2f2826';
  const nod = Math.sin(t * 1.5) > 0.6 ? 1 : 0, s = shorn ? 2 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, col) => px(c, dx, y + dy, w, h, col);
    // kaki
    P(-6, -8, 3, 7, K2); P(3, -8, 3, 7, K2);
    // bulu bergerombol, gelap di bawah & terang di atas
    [[-9, -11, 6], [-2, -9, 6], [5, -11, 5], [-9, -15, 6], [0, -17, 7], [7, -15, 5]].forEach(([a, b, r]) => disc(c, a, y + b + s, r - s, Wd));
    [[-9, -13, 5], [-2, -11, 5], [5, -12, 4], [0, -16, 6], [-7, -16, 5], [6, -16, 4]].forEach(([a, b, r]) => disc(c, a, y + b + s, r - s, Wm));
    [[-8, -17, 3], [-1, -18, 4], [5, -17, 2]].forEach(([a, b, r]) => disc(c, a, y + b + s, Math.max(1, r - s), Wl));
    // ikal bulu
    if (!shorn) [[-11, -14], [-5, -12], [1, -13], [7, -12], [-4, -19], [3, -20]].forEach(([a, b]) => { P(a, b, 2, 1, Wd); P(a + 2, b + 1, 1, 1, Wd); });
    // kaki depan (sisi dekat)
    P(-10, -7, 3, 7, K); P(-10, -1, 3, 1, K2); P(7, -7, 3, 7, K); P(7, -1, 3, 1, K2);
    // kepala
    const hy = nod;
    P(10, -19 + hy, 7, 9, K); P(11, -20 + hy, 5, 1, K); P(11, -10 + hy, 5, 1, K);
    P(7, -18 + hy, 4, 2, K); P(8, -18 + hy, 2, 1, '#e8a8a8');
    P(13, -17 + hy, 3, 3, '#ffffff'); P(14, -16 + hy, 2, 2, K2); P(14, -16 + hy, 1, 1, '#ffffff');
    P(15, -12 + hy, 2, 1, '#d99a9a');
    disc(c, 12, y - 21 + hy, 3, Wm); disc(c, 12, y - 22 + hy, 2, Wl);
  });
}

// ---------- Makanan di meja rumah: digambar besar pada ukuran aslinya supaya jelas ----------
function drawFoodBig(c, x, y, f) {
  x = Math.round(x); y = Math.round(y);
  const bowl = band => {
    px(c, x - 10, y - 10, 20, 1, '#ffffff'); px(c, x - 10, y - 9, 20, 3, '#eef3f8'); px(c, x - 9, y - 6, 18, 2, '#e7edf4'); px(c, x - 8, y - 4, 16, 2, '#dbe4ee');
    px(c, x - 6, y - 2, 12, 1, '#c5d2e0'); px(c, x - 4, y - 1, 8, 1, '#aebccb');
    px(c, x - 10, y - 8, 20, 2, band); px(c, x + 5, y - 9, 5, 1, 'rgba(120,140,170,0.25)'); px(c, x + 4, y - 6, 5, 2, 'rgba(120,140,170,0.25)');
  };
  const plate = () => { oval(c, x, y - 2, 12, 2, '#c5d2e0'); oval(c, x, y - 3, 12, 2, '#eef3f8'); oval(c, x, y - 3, 9, 1, '#ffffff'); };
  switch (f) {
    case 'rice':
      oval(c, x, y - 11, 8, 4, '#f4f1e8'); oval(c, x - 1, y - 12, 6, 3, '#ffffff');
      [[-5, -11], [-2, -14], [2, -12], [5, -11], [0, -10], [3, -14]].forEach(([a, b]) => px(c, x + a, y + b, 2, 1, '#e3dfd0'));
      bowl('#4f86e0'); break;
    case 'noodles':
      oval(c, x, y - 11, 8, 3, '#e8bf5a');
      [[-7, -12, 5], [-3, -13, 6], [1, -11, 6], [-5, -10, 4], [3, -13, 4]].forEach(([a, b, w]) => px(c, x + a, y + b, w, 1, '#fbe6a4'));
      disc(c, x - 3, y - 12, 2, '#fff6e0'); disc(c, x - 3, y - 12, 1, '#f4b23a'); px(c, x + 3, y - 12, 2, 1, '#58a84a'); px(c, x + 1, y - 10, 2, 1, '#58a84a');
      for (let i = 0; i < 11; i++) { px(c, x + 2 + i, y - 11 - i, 1, 1, '#a8743c'); px(c, x + 5 + i, y - 11 - i, 1, 1, '#8a5a35'); }
      bowl('#e2483d'); break;
    case 'dumpling':
      plate();
      [[0, -5], [-6, -2], [6, -2]].forEach(([a, b]) => {
        oval(c, x + a, y + b - 3, 5, 3, '#e3d3b0'); oval(c, x + a, y + b - 4, 5, 2, '#f8f0dc');
        for (let k = -3; k <= 3; k += 2) px(c, x + a + k, y + b - 7, 1, 2, '#d9c69e');
        px(c, x + a - 2, y + b - 4, 2, 1, '#ffffff');
      });
      break;
    case 'bun':
      [[-5, -7], [5, -7]].forEach(([a, b]) => {
        oval(c, x + a, y + b - 2, 5, 4, '#e9dfc8'); oval(c, x + a - 1, y + b - 3, 4, 3, '#fffaf0');
        px(c, x + a - 1, y + b - 6, 2, 1, '#d9c69e'); px(c, x + a, y + b - 5, 1, 1, '#d9c69e');
      });
      px(c, x - 11, y - 7, 22, 7, '#c9a26a'); px(c, x - 11, y - 7, 22, 1, '#e3c48c'); px(c, x - 11, y - 1, 22, 1, '#a07c48');
      for (let i = -9; i < 11; i += 3) px(c, x + i, y - 5, 1, 4, '#a98650');
      px(c, x - 11, y - 4, 22, 1, '#b8945a');
      break;
    case 'egg':
      plate();
      oval(c, x - 4, y - 8, 4, 5, '#e8d6b4'); oval(c, x - 5, y - 9, 3, 4, '#f6ead2'); px(c, x - 6, y - 11, 1, 2, '#ffffff');
      oval(c, x + 4, y - 7, 4, 5, '#ecdcbc'); oval(c, x + 3, y - 8, 3, 4, '#fbf0dc'); px(c, x + 2, y - 10, 1, 2, '#ffffff');
      break;
    case 'milk':
      px(c, x - 5, y - 20, 10, 20, '#d8e8f0'); px(c, x - 5, y - 16, 10, 16, '#ffffff'); px(c, x + 2, y - 16, 3, 16, '#e6eef4');
      oval(c, x, y - 16, 5, 1, '#fbfdff'); px(c, x - 5, y - 20, 10, 1, '#f4fbff'); px(c, x - 4, y - 19, 1, 3, '#f4fbff');
      px(c, x - 5, y - 1, 10, 1, '#c5d2e0');
      break;
    case 'fish':
      plate();
      oval(c, x - 1, y - 7, 8, 4, '#d8701e'); oval(c, x - 1, y - 8, 7, 3, '#f08a32');
      for (let i = 0; i < 4; i++) { px(c, x + 6 + i, y - 8 - i, 1, 2 + i * 2, '#f08a32'); }
      px(c, x + 9, y - 11, 1, 8, '#d8701e');
      px(c, x - 1, y - 12, 4, 2, '#d8701e');
      [[0, -9], [3, -7], [-2, -7], [1, -6]].forEach(([a, b]) => px(c, x + a, y + b, 2, 1, '#ffb066'));
      disc(c, x - 6, y - 8, 1, '#ffffff'); px(c, x - 6, y - 8, 1, 1, '#2a1d18');
      px(c, x - 9, y - 6, 2, 1, '#a8501c');
      break;
    default: drawFood(c, x, y, f);
  }
}

// ---------- Kopi sebagai barang di tas (bukan makanan: minuman orang dewasa) ----------
// Juga masakan buatan Russel (makanan) dan koin (bukan barang tas, hanya untuk gambar)
Object.assign(ITEMS, { coffee: { adult: 1 }, tomatoegg: { food: 1 }, carrotsoup: { food: 1 }, applejuice: { food: 1 } });
const _drawItemBase2 = drawItem;
drawItem = function (c, x, y, type, big) {
  x = Math.round(x); y = Math.round(y);
  const bowl = (band) => { px(c, x - 5, y - 4, 10, 3, '#f3f6fa'); px(c, x - 4, y - 1, 8, 1, '#c5d2e0'); px(c, x - 5, y - 3, 10, 1, band); };
  if (type === 'coffee') {
    px(c, x - 3, y - 6, 6, 6, '#ffffff'); px(c, x - 3, y - 6, 6, 2, '#7d5230'); px(c, x + 3, y - 5, 2, 3, '#ffffff'); px(c, x - 3, y - 1, 6, 1, '#c9c6c0');
    px(c, x - 1, y - 9, 1, 2, '#c9c6c0'); px(c, x + 1, y - 10, 1, 2, '#c9c6c0');
  } else if (type === 'tomatoegg') {
    oval(c, x, y - 2, 7, 2, '#f3f6fa'); oval(c, x, y - 4, 5, 2, '#f6d35a'); px(c, x - 3, y - 5, 2, 2, '#e2483d'); px(c, x + 1, y - 4, 2, 2, '#e2483d'); px(c, x - 1, y - 6, 2, 1, '#e2483d');
  } else if (type === 'carrotsoup') {
    bowl('#58a84a'); oval(c, x, y - 5, 4, 1, '#f08a32'); px(c, x - 2, y - 6, 1, 1, '#ffb066'); px(c, x + 2, y - 6, 1, 1, '#ffb066');
    px(c, x - 1, y - 9, 1, 2, 'rgba(255,255,255,0.8)'); px(c, x + 2, y - 10, 1, 2, 'rgba(255,255,255,0.8)');
  } else if (type === 'applejuice') {
    px(c, x - 2, y - 9, 5, 9, '#d8e8f0'); px(c, x - 2, y - 7, 5, 7, '#f4c23a'); px(c, x - 1, y - 6, 1, 4, '#ffe08a'); px(c, x + 2, y - 12, 1, 5, '#e2483d');
  } else if (type === 'coin') {
    disc(c, x, y - 4, 4, '#c99a1c'); disc(c, x, y - 4, 3, '#f4cf3a'); px(c, x - 1, y - 6, 1, 4, '#fff2a8');
  } else _drawItemBase2(c, x, y, type, big);
};

// ---------- Tikar piknik di Pegunungan (x,y = tengah tikar) ----------
function drawPicnic(c, x, y) {
  x = Math.round(x); y = Math.round(y);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) px(c, x - 20 + i * 5, y - 8 + j * 3, 5, 3, (i + j) % 2 ? '#fbf6ea' : '#e2483d');
  px(c, x - 20, y + 4, 40, 1, '#a8352b');
  // keranjang berisi bakpao (bagian depan tikar, supaya tidak tertutup keluarga)
  px(c, x + 10, y - 9, 1, 4, '#7d5230'); px(c, x + 19, y - 9, 1, 4, '#7d5230'); px(c, x + 10, y - 10, 10, 1, '#7d5230');
  drawFood(c, x + 15, y - 3, 'bun');
  px(c, x + 8, y - 4, 14, 7, '#c9a24a'); px(c, x + 8, y - 4, 14, 1, '#e3c46a'); for (let i = 1; i < 14; i += 3) px(c, x + 8 + i, y - 3, 1, 6, '#a8743c');
  // piring buah
  oval(c, x - 10, y + 1, 7, 2, '#ffffff'); oval(c, x - 10, y + 2, 6, 1, '#d8e0e8'); drawApple(c, x - 13, y - 1); drawApple(c, x - 7, y - 1);
}

// ---------- Gambar stiker: fungsi (c, x, y) dengan x,y = titik bawah-tengah ----------
const ST_ART = {};
const food = k => (c, x, y) => drawItem(c, x, y, k, true);
const person = (look, o = {}) => (c, x, y) => drawPerson(c, x, y, Object.assign({ look, dir: 'down', mood: 'happy', actT: 0.05, noShadow: true }, o));
const icon16 = fn => (c, x, y) => { c.save(); c.translate(x - 8, y - 15); fn(c); c.restore(); };
const head = (o = {}) => (c, x, y) => drawHead(c, x, y - 11, LOOKS.me, 'down', Object.assign({ mood: 'happy', nose: true }, o));
const crescent = (c, x, y, r) => { disc(c, x, y, r, '#fff2c0'); c.save(); c.globalCompositeOperation = 'destination-out'; disc(c, x + Math.round(r * 0.55), y - Math.round(r * 0.4), r - 1, '#000'); c.restore(); };
const sun = (c, x, y) => { for (let a = 0; a < 8; a++) px(c, x - 1 + Math.round(Math.cos(a * 0.785) * 9), y - 1 + Math.round(Math.sin(a * 0.785) * 9), 2, 2, '#f0a83a'); disc(c, x, y, 6, '#ffd84a'); disc(c, x - 1, y - 1, 3, '#fff2a8'); };
const cloud = (c, x, y, k = '#ffffff') => { oval(c, x, y, 9, 4, k); disc(c, x - 4, y - 3, 4, k); disc(c, x + 3, y - 4, 5, k); };
const HL = 'rgba(255,226,90,0.8)';
const set = (keys, fn) => keys.split(' ').forEach(k => { ST_ART[k] = fn; });

// makanan & barang tas
('rice noodles dumpling bun egg milk fish water apple carrot tomato watermelon corn mooncake redpacket ' +
  'shell starfish mushroom wildflower pencil crayon wool').split(' ').forEach(k => { ST_ART[k] = food(k); });
set('yummy eat q_eat', food('noodles'));
ST_ART.a_eat = food('dumpling');
set('q_hungry a_hungry', food('rice'));
ST_ART.q_water = food('water');
ST_ART.nomilk = food('milk');
set('coffee pleasedrink', (c, x, y) => { px(c, x - 4, y - 8, 8, 8, '#ffffff'); px(c, x - 4, y - 8, 8, 2, '#7d5230'); px(c, x + 4, y - 7, 2, 4, '#ffffff'); px(c, x - 4, y - 1, 8, 1, '#c9c6c0'); px(c, x - 2, y - 12, 1, 3, '#c9c6c0'); px(c, x + 1, y - 13, 1, 3, '#c9c6c0'); });

// orang
[['dad', 'dad'], ['mom', 'mom'], ['grandpa', 'grandpa'], ['grandma', 'grandma'], ['teacher', 'teacher'], ['meimei', 'meimei'], ['lele', 'lele'],
  ['tiantian', 'tiantian'], ['xiaoyu', 'xiaoyu'], ['auntie', 'auntie'], ['uncle', 'hiker'], ['classmate', 'tiantian'], ['gege', 'gege'], ['friend', 'meimei'],
  ['didi', 'me'], ['me', 'me'], ['q_name', 'teacher'], ['a_name', 'me'], ['q_son', 'colleague'], ['a_son', 'me'], ['q_visit', 'dad'], ['a_visit', 'me'],
  ['q_where', 'auntie'], ['q_tired', 'mom'], ['a_tired', 'me'], ['q_climb', 'dad'], ['q_gege', 'gege'],
  ['q_study', 'teacher'], ['q_color', 'xiaoyu'], ['q_howru', 'grandma'], ['a_howru', 'me']]
  .forEach(([k, l]) => { ST_ART[k] = person(l); });
set('hello bye goodmorning a_ok a_yes', person('me', { act: 'wave' }));
ST_ART.helloteacher = person('teacher', { act: 'wave' });
ST_ART.welcome = person('mom', { act: 'wave' });
ST_ART.sorry = person('me', { mood: 'sad' });
ST_ART.itsok = person('lele', { act: 'wave' });
ST_ART.thanks = (c, x, y) => { drawPerson(c, x - 3, y, { look: 'me', dir: 'down', mood: 'happy', noShadow: true }); drawHeart(c, x + 9, y - 24); };
ST_ART.jump = person('me', { bob: 4 });
set('tigersuit tiger', person('me', { outfit: { costume: 'tiger' } }));
ST_ART.dragonsuit = person('me', { outfit: { costume: 'dragon' } });
set('cowboyhat costume', person('me', { outfit: { costume: 'cowboy' } }));
set('a_try q_rope jumprope', person('xiaoyu', { act: 'rope', actT: 0.1 }));
set('playtogether q_play', (c, x, y) => { drawPerson(c, x - 7, y, { look: 'me', dir: 'right', mood: 'happy', noShadow: true }); drawPerson(c, x + 7, y, { look: 'meimei', dir: 'left', mood: 'happy', noShadow: true }); });
ST_ART.picnic = (c, x, y) => {
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) px(c, x - 15 + i * 5, y - 7 + j * 2, 5, 2, (i + j) % 2 ? '#ffffff' : '#e2483d');
  px(c, x - 12, y - 16, 12, 8, '#c9a24a'); px(c, x - 12, y - 16, 12, 1, '#a8743c'); px(c, x - 10, y - 20, 1, 4, '#a8743c'); px(c, x - 3, y - 20, 1, 4, '#a8743c'); px(c, x - 10, y - 21, 8, 1, '#a8743c');
  drawApple(c, x + 6, y - 11); drawFood(c, x + 11, y - 7, 'bun');
};

// hewan
set('dog doudou sitdown q_dog', (c, x, y) => drawDog(c, x, y, 1, 0, 'sit', 0));
set('woof goodboy learned a_dog', (c, x, y) => drawDog(c, x, y, 1, 0, 'happy', 0));
ST_ART.shakehand = (c, x, y) => drawDogTrick(c, x, y, 1, 0, 'shake', 0);
ST_ART.rollover = (c, x, y) => drawDogTrick(c, x, y, 1, 0, 'roll', 0.15);
set('cat meow', (c, x, y) => drawCat(c, x, y, 0));
set('chicken cluck', (c, x, y) => drawChicken(c, x, y, 1, 0, false));
set('cow moo', (c, x, y) => drawCowBig(c, x, y, 1, 0));
set('sheep baa', (c, x, y) => drawSheepBig(c, x, y, 1, 0));
ST_ART.shear = (c, x, y) => { drawSheepBig(c, x - 4, y, 1, 0, true); drawItem(c, x + 15, y, 'wool'); };
ST_ART.milkcow = (c, x, y) => { drawCowBig(c, x, y, 1, 0); px(c, x + 9, y - 7, 8, 7, '#a9b6c4'); px(c, x + 10, y - 7, 6, 2, '#ffffff'); };
set('duck quack', (c, x, y) => drawDuck(c, x, y, 1, 0, false));
set('rabbit q_bunny a_bunny', (c, x, y) => drawRabbit(c, x, y, 1, 0, false));
ST_ART.squirrel = (c, x, y) => drawSquirrel(c, x, y, 1, 0);
ST_ART.bird = (c, x, y) => drawBird(c, x, y - 4, 0.2, '#e2483d');
ST_ART.butterfly = (c, x, y) => drawButterfly(c, x, y - 4, 0.05, '#f39ac0');
ST_ART.crab = (c, x, y) => drawCrab(c, x, y, 0);
ST_ART.seagull = (c, x, y) => drawSeagull(c, x, y, 0, false);
ST_ART.panda = (c, x, y) => drawPanda(c, x, y, 0);
ST_ART.goldfish = (c, x, y) => drawGoldfish(c, x, y - 5, Math.PI / 1.8);

// kendaraan
ST_ART.car = (c, x, y) => drawVehicle(c, x, y, 'minicar', 1, 0, '#e2483d');
ST_ART.bus = (c, x, y) => { px(c, x - 15, y - 17, 30, 12, '#f4c23a'); px(c, x - 15, y - 17, 30, 1, '#ffe08a'); for (let i = 0; i < 3; i++) px(c, x - 13 + i * 8, y - 15, 6, 4, '#bfe3f2'); px(c, x + 10, y - 15, 4, 8, '#bfe3f2'); px(c, x - 15, y - 9, 30, 1, '#e2483d'); disc(c, x - 8, y - 4, 3, '#2a2a2e'); disc(c, x + 8, y - 4, 3, '#2a2a2e'); };
ST_ART.bike = (c, x, y) => drawVehicle(c, x, y, 'bike', 1, 0);
const miniTrain = (body, top) => (c, x, y) => { px(c, x - 14, y - 14, 26, 10, body); px(c, x - 14, y - 20, 10, 7, top); px(c, x - 12, y - 18, 5, 4, '#fff2c8'); px(c, x + 4, y - 19, 4, 5, '#3a3a3a'); disc(c, x - 8, y - 3, 3, '#2a2a2e'); disc(c, x + 6, y - 3, 3, '#2a2a2e'); };
set('train steamtrain', miniTrain('#d9483b', '#a8352b'));
ST_ART.bullettrain = (c, x, y) => { for (let r = 0; r < 11; r++) px(c, x - 16, y - 15 + r, 22 + Math.round(r * 0.9), 1, '#fbfbfb'); px(c, x - 14, y - 12, 15, 3, '#2f4a7a'); px(c, x - 16, y - 7, 31, 2, '#4f86e0'); disc(c, x - 9, y - 2, 2, '#2a2a2e'); disc(c, x + 5, y - 2, 2, '#2a2a2e'); };
ST_ART.freighttrain = (c, x, y) => { px(c, x - 16, y - 16, 14, 12, '#f4b23a'); px(c, x - 1, y - 14, 17, 10, '#e2483d'); for (let i = 1; i < 17; i += 3) px(c, x - 1 + i, y - 14, 1, 10, 'rgba(0,0,0,0.2)'); disc(c, x - 10, y - 3, 3, '#2a2a2e'); disc(c, x + 8, y - 3, 3, '#2a2a2e'); };
ST_ART.boat = (c, x, y) => drawVehicle(c, x, y, 'boat', 1, 0);
set('dragonboat dragon', (c, x, y) => { px(c, x - 16, y - 6, 26, 4, '#a8352b'); px(c, x - 16, y - 7, 26, 1, '#f4cf3a'); px(c, x + 8, y - 16, 5, 11, '#58a84a'); px(c, x + 9, y - 21, 10, 7, '#58a84a'); px(c, x + 13, y - 20, 2, 2, '#ffffff'); px(c, x + 14, y - 19, 1, 1, '#2a1d18'); px(c, x + 10, y - 24, 1, 3, '#f4cf3a'); px(c, x + 14, y - 24, 1, 3, '#f4cf3a'); px(c, x + 15, y - 15, 4, 1, '#e2483d'); px(c, x - 18, y - 12, 3, 6, '#58a84a'); });
ST_ART.plane = (c, x, y) => drawVehicle(c, x, y - 11, 'plane', 1, 0);
ST_ART.hotairballoon = (c, x, y) => drawHotAirBalloon(c, x, y - 8, 0);

// alam, cuaca, waktu
set('sun sunny', (c, x, y) => sun(c, x, y - 12));
ST_ART.cloud = (c, x, y) => cloud(c, x, y - 6);
ST_ART.cloudy = (c, x, y) => { sun(c, x + 5, y - 18); cloud(c, x - 2, y - 6); };
ST_ART.rain = (c, x, y) => { cloud(c, x, y - 16, '#dfe6ee'); for (const dx of [-6, 0, 6]) px(c, x + dx, y - 9, 1, 5, '#4fa0cf'); };
ST_ART.snow = (c, x, y) => { const cy = y - 12; px(c, x - 9, cy, 19, 2, '#bfe3f2'); px(c, x, cy - 9, 2, 19, '#bfe3f2'); for (let i = -6; i <= 6; i++) { px(c, x + i, cy + i, 2, 2, '#e3f5fc'); px(c, x + i, cy - i, 2, 2, '#e3f5fc'); } };
ST_ART.windy = (c, x, y) => { for (const [dy, l] of [[-18, 18], [-11, 24], [-4, 16]]) px(c, x - 12, y + dy, l, 2, '#9fd4f2'); oval(c, x + 12, y - 11, 2, 1, '#58a84a'); };
set('moon night goodevening', (c, x, y) => { crescent(c, x - 2, y - 11, 9); drawStar(c, x + 9, y - 3, '#ffd84a'); });
set('goodnight sleep', (c, x, y) => { crescent(c, x - 4, y - 9, 8); drawZ(c, x + 9, y - 16, '#4f86e0'); drawZ(c, x + 5, y - 8, '#4f86e0'); });
set('star great perfect', (c, x, y) => drawStar(c, x, y - 4, '#ffd84a'));
set('morning wakeup', (c, x, y) => { disc(c, x, y - 6, 9, '#ffd84a'); disc(c, x - 2, y - 8, 4, '#fff2a8'); px(c, x - 16, y - 5, 32, 6, '#7cc85a'); px(c, x - 16, y - 5, 32, 1, '#58a84a'); });
ST_ART.rainbow = (c, x, y) => drawRainbow(c, x, y - 2, 15);
ST_ART.tree = (c, x, y) => drawTree(c, x, y, { r: 10 });
set('appletree q_apple a_like', (c, x, y) => drawTree(c, x, y, { r: 11, apples: [[-5, -3], [4, -6], [6, 3], [-2, 3]] }));
set('flower pretty', (c, x, y) => drawFlower(c, x, y, FLOWER_COLORS[0], 0));
ST_ART.leaf = (c, x, y) => { oval(c, x, y - 5, 7, 3, '#58a84a'); px(c, x - 7, y - 5, 14, 1, '#3d7f33'); };
ST_ART.petal = (c, x, y) => { oval(c, x, y - 6, 4, 6, '#f39ac0'); px(c, x, y - 11, 1, 9, '#cc6a95'); };
ST_ART.pistil = (c, x, y) => { disc(c, x, y - 6, 5, '#f4cf3a'); disc(c, x, y - 6, 2, '#e9b02a'); px(c, x - 3, y - 9, 1, 1, '#ffffff'); };
ST_ART.stem = (c, x, y) => { px(c, x, y - 14, 2, 14, '#3f8a3a'); oval(c, x - 4, y - 7, 3, 1, '#58a84a'); };
ST_ART.root = (c, x, y) => { px(c, x - 14, y - 26, 28, 4, '#7cc85a'); px(c, x - 14, y - 22, 28, 22, '#8a5a35'); px(c, x, y - 22, 2, 14, '#f0dcae'); for (let k = 0; k < 6; k++) { px(c, x - 1 - k, y - 14 + k, 1, 1, '#f0dcae'); px(c, x + 2 + k, y - 12 + k, 1, 1, '#f0dcae'); } };
ST_ART.seed = (c, x, y) => { oval(c, x - 3, y - 3, 2, 3, '#c9a24a'); oval(c, x + 3, y - 2, 2, 3, '#a8743c'); };
ST_ART.sprout = (c, x, y) => drawCrop(c, x, y, 'carrot', 3, 0);
ST_ART.watering = (c, x, y) => { px(c, x - 5, y - 8, 8, 7, '#4f86e0'); px(c, x + 3, y - 10, 2, 4, '#4f86e0'); px(c, x - 4, y - 10, 5, 2, '#2f5bab'); px(c, x + 5, y - 11, 2, 1, '#8fd0f2'); };
set('sunflower bloom', (c, x, y) => drawSunflowerPot(c, x, y, 5, 0));
set('bud growtomorrow seeyoutomorrow', (c, x, y) => drawSunflowerPot(c, x, y, 4, 0));
ST_ART.mountain = (c, x, y) => { for (let r = 0; r < 24; r++) px(c, x - 4 - r, y - 26 + r, r * 2 + 1, 1, '#8a8fb0'); for (let r = 0; r < 6; r++) px(c, x - 4 - r, y - 26 + r, r * 2 + 1, 1, '#ffffff'); for (let r = 0; r < 16; r++) px(c, x + 10 - r, y - 16 + r, r * 2 + 1, 1, '#9da2c2'); };
ST_ART.waterfall = (c, x, y) => { px(c, x - 12, y - 30, 24, 6, '#8f8c86'); drawWaterfall(c, x - 5, y - 24, 10, 18, 0); oval(c, x, y - 3, 12, 3, '#4fa0cf'); };
set('river sea wave q_sea', (c, x, y) => { for (let r = 0; r < 3; r++) for (let i = -14; i <= 14; i++) px(c, x + i, y - 8 - r * 6 + Math.round(Math.sin(i / 3 + r) * 2), 1, 3, r % 2 ? '#4fa0cf' : '#8fd0f2'); });
set('swim cool q_swim', (c, x, y) => { drawHead(c, x, y - 22, LOOKS.me, 'down', { mood: 'happy' }); oval(c, x, y - 7, 15, 6, '#4fa0cf'); px(c, x - 11, y - 11, 6, 1, '#ffffff'); px(c, x + 5, y - 11, 6, 1, '#ffffff'); });
ST_ART.rock = (c, x, y) => drawRock(c, x, y, 6);
ST_ART.sand = (c, x, y) => { oval(c, x, y - 4, 14, 5, '#f2dca0'); oval(c, x, y - 6, 10, 3, '#fbecc4'); };
ST_ART.sandcastle = (c, x, y) => drawSandcastle(c, x, y, 3);
ST_ART.palm = (c, x, y) => { for (let i = 0; i < 22; i++) px(c, x - 1 + Math.round(Math.sin(i / 10) * 3), y - i, 3, 1, i % 4 ? '#a8743c' : '#8a5a35'); for (const [dx, dy] of [[-1, 0.4], [1, 0.4], [-1, -0.2], [1, -0.2]]) for (let k = 0; k < 10; k++) px(c, x + 2 + Math.round(dx * k), y - 23 + Math.round(dy * k + k * k / 25), 2, 2, '#4a9a3a'); disc(c, x + 1, y - 21, 2, '#7d5230'); };
set('parasol beach', (c, x, y) => { px(c, x, y - 22, 1, 22, '#e8e2d6'); for (let dy = -7; dy <= 0; dy++) { const w = Math.floor(14 * Math.sqrt(1 - dy * dy / 49)); for (let i = -w; i <= w; i++) px(c, x + i, y - 22 + dy, 1, 1, Math.floor((i + 20) / 5) % 2 ? '#ffffff' : '#e2483d'); } oval(c, x, y - 1, 14, 2, '#f2dca0'); });
ST_ART.hay = (c, x, y) => { px(c, x - 13, y - 14, 26, 14, '#e3c46a'); px(c, x - 13, y - 14, 26, 2, '#f0d684'); px(c, x - 13, y - 8, 26, 1, '#c9a24a'); px(c, x - 4, y - 14, 2, 14, '#a8743c'); px(c, x + 4, y - 14, 2, 14, '#a8743c'); };

// tempat
const house = (roof, roofD, wall) => (c, x, y) => { drawHouse(c, x - 13, y - 22, 26, 22, { roof, roofD, wall }); px(c, x - 3, y - 9, 7, 8, PAL.woodD); px(c, x - 2, y - 8, 5, 7, PAL.wood); px(c, x + 1, y - 5, 1, 1, '#f4cf3a'); };
ST_ART.home = house('#d4553f', '#a23a2c');
ST_ART.barn = house('#a8352b', '#7d2a22', '#e9c89a');
ST_ART.village = (c, x, y) => { drawHouse(c, x - 17, y - 16, 14, 16, { roof: '#4f86e0', roofD: '#2f5bab' }); drawHouse(c, x + 3, y - 20, 14, 20, { roof: '#58a84a', roofD: '#3d7f33' }); };
ST_ART.school = (c, x, y) => { house('#3f9a9a', '#2a7272', '#fbefd0')(c, x - 3, y); px(c, x + 14, y - 30, 1, 30, '#a9a6a0'); px(c, x + 15, y - 30, 7, 3, '#e2483d'); px(c, x + 15, y - 27, 7, 3, '#ffffff'); };
ST_ART.office = (c, x, y) => { px(c, x - 8, y - 32, 16, 32, '#a9b6c4'); for (let wy = y - 29; wy < y - 6; wy += 5) for (const wx of [-5, 1]) px(c, x + wx, wy, 4, 3, '#e8f6fc'); px(c, x - 2, y - 5, 4, 5, '#5a6070'); };
ST_ART.farm = (c, x, y) => { px(c, x - 15, y - 9, 30, 9, '#9a7048'); for (let i = -10; i < 12; i += 6) drawCrop(c, x + i, y - 1, 'carrot', 4, 0); for (let i = -15; i <= 15; i += 6) px(c, x + i, y - 14, 2, 6, PAL.woodD); px(c, x - 15, y - 13, 31, 1, PAL.wood); };
set('classroom board count howmany q_count countagain', (c, x, y) => { px(c, x - 16, y - 26, 32, 20, PAL.wood); px(c, x - 14, y - 24, 28, 15, '#2f5a46'); [1, 2, 3].forEach((d, i) => drawDigit(c, x - 11 + i * 8, y - 21, d, '#f4f0e0')); px(c, x - 12, y - 6, 2, 6, PAL.woodD); px(c, x + 10, y - 6, 2, 6, PAL.woodD); });
set('map a_where', icon16(c => { px(c, 1, 3, 14, 11, '#f3e3c0'); px(c, 5, 3, 1, 11, '#d9c296'); px(c, 10, 3, 1, 11, '#d9c296'); px(c, 2, 9, 4, 1, '#5fb3e0'); px(c, 11, 5, 3, 3, '#58a84a'); px(c, 7, 9, 2, 2, '#e2483d'); }));

// benda
set('ball throw q_ball', (c, x, y) => { disc(c, x, y - 5, 5, '#fbf8f0'); px(c, x - 3, y - 8, 3, 3, '#e2483d'); px(c, x + 2, y - 5, 2, 3, '#4f86e0'); px(c, x - 2, y - 2, 3, 1, '#58a84a'); });
ST_ART.swing = (c, x, y) => { px(c, x - 14, y - 28, 2, 28, PAL.woodD); px(c, x + 12, y - 28, 2, 28, PAL.woodD); px(c, x - 15, y - 29, 30, 2, PAL.wood); px(c, x - 5, y - 27, 1, 18, '#7d6a5a'); px(c, x + 4, y - 27, 1, 18, '#7d6a5a'); px(c, x - 7, y - 9, 14, 3, '#e2483d'); };
set('slide q_slide fun', (c, x, y) => { px(c, x - 14, y - 26, 2, 26, '#7d8a98'); px(c, x - 8, y - 26, 2, 26, '#7d8a98'); for (let yy = y - 22; yy < y; yy += 5) px(c, x - 14, yy, 8, 1, '#a9b6c4'); for (let i = 0; i < 22; i++) px(c, x - 6 + i, y - 26 + i, 3, 3, i % 6 < 3 ? '#e2483d' : '#ef6a5a'); });
set('piano playpiano follow listenagain yourturn', (c, x, y) => { px(c, x - 15, y - 20, 30, 18, '#2a1d18'); px(c, x - 14, y - 12, 28, 6, '#ffffff'); for (let k = 0; k < 7; k++) px(c, x - 13 + k * 4, y - 12, 1, 6, '#c9c6c0'); for (const k of [0, 1, 3, 4, 5]) px(c, x - 12 + k * 4, y - 12, 2, 3, '#2a1d18'); px(c, x - 14, y - 2, 2, 2, '#2a1d18'); px(c, x + 12, y - 2, 2, 2, '#2a1d18'); });
set('sing rhythm followrhythm', (c, x, y) => { drawNote(c, x - 3, y - 2, '#8f62c9'); drawNote(c, x + 4, y - 5, '#e2483d'); });
set('drum playdrum followdrum hits', (c, x, y) => drawDrumKit(c, x, y, 0, 0));
set('bigdrum big', (c, x, y) => { disc(c, x, y - 12, 11, '#a8352b'); disc(c, x, y - 12, 9, '#f6efe0'); disc(c, x, y - 12, 3, '#e2483d'); });
set('smalldrum small', (c, x, y) => { oval(c, x, y - 7, 6, 2, '#f6efe0'); px(c, x - 6, y - 7, 13, 5, '#4f86e0'); px(c, x - 6, y - 3, 13, 1, '#2f5bab'); });
ST_ART.bell = (c, x, y) => { oval(c, x, y - 5, 5, 4, '#f4cf3a'); px(c, x - 5, y - 4, 11, 3, '#f4cf3a'); disc(c, x, y - 1, 1, '#c99a1c'); px(c, x - 1, y - 10, 2, 2, '#c99a1c'); };
ST_ART.computer = (c, x, y) => { px(c, x - 12, y - 24, 24, 17, '#3a3f4a'); px(c, x - 10, y - 22, 20, 13, '#7cc4f0'); px(c, x - 8, y - 14, 16, 3, '#58a84a'); px(c, x - 2, y - 7, 4, 4, '#3a3f4a'); px(c, x - 7, y - 3, 14, 2, '#3a3f4a'); };
ST_ART.laptop = (c, x, y) => drawLaptop(c, x - 8, y - 3, 0.6);
set('phone hellophone', (c, x, y) => drawPhone(c, x, y - 1, false, 0));
set('book story', (c, x, y) => { px(c, x - 14, y - 20, 13, 16, '#fff6e0'); px(c, x + 1, y - 20, 13, 16, '#f4cf3a'); px(c, x - 1, y - 21, 2, 18, '#a8743c'); for (let k = 0; k < 4; k++) { px(c, x - 12, y - 17 + k * 3, 9, 1, '#c9a873'); px(c, x + 3, y - 17 + k * 3, 9, 1, '#c99a1c'); } });
ST_ART.clock = (c, x, y) => drawClock(c, x, y - 8, 0.8);
ST_ART.aquarium = (c, x, y) => { px(c, x - 15, y - 22, 30, 20, '#cfe8f5'); px(c, x - 14, y - 19, 28, 16, '#4fa0cf'); drawGoldfish(c, x, y - 12, Math.PI / 1.8); px(c, x - 14, y - 4, 28, 2, '#e9c86a'); px(c, x - 16, y - 2, 32, 2, '#7d5230'); };
ST_ART.coffeemachine = (c, x, y) => drawCoffeeMachine(c, x, y + 1, false, 0);
set('robot makecoffee', (c, x, y) => drawRobot(c, x, y, 1, 0.3, false, false));
ST_ART.dance = (c, x, y) => { drawRobot(c, x, y, 1, 1 / 6, false, false, true); drawNote(c, x - 12, y - 18, '#8f62c9'); drawNote(c, x + 13, y - 24, '#e2483d'); };
ST_ART.followme = (c, x, y) => { drawPerson(c, x - 10, y, { look: 'me', dir: 'right', mood: 'happy', noShadow: true }); drawRobot(c, x + 10, y, -1, 0.3, false, false); };
ST_ART.coffeeadult = (c, x, y) => { drawPerson(c, x - 5, y, { look: 'dad', dir: 'down', mood: 'happy', noShadow: true }); drawItem(c, x + 12, y - 2, 'coffee'); };
ST_ART.givedad = (c, x, y) => { drawPerson(c, x - 10, y, { look: 'me', dir: 'right', mood: 'happy', noShadow: true }); drawPerson(c, x + 10, y, { look: 'dad', dir: 'left', mood: 'happy', noShadow: true }); drawItem(c, x, y - 20, 'coffee'); };
ST_ART.desk = (c, x, y) => { px(c, x - 15, y - 14, 30, 8, '#d9b98a'); px(c, x - 15, y - 6, 30, 3, '#a8865a'); px(c, x - 13, y - 3, 2, 3, '#7d5f3a'); px(c, x + 11, y - 3, 2, 3, '#7d5f3a'); };
ST_ART.chair = (c, x, y) => { px(c, x - 5, y - 16, 10, 8, '#c08a52'); px(c, x - 5, y - 16, 10, 1, '#d9a56a'); px(c, x - 6, y - 8, 12, 3, '#a8743c'); px(c, x - 5, y - 5, 2, 5, '#7d5230'); px(c, x + 3, y - 5, 2, 5, '#7d5230'); };
ST_ART.window = (c, x, y) => { px(c, x - 13, y - 26, 26, 22, PAL.woodD); px(c, x - 11, y - 24, 22, 18, '#8fd0f2'); px(c, x - 1, y - 24, 2, 18, PAL.woodD); px(c, x - 11, y - 16, 22, 2, PAL.woodD); disc(c, x + 6, y - 20, 2, '#ffd84a'); };
set('gate closegate', (c, x, y) => drawGate(c, x - 12, y, false));
ST_ART.opengate = (c, x, y) => drawGate(c, x - 12, y, true);
set('lantern cny happynewyear', (c, x, y) => drawHangingLantern(c, x, y - 10, 0));
ST_ART.gongxi = food('redpacket');
ST_ART.liondance = (c, x, y) => drawLionDance(c, x - 4, y, 0);
ST_ART.fireworks = (c, x, y) => { drawFirework(c, x - 5, y - 18, 0.7, '#ff6a5a'); drawFirework(c, x + 7, y - 10, 0.5, '#ffd84a'); };
set('midautumn happymidautumn', (c, x, y) => { disc(c, x + 5, y - 18, 9, '#fff2c0'); drawItem(c, x - 6, y, 'mooncake'); });
set('cake birthday happybirthday blowcandles', (c, x, y) => drawCake(c, x, y, true, 0.1));
ST_ART.kite = (c, x, y) => drawKite(c, x, y - 22, 0);
ST_ART.balloon = (c, x, y) => drawBalloons(c, x, y, 0);
set('camera cheese', (c, x, y) => { px(c, x - 7, y - 10, 14, 9, '#4a4a52'); px(c, x - 3, y - 12, 6, 2, '#4a4a52'); disc(c, x, y - 6, 3, '#bfe3f2'); disc(c, x, y - 6, 1, '#2f5bab'); px(c, x + 4, y - 9, 2, 1, '#e2483d'); });
ST_ART.photo = (c, x, y) => { px(c, x - 14, y - 24, 28, 22, '#ffffff'); px(c, x - 12, y - 22, 24, 16, '#8fd0f2'); for (let r = 0; r < 8; r++) px(c, x - 6 - r, y - 14 + r, r * 2 + 1, 1, '#58a84a'); disc(c, x + 6, y - 18, 2, '#ffd84a'); };
set('sticker stickerbook', (c, x, y) => { px(c, x - 8, y - 18, 16, 18, '#fff6e0'); px(c, x - 8, y - 18, 2, 18, '#e2483d'); drawStar(c, x + 1, y - 12, '#ffd84a'); drawHeart(c, x + 1, y - 5, '#ef5a7a'); });
set('bag bagfull take', icon16(c => { px(c, 5, 1, 6, 2, '#8a5030'); px(c, 2, 4, 12, 11, '#d9483b'); px(c, 2, 4, 12, 1, '#f08a7a'); px(c, 4, 8, 8, 5, '#e8735a'); px(c, 7, 9, 2, 2, '#f4cf3a'); }));
set('give giveyou towhom surprise todaysurprise', (c, x, y) => { px(c, x - 6, y - 9, 12, 9, '#e2483d'); px(c, x - 7, y - 11, 14, 3, '#ef6a5a'); px(c, x - 1, y - 11, 2, 11, '#f4cf3a'); px(c, x - 4, y - 14, 3, 3, '#f4cf3a'); px(c, x + 1, y - 14, 3, 3, '#f4cf3a'); });
ST_ART.cannoteat = (c, x, y) => { drawMushroom(c, x, y); for (let k = -6; k <= 6; k++) { px(c, x + k, y - 6 + Math.round(k * 0.7), 2, 1, '#e2483d'); px(c, x + k, y - 6 - Math.round(k * 0.7), 2, 1, '#e2483d'); } };
set('right good', (c, x, y) => { for (let k = 0; k < 4; k++) px(c, x - 6 + k, y - 6 + k, 2, 2, '#58a84a'); for (let k = 0; k < 8; k++) px(c, x - 3 + k, y - 3 - k, 2, 2, '#58a84a'); });
set('again tryagain back', (c, x, y) => { for (let a = 0; a < 26; a++) { const t = a / 26 * 5.2; px(c, x + Math.round(Math.cos(t) * 9), y - 12 + Math.round(Math.sin(t) * 9), 2, 2, '#4f86e0'); } px(c, x + 6, y - 20, 5, 2, '#4f86e0'); px(c, x + 9, y - 20, 2, 5, '#4f86e0'); });
ST_ART.start = (c, x, y) => { for (let r = 0; r < 11; r++) px(c, x - 4, y - 13 + r, Math.round((r < 6 ? r : 10 - r) * 1.6) + 1, 1, '#58a84a'); };

// perasaan & tubuh
set('happy q_happy a_happy', head({ mood: 'happy' }));
['sad', 'angry', 'scared', 'sleepy'].forEach(m => { ST_ART[m] = head({ mood: m }); });
const facePart = rects => (c, x, y) => { const ht = y - 11; drawHead(c, x, ht, LOOKS.me, 'down', { mood: 'happy', nose: true }); rects(x, ht).forEach(r => px(c, r[0], r[1], r[2], r[3], HL)); };
ST_ART.head = head();
ST_ART.hair = facePart((x, ht) => [[x - 6, ht - 3, 12, 6]]);
ST_ART.eyes = facePart((x, ht) => [[x - 5, ht + 4, 10, 5]]);
ST_ART.ears = facePart((x, ht) => [[x - 8, ht + 4, 3, 5], [x + 5, ht + 4, 3, 5]]);
ST_ART.nose = facePart((x, ht) => [[x - 2, ht + 6, 4, 3]]);
ST_ART.mouth = facePart((x, ht) => [[x - 3, ht + 8, 6, 3]]);
const bodyPart = rects => (c, x, y) => { drawPerson(c, x, y, { look: 'me', dir: 'down', mood: 'happy', noShadow: true }); rects(x, y).forEach(r => px(c, r[0], r[1], r[2], r[3], HL)); };
ST_ART.hand = bodyPart((x, y) => [[x - 7, y - 8, 3, 5], [x + 4, y - 8, 3, 5]]);
ST_ART.tummy = bodyPart((x, y) => [[x - 4, y - 8, 8, 5]]);
ST_ART.foot = bodyPart((x, y) => [[x - 5, y - 3, 11, 3]]);
// pakaian (ikon dari cermin; dibaca saat digambar karena ui.js dimuat belakangan)
['hat', 'shirt', 'pants', 'shoes', 'scarf', 'umbrella'].forEach(k => { ST_ART[k] = icon16(c => CLOTH_ICONS[k](c)); });
// rutinitas
ST_ART.brush = (c, x, y) => { px(c, x - 7, y - 4, 12, 2, '#4f86e0'); px(c, x + 3, y - 7, 3, 3, '#ffffff'); px(c, x + 3, y - 8, 3, 1, '#8fd0f2'); };
ST_ART.wash = (c, x, y) => {
  px(c, x - 8, y - 24, 12, 3, '#a9b6c4'); px(c, x + 1, y - 22, 3, 4, '#a9b6c4'); px(c, x - 4, y - 27, 4, 3, '#7d8a98');
  px(c, x + 2, y - 18, 1, 7, '#7cc4f0');
  px(c, x - 5, y - 11, 6, 5, '#ffd7b5'); px(c, x + 3, y - 11, 6, 5, '#ffd7b5'); px(c, x - 5, y - 6, 6, 1, '#e8b48a'); px(c, x + 3, y - 6, 6, 1, '#e8b48a');
  for (const [dx, dy] of [[-8, -13], [9, -14], [-3, -15]]) disc(c, x + dx, y + dy, 1, '#cfefff');
  oval(c, x + 2, y - 2, 10, 2, '#e8eef2');
};
// warna & angka
FLOWER_COLORS.concat([['green', '#58a84a', '#3d7f33']]).forEach(([k, a, b]) => { ST_ART[k] = (c, x, y) => { disc(c, x, y - 9, 8, b); disc(c, x - 1, y - 10, 7, a); disc(c, x - 3, y - 13, 1, '#ffffff'); }; });
const DOT_COLS = ['#e2483d', '#f08a32', '#e8b02a', '#58a84a', '#4f86e0'];
// angka = kartu hitung: kartu ukurannya sama, titiknya sebanyak angka
for (let n = 1; n <= 10; n++) ST_ART['n' + n] = (c, x, y) => {
  px(c, x - 17, y - 22, 34, 22, '#fffaf0'); px(c, x - 17, y - 22, 34, 1, '#ffffff'); px(c, x - 17, y - 1, 34, 1, '#e3d3b0');
  const top = Math.min(n, 5), rows = n > 5 ? [top, n - 5] : [n];
  rows.forEach((cnt, r) => {
    for (let i = 0; i < cnt; i++) disc(c, Math.round(x - (cnt - 1) * 3 + i * 6), y - (rows.length > 1 ? 16 - r * 9 : 11), 2, DOT_COLS[(r * 5 + i) % 5]);
  });
};

// Stiker siap pakai: digambar bergaris tepi, dipotong rapat, lalu diperhalus 4×.
// gray = belum didapat (siluet). Hasil disimpan supaya cepat.
const _stCache = {};
const _stc = document.createElement('canvas'); _stc.width = 48; _stc.height = 48;
const _stx = _stc.getContext('2d', { willReadFrequently: true });
function stickerCanvas(k, gray) {
  const id = k + (gray ? '-g' : '');
  if (id in _stCache) return _stCache[id];
  const fn = ST_ART[k];
  let out = null;
  if (fn) {
    try {
      _stx.clearRect(0, 0, 48, 48);
      drawOutlined(_stx, 24, 45, 1, fn);
      const d = _stx.getImageData(0, 0, 48, 48).data;
      let x0 = 48, y0 = 48, x1 = -1, y1 = -1;
      for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) if (d[(y * 48 + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 >= 0) {
        const w = x1 - x0 + 1, h = y1 - y0 + 1, c = document.createElement('canvas');
        c.width = w + 2; c.height = h + 2;
        const cx = c.getContext('2d', { willReadFrequently: true });
        cx.drawImage(_stc, x0, y0, w, h, 1, 1, w, h);
        if (gray) { cx.globalCompositeOperation = 'source-in'; cx.fillStyle = '#c4b49a'; cx.fillRect(0, 0, c.width, c.height); }
        out = upscale4(c).toDataURL();
      }
    } catch (e) { out = null; }
  }
  return (_stCache[id] = out);
}
