// Meja rakit: satu jendela untuk 6 permainan merakit (bangunan, mobil, rel kereta, pesawat, kayu, manusia salju).
// Tiap permainan = daftar langkah. Langkah bisa: pilih gambar (opts), pilih warna (colors), atau ketuk berkali-kali (taps, sambil berhitung).
// Hasil tersimpan di EX dan tampil di tempatnya (places.js).

// ================= KATA BARU =================
Object.assign(WORDS, {
  // tempat & orang
  site: ['工地', 'gōng dì', 'proyek bangunan'],
  garage: ['修车店', 'xiū chē diàn', 'bengkel mobil'],
  carpentry: ['木工房', 'mù gōng fáng', 'bengkel tukang kayu'],
  toyshop: ['玩具店', 'wán jù diàn', 'toko mainan'],
  mechanic: ['修车师傅', 'xiū chē shī fu', 'montir'],
  carpenter: ['木匠', 'mù jiang', 'tukang kayu'],
  builder: ['建筑工人', 'jiàn zhù gōng rén', 'pekerja bangunan'],
  pilot: ['飞行员', 'fēi xíng yuán', 'pilot'],
  shopkeeper: ['店主', 'diàn zhǔ', 'pemilik toko'],
  // proyek bangunan
  whatbuild: ['盖什么？', 'gài shén me', 'mau membangun apa?'],
  house: ['房子', 'fáng zi', 'rumah'],
  tower: ['高塔', 'gāo tǎ', 'menara'],
  excavator: ['挖掘机', 'wā jué jī', 'ekskavator'],
  dig: ['挖一挖', 'wā yi wā', 'gali tanahnya'],
  truck: ['卡车', 'kǎ chē', 'truk'],
  truckgo: ['卡车运走', 'kǎ chē yùn zǒu', 'truk mengangkut tanah'],
  crane: ['起重机', 'qǐ zhòng jī', 'derek'],
  brick: ['砖', 'zhuān', 'batu bata'],
  putbrick: ['放砖块', 'fàng zhuān kuài', 'pasang batu bata'],
  roof: ['屋顶', 'wū dǐng', 'atap'],
  cardrive: ['汽车开过去', 'qì chē kāi guò qu', 'mobil lewat'],
  builddone: ['盖好了！', 'gài hǎo le', 'sudah jadi!'],
  cone: ['路锥', 'lù zhuī', 'kerucut jalan'],
  hardhat: ['安全帽', 'ān quán mào', 'helm proyek'],
  // mobil
  makecar: ['做汽车', 'zuò qì chē', 'membuat mobil'],
  pickcar: ['选一辆车', 'xuǎn yí liàng chē', 'pilih mobil'],
  policecar: ['警车', 'jǐng chē', 'mobil polisi'],
  firetruck: ['消防车', 'xiāo fáng chē', 'mobil pemadam kebakaran'],
  icecreamtruck: ['冰淇淋车', 'bīng qí lín chē', 'mobil es krim'],
  tire: ['轮子', 'lún zi', 'roda'],
  putwheels: ['装轮子', 'zhuāng lún zi', 'pasang roda'],
  steeringwheel: ['方向盘', 'fāng xiàng pán', 'setir'],
  carlight: ['车灯', 'chē dēng', 'lampu mobil'],
  mycar: ['我的汽车', 'wǒ de qì chē', 'mobilku'],
  drive: ['开车', 'kāi chē', 'menyetir'],
  beep: ['嘀嘀！', 'dī dī', 'tin tin!'],
  // rel kereta
  buildtrack: ['拼轨道', 'pīn guǐ dào', 'susun rel kereta'],
  straight: ['直的', 'zhí de', 'lurus'],
  curve: ['弯的', 'wān de', 'belok'],
  whichone: ['哪一块？', 'nǎ yí kuài', 'yang mana?'],
  tryother: ['换一块', 'huàn yí kuài', 'coba yang lain'],
  traingo: ['火车开了！', 'huǒ chē kāi le', 'keretanya jalan!'],
  choochoo: ['呜呜——', 'wū wū', 'tut tuut!'],
  blocks: ['积木', 'jī mù', 'balok mainan'],
  // pesawat
  makeplane: ['做飞机', 'zuò fēi jī', 'membuat pesawat'],
  pickwing: ['选翅膀', 'xuǎn chì bǎng', 'pilih sayap'],
  bigwing: ['大翅膀', 'dà chì bǎng', 'sayap besar'],
  smallwing: ['小翅膀', 'xiǎo chì bǎng', 'sayap kecil'],
  twowing: ['两层翅膀', 'liǎng céng chì bǎng', 'sayap dua tingkat'],
  planetail: ['尾巴', 'wěi ba', 'ekor pesawat'],
  propeller: ['螺旋桨', 'luó xuán jiǎng', 'baling-baling'],
  myplane: ['我的飞机', 'wǒ de fēi jī', 'pesawatku'],
  fly: ['飞！', 'fēi', 'terbang!'],
  land: ['降落', 'jiàng luò', 'mendarat'],
  lookdown: ['往下看！', 'wǎng xià kàn', 'lihat ke bawah!'],
  runway: ['跑道', 'pǎo dào', 'landasan pacu'],
  controltower: ['塔台', 'tǎ tái', 'menara kontrol'],
  hangar: ['机库', 'jī kù', 'hanggar pesawat'],
  // kayu
  woodwork: ['做木工', 'zuò mù gōng', 'bertukang kayu'],
  whatmake: ['做什么？', 'zuò shén me', 'mau membuat apa?'],
  birdhouse: ['鸟屋', 'niǎo wū', 'rumah burung'],
  woodboat: ['小木船', 'xiǎo mù chuán', 'perahu kayu'],
  wood: ['木头', 'mù tou', 'kayu'],
  saw: ['锯一锯', 'jù yi jù', 'gergaji kayunya'],
  nail: ['钉子', 'dīng zi', 'paku'],
  hammernail: ['钉钉子', 'dìng dīng zi', 'pukul pakunya'],
  paint: ['刷油漆', 'shuā yóu qī', 'mengecat'],
  makedone: ['做好了！', 'zuò hǎo le', 'sudah jadi!'],
  birdcome: ['小鸟来了', 'xiǎo niǎo lái le', 'burungnya datang'],
  // manusia salju
  snowman: ['雪人', 'xuě rén', 'manusia salju'],
  makesnowman: ['堆雪人', 'duī xuě rén', 'membuat manusia salju'],
  bigball: ['大雪球', 'dà xuě qiú', 'bola salju besar'],
  midball: ['中雪球', 'zhōng xuě qiú', 'bola salju sedang'],
  smallball: ['小雪球', 'xiǎo xuě qiú', 'bola salju kecil'],
  putnose: ['放鼻子', 'fàng bí zi', 'pasang hidung'],
  coatbutton: ['扣子', 'kòu zi', 'kancing'],
  puthat: ['戴帽子', 'dài mào zi', 'pakaikan topi'],
  putscarf: ['围围巾', 'wéi wéi jīn', 'pakaikan syal'],
});
Object.assign(WORDS_EN, {
  site: 'construction site', garage: 'car garage', carpentry: "carpenter's workshop", toyshop: 'toy shop',
  mechanic: 'mechanic', carpenter: 'carpenter', builder: 'builder', pilot: 'pilot', shopkeeper: 'shopkeeper',
  whatbuild: 'What shall we build?', house: 'house', tower: 'tower', excavator: 'excavator', dig: 'dig, dig', truck: 'truck', truckgo: 'the truck carries it away',
  crane: 'crane', brick: 'brick', putbrick: 'put on the bricks', roof: 'roof', cardrive: 'a car drives across', builddone: "It's built!", cone: 'traffic cone', hardhat: 'hard hat',
  makecar: 'make a car', pickcar: 'pick a car', policecar: 'police car', firetruck: 'fire truck', icecreamtruck: 'ice cream truck', tire: 'wheel', putwheels: 'put on the wheels',
  steeringwheel: 'steering wheel', carlight: 'headlights', mycar: 'my car', drive: "let's drive", beep: 'beep beep!',
  buildtrack: 'build the track', straight: 'straight', curve: 'curved', whichone: 'Which piece?', tryother: 'try another one', traingo: 'The train is going!', choochoo: 'choo choo!', blocks: 'building blocks',
  makeplane: 'make an airplane', pickwing: 'pick the wings', bigwing: 'big wings', smallwing: 'small wings', twowing: 'double wings', planetail: 'tail', propeller: 'propeller',
  myplane: 'my airplane', fly: 'fly!', land: "let's land", lookdown: 'look down!', runway: 'runway', controltower: 'control tower', hangar: 'hangar',
  woodwork: 'woodworking', whatmake: 'What shall we make?', birdhouse: 'birdhouse', woodboat: 'wooden boat', wood: 'wood', saw: 'saw, saw', nail: 'nail', hammernail: 'hammer the nails',
  paint: "let's paint", makedone: 'All done!', birdcome: 'A little bird came!',
  snowman: 'snowman', makesnowman: "let's build a snowman", bigball: 'big snowball', midball: 'medium snowball', smallball: 'small snowball', putnose: 'put on the nose',
  coatbutton: 'button', puthat: 'put on the hat', putscarf: 'put on the scarf',
});
Object.assign(WORDS_JA, {
  site: ['こうじげんば', 'kōji genba'], garage: ['くるまやさん', 'kuruma-ya-san'], carpentry: ['だいくさんの こうぼう', 'daiku-san no kōbō'],
  toyshop: ['おもちゃやさん', 'omocha-ya-san'],
  mechanic: ['せいびしさん', 'seibishi-san'], carpenter: ['だいくさん', 'daiku-san'], builder: ['こうじの ひと', 'kōji no hito'], pilot: ['パイロット', 'pairotto'], shopkeeper: ['おみせの ひと', 'omise no hito'],
  whatbuild: ['なにを たてる？', 'nani o tateru?'], house: ['いえ', 'ie'], tower: ['タワー', 'tawā'], excavator: ['ショベルカー', 'shoberukā'], dig: ['ほろう', 'horō'],
  truck: ['トラック', 'torakku'], truckgo: ['トラックが はこぶ', 'torakku ga hakobu'], crane: ['クレーン', 'kurēn'], brick: ['れんが', 'renga'], putbrick: ['れんがを つもう', 'renga o tsumō'],
  roof: ['やね', 'yane'], cardrive: ['くるまが わたる', 'kuruma ga wataru'], builddone: ['できた！', 'dekita!'], cone: ['コーン', 'kōn'], hardhat: ['ヘルメット', 'herumetto'],
  makecar: ['くるまを つくる', 'kuruma o tsukuru'], pickcar: ['くるまを えらぼう', 'kuruma o erabō'], policecar: ['パトカー', 'patokā'], firetruck: ['しょうぼうしゃ', 'shōbōsha'],
  icecreamtruck: ['アイスクリームの くるま', 'aisukurīmu no kuruma'], tire: ['タイヤ', 'taiya'], putwheels: ['タイヤを つけよう', 'taiya o tsukeyō'],
  steeringwheel: ['ハンドル', 'handoru'], carlight: ['ライト', 'raito'], mycar: ['ぼくの くるま', 'boku no kuruma'], drive: ['うんてんしよう', 'unten shiyō'], beep: ['ブッブー！', 'bubbū!'],
  buildtrack: ['せんろを つなごう', 'senro o tsunagō'], straight: ['まっすぐ', 'massugu'], curve: ['カーブ', 'kābu'], whichone: ['どれかな？', 'dore ka na?'], tryother: ['ほかのは どう？', 'hoka no wa dō?'],
  traingo: ['でんしゃ しゅっぱつ！', 'densha shuppatsu!'], choochoo: ['ポッポー！', 'poppō!'], blocks: ['つみき', 'tsumiki'],
  makeplane: ['ひこうきを つくる', 'hikōki o tsukuru'], pickwing: ['つばさを えらぼう', 'tsubasa o erabō'], bigwing: ['おおきい つばさ', 'ōkii tsubasa'], smallwing: ['ちいさい つばさ', 'chiisai tsubasa'],
  twowing: ['にだんの つばさ', 'nidan no tsubasa'], planetail: ['しっぽ', 'shippo'], propeller: ['プロペラ', 'puropera'], myplane: ['ぼくの ひこうき', 'boku no hikōki'],
  fly: ['とぶよ！', 'tobu yo!'], land: ['ちゃくりく', 'chakuriku'], lookdown: ['したを みて！', 'shita o mite!'], runway: ['かっそうろ', 'kassōro'], controltower: ['かんせいとう', 'kanseitō'], hangar: ['かくのうこ', 'kakunōko'],
  woodwork: ['もっこう', 'mokkō'], whatmake: ['なにを つくる？', 'nani o tsukuru?'], birdhouse: ['ことりの おうち', 'kotori no ouchi'], woodboat: ['きの ふね', 'ki no fune'], wood: ['ざいもく', 'zaimoku'],
  saw: ['のこぎりで きろう', 'nokogiri de kirō'], nail: ['くぎ', 'kugi'], hammernail: ['くぎを うとう', 'kugi o utō'], paint: ['ペンキを ぬろう', 'penki o nurō'], makedone: ['できた！', 'dekita!'],
  birdcome: ['ことりが きたよ', 'kotori ga kita yo'],
  snowman: ['ゆきだるま', 'yukidaruma'], makesnowman: ['ゆきだるまを つくろう', 'yukidaruma o tsukurō'], bigball: ['おおきい ゆきだま', 'ōkii yukidama'], midball: ['ちゅうくらいの ゆきだま', 'chūkurai no yukidama'],
  smallball: ['ちいさい ゆきだま', 'chiisai yukidama'], putnose: ['はなを つけよう', 'hana o tsukeyō'], coatbutton: ['ボタン', 'botan'], puthat: ['ぼうしを かぶせよう', 'bōshi o kabuseyō'], putscarf: ['マフラーを まこう', 'mafurā o makō'],
});
PLURAL_EN.tire = 'wheels';

