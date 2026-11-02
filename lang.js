// Pilihan bahasa English & Jepang: terjemahan setiap kata, kalimat khusus, angka, dan label tombol.
// Bila LANG = 'zh' (Mandarin) file ini hanya menyediakan data; tampilan tidak diubah.

const WORDS_EN = {
  dog: 'puppy', doudou: 'Doudou', woof: 'woof woof', cat: 'kitty', meow: 'meow',
  school: 'school', teacher: 'teacher', friend: 'friend', meimei: NAMES.meimei, lele: NAMES.lele,
  ball: 'ball', slide: 'slide', swing: 'swing', board: 'blackboard',
  rice: 'rice', noodles: 'noodles', dumpling: 'dumplings', bun: 'steamed bun', egg: 'egg', milk: 'milk', fish: 'fish', water: 'water', yummy: 'yummy!',
  flower: 'flower', petal: 'petal', pistil: 'flower center', leaf: 'leaf', stem: 'stem', root: 'root', butterfly: 'butterfly',
  chicken: 'chicken', cluck: 'cluck cluck', cow: 'cow', moo: 'moo', sheep: 'sheep', baa: 'baa', duck: 'duck', quack: 'quack quack',
  seed: 'seed', watering: 'watering', sprout: 'sprout', carrot: 'carrot', tomato: 'tomato', watermelon: 'watermelon', corn: 'corn', apple: 'apple', appletree: 'apple tree',
  sunny: 'sunny', sun: 'sun', cloudy: 'cloudy', rain: "it's raining", windy: 'windy', snow: "it's snowing",
  morning: 'morning', night: 'night', moon: 'moon', star: 'star', goodmorning: 'good morning', goodevening: 'good evening', goodnight: 'good night',
  red: 'red', yellow: 'yellow', blue: 'blue', green: 'green', pink: 'pink', purple: 'purple', orange: 'orange', white: 'white',
  n1: 'one', n2: 'two', n3: 'three', n4: 'four', n5: 'five', n6: 'six', n7: 'seven', n8: 'eight', n9: 'nine', n10: 'ten',
  count: "let's count", great: 'great job!',
  car: 'car', bus: 'bus', bike: 'bicycle', train: 'train', boat: 'boat', plane: 'airplane',
  dad: 'Daddy', mom: 'Mommy', grandpa: 'Grandpa', grandma: 'Grandma', me: CHILD,
  head: 'head', hair: 'hair', eyes: 'eyes', ears: 'ears', nose: 'nose', mouth: 'mouth', hand: 'hands', tummy: 'tummy', foot: 'feet',
  happy: 'happy', sad: 'sad', angry: 'angry', scared: 'scared', sleepy: 'sleepy',
  hat: 'hat', shirt: 'shirt', pants: 'pants', shoes: 'shoes', scarf: 'scarf', umbrella: 'umbrella',
  wakeup: 'wake up', brush: 'brush your teeth', wash: 'wash your hands', eat: "let's eat", sleep: 'time to sleep',
  hello: 'hello', helloteacher: 'Hello, Ms. ' + NAMES.teacher + '!', thanks: 'thank you', welcome: "you're welcome", bye: 'bye-bye', sorry: "I'm sorry", itsok: "it's okay",
  home: 'home', farm: 'farm', village: 'village', office: 'office', mountain: 'mountain', map: 'map',
  computer: 'computer', phone: 'telephone', hellophone: 'hello?', book: 'book', clock: 'clock', auntie: 'auntie', uncle: 'uncle',
  waterfall: 'waterfall', river: 'river', rock: 'rock', rabbit: 'bunny', squirrel: 'squirrel', bird: 'little bird', mushroom: 'mushroom', tree: 'tree', cloud: 'cloud',
  playtogether: "let's play together", jumprope: 'jump rope', tiantian: NAMES.tiantian, xiaoyu: NAMES.xiaoyu,
  aquarium: 'fish tank', laptop: 'laptop',
  q_son: 'Are you ' + NAMES.dad + "'s son?", a_son: 'Yes! My name is ' + CHILD + '.',
  beach: 'beach', sea: 'sea', wave: 'waves', sand: 'sand', shell: 'seashell', starfish: 'starfish', crab: 'crab', seagull: 'seagull',
  sandcastle: 'sandcastle', palm: 'coconut tree', parasol: 'beach umbrella', q_sea: 'Do you like the sea?',
  bag: 'bag', take: 'take', give: 'give', giveyou: 'This is for you!', throw: 'throw', bagfull: 'The bag is full', towhom: 'Who gets it?',
  cannoteat: "Don't eat that!", wildflower: 'wildflower',
  fun: 'so fun!', gate: 'gate', opengate: 'open the gate', closegate: 'close the gate', dragonboat: 'dragon boat', dragon: 'dragon', back: 'go back',
  classroom: 'classroom', desk: 'desk', chair: 'chair', sitdown: 'sit down', pencil: 'pencil', crayon: 'crayon', piano: 'piano', window: 'window',
  q_study: 'Do you like school?', howmany: 'How many?', classmate: 'classmate',
  playpiano: 'play the piano', follow: 'play after me', sing: "let's sing", listenagain: 'listen again', yourturn: 'your turn',
  barn: 'barn', milkcow: 'milk the cow', shear: 'shear the sheep', wool: 'wool', hay: 'hay', nomilk: 'no more milk',
  drum: 'drum', playdrum: 'play the drum', bigdrum: 'big drum', smalldrum: 'small drum', bell: 'bell', followdrum: 'drum after me',
  hits: 'how many times?', big: 'big', small: 'small',
  jump: 'jump', swim: 'swim', cool: 'nice and cool!',
  sticker: 'sticker', stickerbook: 'sticker book', surprise: 'surprise', todaysurprise: "There's a surprise today!",
  panda: 'panda', rainbow: 'rainbow', balloon: 'balloon', kite: 'kite', hotairballoon: 'hot air balloon', goldfish: 'goldfish',
  shakehand: 'shake hands', rollover: 'roll over', goodboy: 'good boy!', learned: 'Doudou learned it!',
  sunflower: 'sunflower', bud: 'flower bud', growtomorrow: 'It will grow tomorrow', seeyoutomorrow: 'see you tomorrow', bloom: 'it bloomed!',
  costume: 'costume', tigersuit: 'tiger costume', dragonsuit: 'dragon costume', cowboyhat: 'cowboy hat', tiger: 'tiger',
  cny: 'Chinese New Year', happynewyear: 'Happy New Year!', gongxi: 'Good luck and good fortune!', redpacket: 'red envelope', liondance: 'lion dance',
  fireworks: 'fireworks', lantern: 'lantern', midautumn: 'Mid-Autumn Festival', happymidautumn: 'Happy Mid-Autumn Festival!', mooncake: 'mooncake',
  birthday: 'birthday', happybirthday: 'Happy birthday!', cake: 'cake', blowcandles: 'blow out the candles',
  gege: 'big brother', didi: 'little brother', picnic: 'picnic',
  q_climb: "Let's climb the mountain!", q_swim: "Let's go swimming!", q_water: 'Do you want some water?', q_gege: "Little brother, let's play!",
  robot: 'robot', coffee: 'coffee', coffeemachine: 'coffee machine', makecoffee: "I'll make coffee!", pleasedrink: 'Here is your coffee!',
  coffeeadult: 'Coffee is for grown-ups', givedad: 'Give it to Daddy', dance: 'dance', followme: 'follow me',
  photosynthesis: 'photosynthesis', pollination: 'pollination', fromflowertoseed: 'from flower to seed',
  p_sun: 'The sun shines on the leaf', p_water: 'The roots send water up', p_air: 'The leaf breathes in air', p_food: 'The leaf makes food', p_oxygen: 'The leaf gives out oxygen',
  bee: 'bee', nectar: 'nectar', pollen: 'pollen', b_come: 'Here comes a bee', b_nectar: 'The bee drinks nectar', b_pollen: 'Pollen sticks to the bee',
  b_fly: 'The bee flies to another flower', b_done: 'Pollen lands on the flower center',
  s_petals: 'The petals fall off', s_fruit: 'The flower center grows bigger', s_seeds: 'There are seeds inside', s_fall: 'The seeds fall to the ground', s_sprout: 'The seed sprouts', s_new: 'A new flower grows',
  hideseek: 'hide and seek', wheredoudou: 'Where is Doudou?', nothere: 'Not here', foundyou: 'I found you!', behindtree: 'Doudou is behind the tree',
  undertable: 'Doudou is under the table', inbox: 'Doudou is in the box', box: 'box', bathdog: 'bath time', brushdog: 'brush the fur', feeddog: 'feed the puppy', clean: 'so clean!', full: "I'm full!",
  parrot: 'parrot', saytome: 'You say it, I copy!', resttime: 'Time to rest',
  cook: "let's cook", washveg: 'wash it', cut: 'cut', stir: 'stir', boil: 'cook it', serve: 'time to eat', tomatoegg: 'tomato and egg', carrotsoup: 'carrot soup', applejuice: 'apple juice',
  market: 'market', buy: 'buy', sell: 'sell', coin: 'coin', howmuch: 'How much?', nocoins: 'Not enough coins',
  room: 'my room', bear: 'teddy bear', toytrain: 'toy train', toyrobot: 'toy robot', lamp: 'lamp', rug: 'rug', painting: 'painting', potplant: 'potted plant',
  rhythm: 'rhythm', followrhythm: 'follow the beat', perfect: 'perfect!', good: 'good', again: 'try again', start: 'start',
  photo: 'photo', camera: 'camera', cheese: 'say cheese!', story: 'story',
  steamtrain: 'steam train', bullettrain: 'bullet train', freighttrain: 'freight train', countagain: 'count again',
  right: "that's right!", tryagain: 'look again', pretty: 'so pretty!',
  q_eat: 'What do you want to eat?', a_eat: 'I want dumplings!', q_hungry: 'Are you hungry?', a_hungry: "I'm hungry!",
  q_name: "What's your name?", a_name: 'My name is ' + CHILD + '!', q_happy: 'Are you happy today?', a_happy: 'Very happy!',
  q_howru: 'How are you?', a_howru: "I'm fine!", q_color: 'What color do you like?', q_play: "Let's play together, okay?", a_ok: 'Okay!',
  q_ball: 'Do you want to play ball?', a_yes: 'Yes!', q_where: 'Where are you going?', a_where: "I'm going to play!",
  q_visit: 'Did you come to see Daddy?', a_visit: 'Yes!', q_bunny: 'Did you see the little bunny?', a_bunny: 'Yes, I saw it!',
  q_tired: 'Are you tired?', a_tired: 'Not tired!', q_dog: 'Is this your puppy?', a_dog: 'Yes! Its name is Doudou.',
  q_slide: 'Do you want to go down the slide?', q_rope: 'Can you jump rope?', a_try: "I'll try!",
  q_apple: 'Do you like apples?', a_like: 'Yes, I like it!', q_count: 'How many are here?',
};
const NUM_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const PLURAL_EN = { tomato: 'tomatoes', fish: 'fish', sheep: 'sheep' };

