// Bermain & merawat (bukan merakit), memakai mesin langkah dari build.js:
//  1. Klinik Dokter Hewan — pintu di ujung kanan Kebun Binatang. Hewan sakit: tunjuk yang sakit, dengarkan, obati, elus.
//  2. Petak Umpet di rumah — kotak mainan di Rumah. 4 hewan bersembunyi: atas / bawah / dalam / belakang.
//  3. Waktu Tidur — tempat tidur di Rumah: mandi, handuk, sikat gigi, piyama, cerita, lampu, selamat malam, lalu tidur.

// ================= KATA BARU =================
Object.assign(WORDS, {
  vet: ['宠物医院', 'chǒng wù yī yuàn', 'klinik dokter hewan'],
  vetdoc: ['兽医', 'shòu yī', 'dokter hewan'],
  beadoctor: ['当小医生', 'dāng xiǎo yī shēng', 'jadi dokter kecil'],
  whathurt: ['哪里疼？', 'nǎ lǐ téng', 'sakitnya di mana?'],
  earshurt: ['耳朵疼', 'ěr duo téng', 'telinganya sakit'],
  foothurt: ['脚疼', 'jiǎo téng', 'kakinya sakit'],
  tummyhurt: ['肚子疼', 'dù zi téng', 'perutnya sakit'],
  headhurt: ['头疼', 'tóu téng', 'kepalanya sakit'],
  listen: ['听一听', 'tīng yi tīng', 'dengarkan'],
  stethoscope: ['听诊器', 'tīng zhěn qì', 'stetoskop'],
  heartbeat: ['扑通扑通', 'pū tōng pū tōng', 'dug-dug-dug'],
  whichfix: ['用什么？', 'yòng shén me', 'pakai apa?'],
  bandage: ['创可贴', 'chuàng kě tiē', 'plester'],
  medicine: ['药', 'yào', 'obat'],
  pet: ['摸摸它', 'mō mo tā', 'elus-elus'],
  nothurt: ['不疼了！', 'bù téng le', 'sudah tidak sakit!'],
  thanksdoc: ['谢谢医生！', 'xiè xie yī shēng', 'terima kasih, dokter!'],
  nextpatient: ['下一位', 'xià yí wèi', 'pasien berikutnya'],
  notthis: ['不是这个', 'bú shì zhè ge', 'bukan yang ini'],
  // petak umpet di rumah (posisi tanpa nama Dòudou)
  whereis: ['在哪里？', 'zài nǎ lǐ', 'di mana?'],
  findit: ['找一找！', 'zhǎo yi zhǎo', 'ayo cari!'],
  hsTop: ['在柜子上面', 'zài guì zi shàng mian', 'di atas lemari'],
  hsUnder: ['在桌子下面', 'zài zhuō zi xià mian', 'di bawah meja'],
  hsIn: ['在箱子里面', 'zài xiāng zi lǐ mian', 'di dalam kotak'],
  hsBehind: ['在沙发后面', 'zài shā fā hòu mian', 'di belakang sofa'],
  comeout: ['都出来吧！', 'dōu chū lai ba', 'semuanya keluar!'],
  toybox: ['玩具箱', 'wán jù xiāng', 'kotak mainan'],
  // waktu tidur
  bedtime: ['睡觉时间', 'shuì jiào shí jiān', 'waktunya tidur'],
  takebath: ['洗澡', 'xǐ zǎo', 'mandi'],
  towel: ['毛巾', 'máo jīn', 'handuk'],
  drytowel: ['擦干', 'cā gān', 'keringkan badan'],
  pajamas: ['穿睡衣', 'chuān shuì yī', 'pakai piyama'],
  readstory: ['讲故事', 'jiǎng gù shi', 'dengar cerita'],
  lightsoff: ['关灯', 'guān dēng', 'matikan lampu'],
  saygoodnight: ['说晚安', 'shuō wǎn ān', 'ucapkan selamat malam'],
});
Object.assign(WORDS_EN, {
  vet: 'animal hospital', vetdoc: 'vet', beadoctor: "Let's be a vet!", whathurt: 'Where does it hurt?',
  earshurt: 'sore ear', foothurt: 'sore foot', tummyhurt: 'tummy ache', headhurt: 'headache',
  listen: "Let's listen", stethoscope: 'stethoscope', heartbeat: 'thump, thump', whichfix: 'What do we use?',
  bandage: 'bandage', medicine: 'medicine', pet: 'Pat it gently', nothurt: 'All better!', thanksdoc: 'Thank you, doctor!', nextpatient: 'next patient', notthis: 'Not this one',
  whereis: 'Where is it?', findit: "Let's look!", hsTop: 'on top of the cupboard', hsUnder: 'under the table', hsIn: 'in the box', hsBehind: 'behind the sofa',
  comeout: 'Everybody, come out!', toybox: 'toy box',
  bedtime: 'bedtime', takebath: 'bath time', towel: 'towel', drytowel: 'dry off', pajamas: 'put on pajamas', readstory: 'story time', lightsoff: 'lights off', saygoodnight: 'say goodnight',
});
Object.assign(WORDS_JA, {
  vet: ['どうぶつびょういん', 'dōbutsu byōin'], vetdoc: ['じゅういさん', 'jūi-san'], beadoctor: ['おいしゃさんごっこ', 'oisha-san gokko'],
  whathurt: ['どこが いたいの？', 'doko ga itai no?'], earshurt: ['みみが いたい', 'mimi ga itai'], foothurt: ['あしが いたい', 'ashi ga itai'],
  tummyhurt: ['おなかが いたい', 'onaka ga itai'], headhurt: ['あたまが いたい', 'atama ga itai'],
  listen: ['きいてみよう', 'kiite miyō'], stethoscope: ['ちょうしんき', 'chōshinki'], heartbeat: ['どきどき', 'doki doki'], whichfix: ['なにを つかう？', 'nani o tsukau?'],
  bandage: ['ばんそうこう', 'bansōkō'], medicine: ['くすり', 'kusuri'], pet: ['なでなで', 'nade nade'], nothurt: ['もう いたくない！', 'mō itakunai!'],
  thanksdoc: ['ありがとう、せんせい！', 'arigatō, sensei!'], nextpatient: ['つぎの かんじゃさん', 'tsugi no kanja-san'], notthis: ['これじゃ ないよ', 'kore ja nai yo'],
  whereis: ['どこ かな？', 'doko kana?'], findit: ['さがしてね！', 'sagashite ne!'],
  hsTop: ['たなの うえ', 'tana no ue'], hsUnder: ['つくえの した', 'tsukue no shita'], hsIn: ['はこの なか', 'hako no naka'], hsBehind: ['ソファの うしろ', 'sofa no ushiro'],
  comeout: ['みんな でておいで！', 'minna dete oide!'], toybox: ['おもちゃばこ', 'omocha-bako'],
  bedtime: ['ねる じかん', 'neru jikan'], takebath: ['おふろ', 'ofuro'], towel: ['タオル', 'taoru'], drytowel: ['ふこうね', 'fukō ne'],
  pajamas: ['パジャマを きよう', 'pajama o kiyō'], readstory: ['えほんを よもう', 'ehon o yomō'], lightsoff: ['でんきを けそう', 'denki o kesō'], saygoodnight: ['おやすみを いおう', 'oyasumi o iō'],
});

Object.assign(LOOKS, {
  vetdoc: { skin: '#f3c6a0', hair: '#3a2418', hairL: '#5a3a2a', style: 'bob', shirt: '#ffffff', shirtD: '#d6dee6', pants: '#58a8c0', shoes: '#f4f7fa' },
});
Object.assign(VOICE_ROLE, { vetdoc: { pitch: 1.05 } });