const BD_COLORS = ['red', 'blue', 'yellow', 'green', 'pink', 'orange'];
const bdTone = k => RB_TONE[k] || null;
const BD_WOOD = ['#d9a56a', '#a8743c', '#f0c88e'];
const brickAt = (c, x, y, w, h, T) => { px(c, x, y, w, h, T[0]); px(c, x, y, w, 1, T[2]); px(c, x, y + h - 1, w, 1, T[1]); px(c, x + w - 1, y, 1, h, T[1]); px(c, x + Math.floor(w / 2), y + Math.floor(h / 2), 1, 1, T[1]); };
const nailAt = (c, x, y) => { px(c, x, y, 2, 2, '#7d8a98'); px(c, x, y, 1, 1, '#e8eef2'); };
const kidHead = (c, x, y) => { px(c, x - 2, y, 5, 4, '#ffd7b5'); px(c, x - 2, y - 1, 5, 2, '#4a2f1f'); px(c, x + 1, y + 1, 1, 1, '#2a1d18'); };

// ================= GAMBAR: MOBIL =================
const CAR_BASE = { policecar: ['#3f6fd0', '#2a4f9e', '#8fb4ee'], firetruck: ['#e2483d', '#a8352b', '#ff8a7a'], icecreamtruck: ['#f39ac0', '#cc6a95', '#fcd0e2'] };
// x,y = titik tengah bawah. cfg: {body, tires (0–4, kosong = 4), steer, light, color}. o: {dir, moving, driver, dy(key), beam, noShadow}
function drawMyCar(c, x, y, cfg, t, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const body = cfg.body, T = bdTone(cfg.color) || (cfg.color === 'gray' ? RB_GRAY : CAR_BASE[body]) || RB_GRAY, [col, dark, light] = T;
  const nW = cfg.tires == null ? 4 : cfg.tires, dy = o.dy || (() => 0), steer = cfg.steer !== false, lit = cfg.light !== false;
  const blink = Math.floor(t * 4) % 2, mv = !!o.moving, long = body === 'firetruck';
  if (!o.noShadow) shadow(c, x, y + 1, long ? 25 : 22);
  flip(c, x, o.dir || 1, () => {
    const P = (dx, yy, w, h, k) => px(c, dx, y + yy, w, h, k);
    const wheel = (wx, k, far) => {
      const d = dy('tires' + k), wy = y - 4 + d - (far ? 1 : 0);
      disc(c, wx, wy, 4, far ? '#17171b' : '#2a2a2e'); disc(c, wx, wy, 2, far ? '#55555e' : '#c9c9d2');
      if (!far) px(c, wx + (mv && Math.floor(t * 12) % 2 ? 1 : -1), wy - 1, 1, 1, '#ffffff');
    };
    const WX = long ? [16, -15] : [12, -12];
    if (nW >= 3) wheel(WX[0] - 3, 3, true);
    if (nW >= 4) wheel(WX[1] - 3, 4, true);
    if (body) {
      const b = dy('body'), Q = (dx, yy, w, h, k) => P(dx, yy + b, w, h, k);
      let sx = 5, sy = -16;
      if (body === 'policecar') {
        Q(-12, -20, 22, 8, '#f4f7fa'); Q(-11, -21, 20, 1, '#ffffff');
        Q(-10, -19, 8, 5, '#bfe3f2'); Q(0, -19, 8, 5, '#bfe3f2'); Q(-10, -19, 2, 1, '#e8f6fc'); Q(0, -19, 2, 1, '#e8f6fc');
        Q(-21, -13, 42, 8, col); Q(-21, -13, 42, 1, light); Q(-21, -6, 42, 1, dark);
        Q(-9, -11, 19, 3, '#ffffff'); Q(-1, -12, 1, 6, dark);
        Q(-5, -23, 10, 2, '#3a3f4a');
        Q(-5, -25, 5, 2, lit && blink ? '#ff5a4a' : '#a8352b'); Q(0, -25, 5, 2, lit && !blink ? '#7ab4ff' : '#2f5bab');
        Q(19, -11, 2, 3, lit ? '#fff2a8' : '#c9d4e0'); Q(-21, -11, 2, 2, '#ff6a5a');
        Q(-22, -6, 4, 2, '#d0d0d8'); Q(18, -6, 4, 2, '#d0d0d8');
      } else if (body === 'firetruck') {
        Q(-24, -15, 48, 10, col); Q(-24, -15, 48, 1, light); Q(-24, -6, 48, 1, dark);
        Q(8, -24, 16, 10, col); Q(8, -24, 16, 1, light); Q(14, -22, 8, 6, '#bfe3f2'); Q(14, -22, 2, 1, '#e8f6fc');
        Q(-22, -20, 28, 2, '#d6dee6'); for (let k = -21; k < 6; k += 4) Q(k, -22, 1, 6, '#9aa8b8');
        disc(c, -12, y - 10 + b, 3, '#f4cf3a'); disc(c, -12, y - 10 + b, 1, '#c9a21f');
        Q(-3, -13, 9, 6, dark); Q(-2, -12, 7, 1, '#ffffff');
        Q(12, -26, 6, 2, lit && blink ? '#ff5a4a' : '#a8352b');
        Q(22, -12, 2, 3, lit ? '#fff2a8' : '#c9d4e0'); Q(-24, -12, 2, 2, '#ffd84a');
        Q(-25, -6, 4, 2, '#d0d0d8'); Q(22, -6, 4, 2, '#d0d0d8');
        sx = 17; sy = -18;
      } else {
        Q(-21, -23, 39, 18, col); Q(-20, -24, 37, 1, col); Q(-21, -23, 39, 1, light); Q(-21, -6, 39, 1, dark);
        Q(18, -16, 3, 11, col); Q(18, -16, 3, 1, light);
        Q(12, -21, 6, 7, '#bfe3f2'); Q(12, -21, 2, 1, '#e8f6fc');
        Q(-17, -19, 22, 8, '#fff6e4'); for (let k = 0; k < 6; k++) Q(-18 + k * 4, -22, 2, 2, k % 2 ? '#ffffff' : dark);
        disc(c, -11, y - 14 + b, 2, '#fcd0e2'); disc(c, -5, y - 14 + b, 2, '#a8743c'); disc(c, 1, y - 14 + b, 2, '#fff2a8');
        Q(-3, -26, 6, 1, '#e8b46a'); Q(-2, -25, 4, 1, '#d99a4a'); Q(-1, -24, 2, 1, '#c98a3a');
        disc(c, 0, y - 29 + b, 3, '#fcd0e2'); px(c, -1, y - 30 + b, 1, 1, '#ffffff'); disc(c, 1, y - 32 + b, 1, '#e2483d');
        Q(20, -10, 2, 2, lit ? '#fff2a8' : '#c9d4e0');
        Q(-22, -6, 4, 2, '#d0d0d8'); Q(18, -6, 4, 2, '#d0d0d8');
        sx = 14; sy = -16;
      }
      if (o.driver) kidHead(c, sx - 3, y + sy - 3 + b);
      if (steer) {
        const d = dy('steer');
        disc(c, sx, y + sy + b + d, 2, '#3a3f4a'); px(c, sx, y + sy + b + d, 1, 1, '#bfe3f2');
      }
      if (o.beam && lit) for (let i = 0; i < 14; i++) px(c, (long ? 24 : 21) + i, y - 11 - Math.floor(i / 3) + b, 1, 3 + Math.floor(i / 2), 'rgba(255,242,168,0.35)');
    }
    if (nW >= 1) wheel(WX[0], 1);
    if (nW >= 2) wheel(WX[1], 2);
  });
}

// ================= GAMBAR: PESAWAT =================
// cfg: {wing, tail, prop, wheels (0–3, kosong = 3), color}. o: {dir, spin, pilot, dy(key), noShadow}
function drawMyPlane(c, x, y, cfg, t, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const [col, dark, light] = bdTone(cfg.color) || ['#c6d0dc', '#8e9cae', '#e6ecf2'];
  const nW = cfg.wheels == null ? 3 : cfg.wheels, dy = o.dy || (() => 0);
  if (!o.noShadow) shadow(c, x, y + 1, 22);
  flip(c, x, o.dir || 1, () => {
    const P = (dx, yy, w, h, k) => px(c, dx, y + yy, w, h, k);
    const whl = (wx, k) => { const d = dy('wheels' + k); P(wx, -6 + d, 1, 3, '#7d8a98'); disc(c, wx, y - 2 + d, 2, '#2a2a2e'); px(c, wx, y - 2 + d, 1, 1, '#9a9aa2'); };
    if (nW >= 1) whl(8, 1); if (nW >= 2) whl(1, 2); if (nW >= 3) whl(-17, 3);
    if (cfg.tail) {
      const d = dy('tail');
      for (let k = 0; k < 10; k++) P(-22 + Math.round(k * 0.4), -16 - k + d, 7 - Math.round(k * 0.4), 1, k === 9 ? light : col);
      P(-25, -14 + d, 9, 2, dark); P(-25, -14 + d, 9, 1, col);
    }
    if (cfg.wing === 'twowing') { const d = dy('wing'); P(-6, -20 + d, 1, 6, '#7d8a98'); P(9, -20 + d, 1, 6, '#7d8a98'); oval(c, 1, y - 21 + d, 13, 2, dark); oval(c, 1, y - 22 + d, 12, 1, col); }
    P(-21, -16, 37, 9, col); P(-20, -17, 35, 1, col); P(-21, -16, 37, 1, light); P(-21, -8, 37, 1, dark);
    P(16, -15, 3, 7, col); P(19, -14, 2, 5, col); P(-23, -14, 3, 5, col);
    for (let i = 0; i < 4; i++) P(-14 + i * 5, -14, 2, 2, '#bfe3f2');
    P(9, -16, 6, 3, '#bfe3f2'); P(9, -16, 2, 1, '#e8f6fc');
    if (o.pilot) kidHead(c, 11, y - 18);
    if (cfg.wing === 'bigwing') { const d = dy('wing'); oval(c, 0, y - 10 + d, 15, 2, dark); oval(c, 0, y - 11 + d, 14, 1, col); px(c, -13, y - 11 + d, 4, 1, light); }
    else if (cfg.wing === 'smallwing') { const d = dy('wing'); oval(c, 3, y - 10 + d, 8, 2, dark); oval(c, 3, y - 11 + d, 7, 1, col); }
    else if (cfg.wing === 'twowing') { const d = dy('wing'); oval(c, 1, y - 9 + d, 13, 2, dark); oval(c, 1, y - 10 + d, 12, 1, col); }
    if (cfg.prop) {
      const d = dy('prop');
      if (o.spin) oval(c, 22, y - 12 + d, 1, 7, 'rgba(210,220,230,0.75)');
      else { P(22, -19 + d, 1, 14, '#5f6c7a'); P(22, -19 + d, 1, 2, '#e2483d'); P(22, -7 + d, 1, 2, '#e2483d'); }
      disc(c, 22, y - 12 + d, 1, '#3a3f4a');
    }
  });
}