// ---------- Jepang: [hiragana/katakana (berspasi seperti buku anak), romaji] ----------
const NAMES_JA = { meimei: 'エヴリン', xiaoyu: 'ベバリー', lele: 'チュアン', tiantian: 'アーサー', teacher: 'サリ', dad: 'ヘンリー', mom: 'アンナ', me: 'ラッセル' };
const WORDS_JA = {
  dog: ['こいぬ', 'koinu'], doudou: ['ドウドウ', 'Dōdō'], woof: ['ワンワン', 'wan wan'], cat: ['こねこ', 'koneko'], meow: ['ニャーニャー', 'nyā nyā'],
  school: ['がっこう', 'gakkō'], teacher: ['せんせい', 'sensei'], friend: ['ともだち', 'tomodachi'],
  meimei: [NAMES_JA.meimei, NAMES.meimei], lele: [NAMES_JA.lele, NAMES.lele],
  ball: ['ボール', 'bōru'], slide: ['すべりだい', 'suberidai'], swing: ['ブランコ', 'buranko'], board: ['こくばん', 'kokuban'],
  rice: ['ごはん', 'gohan'], noodles: ['ラーメン', 'rāmen'], dumpling: ['ぎょうざ', 'gyōza'], bun: ['にくまん', 'nikuman'], egg: ['たまご', 'tamago'],
  milk: ['ぎゅうにゅう', 'gyūnyū'], fish: ['さかな', 'sakana'], water: ['みず', 'mizu'], yummy: ['おいしい！', 'oishii!'],
  flower: ['はな', 'hana'], petal: ['はなびら', 'hanabira'], pistil: ['はなの まんなか', 'hana no mannaka'], leaf: ['はっぱ', 'happa'],
  stem: ['くき', 'kuki'], root: ['ね', 'ne'], butterfly: ['ちょうちょ', 'chōcho'],
  chicken: ['にわとり', 'niwatori'], cluck: ['コッコッコ', 'kokkokko'], cow: ['うし', 'ushi'], moo: ['モーモー', 'mō mō'], sheep: ['ひつじ', 'hitsuji'],
  baa: ['メーメー', 'mē mē'], duck: ['アヒル', 'ahiru'], quack: ['ガーガー', 'gā gā'],
  seed: ['たね', 'tane'], watering: ['みずやり', 'mizuyari'], sprout: ['めが でた', 'me ga deta'], carrot: ['にんじん', 'ninjin'], tomato: ['トマト', 'tomato'],
  watermelon: ['すいか', 'suika'], corn: ['とうもろこし', 'tōmorokoshi'], apple: ['りんご', 'ringo'], appletree: ['りんごの き', 'ringo no ki'],
  sunny: ['はれ', 'hare'], sun: ['おひさま', 'ohisama'], cloudy: ['くもり', 'kumori'], rain: ['あめ', 'ame'], windy: ['かぜ', 'kaze'], snow: ['ゆき', 'yuki'],
  morning: ['あさ', 'asa'], night: ['よる', 'yoru'], moon: ['おつきさま', 'otsukisama'], star: ['ほし', 'hoshi'],
  goodmorning: ['おはよう', 'ohayō'], goodevening: ['こんばんは', 'konbanwa'], goodnight: ['おやすみ', 'oyasumi'],
  red: ['あか', 'aka'], yellow: ['きいろ', 'kiiro'], blue: ['あお', 'ao'], green: ['みどり', 'midori'], pink: ['ピンク', 'pinku'],
  purple: ['むらさき', 'murasaki'], orange: ['オレンジ', 'orenji'], white: ['しろ', 'shiro'],
  n1: ['いち', 'ichi'], n2: ['に', 'ni'], n3: ['さん', 'san'], n4: ['よん', 'yon'], n5: ['ご', 'go'], n6: ['ろく', 'roku'], n7: ['なな', 'nana'],
  n8: ['はち', 'hachi'], n9: ['きゅう', 'kyū'], n10: ['じゅう', 'jū'],
  count: ['かぞえよう', 'kazoeyō'], great: ['すごいね！', 'sugoi ne!'],
  car: ['くるま', 'kuruma'], bus: ['バス', 'basu'], bike: ['じてんしゃ', 'jitensha'], train: ['でんしゃ', 'densha'], boat: ['ふね', 'fune'], plane: ['ひこうき', 'hikōki'],
  dad: ['パパ', 'papa'], mom: ['ママ', 'mama'], grandpa: ['おじいちゃん', 'ojīchan'], grandma: ['おばあちゃん', 'obāchan'], me: [NAMES_JA.me, CHILD],
  head: ['あたま', 'atama'], hair: ['かみのけ', 'kaminoke'], eyes: ['め', 'me'], ears: ['みみ', 'mimi'], nose: ['はな', 'hana'], mouth: ['くち', 'kuchi'],
  hand: ['て', 'te'], tummy: ['おなか', 'onaka'], foot: ['あし', 'ashi'],
  happy: ['うれしい', 'ureshii'], sad: ['かなしい', 'kanashii'], angry: ['おこってる', 'okotteru'], scared: ['こわい', 'kowai'], sleepy: ['ねむい', 'nemui'],
  hat: ['ぼうし', 'bōshi'], shirt: ['ふく', 'fuku'], pants: ['ズボン', 'zubon'], shoes: ['くつ', 'kutsu'], scarf: ['マフラー', 'mafurā'], umbrella: ['かさ', 'kasa'],
  wakeup: ['おきる', 'okiru'], brush: ['はみがき', 'hamigaki'], wash: ['てを あらう', 'te o arau'], eat: ['いただきます', 'itadakimasu'], sleep: ['ねる じかん', 'neru jikan'],
  hello: ['こんにちは', 'konnichiwa'], helloteacher: [NAMES_JA.teacher + 'せんせい、こんにちは！', NAMES.teacher + '-sensei, konnichiwa!'],
  thanks: ['ありがとう', 'arigatō'], welcome: ['どういたしまして', 'dō itashimashite'], bye: ['バイバイ', 'bai bai'], sorry: ['ごめんね', 'gomen ne'], itsok: ['だいじょうぶ', 'daijōbu'],
  home: ['おうち', 'ouchi'], farm: ['のうじょう', 'nōjō'], village: ['むら', 'mura'], office: ['かいしゃ', 'kaisha'], mountain: ['やま', 'yama'], map: ['ちず', 'chizu'],
  computer: ['パソコン', 'pasokon'], phone: ['でんわ', 'denwa'], hellophone: ['もしもし', 'moshi moshi'], book: ['ほん', 'hon'], clock: ['とけい', 'tokei'],
  auntie: ['おばさん', 'obasan'], uncle: ['おじさん', 'ojisan'],
  waterfall: ['たき', 'taki'], river: ['かわ', 'kawa'], rock: ['いし', 'ishi'], rabbit: ['うさぎ', 'usagi'], squirrel: ['りす', 'risu'],
  bird: ['ことり', 'kotori'], mushroom: ['きのこ', 'kinoko'], tree: ['き', 'ki'], cloud: ['くも', 'kumo'],
  playtogether: ['いっしょに あそぼう', 'issho ni asobō'], jumprope: ['なわとび', 'nawatobi'],
  tiantian: [NAMES_JA.tiantian, NAMES.tiantian], xiaoyu: [NAMES_JA.xiaoyu, NAMES.xiaoyu],
  aquarium: ['すいそう', 'suisō'], laptop: ['ノートパソコン', 'nōto pasokon'],
  q_son: [NAMES_JA.dad + 'さんの むすこさん？', NAMES.dad + '-san no musuko-san?'], a_son: ['うん！ ぼくは ' + NAMES_JA.me + '。', 'un! boku wa ' + CHILD + '.'],
  beach: ['うみべ', 'umibe'], sea: ['うみ', 'umi'], wave: ['なみ', 'nami'], sand: ['すな', 'suna'], shell: ['かいがら', 'kaigara'], starfish: ['ひとで', 'hitode'],
  crab: ['かに', 'kani'], seagull: ['カモメ', 'kamome'], sandcastle: ['すなの おしろ', 'suna no oshiro'], palm: ['ヤシの き', 'yashi no ki'],
  parasol: ['パラソル', 'parasoru'], q_sea: ['うみは すき？', 'umi wa suki?'],
  bag: ['かばん', 'kaban'], take: ['とる', 'toru'], give: ['あげる', 'ageru'], giveyou: ['はい、どうぞ！', 'hai, dōzo!'], throw: ['なげる', 'nageru'],
  bagfull: ['かばんが いっぱい', 'kaban ga ippai'], towhom: ['だれに あげる？', 'dare ni ageru?'], cannoteat: ['たべちゃ だめ！', 'tabecha dame!'],
  wildflower: ['のの はな', 'no no hana'],
  fun: ['たのしい！', 'tanoshii!'], gate: ['もん', 'mon'], opengate: ['もんを あける', 'mon o akeru'], closegate: ['もんを しめる', 'mon o shimeru'],
  dragonboat: ['りゅうの ふね', 'ryū no fune'], dragon: ['りゅう', 'ryū'], back: ['もどる', 'modoru'],
  classroom: ['きょうしつ', 'kyōshitsu'], desk: ['つくえ', 'tsukue'], chair: ['いす', 'isu'], sitdown: ['すわって', 'suwatte'], pencil: ['えんぴつ', 'enpitsu'],
  crayon: ['クレヨン', 'kureyon'], piano: ['ピアノ', 'piano'], window: ['まど', 'mado'], q_study: ['がっこうは すき？', 'gakkō wa suki?'],
  howmany: ['いくつ？', 'ikutsu?'], classmate: ['クラスの ともだち', 'kurasu no tomodachi'],
  playpiano: ['ピアノを ひく', 'piano o hiku'], follow: ['まねして ひいてね', 'mane shite hiite ne'], sing: ['うたおう', 'utaō'],
  listenagain: ['もう いちど きいて', 'mō ichido kiite'], yourturn: ['つぎは きみの ばん', 'tsugi wa kimi no ban'],
  barn: ['どうぶつの おうち', 'dōbutsu no ouchi'], milkcow: ['うしの おちちを しぼる', 'ushi no ochichi o shiboru'], shear: ['ひつじの けを かる', 'hitsuji no ke o karu'],
  wool: ['ひつじの け', 'hitsuji no ke'], hay: ['ほしくさ', 'hoshikusa'], nomilk: ['もう ないよ', 'mō nai yo'],
  drum: ['たいこ', 'taiko'], playdrum: ['たいこを たたく', 'taiko o tataku'], bigdrum: ['おおきい たいこ', 'ōkii taiko'], smalldrum: ['ちいさい たいこ', 'chiisai taiko'],
  bell: ['すず', 'suzu'], followdrum: ['まねして たたいてね', 'mane shite tataite ne'], hits: ['なんかい たたく？', 'nankai tataku?'],
  big: ['おおきい', 'ōkii'], small: ['ちいさい', 'chiisai'],
  jump: ['ジャンプ', 'janpu'], swim: ['およぐ', 'oyogu'], cool: ['つめたくて きもちいい！', 'tsumetakute kimochi ii!'],
  sticker: ['シール', 'shīru'], stickerbook: ['シールちょう', 'shīru-chō'], surprise: ['びっくり', 'bikkuri'], todaysurprise: ['きょうは びっくりが あるよ！', 'kyō wa bikkuri ga aru yo!'],
  panda: ['パンダ', 'panda'], rainbow: ['にじ', 'niji'], balloon: ['ふうせん', 'fūsen'], kite: ['たこ', 'tako'], hotairballoon: ['ききゅう', 'kikyū'], goldfish: ['きんぎょ', 'kingyo'],
  shakehand: ['おて', 'ote'], rollover: ['ごろん', 'goron'], goodboy: ['いいこだね', 'ii ko da ne'], learned: ['ドウドウ、できたね！', 'Dōdō, dekita ne!'],
  sunflower: ['ひまわり', 'himawari'], bud: ['つぼみ', 'tsubomi'], growtomorrow: ['あした おおきく なるよ', 'ashita ōkiku naru yo'],
  seeyoutomorrow: ['また あした', 'mata ashita'], bloom: ['さいたよ！', 'saita yo!'],
  costume: ['いしょう', 'ishō'], tigersuit: ['トラの いしょう', 'tora no ishō'], dragonsuit: ['りゅうの いしょう', 'ryū no ishō'], cowboyhat: ['カウボーイの ぼうし', 'kaubōi no bōshi'],
  tiger: ['トラ', 'tora'],
  cny: ['しゅんせつ', 'shunsetsu'], happynewyear: ['あけまして おめでとう！', 'akemashite omedetō!'], gongxi: ['しあわせが きますように！', 'shiawase ga kimasu yō ni!'],
  redpacket: ['おとしだま', 'otoshidama'], liondance: ['ししまい', 'shishimai'], fireworks: ['はなび', 'hanabi'], lantern: ['ちょうちん', 'chōchin'],
  midautumn: ['おつきみ', 'otsukimi'], happymidautumn: ['たのしい おつきみ！', 'tanoshii otsukimi!'], mooncake: ['げっぺい', 'geppei'],
  birthday: ['たんじょうび', 'tanjōbi'], happybirthday: ['おたんじょうび おめでとう！', 'otanjōbi omedetō!'], cake: ['ケーキ', 'kēki'], blowcandles: ['ろうそくを ふこう', 'rōsoku o fukō'],
  gege: ['おにいちゃん', 'onīchan'], didi: ['おとうと', 'otōto'], picnic: ['ピクニック', 'pikunikku'],
  q_climb: ['やまに のぼろう！', 'yama ni noborō!'], q_swim: ['およごう！', 'oyogō!'], q_water: ['おみず のむ？', 'omizu nomu?'], q_gege: ['いっしょに あそぼう！', 'issho ni asobō!'],
  robot: ['ロボット', 'robotto'], coffee: ['コーヒー', 'kōhī'], coffeemachine: ['コーヒーマシン', 'kōhī mashin'], makecoffee: ['コーヒーを いれるね！', 'kōhī o ireru ne!'],
  pleasedrink: ['コーヒーを どうぞ！', 'kōhī o dōzo!'], coffeeadult: ['コーヒーは おとなの のみもの', 'kōhī wa otona no nomimono'], givedad: ['パパに あげよう', 'papa ni ageyō'],
  dance: ['ダンス', 'dansu'], followme: ['ついてきて', 'tsuite kite'],
  photosynthesis: ['こうごうせい', 'kōgōsei'], pollination: ['じゅふん', 'jufun'], fromflowertoseed: ['はなから たねへ', 'hana kara tane e'],
  p_sun: ['おひさまが はっぱを てらす', 'ohisama ga happa o terasu'], p_water: ['ねが みずを はこぶ', 'ne ga mizu o hakobu'], p_air: ['はっぱが くうきを すう', 'happa ga kūki o sū'],
  p_food: ['はっぱが えいようを つくる', 'happa ga eiyō o tsukuru'], p_oxygen: ['はっぱが さんそを だす', 'happa ga sanso o dasu'],
  bee: ['ミツバチ', 'mitsubachi'], nectar: ['みつ', 'mitsu'], pollen: ['かふん', 'kafun'], b_come: ['ミツバチが きたよ', 'mitsubachi ga kita yo'], b_nectar: ['ミツバチが みつを のむ', 'mitsubachi ga mitsu o nomu'],
  b_pollen: ['かふんが からだに つく', 'kafun ga karada ni tsuku'], b_fly: ['ほかの はなへ とんでいく', 'hoka no hana e tonde iku'], b_done: ['かふんが めしべに つく', 'kafun ga meshibe ni tsuku'],
  s_petals: ['はなびらが おちた', 'hanabira ga ochita'], s_fruit: ['はなの まんなかが おおきく なる', 'hana no mannaka ga ōkiku naru'], s_seeds: ['なかに たねが ある', 'naka ni tane ga aru'],
  s_fall: ['たねが つちに おちる', 'tane ga tsuchi ni ochiru'], s_sprout: ['たねから めが でた', 'tane kara me ga deta'], s_new: ['あたらしい はなが さく', 'atarashii hana ga saku'],
  hideseek: ['かくれんぼ', 'kakurenbo'], wheredoudou: ['ドウドウは どこ？', 'Dōdō wa doko?'], nothere: ['ここには いないよ', 'koko ni wa inai yo'], foundyou: ['みつけた！', 'mitsuketa!'],
  behindtree: ['ドウドウは きの うしろ', 'Dōdō wa ki no ushiro'], undertable: ['ドウドウは テーブルの した', 'Dōdō wa tēburu no shita'], inbox: ['ドウドウは はこの なか', 'Dōdō wa hako no naka'], box: ['はこ', 'hako'],
  bathdog: ['おふろ', 'ofuro'], brushdog: ['ブラッシング', 'burasshingu'], feeddog: ['ごはんを あげる', 'gohan o ageru'], clean: ['きれいに なった！', 'kirei ni natta!'], full: ['おなか いっぱい！', 'onaka ippai!'],
  parrot: ['インコ', 'inko'], saytome: ['いってみて、まねするよ！', 'itte mite, mane suru yo!'], resttime: ['やすむ じかんだよ', 'yasumu jikan da yo'],
  cook: ['りょうりしよう', 'ryōri shiyō'], washveg: ['あらう', 'arau'], cut: ['きる', 'kiru'], stir: ['まぜる', 'mazeru'], boil: ['にる', 'niru'], serve: ['めしあがれ', 'meshiagare'],
  tomatoegg: ['トマトと たまご', 'tomato to tamago'], carrotsoup: ['にんじんスープ', 'ninjin sūpu'], applejuice: ['りんごジュース', 'ringo jūsu'],
  market: ['いちば', 'ichiba'], buy: ['かう', 'kau'], sell: ['うる', 'uru'], coin: ['コイン', 'koin'], howmuch: ['いくら？', 'ikura?'], nocoins: ['コインが たりない', 'koin ga tarinai'],
  room: ['ぼくの へや', 'boku no heya'], bear: ['くまさん', 'kuma-san'], toytrain: ['おもちゃの でんしゃ', 'omocha no densha'], toyrobot: ['おもちゃの ロボット', 'omocha no robotto'],
  lamp: ['ランプ', 'ranpu'], rug: ['じゅうたん', 'jūtan'], painting: ['え', 'e'], potplant: ['うえき', 'ueki'],
  rhythm: ['リズム', 'rizumu'], followrhythm: ['リズムに あわせて', 'rizumu ni awasete'],
  perfect: ['かんぺき！', 'kanpeki!'], good: ['いいね', 'ii ne'], again: ['もう いっかい', 'mō ikkai'], start: ['スタート', 'sutāto'],
  photo: ['しゃしん', 'shashin'], camera: ['カメラ', 'kamera'], cheese: ['はい、チーズ！', 'hai, chīzu!'], story: ['おはなし', 'ohanashi'],
  steamtrain: ['きかんしゃ', 'kikansha'], bullettrain: ['しんかんせん', 'shinkansen'], freighttrain: ['かもつれっしゃ', 'kamotsu ressha'],
  countagain: ['もう いちど かぞえて', 'mō ichido kazoete'], right: ['あたり！', 'atari!'], tryagain: ['もう いちど さがして', 'mō ichido sagashite'],
  pretty: ['きれいだね！', 'kirei da ne!'],
  q_eat: ['なにが たべたい？', 'nani ga tabetai?'], a_eat: ['ぎょうざが たべたい！', 'gyōza ga tabetai!'], q_hungry: ['おなか すいた？', 'onaka suita?'],
  a_hungry: ['おなか すいた！', 'onaka suita!'], q_name: ['おなまえは？', 'onamae wa?'], a_name: [NAMES_JA.me + 'です！', CHILD + ' desu!'],
  q_happy: ['きょうは たのしい？', 'kyō wa tanoshii?'], a_happy: ['とっても たのしい！', 'tottemo tanoshii!'], q_howru: ['げんき？', 'genki?'],
  a_howru: ['げんきだよ！', 'genki da yo!'], q_color: ['なにいろが すき？', 'nani iro ga suki?'], q_play: ['いっしょに あそぼう？', 'issho ni asobō?'],
  a_ok: ['いいよ！', 'ii yo!'], q_ball: ['ボールで あそぶ？', 'bōru de asobu?'], a_yes: ['うん！', 'un!'], q_where: ['どこに いくの？', 'doko ni iku no?'],
  a_where: ['あそびに いくの！', 'asobi ni iku no!'], q_visit: ['パパに あいに きたの？', 'papa ni ai ni kita no?'], a_visit: ['うん！', 'un!'],
  q_bunny: ['うさぎさん みた？', 'usagi-san mita?'], a_bunny: ['みたよ！', 'mita yo!'], q_tired: ['つかれた？', 'tsukareta?'], a_tired: ['つかれてないよ！', 'tsukaretenai yo!'],
  q_dog: ['きみの こいぬ？', 'kimi no koinu?'], a_dog: ['うん！ ドウドウって いうの。', 'un! Dōdō tte iu no.'], q_slide: ['すべりだい する？', 'suberidai suru?'],
  q_rope: ['なわとび できる？', 'nawatobi dekiru?'], a_try: ['やってみる！', 'yatte miru!'], q_apple: ['りんご すき？', 'ringo suki?'], a_like: ['すき！', 'suki!'],
  q_count: ['いくつ ある？', 'ikutsu aru?'],
};
const NUM_JA = [['', '']].concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => WORDS_JA['n' + n]));
// benda dihitung dengan ひとつ, ふたつ, ... (cara anak Jepang menghitung barang)
const COUNT_JA = [['', ''], ['ひとつ', 'hitotsu'], ['ふたつ', 'futatsu'], ['みっつ', 'mittsu'], ['よっつ', 'yottsu'], ['いつつ', 'itsutsu'],
  ['むっつ', 'muttsu'], ['ななつ', 'nanatsu'], ['やっつ', 'yattsu'], ['ここのつ', 'kokonotsu'], ['とお', 'tō']];