// ================= GAMBAR: HEWAN DUDUK MENGHADAP DEPAN =================
// x,y = titik tengah bawah. Dipakai di klinik (besar, big2) dan petak umpet (ukuran biasa).
const PET_COL = {
  dog: { b: '#d39552', d: '#9a6332', l: '#fbe8cc' },
  cat: { b: '#ee9a4a', d: '#c8732c', l: '#fde2c0' },
  rabbit: { b: '#f4f1ea', d: '#cfc8bc', l: '#ffffff' },
  panda: { b: '#fbf8f0', d: '#2a2a2e', l: '#ffffff' },
};
const PET_KINDS = ['dog', 'cat', 'rabbit', 'panda'];
// letak bagian tubuh (relatif titik tengah bawah)
function petPart(kind, part) {
  if (part === 'ears') return kind === 'rabbit' ? [4, -36] : kind === 'dog' ? [8, -19] : [6, -29];
  if (part === 'head') return [-2, -27];
  if (part === 'tummy') return [0, -8];
  return [5, -2]; // foot
}
function bdHeart(c, x, y, col) {
  px(c, x - 3, y - 1, 3, 1, col); px(c, x + 1, y - 1, 3, 1, col); px(c, x - 3, y, 7, 2, col);
  px(c, x - 2, y + 2, 5, 1, col); px(c, x - 1, y + 3, 3, 1, col); px(c, x, y + 4, 1, 1, col); px(c, x - 2, y - 1, 1, 1, '#ffffff');
}
function drawPlaster(c, x, y) {
  px(c, x - 4, y - 1, 9, 3, '#f2c9a0'); px(c, x - 1, y - 4, 3, 9, '#f2c9a0');
  px(c, x - 1, y - 1, 3, 3, '#e0a878'); px(c, x - 4, y + 1, 9, 1, '#d9b088');
}
// o: {mood: 'happy'|'sad', sore, band, jump, wag, t, noShadow, hideBody}
function drawPatient(c, x, y, kind, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const C = PET_COL[kind], K = '#2a1d18', P = kind === 'panda', t = o.t || 0, j = Math.round(o.jump || 0);
  if (!o.noShadow) shadow(c, x, y, 10);
  y -= j;
  const limb = P ? '#2a2a2e' : C.d;
  // ekor
  const wg = o.wag ? (Math.floor(t * 8) % 2) : 0;
  if (kind === 'dog') { px(c, x + 7, y - 8 - wg, 5, 2, C.d); px(c, x + 11, y - 10 - wg, 2, 3, C.d); }
  if (kind === 'cat') { px(c, x + 7, y - 4, 4, 2, C.b); px(c, x + 10, y - 10 - wg, 2, 7, C.b); px(c, x + 10, y - 12 - wg, 2, 2, C.d); }
  if (kind === 'rabbit') disc(c, x + 8, y - 4, 2, '#ffffff');
  if (!o.hideBody) {
    // badan, perut, kaki, tangan
    oval(c, x, y - 9, 8, 8, P ? '#2a2a2e' : C.b);
    oval(c, x, y - 9, 6, 7, C.b);
    oval(c, x, y - 7, 5, 5, C.l);
    oval(c, x - 5, y - 2, 3, 2, limb); oval(c, x + 5, y - 2, 3, 2, limb);
    px(c, x - 6, y - 2, 2, 1, '#e8a0a0'); px(c, x + 5, y - 2, 2, 1, '#e8a0a0');
    oval(c, x - 7, y - 10, 2, 4, limb); oval(c, x + 7, y - 10, 2, 4, limb);
  }
  // telinga di belakang kepala
  if (kind === 'cat') {
    for (const s of [-1, 1]) {
      const ex = x + s * 6;
      px(c, ex - 1, y - 33, 2, 1, C.d); px(c, ex - 2, y - 32, 4, 1, C.b); px(c, ex - 3, y - 31, 6, 3, C.b); px(c, ex - 1, y - 31, 2, 2, '#f7b6c8');
    }
  }
  if (kind === 'rabbit') { for (const s of [-1, 1]) { oval(c, x + s * 4, y - 36, 3, 8, C.b); oval(c, x + s * 4, y - 35, 1, 6, '#f7b6c8'); } }
  if (P) { disc(c, x - 6, y - 28, 3, '#2a2a2e'); disc(c, x + 6, y - 28, 3, '#2a2a2e'); }
  // kepala
  disc(c, x, y - 21, 8, C.b);
  if (kind === 'cat') { px(c, x - 1, y - 29, 3, 3, C.d); px(c, x - 4, y - 28, 1, 2, C.d); px(c, x + 4, y - 28, 1, 2, C.d); }
  if (kind === 'dog') { for (const s of [-1, 1]) oval(c, x + s * 8, y - 20, 3, 6, C.d); px(c, x - 3, y - 28, 6, 2, C.l); }
  if (P) { oval(c, x - 3, y - 21, 2, 3, '#2a2a2e'); oval(c, x + 3, y - 21, 2, 3, '#2a2a2e'); }
  // wajah
  const eye = P ? '#ffffff' : K, happy = o.mood !== 'sad';
  if (happy && o.mood === 'happy') {
    for (const s of [-3, 3]) { px(c, x + s - 1, y - 21, 1, 1, eye); px(c, x + s, y - 22, 1, 1, eye); px(c, x + s + 1, y - 21, 1, 1, eye); }
  } else {
    px(c, x - 3, y - 22, 1, 2, eye); px(c, x + 3, y - 22, 1, 2, eye);
  }
  if (!happy) {
    px(c, x - 5, y - 25, 2, 1, K); px(c, x - 3, y - 26, 1, 1, K); px(c, x + 4, y - 25, 2, 1, K); px(c, x + 3, y - 26, 1, 1, K);
    if (Math.floor(t * 1.5) % 2) disc(c, x - 4, y - 18, 1, '#8fd0f2');
  }
  oval(c, x, y - 17, kind === 'dog' ? 4 : 3, kind === 'dog' ? 3 : 2, kind === 'dog' || kind === 'cat' ? C.l : '#ffffff');
  px(c, x - 1, y - 19, 3, 1, kind === 'cat' || kind === 'rabbit' ? '#e87a8a' : K);
  if (happy) { px(c, x - 2, y - 17, 1, 1, K); px(c, x - 1, y - 16, 3, 1, K); px(c, x + 2, y - 17, 1, 1, K); px(c, x - 7, y - 19, 2, 1, '#f7a0a0'); px(c, x + 6, y - 19, 2, 1, '#f7a0a0'); }
  else { px(c, x - 1, y - 17, 3, 1, K); px(c, x - 2, y - 16, 1, 1, K); px(c, x + 2, y - 16, 1, 1, K); }
  if (kind === 'cat') { px(c, x - 9, y - 18, 4, 1, C.d); px(c, x + 6, y - 18, 4, 1, C.d); }
  // bagian yang sakit / sudah diplester
  if (o.sore) { const [dx, dy] = petPart(kind, o.sore), r = 2 + (Math.floor(t * 4) % 2); disc(c, x + dx, y + dy, r + 1, 'rgba(226,72,61,0.35)'); disc(c, x + dx, y + dy, r - 1, 'rgba(226,72,61,0.7)'); }
  if (o.band && o.band !== 'tummy') { const [dx, dy] = petPart(kind, o.band); drawPlaster(c, x + dx, y + dy); }
}