// ================= GAMBAR: HASIL PROYEK BANGUNAN =================
const BUILT_N = { house: 6, tower: 5, bridge: 5 };
// cfg: {bricks (0–n, kosong = penuh), top, color}
function drawBuilt(c, x, y, kind, cfg, t, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const T = bdTone(cfg.color) || ['#d9915a', '#a8643a', '#f0b884'], dy = o.dy || (() => 0);
  const n = cfg.bricks == null ? BUILT_N[kind] : cfg.bricks, top = cfg.top !== false && (cfg.top || cfg.bricks == null);
  if (kind === 'house') {
    for (let i = 0; i < n; i++) brickAt(c, x - 12 + (i % 2) * 12, y - 6 * (Math.floor(i / 2) + 1) + dy('bricks' + (i + 1)), 12, 6, T);
    if (top) {
      const d = dy('top');
      for (let k = 0; k < 10; k++) px(c, x - 2 - Math.round(k * 1.5), y - 28 + k + d, 4 + Math.round(k * 3), 1, k === 0 ? '#e8735a' : k % 3 === 2 ? '#a23a2c' : '#d4553f');
      if (!d) { px(c, x - 3, y - 9, 6, 9, PAL.woodD); px(c, x - 2, y - 8, 4, 8, PAL.wood); px(c, x + 1, y - 5, 1, 1, '#f4cf3a'); px(c, x + 5, y - 15, 5, 4, '#bfe3f2'); px(c, x - 10, y - 15, 5, 4, '#bfe3f2'); }
    }
  } else if (kind === 'tower') {
    for (let i = 0; i < n; i++) brickAt(c, x - 6, y - 6 * (i + 1) + dy('bricks' + (i + 1)), 12, 6, T);
    for (let i = 0; i < Math.min(n, 4); i++) px(c, x - 1, y - 6 * (i + 1) + 2 + dy('bricks' + (i + 1)), 2, 2, '#2a3a4a');
    if (top) { const d = dy('top'); px(c, x, y - 42 + d, 1, 12, '#7d8a98'); const w = Math.round(Math.sin(t * 4)); px(c, x + 1, y - 42 + d, 8, 5, '#e2483d'); px(c, x + 1, y - 42 + d, 8, 1, '#ff8a7a'); px(c, x + 8, y - 41 + d + w, 1, 3, '#e2483d'); }
  } else {
    px(c, x - 13, y - 3, 26, 3, PAL.water); px(c, x - 13, y - 3, 26, 1, PAL.waterL);
    const pil = [[-16, 0], [-16, 1], [8, 0], [8, 1]];
    for (let i = 0; i < Math.min(n, 4); i++) brickAt(c, x + pil[i][0], y - 7 * (pil[i][1] + 1) + dy('bricks' + (i + 1)), 8, 7, T);
    if (n >= 5) { const d = dy('bricks5'); brickAt(c, x - 20, y - 18 + d, 40, 4, T); for (let k = -18; k < 20; k += 6) px(c, x + k, y - 22 + d, 1, 4, T[1]); px(c, x - 20, y - 22 + d, 40, 1, T[1]); }
    if (top) {
      const d = dy('top'), p = o.carT == null ? 0.5 : (o.carT % 1);
      drawVehicle(c, x - 22 + p * 44, y - 18 + d, 'minicar', 1, t, '#4f86e0');
    }
  }
}

// ================= GAMBAR: BARANG KAYU =================
const WOOD_NAILS = { birdhouse: [[-6, -13], [5, -13], [-6, -4], [5, -4]], chair: [[-8, -10], [6, -10], [-8, -20], [-8, -15]], woodboat: [[-10, -6], [-4, -5], [3, -5], [9, -6]] };
// cfg: {nails (0–4, kosong = 4), color}
function drawWoodThing(c, x, y, kind, cfg, t, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const T = bdTone(cfg.color) || BD_WOOD, [col, dark, light] = T, d = o.dy ? o.dy('thing') : 0, Y = y + d;
  const P = (dx, yy, w, h, k) => px(c, x + dx, Y + yy, w, h, k);
  if (kind === 'birdhouse') {
    P(-8, -16, 16, 16, col); P(-8, -16, 16, 1, light); P(6, -16, 2, 16, dark); P(-8, -1, 16, 1, dark);
    for (let k = 0; k < 10; k++) P(-10 + k, -17 - k, 20 - k * 2, 1, k === 0 ? '#a23a2c' : '#d4553f');
    disc(c, x, Y - 10, 3, '#3a2616'); P(-2, -5, 5, 1, PAL.woodD);
  } else if (kind === 'chair') {
    P(-10, -27, 4, 27, dark); P(-10, -27, 1, 27, light);
    for (const yy of [-24, -18]) P(-7, yy, 3, 2, col);
    P(-10, -12, 20, 4, col); P(-10, -12, 20, 1, light); P(-10, -9, 20, 1, dark);
    P(6, -9, 3, 9, dark); P(-8, -9, 3, 9, dark);
  } else {
    P(-1, -26, 2, 18, PAL.woodD);
    for (let k = 0; k < 14; k++) P(1, -25 + k, Math.round(k * 0.7) + 1, 1, '#fffaf0');
    for (let k = 0; k < 6; k++) P(-15 + k, -8 + k, 30 - k * 2, 1, k === 0 ? light : k === 5 ? dark : col);
    P(-16, -9, 32, 1, dark);
  }
  const nN = cfg.nails == null ? 4 : cfg.nails;
  WOOD_NAILS[kind].slice(0, nN).forEach(([a, b], i) => nailAt(c, x + a, Y + b + (o.dy ? o.dy('nails' + (i + 1)) : 0)));
}

// ================= GAMBAR: MANUSIA SALJU =================
// cfg: {big (0–3), mid (0–2), small (0–1), nose, buttons (0–3), hat, scarf}; kosong = lengkap
function drawSnowman(c, x, y, cfg, t, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const full = !cfg || cfg.big == null, C = full ? { big: 3, mid: 2, small: 1, nose: 1, buttons: 3, hat: 1, scarf: 1 } : cfg, dy = o.dy || (() => 0);
  const ball = (cx, cy, r) => { disc(c, cx, cy, r, '#cfdbe6'); disc(c, cx - 1, cy - 1, r - 1, '#ffffff'); px(c, cx - Math.round(r * 0.5), cy - Math.round(r * 0.6), 2, 1, '#ffffff'); };
  const bR = [0, 6, 9, 12][C.big] || 0, mR = [0, 6, 8][C.mid] || 0, sR = C.small ? 6 : 0;
  if (!o.noShadow && bR) shadow(c, x, y + 1, bR + 2);
  const bY = y - bR + 1, mY = bY - bR - mR + 4, sY = mY - mR - sR + 3;
  if (bR) ball(x, bY, bR);
  if (mR) ball(x, mY + dy('mid1'), mR);
  if (C.buttons) for (let i = 0; i < C.buttons; i++) px(c, x, mY - 3 + i * 3 + dy('buttons' + (i + 1)), 2, 2, '#3a2616');
  if (C.scarf && mR) { const d = dy('scarf'); px(c, x - mR + 2, mY - mR + 1 + d, mR * 2 - 3, 3, '#e2483d'); px(c, x - mR + 2, mY - mR + 1 + d, mR * 2 - 3, 1, '#ff8a7a'); px(c, x + 3, mY - mR + 3 + d, 3, 7, '#e2483d'); px(c, x + 3, mY - mR + 9 + d, 3, 1, '#a8352b'); }
  if (sR) {
    ball(x, sY + dy('small1'), sR);
    px(c, x - 3, sY - 2, 2, 2, '#2a1d18'); px(c, x + 2, sY - 2, 2, 2, '#2a1d18');
    for (let k = 0; k < 4; k++) px(c, x - 2 + k, sY + 2 + (k === 3 ? 1 : 0), 1, 1, '#3a2616');
    if (C.nose) { const d = dy('nose'); px(c, x, sY + d, 5, 2, '#f08a32'); px(c, x + 5, sY + d, 2, 1, '#f08a32'); px(c, x, sY + d, 3, 1, '#ffb877'); }
    if (C.hat) { const d = dy('hat'); px(c, x - 7, sY - sR + 1 + d, 14, 2, '#2a2a32'); px(c, x - 4, sY - sR - 7 + d, 8, 8, '#2a2a32'); px(c, x - 4, sY - sR - 2 + d, 8, 2, '#e2483d'); px(c, x - 4, sY - sR - 7 + d, 8, 1, '#4a4a55'); }
  }
  if (o.arms !== false && mR) { px(c, x - mR - 5, mY - 3, 6, 1, PAL.woodD); px(c, x - mR - 6, mY - 5, 1, 2, PAL.woodD); px(c, x + mR, mY - 3, 6, 1, PAL.woodD); px(c, x + mR + 5, mY - 5, 1, 2, PAL.woodD); }
}

