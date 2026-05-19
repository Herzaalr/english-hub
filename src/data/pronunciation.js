const pronunciationData = [
  // Consonant Sounds
  {
    id: 'p01', symbol: 'θ', name: 'Voiceless "th"',
    category: 'consonant', difficulty: 'hard',
    description_en: 'Tongue between teeth, no vibration. Like in "think".',
    description_id: 'Lidah di antara gigi, tanpa getaran. Seperti di "think".',
    examples: [
      { word: 'think', ipa: '/θɪŋk/', audio_hint: 'th-ink' },
      { word: 'three', ipa: '/θriː/', audio_hint: 'th-ree' },
      { word: 'bath', ipa: '/bæθ/', audio_hint: 'ba-th' },
      { word: 'nothing', ipa: '/ˈnʌθɪŋ/', audio_hint: 'nu-thing' },
    ],
    common_mistakes_en: 'Indonesian speakers often say /t/ or /s/ instead. "think" becomes "tink" or "sink".',
    common_mistakes_id: 'Penutur Indonesia sering mengganti dengan /t/ atau /s/. "think" jadi "tink" atau "sink".',
    practice_sentences: [
      'I think three thoughts through thick fog.',
      'Nothing worth having comes without effort.',
    ],
  },
  {
    id: 'p02', symbol: 'ð', name: 'Voiced "th"',
    category: 'consonant', difficulty: 'hard',
    description_en: 'Tongue between teeth, with vocal vibration. Like in "this".',
    description_id: 'Lidah di antara gigi, dengan getaran pita suara. Seperti di "this".',
    examples: [
      { word: 'this', ipa: '/ðɪs/', audio_hint: 'th-is' },
      { word: 'that', ipa: '/ðæt/', audio_hint: 'th-at' },
      { word: 'mother', ipa: '/ˈmʌðər/', audio_hint: 'mu-ther' },
      { word: 'weather', ipa: '/ˈweðər/', audio_hint: 'wea-ther' },
    ],
    common_mistakes_en: 'Often replaced with /d/ — "this" becomes "dis", "that" becomes "dat".',
    common_mistakes_id: 'Sering diganti /d/ — "this" jadi "dis", "that" jadi "dat".',
    practice_sentences: [
      'The weather in this area is rather pleasant.',
      'My mother and father gathered their belongings together.',
    ],
  },
  {
    id: 'p03', symbol: 'r', name: 'English "R"',
    category: 'consonant', difficulty: 'medium',
    description_en: 'Curl tongue back without touching the roof of the mouth. NOT a trilled R.',
    description_id: 'Lidah ditekuk ke belakang tanpa menyentuh langit-langit mulut. Bukan R getar.',
    examples: [
      { word: 'red', ipa: '/red/', audio_hint: 'r-ed' },
      { word: 'arrive', ipa: '/əˈraɪv/', audio_hint: 'a-rrive' },
      { word: 'very', ipa: '/ˈveri/', audio_hint: 've-ry' },
      { word: 'world', ipa: '/wɜːrld/', audio_hint: 'wo-rld' },
    ],
    common_mistakes_en: 'Indonesian speakers often trill the R or add a vowel after it. "car" becomes "car-uh".',
    common_mistakes_id: 'Penutur Indonesia sering menggetarkan R atau menambah vokal setelahnya. "car" jadi "car-uh".',
    practice_sentences: [
      'Robert really rarely runs right around the river.',
      'The rare red rose grew in the garden.',
    ],
  },
  {
    id: 'p04', symbol: 'v', name: 'V Sound',
    category: 'consonant', difficulty: 'medium',
    description_en: 'Upper teeth on lower lip, with vibration. Different from "w".',
    description_id: 'Gigi atas di bibir bawah, dengan getaran. Berbeda dari "w".',
    examples: [
      { word: 'very', ipa: '/ˈveri/', audio_hint: 've-ry' },
      { word: 'video', ipa: '/ˈvɪdioʊ/', audio_hint: 'vi-deo' },
      { word: 'victory', ipa: '/ˈvɪktəri/', audio_hint: 'vic-to-ry' },
      { word: 'drive', ipa: '/draɪv/', audio_hint: 'dri-ve' },
    ],
    common_mistakes_en: 'Indonesian speakers often use /w/ instead. "very" becomes "wery", "video" becomes "wideo".',
    common_mistakes_id: 'Penutur Indonesia sering mengganti dengan /w/. "very" jadi "wery", "video" jadi "wideo".',
    practice_sentences: [
      'Victor drove his van over the very steep valley.',
      'The vivid violet flowers have a wonderful view.',
    ],
  },
  {
    id: 'p05', symbol: 'l', name: 'Light and Dark L',
    category: 'consonant', difficulty: 'medium',
    description_en: 'Light L: tongue tip on ridge behind upper teeth. Dark L (end of words): tongue back, sounds like "uhl".',
    description_id: 'Light L: ujung lidah di gusi belakang gigi atas. Dark L (akhir kata): lidah ke belakang, bunyi "uhl".',
    examples: [
      { word: 'light', ipa: '/laɪt/', audio_hint: 'l-ight (light L)' },
      { word: 'feel', ipa: '/fiːl/', audio_hint: 'fee-l (dark L)' },
      { word: 'little', ipa: '/ˈlɪtl/', audio_hint: 'li-ttle (both)' },
      { word: 'people', ipa: '/ˈpiːpl/', audio_hint: 'peo-ple (dark L)' },
    ],
    common_mistakes_en: 'Indonesian speakers may use a tongue-tip-only L everywhere, missing the "uhl" quality at word ends.',
    common_mistakes_id: 'Penutur Indonesia mungkin hanya pakai ujung lidah L di mana-mana, kehilangan kualitas "uhl" di akhir kata.',
    practice_sentences: [
      'Little Lily loves to look at the lovely lilac flowers.',
      'I feel like all people will eventually travel well.',
    ],
  },

  // Vowel Sounds
  {
    id: 'p06', symbol: 'ɪ vs iː', name: 'Short vs Long "i"',
    category: 'vowel', difficulty: 'medium',
    description_en: 'ɪ is short and relaxed (bit, sit). iː is long and tense (beat, seat).',
    description_id: 'ɪ pendek dan rileks (bit, sit). iː panjang dan tegang (beat, seat).',
    examples: [
      { word: 'bit', ipa: '/bɪt/', audio_hint: 'short i' },
      { word: 'beat', ipa: '/biːt/', audio_hint: 'long i' },
      { word: 'ship', ipa: '/ʃɪp/', audio_hint: 'short i' },
      { word: 'sheep', ipa: '/ʃiːp/', audio_hint: 'long i' },
    ],
    common_mistakes_en: '"ship" and "sheep" should NOT sound the same. "bit" and "beat" are different words!',
    common_mistakes_id: '"ship" dan "sheep" TIDAK boleh terdengar sama. "bit" dan "beat" adalah kata yang berbeda!',
    practice_sentences: [
      'Please sit on the seat, not the seat on the sit.',
      'The ship carrying sheep hit a reef.',
    ],
  },
  {
    id: 'p07', symbol: 'æ vs ɑː', name: 'Cat vs Car vowels',
    category: 'vowel', difficulty: 'medium',
    description_en: 'æ is the "a" in cat, bad, man. ɑː is the open "a" in car, father, hot (British).',
    description_id: 'æ adalah "a" di cat, bad, man. ɑː adalah "a" terbuka di car, father, hot (British).',
    examples: [
      { word: 'cat', ipa: '/kæt/', audio_hint: 'front a' },
      { word: 'car', ipa: '/kɑːr/', audio_hint: 'back a' },
      { word: 'bat', ipa: '/bæt/', audio_hint: 'front a' },
      { word: 'bar', ipa: '/bɑːr/', audio_hint: 'back a' },
    ],
    common_mistakes_en: 'Indonesian speakers tend to use one "a" sound for all of these.',
    common_mistakes_id: 'Penutur Indonesia cenderung pakai satu bunyi "a" untuk semuanya.',
    practice_sentences: [
      'The fat cat sat on the car mat.',
      'Can a man catch a calm shark at a farm?',
    ],
  },

  // Word Stress
  {
    id: 'p08', symbol: 'ˈ', name: 'Word Stress',
    category: 'stress', difficulty: 'hard',
    description_en: 'English is a stress-timed language. The stressed syllable is LOUDER, LONGER, and HIGHER in pitch.',
    description_id: 'Bahasa Inggris adalah bahasa berbasis stress. Suku kata yang ditekan lebih KERAS, LEBIH LAMA, dan lebih TINGGI.',
    examples: [
      { word: 'PHOtograph', ipa: '/ˈfoʊtəɡræf/', audio_hint: 'stress on PHO' },
      { word: 'phoTOGraphy', ipa: '/fəˈtɒɡrəfi/', audio_hint: 'stress on TO' },
      { word: 'photoGRAPHic', ipa: '/ˌfoʊtəˈɡræfɪk/', audio_hint: 'stress on GRAPH' },
      { word: 'DEvelop', ipa: '/dɪˈveləp/', audio_hint: 'stress on VEL' },
    ],
    common_mistakes_en: 'Indonesian is syllable-timed (every syllable gets equal time). English needs strong stress patterns.',
    common_mistakes_id: 'Bahasa Indonesia adalah suku kata-waktu (setiap suku kata mendapat waktu sama). Inggris butuh pola stress yang kuat.',
    practice_sentences: [
      'I want to PHOtograph the photoGRAPHic scenery.',
      'DEvelopers who work in developMENT need to be developMENtally strong.',
    ],
  },

  // Connected Speech
  {
    id: 'p09', symbol: '→', name: 'Connected Speech',
    category: 'connected', difficulty: 'hard',
    description_en: 'Native speakers don\'t say each word separately. Words blend together in natural speech.',
    description_id: 'Penutur asli tidak mengucapkan setiap kata terpisah. Kata-kata menyatu dalam percakapan natural.',
    examples: [
      { word: 'want to', ipa: 'wanna', audio_hint: 'wanna' },
      { word: 'going to', ipa: 'gonna', audio_hint: 'gonna' },
      { word: 'got to', ipa: 'gotta', audio_hint: 'gotta' },
      { word: 'did you', ipa: 'didja', audio_hint: 'didja' },
      { word: 'what do you', ipa: 'whaddya', audio_hint: 'whaddya' },
    ],
    common_mistakes_en: 'Trying to pronounce every word separately sounds robotic and is hard to understand at native speed.',
    common_mistakes_id: 'Mencoba mengucapkan setiap kata terpisah terdengar seperti robot dan sulit dipahami kecepatan native.',
    practice_sentences: [
      'I wanna go to the store. → I want to go to the store.',
      'What are you doing? → Whatcha doing?',
      'I have got to go. → I gotta go.',
    ],
  },
]

export default pronunciationData