// ================= 1. KLINIK DOKTER HEWAN =================
const VET_PARTS = ['ears', 'foot', 'tummy', 'head'];
function vetPatient() { const i = EX.vetI || 0; return { kind: PET_KINDS[i % 4], part: VET_PARTS[(i * 3 + 1) % 4] }; }
function shuffled(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

BUILD.vet = {
  title: 'beadoctor', doneWord: 'nothurt',
  steps(S) {
    const p = S.pat = vetPatient(), fix = p.part === 'tummy' ? 'medicine' : 'bandage';
    const opts = shuffled([p.part].concat(shuffled(VET_PARTS.filter(k => k !== p.part)).slice(0, 2)));
    // salah pilih: "bukan ini" lalu tanya lagi (bukan "ganti potongan" dari permainan rel)
    const miss = (S, k) => { S.shake = 0.5; sfx('bounce'); say([{ k }, { k: 'notthis' }].concat(bdAsk(S, S.steps[S.step]))); };
    return [
      { key: 'part', ask: 'whathurt', askList: () => [{ k: p.kind }, { k: 'whathurt' }], opts, answer: p.part, sfx: 'tap', miss, sayList: () => [{ k: p.part + 'hurt' }] },
      { key: 'listen', ask: 'listen', taps: 3, icon: 'stethoscope', sfx: 'tap', tapSay: () => [{ k: 'heartbeat' }] },
      { key: 'fix', ask: 'whichfix', opts: shuffled(['bandage', 'medicine']), answer: fix, sfx: 'chime', miss },
      { key: 'pet', ask: 'pet', taps: 3, icon: 'pet', sfx: 'chime', tapSay: (S, i) => [{ k: 'n' + i }] },
    ];
  },
  draw(c, t, S) {
    // dinding klinik & lantai
    px(c, 0, 0, 160, 70, '#d9f0ea'); for (let x = 0; x < 160; x += 10) px(c, x, 0, 1, 66, '#cbe8e0');
    px(c, 0, 62, 160, 8, '#9fd3c4'); px(c, 0, 62, 160, 1, '#c4e8de');
    for (let y = 70; y < 110; y += 10) for (let x = 0; x < 160; x += 10) px(c, x, y, 10, 10, ((x + y) / 10) % 2 ? '#eef5f3' : '#e2ece9');
    // tanda palang hijau & rak obat
    disc(c, 22, 20, 11, '#ffffff'); px(c, 19, 12, 6, 16, '#3fae7a'); px(c, 14, 17, 16, 6, '#3fae7a');
    px(c, 118, 14, 36, 3, PAL.woodD); px(c, 118, 34, 36, 3, PAL.woodD);
    [['#e2483d', 121], ['#4f86e0', 129], ['#f4cf3a', 137], ['#58a84a', 145]].forEach(([k, x], i) => { px(c, x, 6, 6, 8, k); px(c, x + 1, 5, 4, 1, '#ffffff'); px(c, x + 1, 8, 2, 4, 'rgba(255,255,255,0.4)'); px(c, x - 1 + (i % 2) * 2, 26, 7, 8, '#ffffff'); px(c, x + (i % 2) * 2, 28, 5, 2, k); });
    // meja periksa (rendah, supaya telinga kelinci tetap muat)
    px(c, 26, 96, 108, 6, '#7d8a98'); px(c, 26, 96, 108, 1, '#a9b6c4'); px(c, 30, 94, 100, 3, '#ffffff');
    px(c, 36, 102, 4, 8, '#7d8a98'); px(c, 120, 102, 4, 8, '#7d8a98');
    const p = S.pat; if (!p) return;
    const step = S.done ? 9 : S.step, fixed = !!S.cfg.fix || S.done, healed = S.done;
    const jump = healed ? Math.abs(Math.sin(t * 6)) * 6 : S.pulse > 0 && step === 3 ? Math.sin(S.pulse * Math.PI) * 2 : 0;
    big2(() => drawPatient(c, 40, 48, p.kind, { t, mood: fixed ? 'happy' : 'sad', sore: fixed ? null : p.part, band: fixed ? p.part : null, jump: jump / 2, wag: fixed, noShadow: true }));
    // stetoskop di perut saat mendengarkan
    if (step === 1) {
      const bx = 80, by = 82;
      px(c, bx + 3, by - 1, 12, 2, '#5f6c7a'); px(c, bx + 13, by - 40, 2, 40, '#5f6c7a');
      disc(c, bx, by, 5, '#9aa8b8'); disc(c, bx, by, 3, '#d6dee6');
      const n = S.n.listen || 0;
      for (let i = 0; i < n; i++) bdHeart(c, bx + 26 + i * 12, 46 - (S.pulse > 0 && i === n - 1 ? Math.round(S.pulse * 6) : 0), '#e2483d');
    }
    // obat: sendok kecil berwarna merah muda
    if (S.cfg.fix === 'medicine' && step === 3) { px(c, 100, 72, 14, 2, '#c9c6c0'); oval(c, 98, 72, 4, 2, '#f39ac0'); }
    // elus: hati beterbangan
    const pn = S.done ? 3 : S.n.pet || 0;
    for (let i = 0; i < pn; i++) bdHeart(c, 46 + i * 34 + Math.round(Math.sin(t * 3 + i) * 2), 14 + Math.round(Math.sin(t * 2 + i * 2) * 3), '#f39ac0');
    if (S.drop > 0 && step === 2 && S.cfg.fix) bdSparkle(c, t, 80, 60, 24, 18);
  },
  finish(S) {
    EX.vetI = (EX.vetI || 0) + 1; EX.healed = (EX.healed || 0) + 1; exSave();
    return [{ k: 'nothurt' }, { k: 'thanksdoc' }, { k: 'great' }];
  },
  tapDone(S) { S.flash = 0.6; sfx('sparkle'); say([{ k: S.pat.kind }, { k: 'happy' }]); },
  doneOpts: S => [['nextpatient', bdReset]],
};

// ================= 2. PETAK UMPET DI RUMAH =================
// letak tempat sembunyi di kanvas 160×110 dan titik duduk hewan saat ketemu
const HS_SPOT = {
  hsTop: { hit: [4, 36, 32, 44], at: [20, 46] },
  hsUnder: { hit: [40, 58, 44, 32], at: [62, 88] },
  hsIn: { hit: [84, 80, 28, 28], at: [97, 92] },
  hsBehind: { hit: [108, 48, 50, 42], at: [134, 72] },
};
const HS_KEYS = ['hsTop', 'hsUnder', 'hsIn', 'hsBehind'];
BUILD.hide = {
  title: 'hideseek', doneWord: 'comeout',
  steps(S) {
    const kinds = shuffled(PET_KINDS), spots = shuffled(HS_KEYS);
    S.found = []; S.pop = null; S.peek = null; S.miss = 0;
    return kinds.map((kind, i) => ({
      key: 'r' + i, kind, ask: 'whereis', opts: HS_KEYS, answer: spots[i], sfx: 'bounce',
      // ronde 1–2: cari sendiri; ronde 3–4: dengarkan dulu tempatnya
      askList: () => i < 2 ? [{ k: kind }, { k: 'whereis' }, { k: 'findit' }] : [{ k: kind }, { k: spots[i] }, { k: 'findit' }],
      miss(S, k) { S.miss++; S.peek = { spot: k, t: 1 }; sfx('tap'); say([{ k: 'nothere' }].concat(i >= 2 ? [{ k: kind }, { k: spots[i] }] : [])); },
      then(S) { S.pop = { spot: spots[i], kind, t: 1.8 }; S.found.push(kind); S.miss = 0; S.peek = null; },
      sayList: () => [{ k: 'foundyou' }, { k: kind }, { k: spots[i] }],
    }));
  },
  update(dt, S) { if (S.pop) { S.pop.t -= dt; if (S.pop.t <= 0) S.pop = null; } if (S.peek) { S.peek.t -= dt; if (S.peek.t <= 0) S.peek = null; } },
  tapAt(S, x, y) {
    if (S.done) {
      const i = Math.floor((x - 14) / 34);
      if (y > 60 && i >= 0 && i < 4 && S.steps[i]) { sfx('pop'); say([{ k: S.steps[i].kind }]); return true; }
      return false;
    }
    for (const k of HS_KEYS) { const [hx, hy, hw, hh] = HS_SPOT[k].hit; if (x >= hx && x < hx + hw && y >= hy && y < hy + hh) { bdPick(k); return true; } }
    return false;
  },
  draw(c, t, S) {
    const cur = !S.done && S.steps[S.step], hid = cur ? cur.answer : null;
    const peek = k => S.peek && S.peek.spot === k, popAt = k => S.pop && S.pop.spot === k ? S.pop : null;
    const hint = cur && S.miss >= 2, wig = Math.floor(t * 6) % 2;
    // dinding, jendela, lantai
    px(c, 0, 0, 160, 58, '#f6e3c8'); for (let x = 3; x < 160; x += 8) px(c, x, 0, 2, 52, '#efd8b6');
    px(c, 0, 52, 160, 6, '#c08a52'); px(c, 0, 52, 160, 1, '#d9a56a');
    drawPlanks(c, 0, 58, 160, 52, ['#d9a86a', '#d4a263', '#ddb073'], '#bf8f55', 12);
    px(c, 52, 8, 30, 24, PAL.woodD); px(c, 54, 10, 26, 20, G.night ? '#26305e' : '#8fd0f2'); px(c, 66, 10, 2, 20, PAL.woodD); px(c, 54, 19, 26, 2, PAL.woodD);
    px(c, 116, 10, 24, 18, PAL.woodD); px(c, 118, 12, 20, 14, '#fff2c8'); disc(c, 124, 20, 3, '#f4cf3a'); px(c, 128, 16, 8, 8, '#9fd06a');
    oval(c, 84, 100, 40, 8, '#e8735a'); oval(c, 84, 100, 34, 6, '#f4cf3a'); oval(c, 84, 100, 28, 4, '#e8735a');
    // hewan yang sudah ketemu: kepala kecil di pojok kiri atas
    if (!S.done) S.found.forEach((k, i) => { if (S.pop && S.pop.kind === k) return; const keep = PX; PX = 0.5; try { drawPatient(c, (8 + i * 14) * 2, 22 * 2, k, { mood: 'happy', hideBody: true, noShadow: true, t }); } finally { PX = keep; } });
    // --- 上面: lemari, hewan tidur di atas ---
    px(c, 4, 44, 32, 36, PAL.woodD); px(c, 6, 46, 28, 32, PAL.wood);
    for (let i = 0; i < 3; i++) { px(c, 8, 48 + i * 10, 24, 8, '#c08850'); px(c, 8, 48 + i * 10, 24, 1, PAL.woodL); px(c, 18, 51 + i * 10, 4, 2, '#f4cf3a'); }
    px(c, 2, 42, 36, 3, PAL.woodL);
    const pT = popAt('hsTop');
    if (pT) drawPatient(c, 20, 43, pT.kind, { mood: 'happy', t, jump: Math.max(0, Math.sin((1.8 - pT.t) * 8)) * 3, noShadow: true });
    if (hint && hid === 'hsTop') { px(c, 26 + wig, 45, 2, 7, PET_COL[cur.kind].d); px(c, 26 + wig, 51, 2, 2, PET_COL[cur.kind].b); }
    if (peek('hsTop')) drawPeek(c, 20, 34, t);
    // --- 后面: sofa ---
    const pB = popAt('hsBehind');
    if (pB) drawPatient(c, 134, 74 - Math.round(Math.min(1, (1.8 - pB.t) * 4) * 4), pB.kind, { mood: 'happy', t, noShadow: true });
    if (hint && hid === 'hsBehind') { const C = PET_COL[cur.kind]; if (cur.kind === 'rabbit') { oval(c, 130, 50 + wig, 2, 5, C.b); oval(c, 138, 50 + wig, 2, 5, C.b); } else { disc(c, 130, 55 + wig, 3, cur.kind === 'panda' ? '#2a2a2e' : C.d); disc(c, 138, 55 + wig, 3, cur.kind === 'panda' ? '#2a2a2e' : C.d); } }
    px(c, 108, 56, 48, 18, '#4f86e0'); px(c, 108, 56, 48, 2, '#8fb4ee'); px(c, 131, 58, 2, 14, '#3f6fd0');
    px(c, 106, 70, 52, 12, '#3f6fd0'); px(c, 106, 70, 52, 2, '#6f9ae8');
    px(c, 104, 62, 6, 22, '#2f5bab'); px(c, 154, 62, 6, 22, '#2f5bab'); px(c, 104, 62, 6, 2, '#6f9ae8'); px(c, 154, 62, 6, 2, '#6f9ae8');
    px(c, 108, 84, 3, 4, PAL.woodD); px(c, 153, 84, 3, 4, PAL.woodD);
    disc(c, 116, 64, 4, '#f4cf3a'); disc(c, 148, 64, 4, '#e2483d');
    if (peek('hsBehind')) drawPeek(c, 132, 44, t);
    // --- 下面: meja bertaplak ---
    px(c, 40, 62, 44, 4, PAL.woodD); px(c, 40, 62, 44, 1, PAL.woodL);
    px(c, 43, 66, 3, 22, PAL.woodD); px(c, 78, 66, 3, 22, PAL.woodD);
    const pU = popAt('hsUnder'), lift = pU || peek('hsUnder');
    const clothH = lift ? 8 : 22;
    px(c, 38, 64, 48, clothH, '#f4f1ea'); for (let x = 38; x < 86; x += 6) px(c, x, 64, 3, clothH, '#e2483d'); px(c, 38, 64 + clothH - 1, 48, 1, '#d6d0c4');
    // ketemu: hewan keluar dari bawah meja ke permadani
    if (pU) drawPatient(c, 62, 100, pU.kind, { mood: 'happy', t, jump: Math.max(0, Math.sin((1.8 - pU.t) * 8)) * 3 });
    if (hint && hid === 'hsUnder') { const C = PET_COL[cur.kind]; px(c, 84, 82 - wig, 5, 2, C.d); px(c, 88, 80 - wig, 2, 3, C.d); }
    // vas bunga di meja
    px(c, 58, 54, 6, 8, '#4f86e0'); disc(c, 59, 52, 2, '#e2483d'); disc(c, 63, 51, 2, '#f4cf3a');
    // --- 里面: kotak mainan ---
    const pI = popAt('hsIn'), open = pI || peek('hsIn');
    if (pI) drawPatient(c, 97, 98 - Math.round(Math.min(1, (1.8 - pI.t) * 4) * 6), pI.kind, { mood: 'happy', t, noShadow: true, hideBody: true });
    shadow(c, 97, 106, 14);
    px(c, 84, 86, 26, 20, '#e2483d'); px(c, 84, 86, 26, 2, '#ff8a7a'); px(c, 84, 104, 26, 2, '#a8352b');
    drawStar(c, 92, 95, '#f4cf3a'); disc(c, 103, 96, 2, '#4f86e0');
    const hintIn = hint && hid === 'hsIn';
    if (open) { px(c, 82, 74, 4, 13, '#c9473a'); px(c, 82, 74, 4, 1, '#ff8a7a'); }
    else {
      // tutup sedikit terangkat dan telinga mengintip bila sudah 2 kali salah
      if (hintIn) { const C = PET_COL[cur.kind], ek = cur.kind === 'panda' ? '#2a2a2e' : C.d; px(c, 91, 77 - wig, 3, 3, ek); px(c, 100, 77 - wig, 3, 3, ek); }
      px(c, 82, 82 - (hintIn ? 2 : 0), 30, 5, '#c9473a'); px(c, 82, 82 - (hintIn ? 2 : 0), 30, 1, '#ff8a7a');
    }
    if (peek('hsIn')) drawPeek(c, 97, 70, t);
    // --- selesai: semua keluar dan menari ---
    if (S.done) S.steps.forEach((s, i) => drawPatient(c, 30 + i * 34, 108, s.kind, { mood: 'happy', t, wag: true, jump: Math.abs(Math.sin(t * 6 + i)) * 5 }));
  },
  finish(S) { EX.hideWins = (EX.hideWins || 0) + 1; exSave(); return [{ k: 'comeout' }, { k: 'great' }]; },
  doneOpts: S => [['again', bdReset]],
};
// "tidak ada": awan kecil dan tanda tanya
function drawPeek(c, x, y, t) {
  oval(c, x, y, 7, 4, '#ffffff'); oval(c, x - 5, y + 1, 4, 3, '#ffffff'); oval(c, x + 5, y + 1, 4, 3, '#ffffff');
  px(c, x - 1, y - 3, 3, 1, '#5f6c7a'); px(c, x + 1, y - 2, 1, 2, '#5f6c7a'); px(c, x, y, 1, 1, '#5f6c7a'); px(c, x, y + 2, 1, 1, '#5f6c7a');
}

// ================= 3. WAKTU TIDUR =================
const GN_THINGS = ['moon', 'star', 'dog', 'bear'];
// Russel digambar 3× di jendela ini; koordinat dalam piksel kanvas 160×110
const big3 = (x, y, fn) => { PX = 3; try { fn(x / 3, y / 3); } finally { PX = 1; } };
BUILD.bedtime = {
  title: 'bedtime', doneWord: 'goodnight',
  steps: [
    { key: 'bath', ask: 'takebath', taps: 4, icon: 'takebath', sfx: 'bubbles', say: 'clean' },
    { key: 'towel', ask: 'drytowel', opts: ['towel'], sfx: 'whoosh' },
    { key: 'teeth', ask: 'brush', taps: 3, icon: 'brush', sfx: 'bubbles', say: 'clean' },
    { key: 'pj', ask: 'pajamas', colors: true },
    { key: 'story', ask: 'readstory', opts: ['book'], sfx: 'chime', then: S => bdAct('story', 3) },
    { key: 'lights', ask: 'lightsoff', opts: ['lamp'], sfx: 'tap' },
    { key: 'gn', ask: 'saygoodnight', taps: 4, icon: 'goodnight', sfx: 'chime', tapSay: (S, i) => [{ k: GN_THINGS[i - 1] }, { k: 'goodnight' }] },
  ],
  draw(c, t, S) {
    const step = S.done ? 9 : S.step, L = LOOKS.me;
    if (step <= 1) {
      // kamar mandi: ubin biru, bak mandi penuh busa
      px(c, 0, 0, 160, 76, '#d6ecf6'); for (let y = 0; y < 76; y += 10) for (let x = (y / 10) % 2 * 5; x < 160; x += 10) px(c, x, y, 9, 9, '#e4f3fa');
      px(c, 0, 76, 160, 34, '#bcd2de'); for (let x = 0; x < 160; x += 12) px(c, x, 76, 1, 34, '#a9bfcc');
      px(c, 120, 10, 2, 40, '#a9a6a0'); disc(c, 121, 10, 3, '#c9c6c0');
      const n = step === 1 ? 4 : S.n.bath || 0;
      // kepala Russel di bak
      big3(80, 26, (x, y) => drawHead(c, x, y, L, 'down', { mood: 'happy' }));
      for (let i = 0; i < n * 3; i++) { const bx = 48 + ((i * 23) % 64), by = 52 - ((i * 7) % 12) - (i % 3) * 3; disc(c, bx, by, 4 + (i % 3), '#ffffff'); disc(c, bx - 1, by - 1, 1, '#dff3ff'); }
      if (S.pulse > 0) for (let i = 0; i < 4; i++) disc(c, 60 + i * 12, 30 - Math.round((1 - S.pulse) * 20) - i * 3, 2, 'rgba(255,255,255,0.85)');
      px(c, 30, 56, 100, 26, '#ffffff'); px(c, 30, 56, 100, 3, '#eef6fa'); px(c, 30, 80, 100, 2, '#cfdde6'); px(c, 34, 82, 6, 6, '#c9c6c0'); px(c, 120, 82, 6, 6, '#c9c6c0');
      // bebek karet
      const dy = Math.round(Math.sin(t * 3));
      disc(c, 116, 50 + dy, 5, '#f4cf3a'); disc(c, 121, 45 + dy, 3, '#f4cf3a'); px(c, 124, 45 + dy, 3, 2, '#f08a32'); px(c, 121, 44 + dy, 1, 1, '#2a1d18');
      if (S.cfg.towel || step === 1) { px(c, 132, 30, 22, 34, '#f39ac0'); px(c, 132, 30, 22, 2, '#fcd0e2'); for (let y = 36; y < 64; y += 8) px(c, 132, y, 22, 1, '#cc6a95'); px(c, 130, 28, 26, 3, '#a9a6a0'); }
      return;
    }
    if (step === 2) {
      // wastafel & cermin: sikat gigi
      px(c, 0, 0, 160, 76, '#d6ecf6'); for (let y = 0; y < 76; y += 10) for (let x = (y / 10) % 2 * 5; x < 160; x += 10) px(c, x, y, 9, 9, '#e4f3fa');
      px(c, 0, 76, 160, 34, '#bcd2de');
      px(c, 52, 6, 56, 34, '#a9a6a0'); px(c, 54, 8, 52, 30, '#cfe8f5'); for (let k = 0; k < 10; k++) px(c, 60 + k, 24 - k, 2, 1, '#ffffff');
      // rak kecil: gelas & pasta gigi
      px(c, 118, 44, 30, 3, '#fbf8f0'); px(c, 122, 34, 8, 10, '#8fd0f2'); px(c, 124, 28, 1, 7, '#e2483d'); px(c, 127, 29, 1, 6, '#4f86e0');
      px(c, 134, 39, 10, 5, '#ffffff'); px(c, 134, 39, 3, 5, '#e2483d');
      big3(80, 108, (x, y) => drawPerson(c, x, y, { look: 'me', dir: 'down', act: 'brush', actT: t, outfit: { shirt: [0, '#ffffff', '#e0e6ea'] }, noShadow: true }));
      const n = S.n.teeth || 0;
      for (let i = 0; i < n; i++) drawStar(c, 104 + i * 10, 62 - (i % 2) * 6, '#fff2a8');
      for (let i = 0; i < n * 2; i++) disc(c, 86 + ((i * 13) % 18), 82 - ((i * 5) % 12), 2, 'rgba(255,255,255,0.9)');
      return;
    }
    // kamar tidur
    const dark = step >= 6;
    px(c, 0, 0, 160, 64, '#c9d8f0'); for (let x = 4; x < 160; x += 10) px(c, x, 0, 2, 60, '#bccbe6');
    px(c, 0, 60, 160, 50, '#c99a63'); for (let x = 0; x < 160; x += 14) px(c, x, 60, 1, 50, '#b0844f');
    // jendela dengan bulan & bintang
    px(c, 12, 8, 34, 28, PAL.woodD); px(c, 14, 10, 30, 24, '#26305e'); px(c, 28, 10, 2, 24, PAL.woodD);
    const gn = S.done ? 4 : step === 6 ? S.n.gn || 0 : 0;
    disc(c, 22, 18, gn >= 1 ? 5 : 4, '#fff2c0'); disc(c, 24, 17, 3, '#26305e');
    for (let i = 0; i < 4; i++) drawStar(c, 34 + (i % 2) * 6, 14 + i * 5, gn >= 2 && (Math.floor(t * 3 + i) % 3) ? '#fff2a8' : '#8890b8');
    // tempat tidur
    px(c, 52, 46, 8, 34, PAL.woodD); px(c, 52, 46, 8, 2, PAL.woodL);
    px(c, 58, 62, 92, 20, '#fbf8f0'); px(c, 58, 80, 92, 4, PAL.woodD); px(c, 60, 84, 4, 8, PAL.woodD); px(c, 144, 84, 4, 8, PAL.woodD);
    px(c, 60, 56, 26, 10, '#ffffff'); px(c, 60, 65, 26, 1, '#e3ddd0');
    const pj = bdTone(S.cfg.pj) || ['#9fb8e8', '#6f8fd0', '#cfdcf6'];
    if (step === 3) {
      // berdiri di samping tempat tidur, memilih piyama
      big3(104, 108, (x, y) => drawPerson(c, x, y, { look: 'me', dir: 'down', outfit: { shirt: [0, S.cfg.pj ? pj[0] : '#ffffff', S.cfg.pj ? pj[1] : '#e0e6ea'], pants: S.cfg.pj ? pj[0] : '#ffffff' }, noShadow: true }));
      if (S.cfg.pj) for (let i = 0; i < 3; i++) drawStar(c, 100 + i * 6, 88 - i * 6, '#fff2a8');
    } else {
      // berbaring dengan selimut berwarna piyama
      big2(() => drawHead(c, 36, 25, L, 'down', { mood: S.done ? 'sleepy' : 'happy' }));
      px(c, 62, 66, 88, 16, pj[0]); px(c, 62, 66, 88, 3, pj[2]); for (let x = 70; x < 150; x += 12) drawStar(c, x, 74 + (x % 24 ? 0 : 3), pj[2]);
    }
    // meja kecil & lampu
    px(c, 132, 40, 22, 4, PAL.woodD); px(c, 134, 44, 18, 16, PAL.wood); px(c, 140, 30, 2, 10, '#7d8a98');
    px(c, 134, 22, 14, 8, step >= 6 ? '#c9b48a' : '#fff2a8');
    if (step < 6) { c.fillStyle = 'rgba(255,242,168,0.25)'; c.beginPath(); c.arc(141 * PX, 30 * PX, 20 * PX, 0, Math.PI * 2); c.fill(); }
    // buku cerita
    if (step === 4 || (step === 5 && S.act === 'story')) {
      const flip = S.act === 'story' ? Math.floor(S.actT * 3) % 2 : 0;
      px(c, 92, 46, 30, 18, '#ffffff'); px(c, 106, 46, 2, 18, '#cfc9bc'); px(c, 92, 46, 30, 1, '#e2483d');
      for (let i = 0; i < 4; i++) px(c, 95 + (flip ? 14 : 0), 50 + i * 3, 9, 1, '#bdb7aa');
      drawStar(c, 114 - (flip ? 14 : 0), 54, '#f4cf3a');
    }
    // boneka beruang & anjing di lantai
    const bx = 18, by = 98;
    disc(c, bx, by - 6, 6, '#c08a52'); disc(c, bx, by - 15, 5, '#c08a52'); disc(c, bx - 4, by - 19, 2, '#c08a52'); disc(c, bx + 4, by - 19, 2, '#c08a52'); px(c, bx - 2, by - 16, 1, 1, '#2a1d18'); px(c, bx + 2, by - 16, 1, 1, '#2a1d18');
    drawDog(c, 40, 100, 1, 0, 'sit', t);
    if (gn >= 3 || S.done) drawZ(c, 46, 76, '#c9cff0');
    // gelap setelah lampu dimatikan
    if (dark) { c.fillStyle = 'rgba(16,22,58,0.5)'; c.fillRect(0, 0, 160 * PX, 110 * PX); disc(c, 22, 18, gn >= 1 ? 5 : 4, '#fff2c0'); disc(c, 24, 17, 3, '#26305e'); if (gn >= 2) for (let i = 0; i < 4; i++) drawStar(c, 34 + (i % 2) * 6, 14 + i * 5, (Math.floor(t * 3 + i) % 3) ? '#fff2a8' : '#c9cff0'); }
    if (gn >= 4) { bdHeart(c, 18, 74, '#f39ac0'); }
    if (S.done) for (let i = 0; i < 3; i++) { const zz = (t * 0.6 + i / 3) % 1; drawZ(c, 76 + Math.round(zz * 14), 50 - Math.round(zz * 24), '#c9cff0'); }
  },
  finish(S) { EX.bedtimes = (EX.bedtimes || 0) + 1; exSave(); return [{ k: 'sleep' }]; },
  tapDone(S) { say([{ k: 'goodnight' }]); },
  doneOpts: S => [['sleep', () => { closePanel(); if (window.homeSleep) homeSleep(); }]],
};

// ================= GAMBAR STIKER =================
Object.assign(ST_ART, {
  vet: (c, x, y) => { px(c, x - 16, y - 22, 32, 22, '#ffffff'); px(c, x - 18, y - 26, 36, 5, '#3fae7a'); px(c, x - 3, y - 18, 6, 14, '#3fae7a'); px(c, x - 7, y - 14, 14, 6, '#3fae7a'); px(c, x + 8, y - 12, 6, 12, '#bfe3f2'); },
  vetdoc: (c, x, y) => drawPerson(c, x, y, { look: 'vetdoc', dir: 'down' }),
  beadoctor: (c, x, y) => { drawPatient(c, x, y, 'dog', { mood: 'happy', band: 'head', noShadow: true }); },
  whathurt: (c, x, y) => drawPatient(c, x, y, 'cat', { mood: 'sad', sore: 'foot', noShadow: true }),
  earshurt: (c, x, y) => drawPatient(c, x, y, 'rabbit', { mood: 'sad', sore: 'ears', noShadow: true }),
  foothurt: (c, x, y) => drawPatient(c, x, y, 'dog', { mood: 'sad', sore: 'foot', noShadow: true }),
  tummyhurt: (c, x, y) => drawPatient(c, x, y, 'panda', { mood: 'sad', sore: 'tummy', noShadow: true }),
  headhurt: (c, x, y) => drawPatient(c, x, y, 'cat', { mood: 'sad', sore: 'head', noShadow: true }),
  stethoscope: (c, x, y) => { px(c, x - 8, y - 30, 2, 16, '#5f6c7a'); px(c, x + 6, y - 30, 2, 16, '#5f6c7a'); px(c, x - 6, y - 16, 12, 2, '#5f6c7a'); px(c, x - 1, y - 16, 2, 8, '#5f6c7a'); disc(c, x, y - 5, 5, '#9aa8b8'); disc(c, x, y - 5, 3, '#d6dee6'); disc(c, x - 7, y - 31, 2, '#2a2a2e'); disc(c, x + 7, y - 31, 2, '#2a2a2e'); },
  listen: (c, x, y) => { ST_ART.stethoscope(c, x - 4, y); bdHeart(c, x + 10, y - 22, '#e2483d'); },
  heartbeat: (c, x, y) => { bdHeart(c, x - 7, y - 14, '#e2483d'); bdHeart(c, x + 7, y - 22, '#f39ac0'); },
  whichfix: (c, x, y) => { drawPlaster(c, x - 8, y - 12); ST_ART.medicine(c, x + 8, y); },
  bandage: (c, x, y) => { const keep = PX; PX = keep * 2.4; try { drawPlaster(c, x / 2.4, (y - 12) / 2.4); } finally { PX = keep; } },
  medicine: (c, x, y) => { px(c, x - 7, y - 24, 14, 24, '#f39ac0'); px(c, x - 7, y - 24, 14, 2, '#fcd0e2'); px(c, x - 5, y - 30, 10, 6, '#ffffff'); px(c, x - 5, y - 16, 10, 8, '#ffffff'); px(c, x - 1, y - 15, 2, 6, '#e2483d'); px(c, x - 3, y - 13, 6, 2, '#e2483d'); },
  pet: (c, x, y) => { px(c, x - 7, y - 14, 14, 10, '#ffd7b5'); for (let i = 0; i < 4; i++) px(c, x - 7 + i * 4, y - 20, 3, 7, '#ffd7b5'); px(c, x + 7, y - 12, 4, 3, '#ffd7b5'); bdHeart(c, x + 8, y - 28, '#f39ac0'); },
  nothurt: (c, x, y) => drawPatient(c, x, y, 'dog', { mood: 'happy', band: 'foot', noShadow: true }),
  thanksdoc: (c, x, y) => { drawPatient(c, x, y, 'cat', { mood: 'happy', noShadow: true }); bdHeart(c, x + 12, y - 30, '#f39ac0'); },
  nextpatient: (c, x, y) => { drawPatient(c, x - 4, y, 'rabbit', { mood: 'sad', noShadow: true }); px(c, x + 10, y - 16, 8, 2, '#3fae7a'); px(c, x + 15, y - 19, 2, 8, '#3fae7a'); },
  whereis: (c, x, y) => { disc(c, x, y - 18, 10, '#ffffff'); px(c, x - 3, y - 24, 6, 2, '#4f86e0'); px(c, x + 2, y - 23, 2, 5, '#4f86e0'); px(c, x - 1, y - 18, 2, 3, '#4f86e0'); px(c, x - 1, y - 13, 2, 2, '#4f86e0'); },
  findit: (c, x, y) => { disc(c, x - 3, y - 20, 9, '#5f6c7a'); disc(c, x - 3, y - 20, 7, '#cfe8f5'); px(c, x + 3, y - 13, 4, 4, '#5f6c7a'); px(c, x + 6, y - 10, 6, 6, PAL.woodD); },
  hsTop: (c, x, y) => { drawPatient(c, x, y - 18, 'cat', { mood: 'happy', noShadow: true, hideBody: false }); px(c, x - 14, y - 18, 28, 18, PAL.wood); px(c, x - 15, y - 19, 30, 2, PAL.woodL); px(c, x - 11, y - 14, 22, 5, '#c08850'); px(c, x - 11, y - 7, 22, 5, '#c08850'); },
  hsUnder: (c, x, y) => { px(c, x - 18, y - 30, 36, 4, PAL.woodD); px(c, x - 16, y - 26, 3, 26, PAL.woodD); px(c, x + 13, y - 26, 3, 26, PAL.woodD); drawPatient(c, x, y, 'dog', { mood: 'happy', noShadow: true }); },
  hsIn: (c, x, y) => { drawPatient(c, x, y - 6, 'rabbit', { mood: 'happy', noShadow: true, hideBody: true }); px(c, x - 14, y - 16, 28, 16, '#e2483d'); px(c, x - 14, y - 16, 28, 2, '#ff8a7a'); drawStar(c, x - 6, y - 8, '#f4cf3a'); px(c, x - 16, y - 30, 4, 15, '#c9473a'); },
  hsBehind: (c, x, y) => { drawPatient(c, x, y - 8, 'panda', { mood: 'happy', noShadow: true }); px(c, x - 20, y - 20, 40, 14, '#4f86e0'); px(c, x - 20, y - 20, 40, 2, '#8fb4ee'); px(c, x - 22, y - 10, 44, 10, '#3f6fd0'); px(c, x - 24, y - 16, 5, 16, '#2f5bab'); px(c, x + 19, y - 16, 5, 16, '#2f5bab'); },
  comeout: (c, x, y) => { const keep = PX; PX = keep * 0.7; try { PET_KINDS.forEach((k, i) => drawPatient(c, (x - 18 + i * 12) / 0.7, y / 0.7, k, { mood: 'happy', noShadow: true })); } finally { PX = keep; } },
  toybox: (c, x, y) => { drawPatient(c, x, y - 8, 'cat', { mood: 'happy', noShadow: true, hideBody: true }); px(c, x - 15, y - 18, 30, 18, '#e2483d'); px(c, x - 15, y - 18, 30, 2, '#ff8a7a'); drawStar(c, x - 6, y - 9, '#f4cf3a'); disc(c, x + 7, y - 9, 3, '#4f86e0'); },
  bedtime: (c, x, y) => { moonArc(c, x - 4, y - 18, 13, '#f4cf3a'); drawZ(c, x + 10, y - 26, '#4f86e0'); drawStar(c, x + 12, y - 6, '#f4cf3a'); },
  takebath: (c, x, y) => { px(c, x - 18, y - 14, 36, 12, '#ffffff'); px(c, x - 18, y - 14, 36, 2, '#e4f3fa'); px(c, x - 14, y - 2, 4, 2, '#c9c6c0'); px(c, x + 10, y - 2, 4, 2, '#c9c6c0'); for (let i = 0; i < 7; i++) disc(c, x - 14 + i * 5, y - 16 - (i % 2) * 3, 3 + (i % 2), '#ffffff'); disc(c, x + 10, y - 22, 3, '#f4cf3a'); px(c, x + 13, y - 22, 2, 1, '#f08a32'); },
  towel: (c, x, y) => { px(c, x - 12, y - 30, 24, 30, '#f39ac0'); px(c, x - 12, y - 30, 24, 3, '#fcd0e2'); for (let yy = y - 22; yy < y; yy += 7) px(c, x - 12, yy, 24, 1, '#cc6a95'); px(c, x - 14, y - 32, 28, 3, '#a9a6a0'); },
  drytowel: (c, x, y) => ST_ART.towel(c, x, y),
  pajamas: (c, x, y) => { px(c, x - 12, y - 30, 24, 14, '#9fb8e8'); px(c, x - 16, y - 30, 4, 10, '#9fb8e8'); px(c, x + 12, y - 30, 4, 10, '#9fb8e8'); px(c, x - 10, y - 16, 9, 16, '#9fb8e8'); px(c, x + 1, y - 16, 9, 16, '#9fb8e8'); drawStar(c, x - 4, y - 24, '#fff2a8'); drawStar(c, x + 5, y - 8, '#fff2a8'); px(c, x - 3, y - 30, 6, 2, '#6f8fd0'); },
  readstory: (c, x, y) => { px(c, x - 16, y - 22, 32, 20, '#ffffff'); px(c, x - 1, y - 22, 2, 20, '#cfc9bc'); px(c, x - 16, y - 22, 32, 2, '#e2483d'); for (let i = 0; i < 4; i++) px(c, x - 13, y - 17 + i * 4, 10, 1, '#bdb7aa'); drawStar(c, x + 8, y - 12, '#f4cf3a'); },
  lightsoff: (c, x, y) => { px(c, x - 10, y - 30, 20, 12, '#c9b48a'); px(c, x - 1, y - 18, 2, 14, '#7d8a98'); px(c, x - 8, y - 4, 16, 4, PAL.woodD); moonArc(c, x + 12, y - 30, 6, '#f4cf3a'); },
  saygoodnight: (c, x, y) => { moonArc(c, x - 6, y - 18, 11, '#f4cf3a'); drawStar(c, x + 10, y - 26, '#f4cf3a'); drawStar(c, x + 8, y - 8, '#fff2a8'); },
});
// bulan sabit: lingkaran dikurangi lingkaran yang bergeser ke kanan atas
function moonArc(c, x, y, r, col) {
  const ox = Math.round(r * 0.55), oy = -Math.round(r * 0.25);
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.floor(Math.sqrt(r * r - dy * dy)), e = dy - oy, w2 = Math.abs(e) <= r ? Math.floor(Math.sqrt(r * r - e * e)) : -1;
    const x0 = x - w, x1 = w2 < 0 ? x + w : Math.min(x + w, x + ox - w2 - 1);
    if (x1 >= x0) px(c, x0, y + dy, x1 - x0 + 1, 1, col);
  }
}