// ================= GAMBAR: REL KERETA MAINAN =================
const TRK = { cs: 16, x0: 16, y0: 12 };
// tiap tingkat: jalur sel [kolom, baris], sungai (kolom), bukit (sel), sel yang kosong (diisi Russel)
const TRACK_LV = [
  { cells: [[0, 1], [1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]], river: 5, hills: [], gaps: [2, 3, 7] },
  { cells: [[0, 3], [1, 3], [2, 3], [2, 2], [2, 1], [3, 1], [4, 1], [5, 1], [5, 2], [5, 3], [6, 3], [7, 3]], river: -1, hills: ['4,1'], gaps: [2, 6, 8, 10] },
  { cells: [[0, 2], [1, 2], [2, 2], [3, 2], [3, 3], [4, 3], [5, 3], [6, 3], [6, 2], [6, 1], [7, 1]], river: 2, hills: ['5,3'], gaps: [2, 3, 6, 8] },
];
const DIRV = { L: [-1, 0], R: [1, 0], U: [0, -1], D: [0, 1] };
function trackInfo(lv) {
  const L = TRACK_LV[lv], cs = L.cells, out = [];
  const dirTo = (a, b) => (b[0] < a[0] ? 'L' : b[0] > a[0] ? 'R' : b[1] < a[1] ? 'U' : 'D');
  cs.forEach((cell, i) => {
    const prev = i ? cs[i - 1] : [cell[0] - 1, cell[1]], next = i < cs.length - 1 ? cs[i + 1] : [cell[0] + 1, cell[1]];
    const a = dirTo(cell, prev), b = dirTo(cell, next);
    const straight = (a === 'L' && b === 'R') || (a === 'R' && b === 'L') || (a === 'U' && b === 'D') || (a === 'D' && b === 'U');
    const type = cell[0] === L.river ? 'bridge' : L.hills.includes(cell.join(',')) ? 'tunnel' : straight ? 'straight' : 'curve';
    out.push({ cell, a, b, type });
  });
  return out;
}
function drawTrackPiece(c, cx, cy, p, alpha) {
  const cs = TRK.cs, h = cs / 2, keep = c.globalAlpha;
  if (alpha != null) c.globalAlpha = alpha;
  const tie = '#a8743c', rail = '#7d8a98', railL = '#c9d4e0';
  const horiz = (p.a === 'L' || p.a === 'R') && (p.b === 'L' || p.b === 'R');
  if (p.type !== 'curve') {
    if (horiz) { for (let k = 1; k < cs; k += 4) px(c, cx - h + k, cy - 5, 2, 10, tie); px(c, cx - h, cy - 4, cs, 1, rail); px(c, cx - h, cy + 3, cs, 1, rail); px(c, cx - h, cy - 5, cs, 1, railL); }
    else { for (let k = 1; k < cs; k += 4) px(c, cx - 5, cy - h + k, 10, 2, tie); px(c, cx - 4, cy - h, 1, cs, rail); px(c, cx + 3, cy - h, 1, cs, rail); }
  } else {
    // sudut pusat lengkung = pojok sel di antara dua sisi yang tersambung
    const sx = (p.a === 'L' || p.b === 'L') ? -1 : 1, sy = (p.a === 'U' || p.b === 'U') ? -1 : 1;
    const ox = cx + sx * h, oy = cy + sy * h;
    for (let k = 0; k <= 12; k++) {
      const ang = k / 12 * Math.PI / 2, ca = Math.cos(ang), sa = Math.sin(ang);
      if (k % 3 === 1) for (let r = 3; r <= 13; r++) px(c, Math.round(ox - sx * ca * r), Math.round(oy - sy * sa * r), 1, 1, tie);
    }
    for (let k = 0; k <= 30; k++) {
      const ang = k / 30 * Math.PI / 2, ca = Math.cos(ang), sa = Math.sin(ang);
      px(c, Math.round(ox - sx * ca * 4.5), Math.round(oy - sy * sa * 4.5), 1, 1, rail);
      px(c, Math.round(ox - sx * ca * 11.5), Math.round(oy - sy * sa * 11.5), 1, 1, rail);
    }
  }
  if (p.type === 'bridge') {
    if (horiz) { px(c, cx - h, cy - 7, cs, 2, '#c08a52'); px(c, cx - h, cy + 6, cs, 2, '#c08a52'); for (let k = 0; k < cs; k += 4) { px(c, cx - h + k, cy - 9, 1, 3, '#8a6440'); px(c, cx - h + k, cy + 6, 1, 3, '#8a6440'); } }
    else { px(c, cx - 7, cy - h, 2, cs, '#c08a52'); px(c, cx + 6, cy - h, 2, cs, '#c08a52'); }
  }
  if (p.type === 'tunnel') {
    disc(c, cx, cy - 2, 8, '#58a84a'); disc(c, cx - 1, cy - 3, 6, '#7cc85a'); px(c, cx - 3, cy - 8, 2, 1, '#b4e692');
    if (horiz) { px(c, cx - 8, cy - 4, 3, 8, '#2a2a32'); px(c, cx + 5, cy - 4, 3, 8, '#2a2a32'); px(c, cx - 2, cy + 3, 4, 1, rail); }
    else { px(c, cx - 4, cy - 8, 8, 3, '#2a2a32'); px(c, cx - 4, cy + 5, 8, 3, '#2a2a32'); }
  }
  c.globalAlpha = keep;
}
// stiker potongan rel (dipakai sebagai tombol pilihan)
const trackSticker = type => (c, x, y) => {
  px(c, x - 10, y - 20, 20, 20, '#9fd06a'); px(c, x - 10, y - 20, 20, 1, '#b4e692');
  if (type === 'bridge') px(c, x - 10, y - 20, 20, 20, PAL.water);
  const p = type === 'curve' ? { type, a: 'L', b: 'D' } : { type, a: 'L', b: 'R' };
  const keep = TRK.cs; TRK.cs = 20; drawTrackPiece(c, x, y - 10, p); TRK.cs = keep;
};
function trackPoints(info) {
  const cs = TRK.cs, pts = [];
  info.forEach((p, i) => {
    const cx = TRK.x0 + p.cell[0] * cs + cs / 2, cy = TRK.y0 + p.cell[1] * cs + cs / 2;
    const [ax, ay] = DIRV[p.a], [bx, by] = DIRV[p.b];
    if (i === 0) pts.push([cx + ax * cs / 2, cy + ay * cs / 2]);
    if (p.type === 'curve') { pts.push([cx + (ax + bx) * cs * 0.15, cy + (ay + by) * cs * 0.15]); }
    else pts.push([cx, cy]);
    pts.push([cx + bx * cs / 2, cy + by * cs / 2]);
  });
  return pts;
}
function pointAlong(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i], L = Math.hypot(x2 - x1, y2 - y1);
    if (d <= L) return [x1 + (x2 - x1) * d / L, y1 + (y2 - y1) * d / L, Math.sign(x2 - x1) || 0];
    d -= L;
  }
  const e = pts[pts.length - 1]; return [e[0], e[1], 1];
}
const pathLen = pts => pts.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
function drawToyTrain(c, x, y, dir, t) {
  x = Math.round(x); y = Math.round(y);
  flip(c, x, dir < 0 ? -1 : 1, () => {
    const P = (dx, yy, w, h, k) => px(c, dx, y + yy, w, h, k);
    P(-13, -4, 8, 5, '#4f86e0'); P(-13, -4, 8, 1, '#8fb4ee'); P(-12, -3, 2, 2, '#fff2c8'); P(-9, -3, 2, 2, '#fff2c8');
    P(-4, -4, 9, 5, '#e2483d'); P(-4, -7, 4, 3, '#e2483d'); P(-3, -6, 2, 2, '#fff2c8'); P(2, -8, 2, 4, '#3a3f4a'); P(-4, -4, 9, 1, '#ff8a7a');
    P(-12, 1, 2, 1, '#2a2a2e'); P(-8, 1, 2, 1, '#2a2a2e'); P(-3, 1, 2, 1, '#2a2a2e'); P(2, 1, 2, 1, '#2a2a2e');
  });
  if (Math.floor(t * 3) % 2) disc(c, x + (dir < 0 ? -3 : 3), y - 11, 1, '#e8eef2');
}
function drawTrackStation(c, x, y, col) {
  px(c, x - 7, y - 4, 14, 9, '#fbefd0'); for (let k = 0; k < 4; k++) px(c, x - 8 + k, y - 5 - k, 16 - k * 2, 1, col); px(c, x - 1, y, 3, 5, PAL.wood);
}

// ================= JENDELA MERAKIT =================
const BD = { g: null, id: '', step: 0, steps: [], cfg: {}, n: {}, drop: 0, dropKey: null, done: false, act: null, actT: 0, actDur: 0, shake: 0, flash: 0, pulse: 0, mode: null,
  cv: $('bd-cv'), src: document.createElement('canvas') };
BD.src.width = 160; BD.src.height = 110;
BD.sctx = BD.src.getContext('2d', { willReadFrequently: true });
BD.ctx = BD.cv.getContext('2d');
BD.dy = key => (BD.dropKey === key && BD.drop > 0 ? -Math.round(BD.drop * BD.drop * 34) : 0);
PANELS.build = $('p-build');
PANELS.build.addEventListener('pointerdown', e => { if (e.target === PANELS.build) closePanel(); });
const BUILD = {};