// warna sebelum benda: あかい はな, ピンクの はな → [kana, romaji] dengan spasi di akhir
const COLOR_ADJ_JA = { red: ['あかい', 'akai'], yellow: ['きいろい', 'kiiroi'], blue: ['あおい', 'aoi'], white: ['しろい', 'shiroi'] };
function colorJa(k) { const a = COLOR_ADJ_JA[k], w = WORDS_JA[k]; return a ? [a[0] + ' ', a[1] + ' '] : [w[0] + 'の ', w[1] + ' no ']; }
const TIMES_JA = [['', ''], ['いっかい', 'ikkai'], ['にかい', 'nikai'], ['さんかい', 'sankai'], ['よんかい', 'yonkai'], ['ごかい', 'gokai']];

// Kalimat khusus (bukan dari WORDS) yang ditulis langsung di adegan: Mandarin → English / Jepang
const PHRASE_EN = {
  '拿！': 'Take it!', '扔！': 'Throw!', '跳！': 'Jump!', '茄子！': 'Cheese!', '喂？': 'Hello?', '再见！': 'Bye-bye!',
  '哞——': 'Moo!', '咩——': 'Baa!', '哎哟！': 'Ouch!', '汪汪': 'Woof woof',
  '叔叔好！': 'Hello, uncle!', '阿姨好！': 'Hello, auntie!', '同学，你好！': 'Hello, classmate!',
  '我们一起玩！': "Let's play together!", '一起玩！': "Let's play!", '我喜欢红色！': 'I like red!',
  '谢谢妈妈！': 'Thank you, Mommy!', '这是豆豆！': 'This is Doudou!', '你好！我是机器人。': "Hello! I'm a robot.",
  '新年快乐！': 'Happy New Year!', '恭喜发财！': 'Good luck and good fortune!', '中秋节快乐！': 'Happy Mid-Autumn Festival!',
  ['你好！我是' + CHILD + '。']: "Hi! I'm " + CHILD + '.',
  ['早上好，' + CHILD + '！']: 'Good morning, ' + CHILD + '!',
  ['生日快乐，' + CHILD + '！']: 'Happy birthday, ' + CHILD + '!',
  [CHILD + '，你好！']: 'Hello, ' + CHILD + '!',
};
const PHRASE_JA = {
  '拿！': 'とった！', '扔！': 'えいっ！', '跳！': 'ジャンプ！', '茄子！': 'はい、チーズ！', '喂？': 'もしもし？', '再见！': 'バイバイ！',
  '哞——': 'モー！', '咩——': 'メー！', '哎哟！': 'いたっ！', '汪汪': 'ワンワン',
  '叔叔好！': 'おじさん、こんにちは！', '阿姨好！': 'おばさん、こんにちは！', '同学，你好！': 'やあ、こんにちは！',
  '我们一起玩！': 'いっしょに あそぼう！', '一起玩！': 'あそぼう！', '我喜欢红色！': 'あかが すき！',
  '谢谢妈妈！': 'ママ、ありがとう！', '这是豆豆！': 'この こは ドウドウ！', '你好！我是机器人。': 'こんにちは！ ぼくは ロボット。',
  '新年快乐！': 'あけまして おめでとう！', '恭喜发财！': 'しあわせが きますように！', '中秋节快乐！': 'たのしい おつきみ！',
  ['你好！我是' + CHILD + '。']: 'こんにちは！ ぼくは ' + NAMES_JA.me + '。',
  ['早上好，' + CHILD + '！']: NAMES_JA.me + '、おはよう！',
  ['生日快乐，' + CHILD + '！']: NAMES_JA.me + '、おたんじょうび おめでとう！',
  [CHILD + '，你好！']: NAMES_JA.me + '、こんにちは！',
};
['meimei', 'tiantian', 'xiaoyu', 'lele'].forEach(k => {
  PHRASE_EN[NAMES[k] + '，你好！'] = 'Hello, ' + NAMES[k] + '!';
  PHRASE_JA[NAMES[k] + '，你好！'] = NAMES_JA[k] + '、こんにちは！';
});