// ================= TEMPAT: KLINIK DOKTER HEWAN =================
SCENES.vet = (() => {
  const S = { id: 'vet', place: 'vet', outdoor: false, walk: [8, 92, 312, 174], spawn: [160, 160], blocks: [[14, 118, 64, 12], [244, 98, 60, 10]], objs: [], lights: [[80, 60, 50], [240, 60, 50]] };
  S.bg = c => {
    px(c, 0, 0, W, 84, '#d9f0ea'); for (let x = 0; x < W; x += 16) { px(c, x, 0, 1, 80, '#cbe8e0'); px(c, x + 1, 0, 1, 80, '#e6f6f2'); }
    px(c, 0, 72, W, 12, '#9fd3c4'); px(c, 0, 72, W, 1, '#c4e8de'); px(c, 0, 83, W, 1, '#7fb8a8');
    indoorFloor(c, 84, ['#eef5f3', '#e6efed', '#f3f8f7'], '#d2e0dc', 211);
    doorMat(c);
    bgOutlined(c, cc => {
      // tanda palang hijau besar
      disc(cc, 160, 26, 15, '#ffffff'); px(cc, 156, 14, 8, 24, '#3fae7a'); px(cc, 148, 22, 24, 8, '#3fae7a');
      // jendela
      px(cc, 36, 14, 50, 36, '#ffffff'); px(cc, 38, 16, 46, 32, '#8fd0f2'); px(cc, 60, 16, 2, 32, '#ffffff'); px(cc, 38, 31, 46, 2, '#ffffff');
      oval(cc, 50, 24, 7, 2, '#f4f7fa');
      // poster tapak kaki & tulang
      px(cc, 102, 18, 26, 32, '#fff2c8'); disc(cc, 115, 38, 5, '#c08a52'); [[109, 30], [113, 27], [117, 27], [121, 30]].forEach(([a, b]) => disc(cc, a, b, 2, '#c08a52'));
      px(cc, 196, 22, 28, 6, '#ffffff'); disc(cc, 196, 22, 3, '#ffffff'); disc(cc, 196, 28, 3, '#ffffff'); disc(cc, 224, 22, 3, '#ffffff'); disc(cc, 224, 28, 3, '#ffffff');
      // rak obat
      px(cc, 244, 18, 64, 3, PAL.woodD); px(cc, 244, 44, 64, 3, PAL.woodD);
      ['#e2483d', '#4f86e0', '#f4cf3a', '#58a84a', '#f39ac0', '#4f86e0'].forEach((k, i) => { px(cc, 248 + i * 10, 8, 7, 10, k); px(cc, 249 + i * 10, 7, 5, 1, '#ffffff'); px(cc, 248 + i * 10, 33, 8, 11, '#ffffff'); px(cc, 249 + i * 10, 36, 6, 3, k); });
      // timbangan hewan
      px(cc, 250, 62, 50, 6, '#c9d4e0'); px(cc, 250, 62, 50, 1, '#e8eef2'); px(cc, 268, 54, 14, 8, '#ffffff'); px(cc, 271, 56, 8, 3, '#2a3450'); px(cc, 272, 57, 4, 1, '#7fe08a');
    });
  };
  // meja periksa: pasien berikutnya menunggu di atasnya
  S.objs.push({ x: 160, y: 124, hit: [118, 82, 84, 44], go: [160, 136], skin: 'fn:vetTable',
    draw(c, t) {
      shadow(c, 160, 125, 40);
      px(c, 122, 108, 76, 6, '#7d8a98'); px(c, 122, 108, 76, 1, '#a9b6c4'); px(c, 126, 106, 68, 3, '#ffffff');
      px(c, 128, 114, 4, 10, '#7d8a98'); px(c, 188, 114, 4, 10, '#7d8a98');
      const p = vetPatient();
      drawPatient(c, 160, 106, p.kind, { t, mood: 'sad', sore: p.part, noShadow: true });
      if (Math.floor(t * 2) % 2) drawStar(c, 176, 76, '#ffd84a');
    },
    tap() { const p = vetPatient(); say([{ k: p.kind }, { k: p.part + 'hurt' }]); },
    arrive() { G.boy.dir = 'up'; bdOpen('vet'); } });
  // bangku tunggu: anjing berplester & kucing
  S.objs.push({ x: 46, y: 128, hit: [14, 100, 64, 30], go: [46, 140],
    draw(c, t) {
      shadow(c, 46, 128, 30);
      px(c, 16, 112, 60, 6, '#4f86e0'); px(c, 16, 112, 60, 2, '#8fb4ee'); px(c, 16, 100, 60, 4, '#3f6fd0'); px(c, 18, 118, 3, 9, '#5f6c7a'); px(c, 71, 118, 3, 9, '#5f6c7a');
      drawDog(c, 32, 112, 1, 0, 'sit', t); drawPlaster(c, 31, 104);
      drawCat(c, 58, 112, t);
    },
    tap() { sfx('tap'); say([{ k: 'dog' }, { k: 'cat' }]); } });
  // rak obat (latar) bisa diketuk
  S.objs.push({ flat: true, y: 0, hit: [244, 4, 64, 44], go: [276, 104], draw() {}, tap() { say([{ k: 'medicine' }]); sfx('tap'); } });
  S.objs.push(npc('vetdoc', 230, 132, 'left', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'vetdoc', by: 'np' }, { k: 'beadoctor', by: 'np' }, { k: 'a_yes', by: 'me' }],
      [{ k: 'whathurt', by: 'np' }, { k: 'listen', by: 'np' }],
      [{ k: 'q_howru', by: 'np' }, { k: 'a_howru', by: 'me' }],
    ],
  }));
  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'zoo', at: [296, 126] }];
  return S;
})();
// pintu klinik di ujung kanan Kebun Binatang + papan palang hijau
(() => {
  const Z = SCENES.zoo;
  Z.exits.push({ hit: [294, 108, 26, 32], arrow: [308, 126, 'right'], go: [314, 126], to: 'vet', at: [160, 160] });
  Z.objs.push({ x: 304, y: 112, hit: [292, 88, 26, 26], go: [296, 124],
    draw(c) { shadow(c, 304, 112, 5); px(c, 303, 96, 2, 16, PAL.woodD); px(c, 294, 86, 20, 13, '#ffffff'); px(c, 294, 86, 20, 1, '#e8eef2'); px(c, 302, 88, 4, 9, '#3fae7a'); px(c, 299, 91, 10, 3, '#3fae7a'); },
    tap() { say([{ k: 'vet' }]); } });
})();