function bdOpen(id, mode) {
  const g = BUILD[id];
  BD.g = g; BD.id = id; BD.mode = null; BD.act = null;
  openPanel('build');
  const w = word(g.title);
  $('bd-title').innerHTML = rubyHTML(w.zh, w.py);
  if (g.restore && g.restore(BD)) {
    BD.done = true; BD.step = BD.steps.length;
    if (mode && g.mode) g.mode(BD, mode); else say([{ k: g.doneWord || g.title }]);
    bdRender();
  } else bdReset();
}
function bdReset() {
  const g = BD.g;
  BD.step = 0; BD.cfg = {}; BD.n = {}; BD.done = false; BD.act = null; BD.mode = null; BD.dropKey = null; BD.drop = 0;
  BD.steps = typeof g.steps === 'function' ? g.steps(BD) : g.steps;
  bdRender();
  say([{ k: g.title }].concat(bdAsk(BD, BD.steps[0])));
}
// kalimat pertanyaan satu langkah (bisa lebih dari satu kata, mis. "小猫 + 在哪里？")
const bdAsk = (S, s) => s.askList ? s.askList(S) : [{ k: s.ask }];
function bdRender() {
  const box = $('bd-opts'), S = BD, g = S.g;
  box.innerHTML = ''; box.className = 'proc';
  $('bd-steps').innerHTML = S.steps.map((s, i) => `<span class="fstar${S.done || i < S.step ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('bd-steps').setAttribute('aria-label', 'Langkah ' + Math.min(S.step + 1, S.steps.length) + ' dari ' + S.steps.length);
  if (S.done) {
    const opts = g.doneOpts(S);
    box.classList.add('bd-grid');
    if (opts.length === 1) box.classList.add('bd-one');
    opts.forEach(([k, fn]) => box.appendChild(rbOption(k, () => { sfx('tap'); fn(); })));
    return;
  }
  const s = S.steps[S.step];
  if (s.colors) {
    box.classList.add('rb-colors');
    BD_COLORS.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch'; b.style.setProperty('--sw', RB_TONE[k][0]); b.setAttribute('aria-label', 'Warna ' + word(k).id);
      b.addEventListener('click', () => bdPick(k));
      box.appendChild(b);
    });
    return;
  }
  if (s.taps) {
    box.classList.add('bd-one');
    const b = rbOption(s.icon || s.ask, bdTap); b.classList.add('big'); box.appendChild(b);
    return;
  }
  if (s.opts.length === 1) box.classList.add('bd-one');
  else if (s.opts.length > 3) box.classList.add('bd-grid');
  s.opts.forEach(k => { const b = rbOption(k, () => bdPick(k)); if (s.opts.length === 1) b.classList.add('big'); box.appendChild(b); });
}
function bdPick(k) {
  const S = BD;
  if (S.done) return;
  const s = S.steps[S.step];
  if (s.answer && k !== s.answer) {
    if (s.miss) { s.miss(S, k); return; }
    S.shake = 0.5; sfx('bounce'); say([{ k }, { k: 'tryother' }]); return;
  }
  S.cfg[s.key] = k;
  if (s.colors) { sfx('sparkle'); S.flash = 0.6; } else { S.dropKey = s.key; S.drop = 1; sfx(s.sfx || 'pop'); }
  if (s.then) s.then(S);
  bdNext(s.sayList ? s.sayList(S, k) : [{ k: s.say || k }]);
}
function bdTap() {
  const S = BD;
  if (S.done) return;
  const s = S.steps[S.step];
  if (!s.taps) return;
  const i = (S.n[s.key] || 0) + 1;
  S.n[s.key] = i; S.dropKey = s.key + i; S.drop = 1; S.pulse = 1;
  sfx(s.sfx || 'pop');
  if (s.each) s.each(S, i);
  const list = s.tapSay ? s.tapSay(S, i) : [{ k: 'n' + i }];
  if (i < s.taps) { say(list); return; }
  if (s.count) { const cw = countWord(i, s.count[0], s.count[1], s.count[2]); list.push({ card: cw, zh: cw.zh }); }
  if (s.say) list.push({ k: s.say });
  bdNext(list);
}
function bdNext(list) {
  const S = BD;
  S.step++;
  if (S.step >= S.steps.length) { bdFinish(list); return; }
  bdRender();
  say(list.concat(bdAsk(S, S.steps[S.step])));
}
function bdFinish(list) {
  const S = BD;
  S.done = true; S.flash = 1.4;
  sfx('sparkle'); [523, 659, 784, 1047].forEach((f, i) => Snd.tone(f, 0.18, { gain: 0.09, when: i * 0.14, type: 'triangle' }));
  const more = S.g.finish(S) || [];
  addCoins(2, G.boy.x, G.boy.y - 30);
  bdRender();
  say(list.concat(more));
}
function bdAct(name, dur) { BD.act = name; BD.actT = 0; BD.actDur = dur; }
// latar sederhana untuk langit, salju, dinding
function bdSky(c, top, bot, h) { for (let y = 0; y < h; y++) { const k = y / h; px(c, 0, y, 160, 1, `rgb(${Math.round(top[0] + (bot[0] - top[0]) * k)},${Math.round(top[1] + (bot[1] - top[1]) * k)},${Math.round(top[2] + (bot[2] - top[2]) * k)})`); } }
function bdSparkle(c, t, cx, cy, rx, ry) { for (let i = 0; i < 8; i++) { const a = t * 2 + i * 0.785; drawStar(c, Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry), i % 2 ? '#ffd84a' : '#fff2a8'); } }

PANEL_HOOK.build = dt => {
  const S = BD, c = S.sctx, t = G.t;
  if (!S.g) return;
  S.drop = Math.max(0, S.drop - dt * 2.4); S.flash = Math.max(0, S.flash - dt); S.shake = Math.max(0, S.shake - dt); S.pulse = Math.max(0, S.pulse - dt * 2.5);
  if (S.act) { S.actT += dt; if (S.actT > S.actDur) { const a = S.act; S.act = null; if (S.g.actEnd) S.g.actEnd(S, a); } }
  if (S.g.update) S.g.update(dt, S);
  c.clearRect(0, 0, 160, 110);
  S.g.draw(c, t, S);
  if (S.flash > 0) bdSparkle(c, t, 80, 56, 58, 36);
  S.ctx.drawImage(upscale4(S.src), 0, 0);
};
BD.cv.addEventListener('pointerdown', e => {
  const S = BD;
  if (!S.g) return;
  const [x, y] = cvPoint(S.cv, e).map(v => v / (S.cv.width / 160));
  if (S.g.tapAt && S.g.tapAt(S, x, y)) return;
  if (S.done) { if (S.g.tapDone) S.g.tapDone(S); else { S.flash = 0.8; sfx('sparkle'); say([{ k: S.g.doneWord || S.g.title }]); } return; }
  const s = S.steps[S.step];
  if (s.taps) bdTap();
  else if (s.opts && s.opts.length === 1) bdPick(s.opts[0]);
  else say(bdAsk(S, s));
});
$('bd-title').addEventListener('click', () => { if (BD.g) say([{ k: BD.g.title }]); });

// gambar besar di jendela: PX = 2 (satu satuan = 2 piksel kanvas 160×110)
const big2 = fn => { PX = 2; try { fn(); } finally { PX = 1; } };

// ================= 1. PROYEK BANGUNAN =================
BUILD.house = {
  title: 'site', doneWord: 'builddone',
  steps: S => [
    // jumlah bata & langkah terakhir tergantung jenis bangunan
    { key: 'kind', ask: 'whatbuild', opts: ['house', 'tower', 'bridge'],
      then(S) { const k = S.cfg.kind; S.steps[3].taps = BUILT_N[k]; S.steps[4].opts = [{ house: 'roof', tower: 'flag', bridge: 'car' }[k]]; S.steps[4].ask = { house: 'roof', tower: 'flag', bridge: 'cardrive' }[k]; } },
    { key: 'dig', ask: 'dig', taps: 3, icon: 'excavator', sfx: 'plant' },
    { key: 'truck', ask: 'truckgo', opts: ['truck'], sfx: 'horn', then: s => bdAct('truck', 3) },
    { key: 'bricks', ask: 'putbrick', taps: 5, icon: 'brick', sfx: 'bounce', count: ['brick', '块', 'kuài'] },
    { key: 'top', ask: 'roof', opts: ['roof'] },
    { key: 'color', ask: 'pickcolor', colors: true },
  ],
  draw(c, t, S) {
    bdSky(c, [150, 212, 245], [214, 238, 250], 64);
    for (let x = 0; x < 160; x += 2) { const h = 8 + Math.sin(x / 18) * 4; px(c, x, 64 - h, 2, h, '#9fd06a'); }
    px(c, 0, 62, 160, 48, '#c9a46a'); groundPatches(c, 0, 62, 160, 48, 41, '#b8925a', 0.55);
    for (let x = 4; x < 160; x += 24) { px(c, x, 58, 2, 8, '#f08a32'); px(c, x, 60, 2, 1, '#ffffff'); }
    const kind = S.cfg.kind, dig = S.n.dig || 0, gone = !!S.cfg.truck, bx = 92, by = 96;
    // lubang galian / fondasi
    if (dig) { oval(c, bx, by, 8 + dig * 5, 2 + dig, '#7d5230'); oval(c, bx, by - 1, 6 + dig * 5, 1 + dig, '#5a3820'); }
    if (gone) { px(c, bx - 24, by - 2, 48, 4, '#a9a6a0'); px(c, bx - 24, by - 2, 48, 1, '#c9c6c0'); }
    // derek di kanan
    px(c, 146, 6, 4, 92, '#f4cf3a'); for (let y = 8; y < 96; y += 6) { px(c, 146, y, 4, 1, '#c9a21f'); }
    px(c, 70, 8, 84, 3, '#f4cf3a'); for (let x = 72; x < 152; x += 6) px(c, x, 8, 1, 3, '#c9a21f'); px(c, 138, 2, 12, 6, '#e2483d'); px(c, 140, 3, 4, 3, '#bfe3f2');
    const hookX = bx, hookY = S.step === 3 && !S.done ? 26 + Math.round(Math.sin(t * 2)) : 18;
    px(c, hookX, 11, 1, hookY - 11, '#3a3f4a'); px(c, hookX - 2, hookY, 5, 2, '#3a3f4a');
    if (S.step === 3 && !S.done && kind) brickAt(c, hookX - 5, hookY + 2, 10, 5, bdTone(S.cfg.color) || ['#d9915a', '#a8643a', '#f0b884']);
    // ekskavator (kiri) dan gundukan tanah
    const arm = S.pulse > 0 ? Math.sin(S.pulse * Math.PI) : 0;
    if (!gone && dig) { oval(c, 46, 98, 3 + dig * 3, 2 + dig * 2, '#8a5a35'); oval(c, 45, 97, 2 + dig * 2, 1 + dig, '#a8743c'); }
    big2(() => {
      const ex = 12, ey = 49;
      px(c, ex - 9, ey - 4, 18, 4, '#3a3f4a'); for (let k = -8; k < 9; k += 3) px(c, ex + k, ey - 3, 1, 2, '#7d8a98');
      px(c, ex - 7, ey - 11, 14, 7, '#f4cf3a'); px(c, ex - 7, ey - 11, 14, 1, '#fff2a8'); px(c, ex - 6, ey - 16, 7, 5, '#f4cf3a'); px(c, ex - 5, ey - 15, 5, 3, '#bfe3f2');
      const ax = ex + 6, ay = ey - 10;
      px(c, ax, ay - 6 + Math.round(arm * 3), 10, 2, '#c9a21f'); px(c, ax + 9, ay - 6 + Math.round(arm * 3), 2, 9, '#c9a21f');
      px(c, ax + 7, ay + 2 + Math.round(arm * 3), 6, 3, '#5f6c7a');
    });
    // truk: datang lalu pergi membawa tanah
    if (S.act === 'truck') {
      const p = S.actT / 3, tx = p < 0.35 ? -30 + p / 0.35 * 80 : p < 0.55 ? 50 : 50 + (p - 0.55) / 0.45 * 140;
      big2(() => { truckArt(c, tx / 2, 54, p >= 0.35, t); });
    }
    // bangunan tumbuh
    if (kind && gone) {
      const cfg = { bricks: S.n.bricks || 0, top: !!S.cfg.top, color: S.cfg.color };
      if (S.done) { cfg.bricks = null; cfg.top = true; }
      big2(() => drawBuilt(c, bx / 2, by / 2 - 1, kind, cfg, t, { dy: k => Math.round(S.dy(k) / 2), carT: S.cfg.top ? t * 0.3 : null }));
    } else if (!kind) {
      px(c, bx - 1, 70, 2, 22, PAL.woodD); px(c, bx - 12, 64, 24, 10, PAL.woodD); px(c, bx - 11, 65, 22, 8, '#fff2c8');
      drawBuilt(c, bx - 5, 72, 'house', {}, t); drawStar(c, bx + 6, 68, '#f4cf3a');
    }
  },
  finish(S) { (EX.built = EX.built || {})[S.cfg.kind] = S.cfg.color; exSave(); return [{ k: S.cfg.kind }, { k: 'builddone' }, { k: 'great' }]; },
  doneOpts: S => [['makenew', bdReset]],
};
function truckArt(c, x, y, full, t) {
  x = Math.round(x); y = Math.round(y);
  px(c, x - 14, y - 10, 18, 6, '#f08a32'); px(c, x - 14, y - 10, 18, 1, '#ffb877'); px(c, x - 15, y - 12, 2, 8, '#bd5e1c');
  if (full) { oval(c, x - 5, y - 11, 8, 3, '#8a5a35'); oval(c, x - 6, y - 12, 5, 2, '#a8743c'); }
  px(c, x + 4, y - 12, 8, 8, '#4f86e0'); px(c, x + 7, y - 11, 4, 3, '#bfe3f2'); px(c, x + 4, y - 12, 8, 1, '#8fb4ee');
  for (const wx of [-10, 0, 8]) { disc(c, x + wx, y - 3, 2, '#2a2a2e'); px(c, x + wx, y - 3, 1, 1, '#9a9aa2'); }
}

// ================= 2. MOBIL =================
BUILD.car = {
  title: 'makecar', doneWord: 'mycar',
  steps: [
    { key: 'body', ask: 'pickcar', opts: ['policecar', 'firetruck', 'icecreamtruck'] },
    { key: 'tires', ask: 'putwheels', taps: 4, icon: 'tire', sfx: 'bounce', count: ['tire', '个', 'gè'] },
    { key: 'steer', ask: 'steeringwheel', opts: ['steeringwheel'] },
    { key: 'light', ask: 'carlight', opts: ['carlight'], sfx: 'chime' },
    { key: 'color', ask: 'pickcolor', colors: true },
  ],
  restore(S) { if (!EX.car) return false; S.cfg = Object.assign({ steer: 1, light: 1 }, EX.car); S.n = { tires: 4 }; S.steps = this.steps; return true; },
  draw(c, t, S) {
    px(c, 0, 0, 160, 74, '#d3dfe6'); for (let x = 0; x < 160; x += 20) { px(c, x, 0, 1, 70, '#c4d2da'); px(c, x + 1, 0, 1, 70, '#e0eaef'); }
    px(c, 0, 70, 160, 4, '#7d8a98');
    // papan alat & ban di dinding
    px(c, 8, 10, 40, 26, '#8a6440'); px(c, 9, 11, 38, 24, '#b08654');
    stHammer(c, 18, 32); stWrench(c, 30, 32); stDriver(c, 41, 32);
    for (let i = 0; i < 3; i++) { disc(c, 150, 58 - i * 12, 6, '#2a2a2e'); disc(c, 150, 58 - i * 12, 3, '#5a5a62'); }
    px(c, 0, 74, 160, 36, '#a7adb6'); for (let x = 0; x < 160; x += 16) px(c, x, 74, 1, 36, '#969ca6');
    // pengangkat mobil
    px(c, 30, 96, 100, 4, '#5f6c7a'); px(c, 30, 96, 100, 1, '#7d8a98'); for (let i = 0; i < 12; i++) px(c, 33 + i * 8, 98, 4, 1, i % 2 ? '#f4cf3a' : '#3a3f4a');
    const done = S.done, cfg = { body: S.cfg.body, tires: done ? 4 : S.n.tires || 0, steer: !!S.cfg.steer, light: !!S.cfg.light, color: S.cfg.color };
    let x = 40;
    if (S.act === 'drive') { x = 40 + S.actT / 2.6 * 124; if (x > 102) x -= 124; }
    const bob = S.act === 'drive' ? Math.floor(t * 10) % 2 : 0;
    big2(() => drawMyCar(c, x, 48 - bob, cfg, t, { dy: k => Math.round(S.dy(k) / 2), moving: S.act === 'drive', beam: S.act === 'drive' || (S.act === 'light'), driver: done, noShadow: false }));
    if (!S.cfg.body) { px(c, 54, 80, 52, 6, '#7d8a98'); px(c, 54, 80, 52, 1, '#c9d4e0'); }
    if (S.act === 'beep') { for (let k = 0; k < 3; k++) px(c, 128 + k * 3, 60 - k * 4, 2, 2 + k * 2, '#ffd84a'); }
  },
  finish(S) { EX.car = { body: S.cfg.body, color: S.cfg.color }; exSave(); return [{ k: 'mycar', by: G.boy }, { k: 'great' }]; },
  doneOpts: S => [['drive', () => { bdAct('drive', 2.6); sfx('horn'); say([{ k: 'drive', by: G.boy }]); }], ['beep', () => { bdAct('beep', 0.8); sfx('horn'); say([{ k: 'beep', by: G.boy }]); }], ['makenew', bdReset]],
  tapDone(S) { bdAct('drive', 2.6); sfx('horn'); say([{ k: 'beep', by: G.boy }]); },
};

// ================= 3. REL KERETA MAINAN =================
BUILD.track = {
  title: 'buildtrack', doneWord: 'traingo',
  steps(S) {
    S.lv = (EX.trackLv || 0) % TRACK_LV.length; S.info = trackInfo(S.lv); S.pts = trackPoints(S.info); S.len = pathLen(S.pts); S.trainD = -1;
    const all = ['straight', 'curve', 'bridge', 'tunnel'];
    return TRACK_LV[S.lv].gaps.map(i => {
      const ans = S.info[i].type, others = all.filter(k => k !== ans).sort(() => Math.random() - 0.5).slice(0, 2);
      return { key: 'gap' + i, gap: i, ask: 'whichone', opts: [ans, ...others].sort(() => Math.random() - 0.5), answer: ans };
    });
  },
  draw(c, t, S) {
    // meja kayu dan rumput mainan
    px(c, 0, 0, 160, 110, '#b08654'); px(c, 4, 4, 152, 102, '#8a6440');
    px(c, TRK.x0 - 4, TRK.y0 - 4, 8 * TRK.cs + 8, 5 * TRK.cs + 8, '#9fd06a');
    groundPatches(c, TRK.x0 - 4, TRK.y0 - 4, 8 * TRK.cs + 8, 5 * TRK.cs + 8, 61, '#93c862', 0.6);
    const L = TRACK_LV[S.lv];
    if (L.river >= 0) { const rx = TRK.x0 + L.river * TRK.cs; px(c, rx + 1, TRK.y0 - 4, TRK.cs - 2, 5 * TRK.cs + 8, PAL.water); for (let y = TRK.y0; y < TRK.y0 + 80; y += 7) px(c, rx + 4 + (y % 3), y + Math.floor(t * 4) % 7, 4, 1, PAL.waterL); }
    // pohon & rumah kecil penghias
    [[2, 0], [7, 0], [0, 4], [6, 4]].forEach(([a, b]) => { if (!S.info.some(p => p.cell[0] === a && p.cell[1] === b) && a !== L.river) { const x = TRK.x0 + a * TRK.cs + 8, y = TRK.y0 + b * TRK.cs + 13; disc(c, x, y - 6, 5, PAL.leafD); disc(c, x - 1, y - 7, 4, PAL.leaf); px(c, x - 1, y - 2, 2, 3, PAL.woodD); } });
    const cur = S.done ? null : S.steps[S.step], filled = new Set(S.steps.filter((s, i) => i < S.step || S.done).map(s => s.gap));
    S.info.forEach((p, i) => {
      const cx = TRK.x0 + p.cell[0] * TRK.cs + TRK.cs / 2, cy = TRK.y0 + p.cell[1] * TRK.cs + TRK.cs / 2;
      const isGap = TRACK_LV[S.lv].gaps.includes(i);
      if (isGap && !filled.has(i)) {
        const on = cur && cur.gap === i;
        px(c, cx - 7, cy - 7, 14, 14, on && Math.floor(t * 3) % 2 ? 'rgba(255,248,200,0.55)' : 'rgba(255,255,255,0.18)');
        for (let k = -7; k < 7; k += 3) { px(c, cx + k, cy - 8, 2, 1, '#fff8d4'); px(c, cx + k, cy + 7, 2, 1, '#fff8d4'); px(c, cx - 8, cy + k, 1, 2, '#fff8d4'); px(c, cx + 7, cy + k, 1, 2, '#fff8d4'); }
        if (on) drawTrackPiece(c, cx + (S.shake > 0 ? Math.round(Math.sin(S.shake * 40) * 2) : 0), cy, p, 0.28);
      } else {
        const d = S.dropKey === 'gap' + i ? Math.round(S.dy('gap' + i) / 2) : 0;
        drawTrackPiece(c, cx, cy + d, p);
      }
    });
    const first = S.info[0].cell, last = S.info[S.info.length - 1].cell;
    drawTrackStation(c, TRK.x0 + first[0] * TRK.cs + 8, TRK.y0 + first[1] * TRK.cs - 2, '#e2483d');
    drawTrackStation(c, TRK.x0 + last[0] * TRK.cs + 8, TRK.y0 + last[1] * TRK.cs - 2, '#4f86e0');
    // kereta: menunggu di stasiun awal, berjalan saat semua rel tersambung
    const d = S.trainD < 0 ? 6 : S.trainD;
    const [tx, ty, dir] = pointAlong(S.pts, Math.min(d, S.len - 4));
    drawToyTrain(c, tx, ty + 2, dir || 1, t);
  },
  update(dt, S) {
    if (S.done && S.trainD >= 0 && S.trainD < S.len - 4) { S.trainD += dt * 26; if (S.trainD >= S.len - 4) { sfx('chime'); say([{ k: 'arrived' }, { k: 'great' }]); } }
  },
  finish(S) { S.trainD = 6; EX.trackLv = (S.lv + 1) % TRACK_LV.length; exSave(); sfx('horn'); return [{ k: 'traingo' }, { k: 'choochoo' }]; },
  doneOpts: S => [['traingo', () => { S.trainD = 6; sfx('horn'); say([{ k: 'choochoo' }]); }], ['again', bdReset]],
  tapDone(S) { if (S.trainD >= S.len - 4) { S.trainD = 6; sfx('horn'); } say([{ k: 'choochoo' }]); },
};

// ================= 4. PESAWAT =================
const FLY_SIGHTS = ['home', 'farm', 'village', 'school', 'zoo', 'beach', 'mountain', 'station', 'carnival', 'church'];
BUILD.plane = {
  title: 'makeplane', doneWord: 'myplane',
  steps: [
    { key: 'wing', ask: 'pickwing', opts: ['bigwing', 'smallwing', 'twowing'] },
    { key: 'tail', ask: 'planetail', opts: ['planetail'] },
    { key: 'prop', ask: 'propeller', opts: ['propeller'], sfx: 'whoosh' },
    { key: 'wheels', ask: 'putwheels', taps: 3, icon: 'tire', sfx: 'bounce', count: ['tire', '个', 'gè'] },
    { key: 'color', ask: 'pickcolor', colors: true },
  ],
  restore(S) { if (!EX.plane) return false; S.cfg = Object.assign({ tail: 1, prop: 1 }, EX.plane); S.n = { wheels: 3 }; S.steps = this.steps; return true; },
  mode(S, m) { if (m === 'fly') this.takeoff(S); },
  takeoff(S) { S.mode = 'fly'; S.scroll = 0; S.seen = 1; S.climb = 0; sfx('whoosh'); bdRender(); say([{ k: 'fly', by: G.boy }, { k: 'lookdown' }]); },
  draw(c, t, S) {
    const cfg = { wing: S.cfg.wing, tail: !!S.cfg.tail, prop: !!S.cfg.prop, wheels: S.done ? 3 : S.n.wheels || 0, color: S.cfg.color };
    if (S.mode === 'fly') {
      bdSky(c, [120, 190, 240], [200, 232, 250], 110);
      for (let i = 0; i < 4; i++) { const x = ((i * 53 - S.scroll * 0.4) % 200 + 200) % 200 - 20; oval(c, x, 14 + i * 9, 12, 3, '#ffffff'); oval(c, x + 6, 12 + i * 9, 7, 3, '#ffffff'); }
      px(c, 0, 84, 160, 26, '#8fd06a'); groundPatches(c, 0, 84, 160, 26, 71, '#84c75f', 0.55);
      FLY_SIGHTS.forEach((k, i) => { const x = ((i * 70 - S.scroll) % (FLY_SIGHTS.length * 70) + FLY_SIGHTS.length * 70) % (FLY_SIGHTS.length * 70) - 30; if (x > -30 && x < 190 && ST_ART[k]) ST_ART[k](c, Math.round(x), 106); });
      const bob = Math.round(Math.sin(t * 2) * 2) - Math.round(S.climb * 0);
      big2(() => drawMyPlane(c, 40, 34 + bob / 2, cfg, t, { spin: true, pilot: true, noShadow: true }));
      return;
    }
    // hanggar: atap melengkung, lantai
    px(c, 0, 0, 160, 110, '#e8eef2');
    for (let y = 0; y < 20; y++) px(c, 0, y, 160, 1, y % 5 === 4 ? '#c9d4e0' : '#dfe6ee');
    for (let x = 10; x < 160; x += 30) px(c, x, 0, 2, 78, '#c9d4e0');
    px(c, 0, 78, 160, 32, '#b6bbc4'); for (let x = 0; x < 160; x += 20) px(c, x, 78, 1, 32, '#a0a5ae');
    for (let i = 0; i < 10; i++) px(c, 4 + i * 16, 100, 8, 2, '#f4cf3a');
    let x = 40, y = 47;
    if (S.act === 'takeoff') { const p = S.actT / 1.6; x = 40 + p * 70; y = 47 - Math.max(0, p - 0.4) * 50; }
    big2(() => drawMyPlane(c, x, y, cfg, t, { dy: k => Math.round(S.dy(k) / 2), spin: S.act === 'takeoff' || (S.done && S.cfg.prop), pilot: S.done }));
  },
  update(dt, S) {
    if (S.mode !== 'fly') return;
    S.scroll += dt * 24;
    const n = FLY_SIGHTS.length, idx = Math.floor((S.scroll + 80 + 30) / 70) % n;
    if (idx !== S.seen && Math.floor((S.scroll + 110) / 70) > 0) { S.seen = idx; const k = FLY_SIGHTS[(idx + n) % n]; say([{ k }]); }
  },
  actEnd(S, a) { if (a === 'takeoff') this.takeoff(S); },
  finish(S) { EX.plane = { wing: S.cfg.wing, color: S.cfg.color }; exSave(); return [{ k: 'myplane', by: G.boy }, { k: 'great' }]; },
  doneOpts(S) {
    if (S.mode === 'fly') return [['land', () => { S.mode = null; sfx('bounce'); bdRender(); say([{ k: 'land' }, { k: 'airport' }]); }]];
    return [['fly', () => { bdAct('takeoff', 1.6); sfx('whoosh'); say([{ k: 'fly', by: G.boy }]); }], ['makenew', bdReset]];
  },
  tapDone(S) {
    if (S.mode === 'fly') { const n = FLY_SIGHTS.length, idx = Math.round((S.scroll + 110) / 70) % n; say([{ k: 'lookdown' }, { k: FLY_SIGHTS[idx] }]); return; }
    bdAct('takeoff', 1.6); sfx('whoosh'); say([{ k: 'fly', by: G.boy }]);
  },
};

// ================= 5. TUKANG KAYU =================
BUILD.wood = {
  title: 'woodwork', doneWord: 'makedone',
  steps: [
    { key: 'kind', ask: 'whatmake', opts: ['birdhouse', 'chair', 'woodboat'] },
    { key: 'saw', ask: 'saw', taps: 3, icon: 'saw', sfx: 'shake' },
    { key: 'nails', ask: 'hammernail', taps: 4, icon: 'hammer', sfx: 'tap', count: ['nail', '颗', 'kē'] },
    { key: 'color', ask: 'paint', colors: true },
  ],
  draw(c, t, S) {
    drawPlanks(c, 0, 0, 160, 70, ['#c08a52', '#b88250', '#c89458'], '#8a6440', 33, 8, 40);
    px(c, 0, 66, 160, 4, '#7d5230');
    // alat di dinding
    px(c, 10, 8, 50, 26, '#8a6440'); px(c, 11, 9, 48, 24, '#a87a48');
    stHammer(c, 22, 30); stSaw(c, 44, 30);
    px(c, 0, 70, 160, 40, '#d9b27a'); for (let i = 0; i < 30; i++) px(c, (i * 37) % 160, 72 + (i * 13) % 36, 2, 1, '#f0d29a');
    // meja kerja
    px(c, 14, 76, 132, 8, PAL.wood); px(c, 14, 76, 132, 2, PAL.woodL); px(c, 14, 83, 132, 1, PAL.woodD); px(c, 20, 84, 6, 24, PAL.woodD); px(c, 134, 84, 6, 24, PAL.woodD);
    const kind = S.cfg.kind, cut = S.n.saw || 0, sawing = S.step === 1 && !S.done;
    if (!kind || (S.step <= 1 && !S.done && cut < 3)) {
      // papan panjang yang dipotong jadi beberapa bagian
      const parts = cut + 1, w = 96 / parts;
      for (let i = 0; i < parts; i++) { const x = 32 + i * (w + 3) - cut * 1.5; px(c, x, 68, w, 8, '#e8b878'); px(c, x, 68, w, 1, '#f6d6a6'); px(c, x, 75, w, 1, '#c08a52'); for (let k = 4; k < w - 2; k += 9) px(c, x + k, 71, 4, 1, '#d4a060'); }
      if (sawing) { const sx = 32 + (cut + 1) * 96 / (cut + 2) - cut * 1.5 + Math.round(Math.sin(t * 14) * (S.pulse > 0 ? 4 : 1)); stSaw(c, sx + 6, 70); }
    } else {
      big2(() => drawWoodThing(c, 40, 38, kind, { nails: S.done ? 4 : S.n.nails || 0, color: S.cfg.color }, t, { dy: k => Math.round(S.dy(k) / 2) }));
      if (S.step === 2 && !S.done && S.pulse > 0) { const nn = S.n.nails || 1, [a, b] = WOOD_NAILS[kind][nn - 1]; stHammer(c, 80 + a * 2 + 1, 76 + b * 2 + 16 - Math.round(S.pulse * 6)); }
      if (S.step === 3 && !S.done) { px(c, 128, 88, 12, 10, '#e8eef2'); px(c, 128, 88, 12, 3, '#c9d4e0'); px(c, 133, 78, 2, 10, PAL.woodD); px(c, 131, 74, 6, 4, '#3a3f4a'); }
    }
  },
  finish(S) { (EX.made = EX.made || {})[S.cfg.kind] = S.cfg.color; exSave(); const list = [{ k: S.cfg.kind }, { k: 'makedone' }, { k: 'great' }]; if (S.cfg.kind === 'birdhouse') list.push({ k: 'birdcome' }); return list; },
  doneOpts: S => [['makenew', bdReset]],
};

// ================= 6. MANUSIA SALJU =================
BUILD.snow = {
  title: 'makesnowman', doneWord: 'snowman',
  steps: [
    { key: 'big', ask: 'bigball', taps: 3, icon: 'bigball', sfx: 'whoosh', say: 'big' },
    { key: 'mid', ask: 'midball', taps: 2, icon: 'midball', sfx: 'whoosh' },
    { key: 'small', ask: 'smallball', taps: 1, icon: 'smallball', sfx: 'whoosh', say: 'small' },
    { key: 'nose', ask: 'putnose', opts: ['carrot'] },
    { key: 'buttons', ask: 'coatbutton', taps: 3, icon: 'coatbutton', sfx: 'tap', count: ['coatbutton', '颗', 'kē'] },
    { key: 'hat', ask: 'puthat', opts: ['hat'] },
    { key: 'scarf', ask: 'putscarf', opts: ['scarf'] },
  ],
  draw(c, t, S) {
    bdSky(c, [196, 214, 234], [232, 240, 248], 70);
    for (let x = 0; x < 160; x += 2) { const h = 10 + Math.sin(x / 15) * 5; px(c, x, 70 - h, 2, h, '#eef3fa'); }
    [[18, 66], [138, 64], [150, 70]].forEach(([x, y]) => drawPine(c, x, y, 26));
    px(c, 0, 68, 160, 42, '#ffffff'); groundPatches(c, 0, 68, 160, 42, 81, '#e6eef6', 0.58);
    for (let i = 0; i < 26; i++) { const x = (i * 41 + Math.floor(t * 9) * (i % 3 + 1)) % 160, y = (i * 23 + t * (10 + i % 5) * 2) % 70; px(c, x, y, i % 4 ? 1 : 2, i % 4 ? 1 : 2, '#ffffff'); }
    const C = S.done ? null : { big: S.n.big || 0, mid: S.n.mid || 0, small: S.n.small || 0, nose: !!S.cfg.nose, buttons: S.n.buttons || 0, hat: !!S.cfg.hat, scarf: !!S.cfg.scarf };
    big2(() => drawSnowman(c, 40, 53, C, t, { dy: k => Math.round(S.dy(k) / 2), arms: !C || C.mid > 0 }));
    if (C && !C.big) { px(c, 62, 92, 36, 4, '#e6eef6'); oval(c, 80, 92, 18, 4, '#ffffff'); }
  },
  finish(S) { EX.snowman = 1; exSave(); return [{ k: 'snowman' }, { k: 'great' }]; },
  doneOpts: S => [['makenew', bdReset]],
};

// ================= GAMBAR STIKER =================
const stSaw = (c, x, y) => { px(c, x - 12, y - 8, 18, 5, '#c9d4e0'); px(c, x - 12, y - 8, 18, 1, '#e8eef2'); for (let k = -12; k < 6; k += 2) px(c, x + k, y - 3, 1, 1, '#9aa8b8'); px(c, x + 6, y - 10, 7, 8, '#e2483d'); px(c, x + 8, y - 8, 3, 4, '#ff8a7a'); };
Object.assign(ST_ART, {
  newstreet: (c, x, y) => { px(c, x - 18, y - 2, 36, 2, '#8b8d94'); drawHouse(c, x - 16, y - 22, 14, 20, { roof: '#4f86e0', roofD: '#2f5bab', roofL: '#8fb4ee', door: 2 }); drawBuilt(c, x + 10, y - 2, 'tower', {}, 0); },
  site: (c, x, y) => { drawBuilt(c, x - 4, y, 'house', { bricks: 4, top: false, color: 'orange' }, 0); px(c, x + 12, y - 30, 2, 30, '#f4cf3a'); px(c, x - 6, y - 30, 20, 2, '#f4cf3a'); px(c, x - 4, y - 28, 1, 8, '#3a3f4a'); },
  garage: (c, x, y) => { px(c, x - 16, y - 24, 32, 24, '#c9d4e0'); px(c, x - 16, y - 24, 32, 2, '#7d8a98'); px(c, x - 12, y - 18, 24, 18, '#9aa8b8'); for (let k = -16; k < 0; k += 3) px(c, x - 12, y + k, 24, 1, '#7d8a98'); drawMyCar(c, x + 2, y + 2, { body: 'policecar' }, 0, { noShadow: true }); },
  carpentry: (c, x, y) => { drawWoodThing(c, x - 8, y, 'birdhouse', {}, 0); stSaw(c, x + 8, y - 2); },
  toyshop: (c, x, y) => { drawHouse(c, x - 15, y - 26, 30, 26, { roof: '#f39ac0', roofD: '#cc6a95', roofL: '#fcd0e2', door: 8 }); drawToyTrain(c, x + 4, y + 1, 1, 0); },
  airport: (c, x, y) => { px(c, x - 18, y - 4, 36, 4, '#7d8a98'); for (let k = -16; k < 18; k += 6) px(c, x + k, y - 2, 3, 1, '#ffffff'); px(c, x + 10, y - 30, 6, 26, '#e8eef2'); px(c, x + 8, y - 34, 10, 5, '#4f86e0'); drawMyPlane(c, x - 6, y - 4, { wing: 'bigwing', tail: 1, prop: 1, color: 'blue' }, 0, { noShadow: true }); },
  mechanic: (c, x, y) => drawPerson(c, x, y, { look: 'mechanic', dir: 'down', mood: 'happy', noShadow: true }),
  carpenter: (c, x, y) => drawPerson(c, x, y, { look: 'carpenter', dir: 'down', mood: 'happy', noShadow: true }),
  builder: (c, x, y) => drawPerson(c, x, y, { look: 'builder', dir: 'down', mood: 'happy', noShadow: true }),
  pilot: (c, x, y) => drawPerson(c, x, y, { look: 'pilot', dir: 'down', mood: 'happy', noShadow: true }),
  shopkeeper: (c, x, y) => drawPerson(c, x, y, { look: 'shopkeeper', dir: 'down', mood: 'happy', noShadow: true }),
  whatbuild: (c, x, y) => { drawBuilt(c, x - 10, y, 'house', {}, 0); drawBuilt(c, x + 10, y, 'tower', { color: 'blue' }, 0); },
  house: (c, x, y) => drawBuilt(c, x, y, 'house', {}, 0),
  tower: (c, x, y) => drawBuilt(c, x, y, 'tower', { color: 'blue' }, 0),
  bridge: (c, x, y) => drawBuilt(c, x, y, 'bridge', { color: 'yellow' }, 0),
  excavator: (c, x, y) => { px(c, x - 12, y - 5, 22, 5, '#3a3f4a'); for (let k = -11; k < 10; k += 3) px(c, x + k, y - 4, 1, 2, '#7d8a98'); px(c, x - 10, y - 13, 16, 8, '#f4cf3a'); px(c, x - 10, y - 13, 16, 1, '#fff2a8'); px(c, x - 9, y - 19, 8, 6, '#f4cf3a'); px(c, x - 8, y - 18, 6, 4, '#bfe3f2'); px(c, x + 4, y - 22, 12, 2, '#c9a21f'); px(c, x + 14, y - 22, 2, 12, '#c9a21f'); px(c, x + 12, y - 11, 6, 4, '#5f6c7a'); },
  dig: (c, x, y) => { ST_ART.excavator(c, x - 4, y); oval(c, x + 12, y - 2, 6, 2, '#7d5230'); },
  truck: (c, x, y) => truckArt(c, x + 2, y, true, 0),
  truckgo: (c, x, y) => { truckArt(c, x + 2, y, true, 0); drawArrow(c, x + 16, y - 18, 'right', 0); },
  crane: (c, x, y) => { px(c, x + 8, y - 34, 3, 34, '#f4cf3a'); px(c, x - 14, y - 34, 26, 3, '#f4cf3a'); px(c, x - 10, y - 31, 1, 12, '#3a3f4a'); brickAt(c, x - 14, y - 19, 9, 5, ['#d9915a', '#a8643a', '#f0b884']); px(c, x + 4, y - 4, 11, 4, '#7d8a98'); },
  brick: (c, x, y) => { brickAt(c, x - 10, y - 8, 20, 8, ['#d9915a', '#a8643a', '#f0b884']); brickAt(c, x - 5, y - 16, 20, 8, ['#d9915a', '#a8643a', '#f0b884']); },
  putbrick: (c, x, y) => drawBuilt(c, x, y, 'house', { bricks: 5, top: false }, 0),
  roof: (c, x, y) => { for (let k = 0; k < 12; k++) px(c, x - 2 - Math.round(k * 1.4), y - 18 + k, 4 + Math.round(k * 2.8), 1, k === 0 ? '#e8735a' : k % 3 === 2 ? '#a23a2c' : '#d4553f'); },
  cardrive: (c, x, y) => drawBuilt(c, x, y, 'bridge', { color: 'yellow' }, 0, { carT: 0.6 }),
  builddone: (c, x, y) => { drawBuilt(c, x, y, 'house', {}, 0); drawStar(c, x - 16, y - 26, '#ffd84a'); drawStar(c, x + 16, y - 20, '#ffd84a'); },
  cone: (c, x, y) => { px(c, x - 8, y - 3, 16, 3, '#bd5e1c'); for (let k = 0; k < 16; k++) px(c, x - 6 + Math.round(k * 0.35), y - 4 - k, 12 - Math.round(k * 0.7), 1, k % 6 < 2 ? '#ffffff' : '#f08a32'); },
  hardhat: (c, x, y) => { oval(c, x, y - 8, 12, 8, '#f4cf3a'); px(c, x - 14, y - 4, 28, 3, '#c9a21f'); px(c, x - 1, y - 16, 3, 12, '#fff2a8'); px(c, x - 14, y - 1, 28, 1, '#000000'); },
  makecar: (c, x, y) => { drawMyCar(c, x - 4, y, { body: 'policecar', tires: 2 }, 0, { noShadow: true }); stWrench(c, x + 18, y); },
  pickcar: (c, x, y) => { drawMyCar(c, x - 6, y - 8, { body: 'firetruck' }, 0, { noShadow: true }); drawMyCar(c, x + 6, y, { body: 'icecreamtruck' }, 0, { noShadow: true }); },
  policecar: (c, x, y) => drawMyCar(c, x, y, { body: 'policecar' }, 0, { noShadow: true }),
  firetruck: (c, x, y) => drawMyCar(c, x, y, { body: 'firetruck' }, 0, { noShadow: true }),
  icecreamtruck: (c, x, y) => drawMyCar(c, x, y, { body: 'icecreamtruck' }, 0, { noShadow: true }),
  tire: (c, x, y) => { disc(c, x, y - 10, 10, '#2a2a2e'); disc(c, x, y - 10, 5, '#c9c9d2'); disc(c, x, y - 10, 2, '#7d8a98'); px(c, x - 7, y - 16, 3, 2, '#5a5a62'); },
  putwheels: (c, x, y) => drawMyCar(c, x, y, { body: 'policecar', tires: 2 }, 0, { noShadow: true }),
  steeringwheel: (c, x, y) => { disc(c, x, y - 12, 11, '#3a3f4a'); disc(c, x, y - 12, 8, '#ffffff'); px(c, x - 8, y - 13, 16, 3, '#3a3f4a'); px(c, x - 1, y - 12, 3, 9, '#3a3f4a'); disc(c, x, y - 12, 3, '#e2483d'); },
  carlight: (c, x, y) => { disc(c, x - 8, y - 10, 7, '#c9d4e0'); disc(c, x - 8, y - 10, 5, '#fff2a8'); for (let i = 0; i < 14; i++) px(c, x - 1 + i, y - 12 - Math.floor(i / 3), 1, 4 + Math.floor(i / 2), 'rgba(255,230,120,0.7)'); },
  mycar: (c, x, y) => { drawMyCar(c, x, y, Object.assign({ body: 'policecar' }, EX.car || {}), 0, { noShadow: true, driver: true }); drawHeart(c, x + 16, y - 28); },
  drive: (c, x, y) => { drawMyCar(c, x - 4, y, Object.assign({ body: 'policecar' }, EX.car || {}), 0, { noShadow: true, driver: true }); for (let k = 0; k < 3; k++) px(c, x - 26 - k * 3, y - 14 + k * 4, 5, 1, '#9aa8b8'); },
  beep: (c, x, y) => { drawMyCar(c, x - 4, y, Object.assign({ body: 'policecar' }, EX.car || {}), 0, { noShadow: true, driver: true }); for (let k = 0; k < 3; k++) px(c, x + 18 + k * 3, y - 18 - k * 4, 2, 3 + k * 2, '#f4cf3a'); },
  buildtrack: (c, x, y) => { trackSticker('curve')(c, x - 10, y); trackSticker('straight')(c, x + 10, y); drawToyTrain(c, x + 10, y - 9, 1, 0); },
  straight: trackSticker('straight'), curve: trackSticker('curve'),
  whichone: (c, x, y) => { trackSticker('straight')(c, x - 6, y); px(c, x + 9, y - 26, 6, 2, '#4f86e0'); px(c, x + 13, y - 25, 2, 5, '#4f86e0'); px(c, x + 10, y - 21, 4, 2, '#4f86e0'); px(c, x + 10, y - 17, 3, 2, '#4f86e0'); },
  tryother: (c, x, y) => { trackSticker('curve')(c, x - 8, y); trackSticker('straight')(c, x + 8, y - 6); },
  traingo: (c, x, y) => { trackSticker('straight')(c, x - 10, y); trackSticker('straight')(c, x + 10, y); drawToyTrain(c, x + 4, y - 9, 1, 0); },
  choochoo: (c, x, y) => { drawToyTrain(c, x, y - 4, 1, 0); disc(c, x + 4, y - 18, 3, '#ffffff'); disc(c, x + 8, y - 24, 4, '#ffffff'); },
  blocks: (c, x, y) => { brickAt(c, x - 12, y - 8, 8, 8, RB_TONE.red); brickAt(c, x - 3, y - 8, 8, 8, RB_TONE.blue); brickAt(c, x + 6, y - 8, 8, 8, RB_TONE.green); brickAt(c, x - 7, y - 16, 8, 8, RB_TONE.yellow); for (let k = 0; k < 6; k++) px(c, x + 3 - k, y - 17 - k, 1 + k * 2 > 12 ? 12 : 1 + k * 2, 1, RB_TONE.pink[0]); },
  makeplane: (c, x, y) => { drawMyPlane(c, x - 2, y, { wing: 'bigwing', tail: 1, prop: 1, wheels: 2, color: 'red' }, 0, { noShadow: true }); stWrench(c, x + 18, y); },
  pickwing: (c, x, y) => { oval(c, x, y - 18, 16, 3, '#2f5bab'); oval(c, x, y - 19, 15, 2, '#4f86e0'); oval(c, x, y - 6, 10, 3, '#a8352b'); oval(c, x, y - 7, 9, 2, '#e2483d'); },
  bigwing: (c, x, y) => { drawMyPlane(c, x, y, { wing: 'bigwing', wheels: 0 }, 0, { noShadow: true }); },
  smallwing: (c, x, y) => { drawMyPlane(c, x, y, { wing: 'smallwing', wheels: 0, color: 'yellow' }, 0, { noShadow: true }); },
  twowing: (c, x, y) => { drawMyPlane(c, x, y, { wing: 'twowing', wheels: 0, color: 'red' }, 0, { noShadow: true }); },
  planetail: (c, x, y) => { for (let k = 0; k < 18; k++) px(c, x - 8 + Math.round(k * 0.5), y - 4 - k, 14 - Math.round(k * 0.6), 1, k > 14 ? '#ff8a7a' : '#e2483d'); px(c, x - 12, y - 4, 22, 4, '#a8352b'); },
  propeller: (c, x, y) => { px(c, x - 1, y - 32, 3, 30, '#5f6c7a'); px(c, x - 1, y - 32, 3, 3, '#e2483d'); px(c, x - 1, y - 5, 3, 3, '#e2483d'); disc(c, x, y - 17, 4, '#3a3f4a'); disc(c, x, y - 17, 2, '#9aa8b8'); },
  myplane: (c, x, y) => { drawMyPlane(c, x, y, Object.assign({ wing: 'bigwing', tail: 1, prop: 1 }, EX.plane || {}), 0, { noShadow: true, pilot: true }); drawHeart(c, x + 16, y - 26); },
  fly: (c, x, y) => { oval(c, x - 10, y - 4, 9, 3, '#ffffff'); drawMyPlane(c, x + 2, y - 10, Object.assign({ wing: 'bigwing', tail: 1, prop: 1 }, EX.plane || {}), 0, { noShadow: true, spin: true, pilot: true }); },
  land: (c, x, y) => { px(c, x - 18, y - 3, 36, 3, '#7d8a98'); for (let k = -16; k < 18; k += 6) px(c, x + k, y - 2, 3, 1, '#ffffff'); drawMyPlane(c, x, y - 3, Object.assign({ wing: 'bigwing', tail: 1, prop: 1 }, EX.plane || {}), 0, { noShadow: true }); },
  lookdown: (c, x, y) => { drawHouse(c, x - 8, y - 14, 16, 14, { roof: '#d4553f', roofD: '#a23a2c', roofL: '#e8735a' }); drawArrow(c, x + 14, y - 24, 'down', 0); },
  runway: (c, x, y) => { px(c, x - 18, y - 10, 36, 10, '#7d8a98'); for (let k = -16; k < 18; k += 8) px(c, x + k, y - 6, 5, 2, '#ffffff'); },
  controltower: (c, x, y) => { px(c, x - 3, y - 26, 6, 26, '#e8eef2'); px(c, x - 3, y - 26, 2, 26, '#ffffff'); px(c, x - 8, y - 34, 16, 8, '#2a3a4a'); px(c, x - 7, y - 33, 14, 5, '#7cf0c4'); px(c, x - 9, y - 36, 18, 2, '#e2483d'); },
  hangar: (c, x, y) => { for (let k = 0; k < 14; k++) { const w = Math.round(Math.sqrt(1 - ((13 - k) / 14) ** 2) * 18); px(c, x - w, y - 4 - k * 2 - 2, w * 2, 2, k % 2 ? '#c9d4e0' : '#dfe6ee'); } px(c, x - 18, y - 4, 36, 4, '#9aa8b8'); px(c, x - 10, y - 18, 20, 14, '#5f6c7a'); },
  woodwork: (c, x, y) => { drawWoodThing(c, x - 6, y, 'chair', {}, 0); stHammer(c, x + 12, y); },
  whatmake: (c, x, y) => { drawWoodThing(c, x - 9, y, 'birdhouse', {}, 0); drawWoodThing(c, x + 10, y, 'chair', {}, 0); },
  birdhouse: (c, x, y) => drawWoodThing(c, x, y, 'birdhouse', { color: 'yellow' }, 0),
  woodboat: (c, x, y) => drawWoodThing(c, x, y, 'woodboat', { color: 'blue' }, 0),
  wood: (c, x, y) => { for (let i = 0; i < 3; i++) { px(c, x - 14 + i * 2, y - 6 - i * 7, 28, 6, '#e8b878'); px(c, x - 14 + i * 2, y - 6 - i * 7, 28, 1, '#f6d6a6'); disc(c, x + 13 + i * 2, y - 3 - i * 7, 3, '#c08a52'); disc(c, x + 13 + i * 2, y - 3 - i * 7, 1, '#a8743c'); } },
  saw: (c, x, y) => { px(c, x - 16, y - 6, 32, 6, '#e8b878'); px(c, x - 16, y - 6, 32, 1, '#f6d6a6'); stSaw(c, x + 2, y - 6); },
  nail: (c, x, y) => { px(c, x - 5, y - 24, 11, 3, '#9aa8b8'); px(c, x - 5, y - 24, 11, 1, '#e8eef2'); px(c, x - 1, y - 21, 3, 17, '#9aa8b8'); px(c, x - 1, y - 21, 1, 17, '#e8eef2'); px(c, x, y - 4, 1, 3, '#7d8a98'); },
  hammernail: (c, x, y) => { px(c, x - 14, y - 5, 28, 5, '#e8b878'); px(c, x - 1, y - 10, 2, 5, '#9aa8b8'); px(c, x - 3, y - 11, 6, 1, '#9aa8b8'); stHammer(c, x + 8, y - 8); },
  paint: (c, x, y) => { px(c, x - 12, y - 14, 14, 14, '#e8eef2'); px(c, x - 12, y - 14, 14, 3, '#4f86e0'); px(c, x - 11, y - 10, 12, 1, '#4f86e0'); px(c, x + 6, y - 26, 3, 14, PAL.woodD); px(c, x + 4, y - 12, 7, 6, '#3a3f4a'); px(c, x + 4, y - 7, 7, 3, '#4f86e0'); },
  makedone: (c, x, y) => { drawWoodThing(c, x, y, 'birdhouse', { color: 'green' }, 0); drawStar(c, x - 15, y - 26, '#ffd84a'); drawStar(c, x + 15, y - 18, '#ffd84a'); },
  birdcome: (c, x, y) => { drawWoodThing(c, x - 4, y, 'birdhouse', { color: 'yellow' }, 0); drawBird(c, x + 12, y - 22, 0, '#4f86e0'); },
  snowman: (c, x, y) => drawSnowman(c, x, y, null, 0, { noShadow: true }),
  makesnowman: (c, x, y) => { drawSnowman(c, x - 4, y, { big: 3, mid: 2, small: 1, nose: 1 }, 0, { noShadow: true, arms: false }); oval(c, x + 14, y - 4, 6, 4, '#ffffff'); },
  bigball: (c, x, y) => { disc(c, x, y - 13, 13, '#cfdbe6'); disc(c, x - 1, y - 14, 12, '#ffffff'); },
  midball: (c, x, y) => { disc(c, x, y - 9, 9, '#cfdbe6'); disc(c, x - 1, y - 10, 8, '#ffffff'); },
  smallball: (c, x, y) => { disc(c, x, y - 6, 6, '#cfdbe6'); disc(c, x - 1, y - 7, 5, '#ffffff'); },
  putnose: (c, x, y) => { disc(c, x - 3, y - 12, 11, '#cfdbe6'); disc(c, x - 4, y - 13, 10, '#ffffff'); px(c, x - 7, y - 16, 2, 2, '#2a1d18'); px(c, x, y - 16, 2, 2, '#2a1d18'); px(c, x - 3, y - 12, 12, 3, '#f08a32'); px(c, x + 9, y - 11, 3, 1, '#f08a32'); },
  coatbutton: (c, x, y) => { for (const [a, b] of [[-8, -8], [6, -12]]) { disc(c, x + a, y + b, 6, '#3a2616'); disc(c, x + a, y + b, 5, '#5a3a22'); px(c, x + a - 2, y + b - 1, 2, 2, '#2a1d18'); px(c, x + a + 1, y + b - 1, 2, 2, '#2a1d18'); } },
  puthat: (c, x, y) => { px(c, x - 14, y - 4, 28, 4, '#2a2a32'); px(c, x - 8, y - 22, 16, 18, '#2a2a32'); px(c, x - 8, y - 9, 16, 4, '#e2483d'); px(c, x - 8, y - 22, 16, 1, '#4a4a55'); },
  putscarf: (c, x, y) => { px(c, x - 14, y - 22, 28, 6, '#e2483d'); px(c, x - 14, y - 22, 28, 2, '#ff8a7a'); px(c, x + 4, y - 16, 6, 14, '#e2483d'); for (let k = 0; k < 3; k++) px(c, x + 4 + k * 2, y - 2, 1, 2, '#a8352b'); },
});