// Teks khusus menurut bahasa: tr = kalimat Mandarin → bahasa aktif; langCard = kartu buatan sendiri.
// ja = [teks, romaji]
function tr(zh) { return LANG === 'en' ? PHRASE_EN[zh] || zh : LANG === 'ja' ? PHRASE_JA[zh] || zh : zh; }
function langCard(zh, py, id, en, ja) {
  if (LANG === 'en') return { zh: en, py: '', id };
  if (LANG === 'ja') return { zh: ja[0], py: ja[1], id };
  return { zh, py, id };
}
// objek {zh, py, id, en, ja} (lirik, cerita) → kartu bahasa aktif
function txt(o) { return langCard(o.zh, o.py, o.id, o.en, o.ja); }
const en = s => `<span class="en">${s}</span>`;
const jr = (s, r) => `<ruby class="ja">${s}<rt>${r}</rt></ruby>`;

// Label tombol & judul di halaman (HTML aslinya Mandarin dengan pinyin)
if (LANG !== 'zh') {
  const E = LANG === 'en';
  const L = (e, k, r) => (E ? en(e) : jr(k, r));
  document.documentElement.classList.add('lang-' + LANG);
  document.documentElement.lang = LANG;
  const set = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; };
  const back = small => `<span>${L('Back', 'もどる', 'modoru')}</span><small>${small}</small>`;
  [
    ['#p-flower [data-mode="look"]', L('Look', 'みる', 'miru')], ['#p-flower [data-mode="grow"]', L('Plant', 'うえる', 'ueru')], ['#p-flower [data-mode="find"]', L('Find', 'さがす', 'sagasu')], ['#p-flower [data-mode="process"]', L('Learn', 'しくみ', 'shikumi')],
    ['#flower-title', L('Flower', 'はな', 'hana')], ['#flower-back', back('kembali ke bunga')],
    ['#p-mirror [data-tab="body"]', L('Body', 'からだ', 'karada')], ['#p-mirror [data-tab="clothes"]', L('Clothes', 'ふく', 'fuku')], ['#p-mirror [data-tab="feel"]', L('Feelings', 'きもち', 'kimochi')],
    ['#count-title', L('Count', 'かぞえる', 'kazoeru')], ['#p-count [data-cmode="tap"]', L('Count', 'かぞえる', 'kazoeru')], ['#p-count [data-cmode="quiz"]', L('How many?', 'いくつ？', 'ikutsu?')],
    ['#p-piano [data-pmode="free"]', L('Play', 'ひく', 'hiku')], ['#p-piano [data-pmode="follow"]', L('Copy me', 'まねっこ', 'manekko')], ['#p-piano [data-pmode="song"]', L('Sing', 'うたう', 'utau')],
    ['#p-stickers [data-stab="stickers"]', L('Stickers', 'シール', 'shīru')], ['#p-stickers [data-stab="photos"]', L('Photos', 'しゃしん', 'shashin')],
    ['#ph-back', back('kembali')],
    ['#p-drum [data-dmode="free"]', L('Play', 'たたく', 'tataku')], ['#p-drum [data-dmode="follow"]', L('Copy me', 'まねっこ', 'manekko')],
    ['#p-drum [data-dmode="count"]', L('How many?', 'なんかい？', 'nankai?')], ['#p-drum [data-dmode="rhythm"]', L('Rhythm', 'リズム', 'rizumu')],
    ['#rhythm-start', `<span>${L('Start', 'スタート', 'sutāto')}</span><small>mulai</small>`],
    ['#bag-title', L('My bag', 'かばん', 'kaban')],
    ['#bag-empty', `${L('The bag is empty.', 'かばんは からっぽ', 'kaban wa karappo')} <small>Tasnya masih kosong. Ketuk apel, telur, sayur, kerang, jamur, atau bunga liar untuk mengambilnya.</small>`],
    ['#p-bag [data-act="eat"]', `${L('Eat', 'たべる', 'taberu')}<small>makan</small>`], ['#p-bag [data-act="give"]', `${L('Give', 'あげる', 'ageru')}<small>beri</small>`],
    ['#p-bag [data-act="throw"]', `${L('Throw', 'なげる', 'nageru')}<small>lempar</small>`],
    ['#title h1', E ? en(CHILD + "'s Little Village") : jr(NAMES_JA.me + 'の ちいさな むら', CHILD + ' no chiisana mura')],
    ['#title .sign > p', 'Desa kecil Russel. Main sambil belajar ' + (E ? 'English.' : 'bahasa Jepang.')],
    ['#voice-hint', 'Browser ini belum punya suara ' + (E ? 'English' : 'Jepang') + ', jadi kata hanya tampil sebagai tulisan. Buka di Chrome, Edge, Android, atau iPad untuk mendengar suaranya.'],
  ].forEach(([sel, html]) => set(sel, html));
  document.title = E ? CHILD + "'s Little Village" : NAMES_JA.me + 'の ちいさな むら';
}