// ================= RUMAH: kotak mainan untuk petak umpet =================
(() => {
  const H = SCENES.home;
  H.objs.push({ x: 292, y: 150, hit: [276, 124, 32, 28], go: [292, 160],
    draw(c, t) {
      shadow(c, 292, 150, 15);
      const pk = Math.floor(t * 0.8) % 3 === 0;
      if (pk) { disc(c, 288, 135, 3, '#ee9a4a'); disc(c, 296, 135, 3, '#ee9a4a'); px(c, 287, 134, 2, 2, '#f7b6c8'); px(c, 295, 134, 2, 2, '#f7b6c8'); }
      px(c, 278, 134, 28, 16, '#e2483d'); px(c, 278, 134, 28, 2, '#ff8a7a'); px(c, 278, 148, 28, 2, '#a8352b');
      px(c, 276, 131 - (pk ? 2 : 0), 32, 4, '#c9473a'); px(c, 276, 131 - (pk ? 2 : 0), 32, 1, '#ff8a7a');
      drawStar(c, 286, 142, '#f4cf3a'); disc(c, 298, 142, 2, '#4f86e0');
    },
    tap() { say([{ k: 'toybox' }, { k: 'hideseek' }]); sfx('tap'); },
    arrive() { G.boy.dir = 'right'; bdOpen('hide'); } });
})();

// ================= TEMA DI MENU ORANG TUA =================
THEMES.push(
  { name: 'Klinik dokter hewan', where: 'Jalan terus ke kanan di Kebun Binatang (papan palang hijau). Ketuk meja periksa: hewan yang sakit menunjukkan bagian yang sakit (telinga, kaki, perut, kepala), dengarkan dengan stetoskop, pilih plester atau obat, lalu elus 3 kali. Pasien berganti: anjing, kucing, kelinci, panda.', words: ['vet', 'vetdoc', 'beadoctor', 'whathurt', 'ears', 'foot', 'tummy', 'head', 'earshurt', 'foothurt', 'tummyhurt', 'headhurt', 'listen', 'stethoscope', 'heartbeat', 'whichfix', 'bandage', 'medicine', 'pet', 'nothurt', 'thanksdoc', 'nextpatient'] },
  { name: 'Petak umpet di rumah', where: 'Ketuk kotak mainan merah di pojok kanan bawah Rumah. Empat hewan bergantian bersembunyi: di atas lemari, di bawah meja, di dalam kotak, di belakang sofa. Dua ronde pertama mencari sendiri; dua ronde terakhir Russel mendengar dulu tempatnya lalu mencari. Kalau salah 2 kali, ekor/telinganya mengintip.', words: ['hideseek', 'toybox', 'whereis', 'findit', 'nothere', 'foundyou', 'hsTop', 'hsUnder', 'hsIn', 'hsBehind', 'dog', 'cat', 'rabbit', 'panda', 'comeout'] },
  { name: 'Waktu tidur', where: 'Ketuk tempat tidur di Rumah: mandi (4 kali gosok), handuk, sikat gigi, pilih warna piyama, dengar cerita, matikan lampu, lalu ucapkan selamat malam ke bulan, bintang, anjing, dan beruang. Setelah itu Russel tidur dan bangun pagi.', words: ['bedtime', 'takebath', 'clean', 'towel', 'drytowel', 'brush', 'pajamas', 'readstory', 'book', 'lightsoff', 'lamp', 'saygoodnight', 'moon', 'star', 'bear', 'goodnight', 'sleep'] },
);
